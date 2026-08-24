import type { HumanTransferStatus } from "./human-transfer";
import type { VoiceConnectionStatus } from "./useRealtimeVoice";

export type VoiceDemoUiStatus =
  | "idle"
  | "connecting"
  | "listening"
  | "agent-speaking"
  | "transferring"
  | "transfer-connected"
  | "transfer-failed"
  | "error";

export type VoiceDemoStatusCopy = {
  label: string;
  detail: string;
};

/**
 * Map hook + transfer phase to the marketing orb / talk-strip status.
 */
export function resolveVoiceDemoUiStatus(input: {
  hookStatus: VoiceConnectionStatus;
  isAgentSpeaking: boolean;
  hasError: boolean;
  humanTransferStatus?: HumanTransferStatus | null;
}): VoiceDemoUiStatus {
  if (input.hasError || input.hookStatus === "error") {
    return "error";
  }
  if (input.humanTransferStatus === "failed") {
    return "transfer-failed";
  }
  if (input.humanTransferStatus === "connected") {
    return "transfer-connected";
  }
  if (input.humanTransferStatus === "transferring") {
    return "transferring";
  }
  if (input.hookStatus === "listening") {
    return input.isAgentSpeaking ? "agent-speaking" : "listening";
  }
  if (input.hookStatus === "connecting") {
    return "connecting";
  }
  return "idle";
}

/**
 * Visitor-facing status copy for the public voice demo.
 */
export function getVoiceDemoStatusCopy(
  status: VoiceDemoUiStatus,
  errorMessage?: string | null,
): VoiceDemoStatusCopy {
  if (status === "connecting") {
    return {
      label: "Connecting",
      detail: "Starting a short live demo — no account needed.",
    };
  }
  if (status === "transferring") {
    return {
      label: "Connecting you to a human…",
      detail: "Stay on this session. We're dialing a teammate now.",
    };
  }
  if (status === "transfer-connected") {
    return {
      label: "Connected",
      detail: "A teammate is on the line. Keep this tab open.",
    };
  }
  if (status === "transfer-failed") {
    return {
      label: "Transfer failed (try again).",
      detail:
        "The transfer didn't connect. You can keep talking to the agent or try asking again.",
    };
  }
  if (status === "listening") {
    return {
      label: "Listening",
      detail: "Speak naturally. The same agent answers as on a phone call.",
    };
  }
  if (status === "agent-speaking") {
    return {
      label: "Live",
      detail: "Interrupt anytime — just start talking.",
    };
  }
  if (status === "error") {
    return {
      label: "Talk unavailable",
      detail:
        errorMessage ??
        "Something went wrong. Click Talk to try again.",
    };
  }
  return {
    label: "Ready to talk",
    detail: "Click Talk — no phone number, no account.",
  };
}
