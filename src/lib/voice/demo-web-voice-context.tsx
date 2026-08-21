"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

import {
  useRealtimeVoice,
  type UseRealtimeVoiceResult,
} from "./useRealtimeVoice";

const DemoWebVoiceContext = createContext<UseRealtimeVoiceResult | null>(null);

/**
 * One shared demo voice session for chrome, orb, HUD, and the call strip.
 */
export function DemoWebVoiceProvider({ children }: { children: ReactNode }) {
  const voice = useRealtimeVoice({ language: "en" });
  const value = useMemo(() => voice, [voice]);

  return <DemoWebVoiceContext.Provider value={value}>{children}</DemoWebVoiceContext.Provider>;
}

export function useDemoWebVoice() {
  const ctx = useContext(DemoWebVoiceContext);
  if (!ctx) {
    throw new Error("useDemoWebVoice must be used within DemoWebVoiceProvider");
  }
  return ctx;
}
