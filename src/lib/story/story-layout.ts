import { HANDOFF_SPATIAL_COMPACT, HANDOFF_SPATIAL_DESKTOP } from "./handoff-reveal";
import { PERSISTENT_ORB, STORY_ORB_SCALE, STORY_SATELLITE_ICON_SCALE } from "./persistent-orb";
import { integrationLayoutForWidth, type IntegrationLayout } from "./integrations-reveal";
import type { GruntHubModule } from "./grunt-reveal";
import { GRUNT_MODULE_RADIUS } from "./grunt-reveal";

/** Story responsive breakpoints — align with globals.css media queries. */
export const STORY_BREAKPOINT_MOBILE = 480;
export const STORY_BREAKPOINT_TABLET = 900;

export type StoryPoint = { x: number; y: number };
export type StoryRect = { x: number; y: number; w: number; h: number };

/** 0 = desktop, 1 = mobile — smooth blend across tablet band. */
export function storyCompactT(viewportWidth: number): number {
  if (viewportWidth > STORY_BREAKPOINT_TABLET) return 0;
  if (viewportWidth <= STORY_BREAKPOINT_MOBILE) return 1;
  return (STORY_BREAKPOINT_TABLET - viewportWidth) / (STORY_BREAKPOINT_TABLET - STORY_BREAKPOINT_MOBILE);
}

