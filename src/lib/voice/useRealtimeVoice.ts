"use client";

/**
 * Browser realtime voice for the public marketing demo.
 *
 * DSP and protocol match the booker `useRealtimeVoice` hook: 16 kHz PCM over
 * WebSocket, AudioWorklet capture, TTS playback, barge-in (`clear`).
 * Session mint is `POST /api/demo/web-voice` — the client never builds a tenant
 * WebSocket URL or holds an API key.
 */
import { useCallback, useEffect, useRef, useState } from "react";

import { mapDemoWebVoiceError } from "./demo-web-voice-errors";

const TARGET_SAMPLE_RATE = 16000;

export type VoiceConnectionStatus = "idle" | "connecting" | "listening" | "error";

export type VoiceTranscriptRole = "user" | "assistant";

export interface VoiceTranscriptEntry {
  id: string;
  role: VoiceTranscriptRole;
  text: string;
  final: boolean;
}

export interface UseRealtimeVoiceOptions {
  language?: string;
}

export interface UseRealtimeVoiceResult {
  status: VoiceConnectionStatus;
  error: string | null;
  isAgentSpeaking: boolean;
  transcripts: VoiceTranscriptEntry[];
  start: () => Promise<void>;
  stop: () => void;
}

type MintResponse = {
  ws_url?: string;
  error?: string;
};

const CAPTURE_WORKLET_SOURCE = `
class CaptureProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (input && input[0]) {
      this.port.postMessage(input[0].slice(0));
    }
    return true;
  }
}
registerProcessor('capture-processor', CaptureProcessor);
`;

/**
 * Linear-resample a Float32 mono buffer from inRate to TARGET_SAMPLE_RATE.
 */
function downsampleTo16k(input: Float32Array, inRate: number): Float32Array {
  if (inRate === TARGET_SAMPLE_RATE) {
    return input;
  }
  const ratio = inRate / TARGET_SAMPLE_RATE;
  const outLength = Math.floor(input.length / ratio);
  const output = new Float32Array(outLength);
  for (let i = 0; i < outLength; i += 1) {
    const srcIndex = i * ratio;
    const low = Math.floor(srcIndex);
    const high = Math.min(low + 1, input.length - 1);
    const frac = srcIndex - low;
    output[i] = input[low] * (1 - frac) + input[high] * frac;
  }
  return output;
}

/**
 * Convert Float32 [-1, 1] samples to little-endian Int16 PCM bytes.
 */
