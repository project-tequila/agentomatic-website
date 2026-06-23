"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type VideoSoundContextValue = {
  soundOn: boolean;
  toggleSound: () => void;
  enableSound: () => void;
};

const VideoSoundContext = createContext<VideoSoundContextValue | null>(null);

type VideoSoundProviderProps = {
  children: ReactNode;
};

export function VideoSoundProvider({ children }: VideoSoundProviderProps) {
  const [soundOn, setSoundOn] = useState(false);

  const enableSound = useCallback(() => setSoundOn(true), []);
  const toggleSound = useCallback(() => setSoundOn((on) => !on), []);

  const value = useMemo(
    () => ({ soundOn, toggleSound, enableSound }),
    [enableSound, soundOn, toggleSound],
  );

  return <VideoSoundContext.Provider value={value}>{children}</VideoSoundContext.Provider>;
}

export function useVideoSound() {
  const ctx = useContext(VideoSoundContext);
  if (!ctx) {
    throw new Error("useVideoSound must be used within VideoSoundProvider");
  }
  return ctx;
}

export function useVideoSoundOptional() {
  return useContext(VideoSoundContext);
}
