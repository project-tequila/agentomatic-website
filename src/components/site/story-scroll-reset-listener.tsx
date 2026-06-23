"use client";

import { useEffect } from "react";

import { useScrollContainer } from "@/lib/helios/scroll-container-context";
import { STORY_SCROLL_RESET_EVENT } from "@/lib/story/reset-story-scroll";

/** Listens for logo/home clicks and resets the immersive story scroll position. */
export function StoryScrollResetListener() {
  const scrollRef = useScrollContainer();

  useEffect(() => {
    const onReset = () => {
      const scrollEl = scrollRef.current;
      if (!scrollEl) return;
      scrollEl.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener(STORY_SCROLL_RESET_EVENT, onReset);
    return () => window.removeEventListener(STORY_SCROLL_RESET_EVENT, onReset);
  }, [scrollRef]);

  return null;
}