function floatToInt16Bytes(input: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(input.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < input.length; i += 1) {
    const clamped = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(i * 2, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
  }
  return buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

/**
 * Decode 16-bit little-endian PCM bytes into Float32 samples.
 */
function int16BytesToFloat32(buffer: ArrayBuffer): Float32Array {
  const view = new DataView(buffer);
  const length = Math.floor(buffer.byteLength / 2);
  const output = new Float32Array(length);
  for (let i = 0; i < length; i += 1) {
    output[i] = view.getInt16(i * 2, true) / 0x8000;
  }
  return output;
}

async function mintDemoWebVoiceSession(language: string): Promise<string> {
  const res = await fetch("/api/demo/web-voice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language }),
  });

  let data: MintResponse = {};
  try {
    data = (await res.json()) as MintResponse;
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw Object.assign(new Error(data.error || "mint failed"), {
      httpStatus: res.status,
      serverMessage: data.error,
    });
  }

  if (typeof data.ws_url !== "string" || !data.ws_url.startsWith("ws")) {
    throw Object.assign(new Error("missing ws_url"), { httpStatus: res.status });
  }

  return data.ws_url;
}

/**
 * Public demo voice hook. `start()` mints a session then connects to `ws_url`.
 */
export function useRealtimeVoice(
  options: UseRealtimeVoiceOptions = {},
): UseRealtimeVoiceResult {
  const language = options.language ?? "en";

  const [status, setStatus] = useState<VoiceConnectionStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [transcripts, setTranscripts] = useState<VoiceTranscriptEntry[]>([]);

  const statusRef = useRef<VoiceConnectionStatus>("idle");
  const wsRef = useRef<WebSocket | null>(null);
  const captureCtxRef = useRef<AudioContext | null>(null);
  const playbackCtxRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const playheadRef = useRef<number>(0);
  const scheduledSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  const setStatusSafe = useCallback((next: VoiceConnectionStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const appendTranscript = useCallback((entry: VoiceTranscriptEntry) => {
    setTranscripts((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.role === entry.role && !last.final) {
        const next = prev.slice(0, -1);
        return [...next, entry];
      }
      return [...prev, entry];
    });
  }, []);

  const stopPlayback = useCallback(() => {
    scheduledSourcesRef.current.forEach((node) => {
      try {
        node.stop();
      } catch {
        // already stopped
      }
    });
    scheduledSourcesRef.current = [];
    if (playbackCtxRef.current) {
      playheadRef.current = playbackCtxRef.current.currentTime;
    }
    setIsAgentSpeaking(false);
  }, []);

  const scheduleAudioChunk = useCallback((pcm: Float32Array) => {
    const ctx = playbackCtxRef.current;
    if (!ctx || pcm.length === 0) {
      return;
    }
    const audioBuffer = ctx.createBuffer(1, pcm.length, TARGET_SAMPLE_RATE);
    audioBuffer.getChannelData(0).set(pcm);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    const startAt = Math.max(ctx.currentTime, playheadRef.current);
    source.start(startAt);
    playheadRef.current = startAt + audioBuffer.duration;
    setIsAgentSpeaking(true);

    scheduledSourcesRef.current.push(source);
    source.onended = () => {
      scheduledSourcesRef.current = scheduledSourcesRef.current.filter((node) => node !== source);
      if (
        scheduledSourcesRef.current.length === 0 &&
        playbackCtxRef.current &&
        playbackCtxRef.current.currentTime >= playheadRef.current - 0.05
      ) {
        setIsAgentSpeaking(false);
      }
    };
  }, []);

  const cleanup = useCallback(() => {
    if (workletNodeRef.current) {
      workletNodeRef.current.port.onmessage = null;
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (captureCtxRef.current) {
      captureCtxRef.current.close().catch(() => undefined);
      captureCtxRef.current = null;
    }
    stopPlayback();
    if (playbackCtxRef.current) {
      playbackCtxRef.current.close().catch(() => undefined);
      playbackCtxRef.current = null;
    }
    if (wsRef.current) {
      const ws = wsRef.current;
      wsRef.current = null;
      try {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ event: "stop" }));
        }
        ws.close();
      } catch {
        // ignore
      }
    }
  }, [stopPlayback]);

  const handleServerMessage = useCallback(
    (raw: unknown) => {
      if (typeof raw !== "string") {
        return;
      }
      let data: Record<string, unknown>;
      try {
        data = JSON.parse(raw) as Record<string, unknown>;
      } catch {
        return;
      }

      if (data.event === "clear") {
        stopPlayback();
        return;
      }
      if (data.type === "transcript") {
        const role = data.role === "assistant" ? "assistant" : "user";
        const text = typeof data.text === "string" ? data.text : "";
        if (!text) {
          return;
        }
        appendTranscript({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          role,
          text,
          final: role === "assistant" ? true : Boolean(data.final),
        });
      }
    },
    [appendTranscript, stopPlayback],
  );

  const stop = useCallback(() => {
    cleanup();
    setStatusSafe("idle");
    setIsAgentSpeaking(false);
  }, [cleanup, setStatusSafe]);

  const start = useCallback(async () => {
    if (statusRef.current === "connecting" || statusRef.current === "listening") {
      return;
    }
    setError(null);
    setTranscripts([]);
    setStatusSafe("connecting");

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      mediaStreamRef.current = mediaStream;

      const wsUrl = await mintDemoWebVoiceSession(language);

      const captureCtx = new AudioContext();
      captureCtxRef.current = captureCtx;
      const inRate = captureCtx.sampleRate;

      const workletBlob = new Blob([CAPTURE_WORKLET_SOURCE], {
        type: "application/javascript",
      });
      const workletUrl = URL.createObjectURL(workletBlob);
      await captureCtx.audioWorklet.addModule(workletUrl);
      URL.revokeObjectURL(workletUrl);

      const playbackCtx = new AudioContext();
      playbackCtxRef.current = playbackCtx;
      playheadRef.current = playbackCtx.currentTime;
      if (playbackCtx.state === "suspended") {
        await playbackCtx.resume().catch(() => undefined);
      }

      const ws = new WebSocket(wsUrl);
      ws.binaryType = "arraybuffer";
      wsRef.current = ws;

      ws.onopen = () => {
        setStatusSafe("listening");
        ws.send(JSON.stringify({ event: "start", sampleRate: TARGET_SAMPLE_RATE }));

        const sourceNode = captureCtx.createMediaStreamSource(mediaStream);
        sourceNodeRef.current = sourceNode;
        const workletNode = new AudioWorkletNode(captureCtx, "capture-processor");
        workletNodeRef.current = workletNode;

        workletNode.port.onmessage = (event: MessageEvent<Float32Array>) => {
          if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            return;
          }
          const downsampled = downsampleTo16k(event.data, inRate);
          const pcmBytes = floatToInt16Bytes(downsampled);
          wsRef.current.send(
            JSON.stringify({
              event: "media",
              media: { payload: arrayBufferToBase64(pcmBytes) },
            }),
          );
        };

        sourceNode.connect(workletNode);
        const sink = captureCtx.createGain();
        sink.gain.value = 0;
        workletNode.connect(sink);
        sink.connect(captureCtx.destination);
      };

      ws.onmessage = (event: MessageEvent) => {
        if (event.data instanceof ArrayBuffer) {
          scheduleAudioChunk(int16BytesToFloat32(event.data));
          return;
        }
        handleServerMessage(event.data);
      };

      ws.onerror = () => {
        setError(mapDemoWebVoiceError({ httpStatus: 502 }));
        setStatusSafe("error");
      };

      ws.onclose = () => {
        if (statusRef.current !== "error") {
          setStatusSafe("idle");
        }
      };
    } catch (err) {
      const httpStatus =
        err && typeof err === "object" && "httpStatus" in err
          ? Number((err as { httpStatus?: number }).httpStatus)
          : undefined;
      const serverMessage =
        err && typeof err === "object" && "serverMessage" in err
          ? String((err as { serverMessage?: string }).serverMessage ?? "")
          : undefined;
      setError(mapDemoWebVoiceError({ httpStatus, error: err, serverMessage }));
      setStatusSafe("error");
      cleanup();
    }
  }, [cleanup, handleServerMessage, language, scheduleAudioChunk, setStatusSafe]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return { status, error, isAgentSpeaking, transcripts, start, stop };
}
