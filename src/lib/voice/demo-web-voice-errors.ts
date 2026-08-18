/**
 * User-facing copy for the public in-browser demo voice path.
 * Keep Call me as the fallback; never mention API keys or gateway internals.
 */

export const DEMO_MIC_DENIED_COPY =
  "Allow microphone, or use Call me.";

export const DEMO_VOICE_UNAVAILABLE_COPY =
  "Live talk isn’t available right now. Use Call me and we’ll ring you.";

/**
 * Maps mint HTTP status and thrown errors to visitor-facing copy.
 */
export function mapDemoWebVoiceError(input: {
  httpStatus?: number;
  error?: unknown;
  serverMessage?: string;
}): string {
  const status = input.httpStatus;
  if (status === 404 || status === 502 || status === 503) {
    return DEMO_VOICE_UNAVAILABLE_COPY;
  }
  if (status === 429) {
    return "Too many live talks from this network. Use Call me, or try again in a few minutes.";
  }

  const err = input.error;
  if (err && typeof err === "object" && "name" in err) {
    const name = String((err as { name?: string }).name);
    if (name === "NotAllowedError" || name === "PermissionDeniedError") {
      return DEMO_MIC_DENIED_COPY;
    }
    if (name === "NotFoundError") {
      return DEMO_MIC_DENIED_COPY;
    }
  }

  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    if (msg.includes("permission") || msg.includes("microphone") || msg.includes("notallowed")) {
      return DEMO_MIC_DENIED_COPY;
    }
  }

  if (typeof input.serverMessage === "string" && input.serverMessage.trim()) {
    return input.serverMessage.trim();
  }

  return DEMO_VOICE_UNAVAILABLE_COPY;
}

/**
 * Helios voiceState + energy from the realtime hook, not a fake cycle.
 */
export function heliosFromRealtimeVoice(input: {
  status: "idle" | "connecting" | "listening" | "error";
  isAgentSpeaking: boolean;
}): { voiceState: "idle" | "listening" | "speaking"; energy: number } {
  if (input.isAgentSpeaking) {
    return { voiceState: "speaking", energy: 1 };
  }
  if (input.status === "listening" || input.status === "connecting") {
    return { voiceState: "listening", energy: input.status === "connecting" ? 0.4 : 0.62 };
  }
  return { voiceState: "idle", energy: 0.18 };
}
