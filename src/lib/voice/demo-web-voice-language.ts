import type { VoiceConnectionStatus } from "./useRealtimeVoice";

/**
 * Language may change only when the demo voice session is not live.
 */
export function canChangeDemoWebVoiceLanguage(status: VoiceConnectionStatus): boolean {
  return status === "idle" || status === "error";
}
