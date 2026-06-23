import { interpolate } from "@helios-project/core";

/** Body typing stays hidden until title typing reaches completion. */
export function gatedBodyTypingReveal(
  progress: number,
  titleComplete: number,
  windowStart: number,
  windowEnd: number,
  reduceMotion = false,
): number {
  if (reduceMotion) {
    return titleComplete >= 0.995 && progress >= windowStart ? 1 : 0;
  }
  if (titleComplete < 0.995) return 0;
  return interpolate(progress, [windowStart, windowEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/** Chapters with static titles — body types shortly after the band begins. */
export function staticTitleBodyTypingReveal(progress: number, reduceMotion = false) {
  return gatedBodyTypingReveal(progress, 1, 0.06, 0.48, reduceMotion);
}
