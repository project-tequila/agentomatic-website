"use client";

import { useEffect, type RefObject } from "react";

import { useHeliosVoice } from "./helios-provider";
import { useScrollContainer } from "./scroll-container-context";
import { storyToSceneProgress } from "../story/chapters";

function storyLocalProgress(scrollEl: HTMLElement, storyEl: HTMLElement) {
  const max = storyEl.offsetHeight - scrollEl.clientHeight;
  // offsetTop tracks document position; getBoundingClientRect cancels scrollTop during sticky scroll.
  const local = scrollEl.scrollTop - storyEl.offsetTop;
  const storyProgress = max > 0 ? Math.min(1, Math.max(0, local / max)) : 0;
  return { storyProgress, local, max };
}

export function useStoryScroll(storyRef: RefObject<HTMLElement | null>) {
  const scrollRef = useScrollContainer();
  const { setVoiceInput } = useHeliosVoice();

  useEffect(() => {
    const scrollEl = scrollRef.current;
    const storyEl = storyRef.current;
    if (!scrollEl || !storyEl) return;

    let raf = 0;
    let touchActive = false;
    let scrollActive = false;
    let scrollIdleTimer: ReturnType<typeof setTimeout> | null = null;

    const publish = (storyProgress: number) => {
      const sceneProgress = storyToSceneProgress(storyProgress);
      const pageMax = scrollEl.scrollHeight - scrollEl.clientHeight;
      const scrollProgress = pageMax > 0 ? Math.min(1, Math.max(0, scrollEl.scrollTop / pageMax)) : 0;
      setVoiceInput({ storyProgress, sceneProgress, scrollProgress });
    };

    const update = () => {
      const { storyProgress } = storyLocalProgress(scrollEl, storyEl);
      publish(storyProgress);
    };

    const stopPoll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const poll = () => {
      update();
      if (touchActive || scrollActive) {
        raf = requestAnimationFrame(poll);
      } else {
        raf = 0;
      }
    };

    const ensurePoll = () => {
      if (!raf) raf = requestAnimationFrame(poll);
    };

    const markScrollActive = () => {
      scrollActive = true;
      if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
      scrollIdleTimer = setTimeout(() => {
        scrollActive = false;
      }, 180);
      update();
      ensurePoll();
    };

    const onTouchStart = () => {
      touchActive = true;
      markScrollActive();
    };

    const onTouchEnd = () => {
      touchActive = false;
      markScrollActive();
      update();
    };

    update();
    ensurePoll();

    scrollEl.addEventListener("scroll", markScrollActive, { passive: true });
    scrollEl.addEventListener("touchstart", onTouchStart, { passive: true });
    scrollEl.addEventListener("touchend", onTouchEnd, { passive: true });
    scrollEl.addEventListener("touchcancel", onTouchEnd, { passive: true });
    scrollEl.addEventListener("scrollend", update);
    window.addEventListener("resize", update);

    return () => {
      stopPoll();
      if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
      scrollEl.removeEventListener("scroll", markScrollActive);
      scrollEl.removeEventListener("touchstart", onTouchStart);
      scrollEl.removeEventListener("touchend", onTouchEnd);
      scrollEl.removeEventListener("touchcancel", onTouchEnd);
      scrollEl.removeEventListener("scrollend", update);
      window.removeEventListener("resize", update);
    };
  }, [storyRef, scrollRef, setVoiceInput]);
}
