import { interpolate } from "@helios-project/core";

import { gatedBodyTypingReveal } from "./body-typing-reveal";
import { PERSISTENT_ORB } from "./persistent-orb";

export const HANDOFF_STAGE = {
  width: PERSISTENT_ORB.width,
  height: PERSISTENT_ORB.height,
  orbX: PERSISTENT_ORB.cx,
  orbY: PERSISTENT_ORB.cy,
} as const;

/** Extreme left — caller on inbound or outbound. */
export const HANDOFF_CALLER = { x: 48, y: PERSISTENT_ORB.cy };

/** Outbound edge of the realistic caller phone (matches handoff-scene scale). */
export const HANDOFF_CALLER_CONNECT_X = HANDOFF_CALLER.x + 26;

/** Human starts upper-right; ends left of center after swap. */
export const HANDOFF_HUMAN_START = { x: 536, y: 186 };
export const HANDOFF_HUMAN_END = { x: 228, y: 224 };

/** Orb slides right as the human takes the desk. */
export const HANDOFF_ORB_SHIFT = 128;

export type HandoffLayout = {
  humanX: number;
  humanY: number;
  orbShiftX: number;
  orbX: number;
  swap: number;
};

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

export function handoffLayout(progress: number): HandoffLayout {
  const swap = smoothstep(
    interpolate(progress, [0.5, 0.86], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const humanX = HANDOFF_HUMAN_START.x + (HANDOFF_HUMAN_END.x - HANDOFF_HUMAN_START.x) * swap;
  const humanY = HANDOFF_HUMAN_START.y + (HANDOFF_HUMAN_END.y - HANDOFF_HUMAN_START.y) * swap;
  const orbShiftX = HANDOFF_ORB_SHIFT * swap;

  return {
    humanX,
    humanY,
    orbShiftX,
    orbX: PERSISTENT_ORB.cx + orbShiftX,
    swap,
  };
}

export function handoffOrbShift(progress: number) {
  return handoffLayout(progress).orbShiftX;
}

export function handoffCallerToOrbPath(orbX: number) {
  const y = PERSISTENT_ORB.cy;
  const sx = HANDOFF_CALLER_CONNECT_X;
  return `M ${sx} ${y} Q ${(sx + orbX) / 2 - 12} ${y - 32} ${orbX - 44} ${y}`;
}

export function handoffCallerToHumanPath(layout: HandoffLayout) {
  const sx = HANDOFF_CALLER_CONNECT_X;
  const sy = PERSISTENT_ORB.cy;
  const ex = layout.humanX - 38;
  const ey = layout.humanY + 4;
  const cx = sx + (ex - sx) * 0.46;
  const cy = sy + (ey - sy) * 0.32 - 16;
  return `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`;
}

/** @deprecated use handoffCallerToOrbPath */
export function handoffCallerPath(orbX: number) {
  return handoffCallerToOrbPath(orbX);
}

export function handoffSummaryPath(layout: HandoffLayout) {
  const sx = layout.orbX + 18;
  const sy = PERSISTENT_ORB.cy + 12;
  const ex = layout.humanX - 36;
  const ey = layout.humanY + 8;
  const cx = (sx + ex) / 2;
  const cy = sy - 36 + layout.swap * 12;
  return `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`;
}

export function handoffCallerReveal(progress: number) {
  return interpolate(progress, [0.06, 0.22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

export function handoffRoutineReveal(progress: number) {
  const fadeIn = interpolate(progress, [0.14, 0.32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(progress, [0.46, 0.66], [1, 0.22], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return fadeIn * fadeOut;
}

/** Caller routed to AI before the warm handoff. */
export function handoffCallerToOrbFlow(progress: number) {
  const fadeIn = interpolate(progress, [0.12, 0.38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(progress, [0.48, 0.64], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return fadeIn * fadeOut;
}

/** After transfer, caller stays on the line with your team — not the agent. */
export function handoffCallerToHumanFlow(progress: number) {
  return interpolate(progress, [0.64, 0.86], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

/** @deprecated use handoffCallerToOrbFlow */
export function handoffCallerFlowReveal(progress: number) {
  return handoffCallerToOrbFlow(progress);
}

export function handoffTransferReveal(progress: number) {
  return interpolate(progress, [0.28, 0.48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

/** Keeps the handoff moment visible through the swap and caller reconnect. */
export function handoffTransferIntensity(progress: number) {
  const rise = interpolate(progress, [0.28, 0.46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fall = interpolate(progress, [0.74, 0.94], [1, 0.42], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return rise * fall;
}

export function handoffTransferPeak(progress: number) {
  return interpolate(progress, [0.4, 0.52, 0.64], [0.55, 1, 0.72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function handoffHumanReveal(progress: number, reduceMotion = false) {
  const raw = interpolate(progress, [0.28, 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t = reduceMotion ? (raw > 0.45 ? 1 : 0) : smoothstep(raw);
  return {
    opacity: t,
    scale: 0.84 + t * 0.18,
    ring: interpolate(progress, [0.5, 0.88], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  };
}

export function handoffControlReveal(progress: number) {
  return interpolate(progress, [0.58, 0.82], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

/** Warm handoff label — only after the transfer has completed. */
export function handoffWarmHandoffLabel(progress: number) {
  return interpolate(progress, [0.54, 0.72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

/** Title tagline typing — synced with orb→human transfer in the scene. */
export function handoffTaglineTypingReveal(progress: number, reduceMotion = false) {
  if (reduceMotion) return 1;
  return smoothstep(
    interpolate(progress, [0.38, 0.68], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
}

export function handoffTaglineGlow(progress: number) {
  return interpolate(progress, [0.52, 0.64, 0.78], [0, 1, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/** 0–1 — tagline fully typed (line 2 complete). */
export function handoffTitleCompleteReveal(progress: number, reduceMotion = false) {
  return handoffTaglineTypingReveal(progress, reduceMotion);
}

export function handoffBodyReveal(progress: number, reduceMotion = false) {
  const titleComplete = handoffTitleCompleteReveal(progress, reduceMotion);
  return gatedBodyTypingReveal(progress, titleComplete, 0.72, 0.94, reduceMotion);
}

export function handoffSummaryReveal(progress: number, layout: HandoffLayout) {
  const opacity = interpolate(progress, [0.36, 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const travel = interpolate(progress, [0.44, 0.76], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t = smoothstep(travel);
  const peak = handoffTransferPeak(progress);

  const startX = layout.orbX - 58;
  const startY = PERSISTENT_ORB.cy + 38;
  const endX = layout.humanX - 78;
  const endY = layout.humanY + 42;

  return {
    opacity: opacity * (0.72 + peak * 0.28),
    x: startX + (endX - startX) * t,
    y: startY + (endY - startY) * t,
    slide: interpolate(progress, [0.38, 0.74], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    travel: t,
    scale: 0.94 + peak * 0.18,
    glow: peak,
  };
}

export function handoffSwapReveal(progress: number) {
  return interpolate(progress, [0.5, 0.86], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

export function handoffOrbCalm(progress: number) {
  return interpolate(progress, [0.25, 0.65], [1, 0.72], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}
