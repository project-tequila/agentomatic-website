"use client";

import { Helios } from "@helios-project/core";
import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";

import { defaultVoiceHeliosInput, type VoiceHeliosInputProps } from "./types";

type HeliosContextValue = {
  helios: Helios<VoiceHeliosInputProps>;
  setVoiceInput: (patch: Partial<VoiceHeliosInputProps>) => void;
};

const HeliosContext = createContext<HeliosContextValue | null>(null);

type HeliosVoiceProviderProps = {
  children: ReactNode;
};

export function HeliosVoiceProvider({ children }: HeliosVoiceProviderProps) {
  const helios = useMemo(
    () =>
      new Helios<VoiceHeliosInputProps>({
        fps: 60,
        duration: 16,
        loop: true,
        inputProps: defaultVoiceHeliosInput,
      }),
    [],
  );

  useEffect(() => {
    helios.play();
    return () => {
      helios.pause();
      helios.dispose();
    };
  }, [helios]);

  const value = useMemo<HeliosContextValue>(
    () => ({
      helios,
      setVoiceInput: (patch) => {
        const current = helios.getState().inputProps;
        helios.setInputProps({ ...current, ...patch });
      },
    }),
    [helios],
  );

  return <HeliosContext.Provider value={value}>{children}</HeliosContext.Provider>;
}

export function useHeliosVoice() {
  const ctx = useContext(HeliosContext);
  if (!ctx) {
    throw new Error("useHeliosVoice must be used within HeliosVoiceProvider");
  }
  return ctx;
}
