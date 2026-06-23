"use client";

import { useEffect, useRef, useState } from "react";

/** True when story scroll value has been still for a short moment. */
export function useStoryScrollPaused(story: number, delayMs = 120) {
  const [paused, setPaused] = useState(false);
  const lastStory = useRef(story);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (Math.abs(story - lastStory.current) > 0.0004) {
      lastStory.current = story;
      setPaused(false);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setPaused(true), delayMs);
    }

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [story, delayMs]);

  useEffect(() => {
    timer.current = setTimeout(() => setPaused(true), delayMs);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [delayMs]);

  return paused;
}
