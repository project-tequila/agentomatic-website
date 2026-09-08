"use client";

import { useCallback, useEffect, useState } from "react";

import { useHeliosVoice } from "@/lib/helios/helios-provider";
import { useVideoFrame } from "@/lib/helios/use-video-frame";
import { requestStorySlide } from "@/lib/story/reset-story-scroll";
import { slideIndexForStoryProgress, storySlideIndexById } from "@/lib/story/story-slides";
import { cn } from "@/lib/utils";

const chapters = [
  { id: "hook", label: "Intro", slideId: "hook" },
  { id: "features", label: "Features", slideId: "hours" },
  { id: "integrations", label: "Integrations", slideId: "integrations" },
  { id: "handoff", label: "Handoff", slideId: "handoff" },
  { id: "dashboard", label: "Command center", slideId: "dashboard" },
  { id: "demo", label: "Demo", slideId: "cta" },
] as const;

type ChapterId = (typeof chapters)[number]["id"];

export function StoryChapterNav() {
  const { helios } = useHeliosVoice();
  const { inputProps } = useVideoFrame(helios);
  const story = inputProps.storyProgress ?? 0;
  const [activeId, setActiveId] = useState<ChapterId>(chapters[0]!.id);

  useEffect(() => {
    const slideIndex = slideIndexForStoryProgress(story);
    let current: ChapterId = chapters[0]!.id;
    for (const chapter of chapters) {
      if (storySlideIndexById(chapter.slideId) <= slideIndex) current = chapter.id;
    }
    queueMicrotask(() => setActiveId(current));
  }, [story]);

  const onJump = useCallback((slideId: string, id: ChapterId) => {
    requestStorySlide({ id: slideId });
    setActiveId(id);
  }, []);

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
              onClick={() => onJump(chapter.slideId, chapter.id)}
            >
              <span className="sr-only">{chapter.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
