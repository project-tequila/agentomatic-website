import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { FEATURES_END, activeFeatureChapter, activeStoryChapter } from "./chapters.ts";
import {
  STORY_SLIDE_COUNT,
  clampStorySlideIndex,
  isLastStorySlide,
  slideIndexForStoryProgress,
  storyProgressForSlide,
  storySlideAt,
  storySlides,
} from "./story-slides.ts";

describe("story slides", () => {
  it("covers the full timeline without gaps", () => {
    assert.equal(STORY_SLIDE_COUNT, 10);
    assert.equal(storySlides[0]!.start, 0);
    assert.equal(storySlides.at(-1)!.end, 1);
    for (let i = 1; i < storySlides.length; i++) {
      assert.equal(storySlides[i]!.start, storySlides[i - 1]!.end);
    }
  });

  it("keeps autoplay progress inside the active band", () => {
    const grunt = storySlides.findIndex((slide) => slide.id === "grunt");
    const start = storyProgressForSlide(grunt, 0);
    const end = storyProgressForSlide(grunt, 1);
    assert.equal(start, storySlideAt(grunt).start);
    assert.ok(end < storySlideAt(grunt).end);
    assert.equal(activeStoryChapter(start).id, "grunt");
    assert.equal(activeStoryChapter(end).id, "grunt");
  });

  it("maps feature playheads to the matching feature chapter", () => {
    const hours = storySlideIndexSafe("hours");
    const mid = storyProgressForSlide(hours, 0.5);
    assert.equal(activeFeatureChapter(mid)?.id, "hours");
    const cta = storyProgressForSlide(STORY_SLIDE_COUNT - 1, 0.2);
    assert.ok(cta >= FEATURES_END);
    assert.equal(activeFeatureChapter(cta), null);
  });

  it("clamps indices and detects the last slide", () => {
    assert.equal(clampStorySlideIndex(-2), 0);
    assert.equal(clampStorySlideIndex(99), STORY_SLIDE_COUNT - 1);
    assert.equal(isLastStorySlide(STORY_SLIDE_COUNT - 1), true);
    assert.equal(isLastStorySlide(0), false);
    assert.equal(slideIndexForStoryProgress(0), 0);
    assert.equal(slideIndexForStoryProgress(0.92), STORY_SLIDE_COUNT - 1);
  });

  it("holds autoplay at a fully-on point inside the band", () => {
    const hours = storySlideIndexSafe("hours");
    const held = storyProgressForSlide(hours, 1);
    const band = storySlideAt(hours);
    assert.ok(held < band.end);
    assert.ok(held > band.start + (band.end - band.start) * 0.9);
    assert.equal(activeFeatureChapter(held)?.id, "hours");
  });
});

function storySlideIndexSafe(id: string) {
  const index = storySlides.findIndex((slide) => slide.id === id);
  assert.ok(index >= 0);
  return index;
}
