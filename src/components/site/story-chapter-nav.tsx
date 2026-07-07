"use client";

import { useCallback, useEffect, useState } from "react";

import { useHeliosVoice } from "@/lib/helios/helios-provider";
import { useScrollContainer } from "@/lib/helios/scroll-container-context";
import { useVideoFrame } from "@/lib/helios/use-video-frame";
import { ACT1_END, FEATURES_END } from "@/lib/story/chapters";
import { cn } from "@/lib/utils";

const chapters = [
  { id: "hook", label: "Intro", progress: 0 },
  { id: "features", label: "Features", progress: ACT1_END + (FEATURES_END - ACT1_END) * 0.5 },
  { id: "integrations", label: "Integrations", progress: 0.513 },
  { id: "handoff", label: "Handoff", progress: 0.676 },
  { id: "dashboard", label: "Command center", progress: 0.88 },
  { id: "demo", label: "Demo", progress: FEATURES_END },
] as const;

type ChapterId = (typeof chapters)[number]["id"];

function scrollToStoryProgress(
  scrollEl: HTMLElement,
  storyEl: HTMLElement,
  progress: number,
) {
  const max = storyEl.offsetHeight - scrollEl.clientHeight;
  const local = progress * max;
  scrollEl.scrollTo({ top: storyEl.offsetTop + local, behavior: "smooth" });
}

export function StoryChapterNav() {
  const scrollRef = useScrollContainer();
  const { helios } = useHeliosVoice();
  const { inputProps } = useVideoFrame(helios);
  const story = inputProps.storyProgress ?? 0;
  const [activeId, setActiveId] = useState<ChapterId>(chapters[0]!.id);

  useEffect(() => {
    let current: ChapterId = chapters[0]!.id;
    for (const chapter of chapters) {
      if (story >= chapter.progress - 0.04) current = chapter.id;
    }
    setActiveId(current);
  }, [story]);

  const onJump = useCallback(
    (progress: number, id: ChapterId) => {
      const scrollEl = scrollRef.current;
      const storyEl = scrollEl?.querySelector(".rumik-story") as HTMLElement | null;
      if (!scrollEl || !storyEl) return;
      scrollToStoryProgress(scrollEl, storyEl, progress);
      setActiveId(id);
    },
    [scrollRef],
  );

  return (
    <nav className="story-chapter-nav" aria-label="Story chapters">
      <ol className="story-chapter-nav__list">
        {chapters.map((chapter) => (
          <li key={chapter.id}>
            <button
              type="button"
              className={cn("story-chapter-nav__dot", activeId === chapter.id && "story-chapter-nav__dot--active")}
              aria-label={`Jump to ${chapter.label}`}
              aria-current={activeId === chapter.id ? "step" : undefined}
              onClick={() => onJump(chapter.progress, chapter.id)}
            >
              <span className="sr-only">{chapter.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
