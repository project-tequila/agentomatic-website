"use client";

import { useEffect, type RefObject } from "react";

import {
  gruntStageViewBox,
  STORY_PRESERVE_TABLET_MAX,
  storyMeetFillScale,
  storyStageViewDimensionsForWidth,
  viewBoxDimensions,
} from "./persistent-orb";

export type StoryVisualScaleScene = "grunt" | "integrations" | "handoff" | "reminders" | "default";

function viewBoxForScene(scene: StoryVisualScaleScene, viewportWidth: number) {
  if (scene === "grunt") {
    return viewBoxDimensions(gruntStageViewBox());
  }
  return storyStageViewDimensionsForWidth(viewportWidth);
}

function safetyForScene(scene: StoryVisualScaleScene) {
  switch (scene) {
    case "grunt":
      return 0.9;
    case "integrations":
    case "handoff":
    case "reminders":
      return 0.92;
    default:
      return 0.96;
  }
}

function cssVisualScaleFloor(root: HTMLElement) {
  const raw = getComputedStyle(root).getPropertyValue("--story-visual-scale").trim();
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

/** Measures stage anchor and sets --story-visual-scale on the illustration root (mobile/tablet only). */
export function useStoryVisualScale(
  stageAnchorRef: RefObject<HTMLElement | null>,
  rootRef: RefObject<HTMLElement | null>,
  activeScene: StoryVisualScaleScene,
) {
  useEffect(() => {
    const anchor = stageAnchorRef.current;
    const root = rootRef.current;
    if (!anchor || !root) return;

    const sync = () => {
      if (window.innerWidth > STORY_PRESERVE_TABLET_MAX) {
        root.style.removeProperty("--story-visual-scale");
        return;
      }

      const { width, height } = anchor.getBoundingClientRect();
      const vb = viewBoxForScene(activeScene, window.innerWidth);
      const computed = storyMeetFillScale(
        width,
        height,
        vb.width,
        vb.height,
        safetyForScene(activeScene),
      );
      const scale = Math.max(cssVisualScaleFloor(root), computed);
      root.style.setProperty("--story-visual-scale", scale.toFixed(3));
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(anchor);
    window.addEventListener("resize", sync);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
      root.style.removeProperty("--story-visual-scale");
    };
  }, [stageAnchorRef, rootRef, activeScene]);
}
