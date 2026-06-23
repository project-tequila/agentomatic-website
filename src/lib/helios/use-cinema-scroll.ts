"use client";

import { useEffect, type RefObject } from "react";

import { useHeliosVoice } from "./helios-provider";
import { useScrollContainer } from "./scroll-container-context";

export function useCinemaScroll(cinemaRef: RefObject<HTMLElement | null>) {
  const scrollRef = useScrollContainer();
  const { setVoiceInput } = useHeliosVoice();

  useEffect(() => {
    const scrollEl = scrollRef.current;
    const cinemaEl = cinemaRef.current;
    if (!scrollEl || !cinemaEl) return;

    const update = () => {
      const max = cinemaEl.offsetHeight - scrollEl.clientHeight;
      const local = scrollEl.scrollTop - cinemaEl.offsetTop;
      const sceneProgress = max > 0 ? Math.min(1, Math.max(0, local / max)) : 0;

      const pageMax = scrollEl.scrollHeight - scrollEl.clientHeight;
      const scrollProgress = pageMax > 0 ? Math.min(1, Math.max(0, scrollEl.scrollTop / pageMax)) : 0;

      setVoiceInput({ sceneProgress, scrollProgress });
    };

    update();
    scrollEl.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      scrollEl.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [cinemaRef, scrollRef, setVoiceInput]);
}