export function lerpValue(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

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

/** Orb-connected satellite scale — matches --story-satellite-icon-scale in CSS. */
export function satelliteScaleForWidth(viewportWidth: number): number {
  const t = storyCompactT(viewportWidth);
  if (t === 0) return STORY_SATELLITE_ICON_SCALE;
  if (t === 1) return 0.72;
  return STORY_SATELLITE_ICON_SCALE - t * 0.045;
}

export type ConcurrentSpatialLayout = {
  radiusScale: number;
  ySquash: number;
  satelliteScale: number;
};

export function concurrentLayoutForWidth(viewportWidth: number): ConcurrentSpatialLayout {
  const t = storyCompactT(viewportWidth);
  // Desktop orb is CSS-scaled (--story-orb-scale ≈ 0.75); pull phone orbit inward to match.
  const desktopRadiusScale = STORY_ORB_SCALE;
  return {
    radiusScale: lerpValue(desktopRadiusScale, 0.74, t),
    ySquash: lerpValue(0.82, 0.76, t),
    satelliteScale: satelliteScaleForWidth(viewportWidth),
  };
}

export function gruntModulesForRadius(moduleRadius: number, orbX = PERSISTENT_ORB.cx, orbY = PERSISTENT_ORB.cy): GruntHubModule[] {
  return [
    { id: "schedule", x: orbX, y: orbY - moduleRadius, revealAt: 0.06, accent: "sky" },
    { id: "conversations", x: orbX + moduleRadius, y: orbY, revealAt: 0.24, accent: "mint" },
    { id: "data", x: orbX, y: orbY + moduleRadius, revealAt: 0.42, accent: "amber" },
    { id: "route", x: orbX - moduleRadius, y: orbY, revealAt: 0.6, accent: "violet" },
  ];
}

export type GruntSpatialLayout = {
  moduleRadius: number;
  modules: GruntHubModule[];
  satelliteScale: number;
};

export function gruntLayoutForWidth(viewportWidth: number): GruntSpatialLayout {
  const t = storyCompactT(viewportWidth);
  const moduleRadius = lerpValue(GRUNT_MODULE_RADIUS, 118, t);
  return {
    moduleRadius,
    modules: gruntModulesForRadius(moduleRadius),
    satelliteScale: satelliteScaleForWidth(viewportWidth),
  };
}

const MULTILINGUAL_CARD_DESKTOP = { x: 458, y: 148, width: 228, height: 188 } as const;
const MULTILINGUAL_CARD_COMPACT = { x: 392, y: 132, width: 200, height: 172 } as const;

export type MultilingualSpatialLayout = {
  card: { x: number; y: number; width: number; height: number };
  satelliteScale: number;
};

export function multilingualLayoutForWidth(viewportWidth: number): MultilingualSpatialLayout {
  const t = storyCompactT(viewportWidth);
  const from = {
    x: MULTILINGUAL_CARD_DESKTOP.x,
    y: MULTILINGUAL_CARD_DESKTOP.y,
    w: MULTILINGUAL_CARD_DESKTOP.width,
    h: MULTILINGUAL_CARD_DESKTOP.height,
  };
  const to = {
    x: MULTILINGUAL_CARD_COMPACT.x,
    y: MULTILINGUAL_CARD_COMPACT.y,
    w: MULTILINGUAL_CARD_COMPACT.width,
    h: MULTILINGUAL_CARD_COMPACT.height,
  };
  const rect = lerpRect(from, to, t);
  return {
    card: { x: rect.x, y: rect.y, width: rect.w, height: rect.h },
    satelliteScale: satelliteScaleForWidth(viewportWidth),
  };
}

export type HandoffSpatialLayout = {
  caller: StoryPoint;
  callerConnectX: number;
  humanStart: StoryPoint;
  humanEnd: StoryPoint;
  orbShift: number;
  satelliteScale: number;
};

export function handoffLayoutForWidth(viewportWidth: number): HandoffSpatialLayout {
  const t = storyCompactT(viewportWidth);
  const desktop = HANDOFF_SPATIAL_DESKTOP;
  const compact = HANDOFF_SPATIAL_COMPACT;
  const caller = lerpPoint(desktop.caller, compact.caller, t);
  const humanStart = lerpPoint(desktop.humanStart, compact.humanStart, t);
  const humanEnd = lerpPoint(desktop.humanEnd, compact.humanEnd, t);
  return {
    caller,
    callerConnectX: lerpValue(desktop.callerConnectX, compact.callerConnectX, t),
    humanStart,
    humanEnd,
    orbShift: lerpValue(desktop.orbShift, compact.orbShift, t),
    satelliteScale: satelliteScaleForWidth(viewportWidth),
  };
}

export type RemindersSpatialLayout = {
  caller: StoryPoint;
  callerConnectX: number;
  calendar: StoryPoint;
  satelliteScale: number;
};

export function remindersLayoutForWidth(viewportWidth: number): RemindersSpatialLayout {
  const t = storyCompactT(viewportWidth);
  const caller = lerpPoint({ x: 48, y: PERSISTENT_ORB.cy }, { x: 82, y: PERSISTENT_ORB.cy - 2 }, t);
  const calendar = lerpPoint({ x: 572, y: 188 }, { x: 518, y: 168 }, t);
  return {
    caller,
    callerConnectX: caller.x + 44,
    calendar,
    satelliteScale: satelliteScaleForWidth(viewportWidth),
  };
}

/** Thread + rail sit below site chrome safe zone (slice-crop + y-offset). */
const DASHBOARD_THREAD_DESKTOP: StoryRect = { x: 48, y: 54, w: 296, h: 206 };
const DASHBOARD_THREAD_COMPACT: StoryRect = { x: 62, y: 46, w: 268, h: 188 };
const DASHBOARD_ICONS_DESKTOP: StoryRect = { x: 620, y: 58, w: 52, h: 204 };
const DASHBOARD_ICONS_COMPACT: StoryRect = { x: 558, y: 50, w: 48, h: 188 };

export type DashboardSpatialLayout = {
  thread: StoryRect;
  actionIcons: StoryRect;
  satelliteScale: number;
};

export function dashboardLayoutForWidth(viewportWidth: number): DashboardSpatialLayout {
  const t = storyCompactT(viewportWidth);
  return {
    thread: lerpRect(DASHBOARD_THREAD_DESKTOP, DASHBOARD_THREAD_COMPACT, t),
    actionIcons: lerpRect(DASHBOARD_ICONS_DESKTOP, DASHBOARD_ICONS_COMPACT, t),
    satelliteScale: satelliteScaleForWidth(viewportWidth),
  };
}

export type HoursSpatialLayout = {
  orbitRadius: number;
  satelliteScale: number;
};

export function hoursLayoutForWidth(viewportWidth: number): HoursSpatialLayout {
  const t = storyCompactT(viewportWidth);
  const baseOrbit = 132 * STORY_SATELLITE_ICON_SCALE;
  return {
    orbitRadius: lerpValue(baseOrbit, baseOrbit * 0.88, t),
    satelliteScale: satelliteScaleForWidth(viewportWidth),
  };
}

export type StorySpatialLayout = {
  viewportWidth: number;
  satelliteScale: number;
  integrations: IntegrationLayout;
  concurrent: ConcurrentSpatialLayout;
  grunt: GruntSpatialLayout;
  multilingual: MultilingualSpatialLayout;
  handoff: HandoffSpatialLayout;
  reminders: RemindersSpatialLayout;
  dashboard: DashboardSpatialLayout;
  hours: HoursSpatialLayout;
};

export function storySpatialLayoutForWidth(viewportWidth: number): StorySpatialLayout {
  const satelliteScale = satelliteScaleForWidth(viewportWidth);
  return {
    viewportWidth,
    satelliteScale,
    integrations: integrationLayoutForWidth(viewportWidth),
    concurrent: concurrentLayoutForWidth(viewportWidth),
    grunt: gruntLayoutForWidth(viewportWidth),
    multilingual: multilingualLayoutForWidth(viewportWidth),
    handoff: handoffLayoutForWidth(viewportWidth),
    reminders: remindersLayoutForWidth(viewportWidth),
    dashboard: dashboardLayoutForWidth(viewportWidth),
    hours: hoursLayoutForWidth(viewportWidth),
  };
}
