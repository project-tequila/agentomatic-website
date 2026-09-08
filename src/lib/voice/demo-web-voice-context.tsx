"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_DEMO_VOICE_LANGUAGE,
  normalizeVoiceLanguage,
  type VoiceLanguageCode,
} from "@/lib/voice-languages";

import { canChangeDemoWebVoiceLanguage } from "./demo-web-voice-language";
import {
  useRealtimeVoice,
  type UseRealtimeVoiceResult,
} from "./useRealtimeVoice";

export type DemoWebVoiceContextValue = UseRealtimeVoiceResult & {
  language: VoiceLanguageCode;
  setLanguage: (language: VoiceLanguageCode) => void;
};

const DemoWebVoiceContext = createContext<DemoWebVoiceContextValue | null>(null);

/**
 * One shared demo voice session for chrome, orb, HUD, and the call strip.
 * Language is chosen before connect and locked while a session is live.
 */
export function DemoWebVoiceProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<VoiceLanguageCode>(DEFAULT_DEMO_VOICE_LANGUAGE);
  const voice = useRealtimeVoice({ language });

  const setLanguage = useCallback(
    (nextLanguage: VoiceLanguageCode) => {
      if (!canChangeDemoWebVoiceLanguage(voice.status)) {
        return;
      }
      setLanguageState(normalizeVoiceLanguage(nextLanguage));
    },
    [voice.status],
  );

  const value = useMemo(
    () => ({
      ...voice,
      language,
      setLanguage,
    }),
    [voice, language, setLanguage],
  );

  return <DemoWebVoiceContext.Provider value={value}>{children}</DemoWebVoiceContext.Provider>;
}

/**
 * Shared demo web-voice session + language selection.
 */
export function useDemoWebVoice(): DemoWebVoiceContextValue {
  const ctx = useContext(DemoWebVoiceContext);
  if (!ctx) {
    throw new Error("useDemoWebVoice must be used within DemoWebVoiceProvider");
  }
  return ctx;
}
