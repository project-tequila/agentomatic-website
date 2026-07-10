import { interpolate } from "@helios-project/core";

import { ACT1_END, FEATURES_END, act1Beats, featureChapters } from "./chapters";
import { storyCompactT } from "./story-scale";

/** Canonical orb anchor — fixed across the full story scroll. */
export const PERSISTENT_ORB = {
  width: 720,
  height: 440,
  cx: 360,
  cy: 220,
} as const;

/** Edge-to-edge fill — slice crops overflow; CSS scale is 1 for viewport fill. */
export const STORY_STAGE_PRESERVE = "xMidYMid slice" as const;

/** Show full art on narrow viewports — no edge crop. */
export const STORY_STAGE_PRESERVE_MEET = "xMidYMid meet" as const;

export const STORY_PRESERVE_TABLET_MAX = 900;

export type StoryPreserveAspectRatio = typeof STORY_STAGE_PRESERVE | typeof STORY_STAGE_PRESERVE_MEET;

/** Meet on narrow viewports (no edge crop); slice on desktop for edge-to-edge fill. */
export function storyPreserveForWidth(viewportWidth: number): StoryPreserveAspectRatio {
  return viewportWidth <= STORY_PRESERVE_TABLET_MAX ? STORY_STAGE_PRESERVE_MEET : STORY_STAGE_PRESERVE;
}

/** Bleed for orb waves, glows, and edge labels beyond the 720×440 canvas. */
export const STORY_STAGE_GLOW_PAD = 56;

/**
 * Legacy scale hook — kept at 1 so HTML overlays (concurrent phones) match SVG size.
 * ViewBox sizing handles viewport fill; do not shrink content here.
 */
export const STORY_STAGE_VISUAL_SCALE = 1;

/** Orb-connected satellite icons (channels, phones, hub modules) — matches --story-satellite-icon-scale in CSS. */
export const STORY_SATELLITE_ICON_SCALE = 0.765;

/** Persistent frontdesk orb visual scale — matches desktop --story-orb-scale in CSS. */
export const STORY_ORB_SCALE = 0.6;

/** Outermost voice wave radius in SVG user units (FrontdeskVoiceOrb). */
export const PERSISTENT_ORB_OUTER_WAVE_RADIUS = 104;

/** Max wave ripple amplitude beyond the outer radius (FrontdeskVoiceOrb). */
export const PERSISTENT_ORB_WAVE_AMPLITUDE = 12;

/** Hours chapter dashed orbit — fully encloses outer waves with comfortable inset. */
export const PERSISTENT_ORB_HOURS_ORBIT_RADIUS =
  PERSISTENT_ORB_OUTER_WAVE_RADIUS + PERSISTENT_ORB_WAVE_AMPLITUDE + 36;

export function viewBoxDimensions(viewBox: string) {
  const parts = viewBox.trim().split(/\s+/).map(Number);
  return {
    width: parts[2] ?? STORY_STAGE_VIEW.width,
    height: parts[3] ?? STORY_STAGE_VIEW.height,
  };
}

/** Horizontal hit-zone offset when the orb shifts in SVG space (e.g. handoff), as % of stage width. */
export function persistentOrbHitShiftPercent(shiftX: number, viewBox: string) {
  const { width } = viewBoxDimensions(viewBox);
  return (shiftX / width) * 100 * STORY_ORB_SCALE;
}

/** Hit target diameter as % of stage width — outer waves plus light tap padding, scaled with the orb. */
export function persistentOrbHitSizePercent(viewBox: string, padding = 1.1) {
  const { width } = viewBoxDimensions(viewBox);
  const diameter = PERSISTENT_ORB_OUTER_WAVE_RADIUS * 2 * padding;
  return (diameter / width) * 100 * STORY_ORB_SCALE;
}

/** Slight viewBox bleed so slice-crop keeps glows inside the frame. */
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

/** Hard cap for computed mobile fill scale — orb-centered zoom with safety margins. */
export const STORY_VISUAL_SCALE_MAX = 2.0125;

/** Tighter padding on mobile/tablet — larger orb at same meet-fit width. */
const STORY_STAGE_COMPACT_GLOW_PAD = 32;
const STORY_STAGE_COMPACT_FIT_MARGIN = 1;

