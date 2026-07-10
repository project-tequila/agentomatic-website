"use client";

import { useEffect, useRef, useState } from "react";

import { useScrollContainer } from "@/lib/helios/scroll-container-context";

/** True when story scroll value has been still for a short moment. */
export function useStoryScrollPaused(story: number, delayMs = 120) {
  const scrollRef = useScrollContainer();
  const [paused, setPaused] = useState(false);
  const lastStory = useRef(story);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const schedulePaused = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setPaused(true), delayMs);
  };

  const markActive = () => {
    setPaused(false);
    schedulePaused();
  };

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    // Avoid synchronous state writes in effects (lint rule).
    queueMicrotask(markActive);

    scrollEl.addEventListener("scroll", markActive, { passive: true });
    scrollEl.addEventListener("touchstart", markActive, { passive: true });
    scrollEl.addEventListener("touchend", markActive, { passive: true });
    scrollEl.addEventListener("touchcancel", markActive, { passive: true });
    scrollEl.addEventListener("scrollend", schedulePaused);

    return () => {
      if (timer.current) clearTimeout(timer.current);
      scrollEl.removeEventListener("scroll", markActive);
      scrollEl.removeEventListener("touchstart", markActive);
      scrollEl.removeEventListener("touchend", markActive);
      scrollEl.removeEventListener("touchcancel", markActive);
      scrollEl.removeEventListener("scrollend", schedulePaused);
    };
  }, [scrollRef, delayMs]);

  useEffect(() => {
    if (Math.abs(story - lastStory.current) > 0.0004) {
      lastStory.current = story;
      queueMicrotask(markActive);
    }
  }, [story, delayMs]);

  return paused;
}
