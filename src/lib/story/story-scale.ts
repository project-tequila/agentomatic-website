import { STORY_SATELLITE_ICON_SCALE } from "./persistent-orb";

/** Story responsive breakpoints — align with globals.css media queries. */
export const STORY_BREAKPOINT_MOBILE = 480;
export const STORY_BREAKPOINT_TABLET = 900;

export type StoryPoint = { x: number; y: number };
export type StoryRect = { x: number; y: number; w: number; h: number };

export function lerpPoint(from: StoryPoint, to: StoryPoint, t: number): StoryPoint {
  return { x: lerpValue(from.x, to.x, t), y: lerpValue(from.y, to.y, t) };
}

export function lerpRect(from: StoryRect, to: StoryRect, t: number): StoryRect {
  return {
    x: lerpValue(from.x, to.x, t),
    y: lerpValue(from.y, to.y, t),
    w: lerpValue(from.w, to.w, t),
    h: lerpValue(from.h, to.h, t),
  };
}

/** 0 = desktop, 1 = mobile — smooth blend across tablet band. */
export function storyCompactT(viewportWidth: number): number {
  if (viewportWidth > STORY_BREAKPOINT_TABLET) return 0;
  if (viewportWidth <= STORY_BREAKPOINT_MOBILE) return 1;
  return (STORY_BREAKPOINT_TABLET - viewportWidth) / (STORY_BREAKPOINT_TABLET - STORY_BREAKPOINT_MOBILE);
}

/** 1 = desktop proportions, 0 = mobile — multiplier for spread/radii. */
export function storySpatialT(viewportWidth: number): number {
  return 1 - storyCompactT(viewportWidth);
}

export function lerpValue(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

/** Scale entrance offsets — tighter on compact viewports. */
export function storyRevealSpread(base: number, viewportWidth: number): number {
  const compact = storyCompactT(viewportWidth);
  return base * lerpValue(1, 0.78, compact);
}

/** Slightly larger satellites on mobile for tap/readability. */
export function storySatelliteScaleForWidth(viewportWidth: number): number {
  const compact = storyCompactT(viewportWidth);
  return lerpValue(STORY_SATELLITE_ICON_SCALE, STORY_SATELLITE_ICON_SCALE * 1.08, compact);
}