function storyStageViewForPadding(glowPad: number, fitMargin: number) {
  const baseWidth = PERSISTENT_ORB.width + glowPad * 2;
  const baseHeight = PERSISTENT_ORB.height + glowPad * 2;
  return {
    width: Math.round(baseWidth * fitMargin),
    height: Math.round(baseHeight * fitMargin),
    minX: Math.round(PERSISTENT_ORB.cx - (baseWidth * fitMargin) / 2),
    minY: Math.round(PERSISTENT_ORB.cy - (baseHeight * fitMargin) / 2),
  };
}

const STORY_STAGE_COMPACT_VIEW = storyStageViewForPadding(
  STORY_STAGE_COMPACT_GLOW_PAD,
  STORY_STAGE_COMPACT_FIT_MARGIN,
);

function storyStageViewForWidth(viewportWidth: number) {
  const t = storyCompactT(viewportWidth);
  if (t <= 0) return STORY_STAGE_VIEW;
  if (t >= 1) return STORY_STAGE_COMPACT_VIEW;
  return {
    width: Math.round(lerpView(STORY_STAGE_VIEW.width, STORY_STAGE_COMPACT_VIEW.width, t)),
    height: Math.round(lerpView(STORY_STAGE_VIEW.height, STORY_STAGE_COMPACT_VIEW.height, t)),
    minX: Math.round(lerpView(STORY_STAGE_VIEW.minX, STORY_STAGE_COMPACT_VIEW.minX, t)),
    minY: Math.round(lerpView(STORY_STAGE_VIEW.minY, STORY_STAGE_COMPACT_VIEW.minY, t)),
  };
}

function lerpView(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

/** Desktop / wide viewBox string. */
export function storyStageViewBox() {
  const { minX, minY, width, height } = STORY_STAGE_VIEW;
  return `${minX} ${minY} ${width} ${height}`;
}

/** ViewBox interpolated between desktop bleed and compact tight frame. */
export function storyStageViewBoxForWidth(viewportWidth: number) {
  const { minX, minY, width, height } = storyStageViewForWidth(viewportWidth);
  return `${minX} ${minY} ${width} ${height}`;
}

export function storyStageViewDimensionsForWidth(viewportWidth: number) {
  const { width, height } = storyStageViewForWidth(viewportWidth);
  return { width, height };
}

/**
 * Max CSS --story-visual-scale for meet-fit SVG inside the stage anchor box.
 * Uses vertical slack on width-limited portrait stages.
 */
export function storyMeetFillScale(
  stageWidth: number,
  stageHeight: number,
  viewBoxWidth: number = STORY_STAGE_VIEW.width,
  viewBoxHeight: number = STORY_STAGE_VIEW.height,
  safety = 0.96,
): number {
  if (stageWidth <= 0 || stageHeight <= 0) return 1;
  const meet = Math.min(stageWidth / viewBoxWidth, stageHeight / viewBoxHeight);
  const fitW = viewBoxWidth * meet;
  const fitH = viewBoxHeight * meet;
  const widthLimited = fitW >= stageWidth - 0.5;
  const rawFill = widthLimited ? stageHeight / fitH : stageWidth / fitW;
  return Math.max(1, Math.min(rawFill * safety, STORY_VISUAL_SCALE_MAX));
}

/** Grunt hub extends beyond the orb canvas — asymmetric viewBox keeps top labels inside the frame. */
export function gruntStageViewBox() {
  const { cx, cy } = PERSISTENT_ORB;
  const padX = STORY_STAGE_GLOW_PAD + 24;
  const padTop = STORY_STAGE_GLOW_PAD + 116;
  const padBottom = STORY_STAGE_GLOW_PAD + 72;
  const halfW = (PERSISTENT_ORB.width + padX * 2) / 2;
  const minX = Math.round(cx - halfW * STORY_STAGE_FIT_MARGIN);
  const minY = Math.round(cy - (PERSISTENT_ORB.height / 2 + padTop) * STORY_STAGE_FIT_MARGIN);
  const maxY = Math.round(cy + (PERSISTENT_ORB.height / 2 + padBottom) * STORY_STAGE_FIT_MARGIN);
  const width = Math.round(halfW * 2 * STORY_STAGE_FIT_MARGIN);
  const height = maxY - minY;
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
