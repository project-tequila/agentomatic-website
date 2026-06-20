import { interpolate } from "@helios-project/core";

/** 0–1 timeline for the front-desk cinema (walk in → sit → ready). */
export function scenePhase(progress: number) {
  const p = Math.min(1, Math.max(0, progress));
  return {
    grunt: interpolate(p, [0, 0.2], [1, 0], { extrapolateRight: "clamp" }),
    walk: interpolate(p, [0.12, 0.22, 0.58], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    sit: interpolate(p, [0.5, 0.62, 0.82], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    seated: interpolate(p, [0.72, 0.88], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    raw: p,
  };
}

export function walkProgress(progress: number) {
  return interpolate(progress, [0.18, 0.58], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

export function sitProgress(progress: number) {
  return interpolate(progress, [0.52, 0.82], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}
