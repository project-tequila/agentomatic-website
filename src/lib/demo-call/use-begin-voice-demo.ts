"use client";

import { useCallback, useSyncExternalStore } from "react";

import { useDemoCall } from "@/lib/demo-call/demo-call-context";
import type { DemoVoiceEngine } from "@/lib/voice-languages";

import {
  getDemoVoiceChoice,
  isDemoVoiceChoiceReady,
  subscribeDemoVoiceChoice,
} from "./demo-voice-choice";

export {
  chooseDemoVoiceEngine,
  chooseDemoVoiceLanguage,
  isDemoVoiceChoiceReady,
  resetDemoVoiceChoice,
} from "./demo-voice-choice";

export function useDemoVoiceChoiceReady(engine: DemoVoiceEngine): boolean {
  const snapshot = useSyncExternalStore(
    subscribeDemoVoiceChoice,
    getDemoVoiceChoice,
    getDemoVoiceChoice,
  );
  return isDemoVoiceChoiceReady(engine, snapshot);
}

/**
 * Opens the voice-focus chooser. The microphone starts only from Start Talk,
 * which keeps the getUserMedia user gesture on that click.
 */
export function useBeginVoiceDemo() {
  const { openDemoCall } = useDemoCall();

  return useCallback(() => {
    openDemoCall();
  }, [openDemoCall]);
}
