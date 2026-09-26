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
  CASCADE_VOICE_LANGUAGE_OPTIONS,
  DEFAULT_DEMO_VOICE_ENGINE,
  DEFAULT_DEMO_VOICE_LANGUAGE,
  normalizeSpeechLlmLanguage,
  normalizeVoiceLanguage,
  SPEECH_LLM_LANGUAGE_OPTIONS,
  type DemoVoiceEngine,
  type SpeechLlmLanguageCode,
  type VoiceLanguageCode,
} from "@/lib/voice-languages";

import { canChangeDemoWebVoiceLanguage } from "./demo-web-voice-language";
import {
  useRealtimeVoice,
  type UseRealtimeVoiceResult,
} from "./useRealtimeVoice";

export type DemoWebVoiceContextValue = UseRealtimeVoiceResult & {
  engine: DemoVoiceEngine;
  setEngine: (engine: DemoVoiceEngine) => void;
  language: string;
  setLanguage: (language: string) => void;
  languageOptions: ReadonlyArray<{ value: string; label: string }>;
};

const DemoWebVoiceContext = createContext<DemoWebVoiceContextValue | null>(null);

/**
 * One shared demo voice session for chrome, orb, HUD, and the call strip.
 * Engine and language are chosen before connect and locked while a session is live.
 * Speech LLM and cascaded LLM keep separate language selections.
 */
export function DemoWebVoiceProvider({ children }: { children: ReactNode }) {
  const [engine, setEngineState] = useState<DemoVoiceEngine>(DEFAULT_DEMO_VOICE_ENGINE);
  const [speechLanguage, setSpeechLanguage] = useState<SpeechLlmLanguageCode>("en");
  const [cascadeLanguage, setCascadeLanguage] = useState<VoiceLanguageCode>(
    DEFAULT_DEMO_VOICE_LANGUAGE,
  );
  const language = engine === "speech_llm" ? speechLanguage : cascadeLanguage;
  const voice = useRealtimeVoice({ language, speechPath: engine });

  const setEngine = useCallback(
    (nextEngine: DemoVoiceEngine) => {
      if (!canChangeDemoWebVoiceLanguage(voice.status)) return;
      setEngineState(nextEngine);
    },
    [voice.status],
  );

  const setLanguage = useCallback(
    (nextLanguage: string) => {
      if (!canChangeDemoWebVoiceLanguage(voice.status)) return;
      if (engine === "speech_llm") {
        setSpeechLanguage(normalizeSpeechLlmLanguage(nextLanguage));
        return;
      }
      setCascadeLanguage(normalizeVoiceLanguage(nextLanguage));
    },
    [engine, voice.status],
  );

  const languageOptions =
    engine === "speech_llm" ? SPEECH_LLM_LANGUAGE_OPTIONS : CASCADE_VOICE_LANGUAGE_OPTIONS;

  const value = useMemo(
    () => ({
      ...voice,
      engine,
      setEngine,
      language,
      setLanguage,
      languageOptions,
    }),
    [voice, engine, setEngine, language, setLanguage, languageOptions],
  );

  return <DemoWebVoiceContext.Provider value={value}>{children}</DemoWebVoiceContext.Provider>;
}

/**
 * Shared demo web-voice session, engine, and language selection.
 */
export function useDemoWebVoice(): DemoWebVoiceContextValue {
  const ctx = useContext(DemoWebVoiceContext);
  if (!ctx) {
    throw new Error("useDemoWebVoice must be used within DemoWebVoiceProvider");
  }
  return ctx;
}
