"use client";

import { useEffect, type RefObject } from "react";

import { useHeliosVoice } from "./helios-provider";
import { useScrollContainer } from "./scroll-container-context";
import { storyToSceneProgress } from "../story/chapters";

export function useStoryScroll(storyRef: RefObject<HTMLElement | null>) {
  const scrollRef = useScrollContainer();
  const { setVoiceInput } = useHeliosVoice();

  useEffect(() => {
    const scrollEl = scrollRef.current;
    const storyEl = storyRef.current;
    if (!scrollEl || !storyEl) return;

    const update = () => {
      const max = storyEl.offsetHeight - scrollEl.clientHeight;
      const local = scrollEl.scrollTop - storyEl.offsetTop;
      const storyProgress = max > 0 ? Math.min(1, Math.max(0, local / max)) : 0;
      const sceneProgress = storyToSceneProgress(storyProgress);

      const pageMax = scrollEl.scrollHeight - scrollEl.clientHeight;
      const scrollProgress = pageMax > 0 ? Math.min(1, Math.max(0, scrollEl.scrollTop / pageMax)) : 0;

      setVoiceInput({ storyProgress, sceneProgress, scrollProgress });
    };

    const frame = requestAnimationFrame(update);
    scrollEl.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      scrollEl.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [storyRef, scrollRef, setVoiceInput]);
}
