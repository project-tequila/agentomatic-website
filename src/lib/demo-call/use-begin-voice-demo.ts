"use client";

import { useCallback } from "react";

import { useDemoCall } from "@/lib/demo-call/demo-call-context";
import { useDemoWebVoice } from "@/lib/voice/demo-web-voice-context";

/**
 * Opens voice focus and starts the demo session in the same click handler
 * so getUserMedia keeps the browser user-gesture (CustomEvent breaks this on mobile).
 */
export function useBeginVoiceDemo() {
  const { openDemoCall } = useDemoCall();
  const { start } = useDemoWebVoice();

  return useCallback(() => {
    void start();
    openDemoCall();
  }, [openDemoCall, start]);
}
