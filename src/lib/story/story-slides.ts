import { act1Beats, FEATURES_END, featureChapters } from "./chapters.ts";

export type StorySlide = {
  id: string;
  start: number;
  end: number;
};

/** Discrete homepage beats. Scroll pages between these; each plays on a clock. */
export const storySlides: StorySlide[] = [
  ...act1Beats.map((beat) => ({ id: beat.id, start: beat.start, end: beat.end })),
  ...featureChapters.map((chapter) => ({ id: chapter.id, start: chapter.start, end: chapter.end })),
  { id: "cta", start: FEATURES_END, end: 1 },
];

export const STORY_SLIDE_COUNT = storySlides.length;

/** Time to run one beat's reveal after a page lands — unhurried, then holds. */
export const STORY_SLIDE_PLAY_MS = 3600;

/** Breath before the beat starts moving. */
export const STORY_SLIDE_DELAY_MS = 180;

/** Ignore extra wheel/trackpad inertia after a page change. */
export const STORY_SLIDE_LOCK_MS = 680;

const BAND_INSET = 0.999;

export function clampStorySlideIndex(index: number) {
  if (index < 0) return 0;
  if (index >= storySlides.length) return storySlides.length - 1;
  return index;
}

export function storySlideAt(index: number): StorySlide {
  return storySlides[clampStorySlideIndex(index)]!;
}

export function storySlideIndexById(id: string) {
  const index = storySlides.findIndex((slide) => slide.id === id);
  return index >= 0 ? index : 0;
}

export function slideIndexForStoryProgress(story: number) {
  if (story >= 1) return storySlides.length - 1;
  const index = storySlides.findIndex((slide) => story >= slide.start && story < slide.end);
  return index >= 0 ? index : storySlides.length - 1;
}

/**
 * Maps a 0–1 playhead onto the existing scroll timeline for one beat.
 * Stays strictly inside the band so the next chapter does not leak in.
 */
export function storyProgressForSlide(index: number, playhead: number) {
  const slide = storySlideAt(index);
  const t = Math.min(1, Math.max(0, playhead));
  return slide.start + (slide.end - slide.start) * t * BAND_INSET;
}

export function isLastStorySlide(index: number) {
  return clampStorySlideIndex(index) === storySlides.length - 1;
}
