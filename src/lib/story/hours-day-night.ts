import { interpolate } from "@helios-project/core";

import { featureChapters } from "./chapters";

/** 0 = deep night, 1 = full daylight — driven by the same orbit as HoursDayNightCycle. */
export type HoursDayNightMix = {
  progress: number;
  angle: number;
  sunWeight: number;
  moonWeight: number;
  /** Primary crossfade: 0 night → 1 day. */
  dayMix: number;
  nightSky: number;
  starOpacity: number;
  dayGlow: number;
};

const EDGE = 0.04;

/**
 * Day↔night weights from hours chapter scroll progress.
 * Angle matches the sun/moon body on the dashed orbit (progress 0 → sun high / day).
 * Clamps progress at band edges so soft chapter blends still get a stable sky.
 */
export function hoursDayNightMix(story: number): HoursDayNightMix | null {
  const band = featureChapters.find((chapter) => chapter.id === "hours");
  if (!band) return null;
  if (story < band.start - EDGE || story >= band.end + EDGE) return null;

  const progress = Math.min(1, Math.max(0, (story - band.start) / (band.end - band.start)));
  const angle = progress * Math.PI * 2 - Math.PI / 2;
  const sunWeight = Math.max(0, -Math.sin(angle));
  const moonWeight = Math.max(0, Math.sin(angle));

  const nightSky = interpolate(moonWeight, [0, 0.45, 1], [0, 0.55, 0.88], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const starOpacity = interpolate(moonWeight, [0.2, 0.5, 1], [0, 0.82, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dayGlow = interpolate(sunWeight, [0, 0.5, 1], [0, 0.45, 0.72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return {
    progress,
    angle,
    sunWeight,
    moonWeight,
    dayMix: sunWeight,
    nightSky,
    starOpacity,
    dayGlow,
  };
}
