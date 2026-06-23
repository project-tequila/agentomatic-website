import { interpolate } from "@helios-project/core";

import { gatedBodyTypingReveal } from "./body-typing-reveal";
import { FEATURES_END } from "./chapters";

/** 0–1 progress inside the CTA scroll band. */
export function ctaChapterProgress(story: number) {
  if (story < FEATURES_END) return null;
  return (story - FEATURES_END) / (1 - FEATURES_END);
}

export function ctaTitleLine1TypingReveal(progress: number, reduceMotion = false) {
  if (reduceMotion) return progress > 0.06 ? 1 : 0;
  return interpolate(progress, [0.04, 0.42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

export function ctaTitleLine2TypingReveal(progress: number, reduceMotion = false) {
  if (reduceMotion) return progress > 0.1 ? 1 : 0;
  return interpolate(progress, [0.34, 0.74], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

/** 0–1 — both headline lines fully typed (line 2 finishes last). */
export function ctaTitleCompleteReveal(progress: number, reduceMotion = false) {
  return ctaTitleLine2TypingReveal(progress, reduceMotion);
}

export function ctaBodyReveal(progress: number, reduceMotion = false) {
  const titleComplete = ctaTitleCompleteReveal(progress, reduceMotion);
  return gatedBodyTypingReveal(progress, titleComplete, CTA_HEADLINE_TYPING_END + 0.04, 0.96, reduceMotion);
}

/** Scroll progress where line 2 ("live.") typing target reaches 100%. */
export const CTA_HEADLINE_TYPING_END = 0.74;

/** Small buffer after headline typing so eased display catches up before strip pops in. */
export const CTA_DEMO_PANEL_REVEAL_START = 0.78;

/** Scroll-driven demo strip reveal — hidden until CTA headline typing finishes. */
export function ctaDemoPanelReveal(progress: number, reduceMotion = false) {
  if (reduceMotion) return progress > 0.1 ? 1 : 0;
  return interpolate(progress, [CTA_DEMO_PANEL_REVEAL_START, 0.92], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}
