"use client";

import { useEffect } from "react";

import { useScrollContainer } from "@/lib/helios/scroll-container-context";
import { STORY_SCROLL_RESET_EVENT } from "@/lib/story/reset-story-scroll";

/**
 * Logo/home clicks dispatch `STORY_SCROLL_RESET_EVENT`.
 * The story pager owns the actual reset; this keeps the listener mounted
 * so older callers still have a subscriber if the pager is not on the page.
 */
export function StoryScrollResetListener() {
  const scrollRef = useScrollContainer();

  useEffect(() => {
    const onReset = () => {
      const scrollEl = scrollRef.current;
      if (!scrollEl) return;
      if (scrollEl.classList.contains("site-3d__scroll--story-paging")) return;
      scrollEl.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener(STORY_SCROLL_RESET_EVENT, onReset);
    return () => window.removeEventListener(STORY_SCROLL_RESET_EVENT, onReset);
  }, [scrollRef]);

  return null;
}
