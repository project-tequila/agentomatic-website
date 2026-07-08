"use client";

import { useEffect, type RefObject } from "react";

import {
  PERSISTENT_ORB,
  storyMeetFillScale,
  storyStageViewDimensionsForWidth,
} from "./persistent-orb";

function syncVisualScale(root: HTMLElement | null, anchor: HTMLElement, viewportWidth: number) {
  const { width: viewBoxWidth, height: viewBoxHeight } = storyStageViewDimensionsForWidth(viewportWidth);
  const { width, height } = anchor.getBoundingClientRect();
  const scale = storyMeetFillScale(width, height, viewBoxWidth, viewBoxHeight);

  const vars: [string, string][] = [
    ["--story-visual-scale", String(scale)],
    ["--story-orb-center-x", `${PERSISTENT_ORB.cx}px`],
    ["--story-orb-center-y", `${PERSISTENT_ORB.cy}px`],
  ];

  for (const [key, value] of vars) {
    anchor.style.setProperty(key, value);
    root?.style.setProperty(key, value);
  }
}

export function useStoryVisualScale(
  anchorRef: RefObject<HTMLElement | null>,
  rootRef?: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const update = () => {
      syncVisualScale(rootRef?.current ?? null, anchor, window.innerWidth);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(anchor);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [anchorRef, rootRef]);
}
