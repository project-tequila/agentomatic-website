"use client";

import { useEffect, type RefObject } from "react";

import { useHeliosVoice } from "./helios-provider";

export function useScrollHelios(scrollRef: RefObject<HTMLElement | null>) {
  const { setVoiceInput } = useHeliosVoice();

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const onScroll = () => {
      const max = element.scrollHeight - element.clientHeight;
      const progress = max > 0 ? element.scrollTop / max : 0;
      setVoiceInput({ scrollProgress: Math.min(1, Math.max(0, progress)) });
    };

    onScroll();
    element.addEventListener("scroll", onScroll, { passive: true });
    return () => element.removeEventListener("scroll", onScroll);
  }, [scrollRef, setVoiceInput]);
}
