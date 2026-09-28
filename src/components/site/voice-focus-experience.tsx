"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Loader2, Mic, Square, X } from "lucide-react";
import { useCallback, useEffect } from "react";

import { DemoVoiceEngineControls } from "@/components/site/demo-voice-engine-controls";
import { DemoVoiceTranscript } from "@/components/site/demo-voice-transcript";
import { useDemoCall } from "@/lib/demo-call/demo-call-context";
import { useDemoWebVoice } from "@/lib/voice/demo-web-voice-context";
import { mapVoiceEnergyOrbState } from "@/lib/voice/voice-orb-state";
import { cn } from "@/lib/utils";

import { AudioReactiveFrontdeskOrb } from "./audio-reactive-frontdesk-orb";

function statusLine(
  status: string,
  isAgentSpeaking: boolean,
  error: string | null,
): string {
  if (error) return error;
  if (status === "requesting-mic") return "Allow microphone when prompted";
  if (status === "connecting") return "Connecting…";
  if (isAgentSpeaking) return "Agent speaking — jump in anytime";
  if (status === "listening") return "Listening…";
  if (status === "idle") return "Choose a voice model and language, then press Start Talk.";
  return "Starting…";
}

/**
 * Full-screen voice focus: blurred backdrop, orb as hero, language + controls.
 * Shown when the demo opens or a live session is active.
 */
export function VoiceFocusExperience() {
  const reduceMotion = useReducedMotion();
  const { isOpen, closeDemoCall } = useDemoCall();
  const {
    status,
    error,
    isAgentSpeaking,
    transcripts,
    start,
    stop,
    getInputVolume,
    getOutputVolume,
  } = useDemoWebVoice();

  const voiceActive =
    status === "requesting-mic" ||
    status === "connecting" ||
    status === "listening" ||
    isAgentSpeaking;
  const visible = isOpen || voiceActive;

  const onEnd = useCallback(() => {
    stop();
    closeDemoCall();
  }, [stop, closeDemoCall]);

  useEffect(() => {
    document.body.classList.toggle("voice-focus-open", visible);
    return () => document.body.classList.remove("voice-focus-open");
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onEnd();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, onEnd]);

  const agentState = mapVoiceEnergyOrbState({ status, isAgentSpeaking, transcripts });
  const line = statusLine(status, isAgentSpeaking, error);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="voice-focus"
          className="voice-focus"
          role="dialog"
          aria-modal="true"
          aria-label="Talk to the agent"
          data-voice-state={agentState}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 0.7, 0.18, 1] }}
        >
          <div className="voice-focus__backdrop" aria-hidden />

          <button
            type="button"
            className="voice-focus__close"
            onClick={onEnd}
            aria-label={voiceActive ? "End talk and close" : "Close"}
          >
            <X className="size-4" strokeWidth={2} aria-hidden />
          </button>

          <div className="voice-focus__stage">
            <div className="voice-focus__mast">
              <div
                className={cn("voice-focus__orb", voiceActive && "voice-focus__orb--live")}
                data-voice-state={agentState}
                aria-hidden
              >
                <AudioReactiveFrontdeskOrb
                  agentState={agentState}
                  getInputVolume={getInputVolume}
                  getOutputVolume={getOutputVolume}
                  reduceMotion={!!reduceMotion}
                />
              </div>

              <DemoVoiceEngineControls variant="focus" />

              <p className="voice-focus__status" aria-live="polite">
                {status === "connecting" || status === "requesting-mic" ? (
                  <Loader2 className="voice-focus__status-icon animate-spin" aria-hidden />
                ) : null}
                {line}
              </p>
            </div>

            <DemoVoiceTranscript entries={transcripts} variant="focus" />

            <div className="voice-focus__actions">
              {voiceActive ? (
                <button
                  type="button"
                  className="voice-focus__end voice-focus__end--live"
                  onClick={onEnd}
                  aria-label="End talk"
                >
                  {status === "connecting" || status === "requesting-mic" ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <Square className="size-3.5" strokeWidth={2} aria-hidden />
                  )}
                  End talk
                </button>
              ) : (
                <button
                  type="button"
                  className="voice-focus__start"
                  data-testid="voice-focus-start-talk"
                  onClick={() => {
                    void start();
                  }}
                  aria-label="Start Talk"
                >
                  <Mic className="size-4" strokeWidth={1.75} aria-hidden />
                  Start Talk
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
