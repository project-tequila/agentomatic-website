import { interpolate } from "@helios-project/core";

import { ACT1_END, FEATURES_END, act1Beats, featureChapters } from "./chapters";

/** Canonical orb anchor — fixed across the full story scroll. */
export const PERSISTENT_ORB = {
  width: 720,
  height: 440,
  cx: 360,
  cy: 220,
} as const;

/** Fit full scene inside the viewport — no clipping or overflow. */
export const STORY_STAGE_PRESERVE = "xMidYMid meet" as const;

/** Bleed for orb waves, glows, and edge labels beyond the 720×440 canvas. */
export const STORY_STAGE_GLOW_PAD = 56;

/**
 * Legacy scale hook — kept at 1 so HTML overlays (concurrent phones) match SVG size.
 * ViewBox sizing handles viewport fill; do not shrink content here.
 */
export const STORY_STAGE_VISUAL_SCALE = 1;

/** Tiny safety margin on meet-fit so edge glow never clips. */
export const STORY_STAGE_FIT_MARGIN = 1.04;

const STORY_STAGE_BASE_WIDTH = PERSISTENT_ORB.width + STORY_STAGE_GLOW_PAD * 2;
const STORY_STAGE_BASE_HEIGHT = PERSISTENT_ORB.height + STORY_STAGE_GLOW_PAD * 2;

/** Tight viewBox centered on the orb — maximizes on-screen size while meet-fit stays safe. */
export const STORY_STAGE_VIEW = {
  width: Math.round(STORY_STAGE_BASE_WIDTH * STORY_STAGE_FIT_MARGIN),
  height: Math.round(STORY_STAGE_BASE_HEIGHT * STORY_STAGE_FIT_MARGIN),
  minX: Math.round(PERSISTENT_ORB.cx - (STORY_STAGE_BASE_WIDTH * STORY_STAGE_FIT_MARGIN) / 2),
  minY: Math.round(PERSISTENT_ORB.cy - (STORY_STAGE_BASE_HEIGHT * STORY_STAGE_FIT_MARGIN) / 2),
} as const;

export function storyStageViewBox() {
  const { minX, minY, width, height } = STORY_STAGE_VIEW;
  return `${minX} ${minY} ${width} ${height}`;
}

export type PersistentOrbMode =
  | "hook"
  | "grunt"
  | "hours"
  | "concurrent"
  | "integrations"
  | "multilingual"
  | "handoff"
  | "reminders"
  | "dashboard"
  | "cta";

type OrbBand = { id: PersistentOrbMode; start: number; end: number };

const ORB_BANDS: OrbBand[] = [
  ...act1Beats.map((b) => ({ id: b.id as PersistentOrbMode, start: b.start, end: b.end })),
  ...featureChapters.map((f) => ({ id: f.id as PersistentOrbMode, start: f.start, end: f.end })),
];

const ORB_START = 0;
const ORB_END = 1;

export function persistentOrbVisible(story: number) {
  return story >= ORB_START && story <= ORB_END;
}

export function persistentOrbOpacity(story: number) {
  if (story < ORB_START || story > ORB_END) return 0;
  return 1;
}

export function persistentOrbMode(story: number): PersistentOrbMode {
  if (story >= FEATURES_END) return "cta";
  for (const band of ORB_BANDS) {
    if (story >= band.start && story < band.end) return band.id;
  }
  if (story < ACT1_END) return "hook";
  return "dashboard";
}

export function persistentOrbBandProgress(story: number) {
  const mode = persistentOrbMode(story);
  if (mode === "cta") {
    return interpolate(story, [FEATURES_END, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }
  const band = ORB_BANDS.find((b) => b.id === mode);
  if (!band) return 0;
  return Math.min(1, Math.max(0, (story - band.start) / (band.end - band.start)));
}

export function persistentOrbIntensity(story: number) {
  const progress = persistentOrbBandProgress(story);
  const mode = persistentOrbMode(story);
  if (mode === "hook") return 0.45 + progress * 0.25;
  if (mode === "grunt") return 0.55 + progress * 0.3;
  if (mode === "handoff") {
    const calm = interpolate(progress, [0.25, 0.65], [1, 0.72], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (0.48 + progress * 0.16) * calm;
  }
  if (mode === "dashboard") return 0.44 + progress * 0.22;
  if (mode === "cta") return 0.72;
  return 0.58 + progress * 0.42;
}

export function persistentOrbDashboardOverlay(story: number) {
  if (persistentOrbMode(story) !== "dashboard") return 1;
  const progress = persistentOrbBandProgress(story);
  return interpolate(progress, [0.06, 0.32], [1, 0.72], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

export function persistentOrbModeBlend(story: number) {
  const mode = persistentOrbMode(story);
  const band = ORB_BANDS.find((b) => b.id === mode);
  if (!band) return { mode, blend: 0, nextMode: mode };

  const local = (story - band.start) / (band.end - band.start);
  const idx = ORB_BANDS.findIndex((b) => b.id === mode);

  if (local > 0.88 && idx < ORB_BANDS.length - 1) {
    const nextMode = ORB_BANDS[idx + 1]!.id;
    const blend = interpolate(local, [0.88, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { mode, blend, nextMode };
  }

  if (local < 0.12 && idx > 0) {
    const prevMode = ORB_BANDS[idx - 1]!.id;
    const blend = interpolate(local, [0, 0.12], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { mode: prevMode, blend, nextMode: mode };
  }

  return { mode, blend: 0, nextMode: mode };
}
