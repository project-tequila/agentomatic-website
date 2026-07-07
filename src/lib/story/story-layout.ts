import { HANDOFF_SPATIAL_DESKTOP } from "./handoff-reveal";
import {
  PERSISTENT_ORB,
  PERSISTENT_ORB_HOURS_ORBIT_RADIUS,
  STORY_ORB_SCALE,
  STORY_SATELLITE_ICON_SCALE,
  storyPreserveForWidth,
  type StoryPreserveAspectRatio,
} from "./persistent-orb";
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

/** Orb-connected satellite scale — same ratio on mobile and desktop. */
export function satelliteScaleForWidth(_viewportWidth: number): number {
  return STORY_SATELLITE_ICON_SCALE;
}

export type ConcurrentSpatialLayout = {
  radiusScale: number;
  ySquash: number;
  satelliteScale: number;
};

export function concurrentLayoutForWidth(_viewportWidth: number): ConcurrentSpatialLayout {
  return {
    radiusScale: STORY_ORB_SCALE,
    ySquash: 0.82,
    satelliteScale: STORY_SATELLITE_ICON_SCALE,
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

/** Hub module card boost on mobile/tablet only (scheduling, routing, etc.). */
export const GRUNT_HUB_CARD_SCALE_COMPACT = 1.25;

export function gruntLayoutForWidth(_viewportWidth: number): GruntSpatialLayout {
  return {
    moduleRadius: GRUNT_MODULE_RADIUS,
    modules: gruntModulesForRadius(GRUNT_MODULE_RADIUS),
    satelliteScale: STORY_SATELLITE_ICON_SCALE,
  };
}

const MULTILINGUAL_CARD_DESKTOP = { x: 458, y: 148, width: 228, height: 188 } as const;
const MULTILINGUAL_CARD_COMPACT = { x: 408, y: 138, width: 192, height: 164 } as const;

export type MultilingualSpatialLayout = {
  card: { x: number; y: number; width: number; height: number };
  satelliteScale: number;
};

export function multilingualLayoutForWidth(_viewportWidth: number): MultilingualSpatialLayout {
  return {
    card: {
      x: MULTILINGUAL_CARD_DESKTOP.x,
      y: MULTILINGUAL_CARD_DESKTOP.y,
      width: MULTILINGUAL_CARD_DESKTOP.width,
      height: MULTILINGUAL_CARD_DESKTOP.height,
    },
    satelliteScale: STORY_SATELLITE_ICON_SCALE,
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

export function handoffLayoutForWidth(_viewportWidth: number): HandoffSpatialLayout {
  const desktop = HANDOFF_SPATIAL_DESKTOP;
  return {
    caller: desktop.caller,
    callerConnectX: desktop.callerConnectX,
    humanStart: desktop.humanStart,
    humanEnd: desktop.humanEnd,
    orbShift: desktop.orbShift,
    satelliteScale: STORY_SATELLITE_ICON_SCALE,
  };
}

export type RemindersSpatialLayout = {
  caller: StoryPoint;
  callerConnectX: number;
  calendar: StoryPoint;
  satelliteScale: number;
};

export function remindersLayoutForWidth(_viewportWidth: number): RemindersSpatialLayout {
  return {
    caller: { x: 48, y: PERSISTENT_ORB.cy },
    callerConnectX: 48 + 44,
    calendar: { x: 572, y: 188 },
    satelliteScale: STORY_SATELLITE_ICON_SCALE,
  };
}

/** Thread + rail sit below site chrome safe zone (slice-crop + y-offset). */
const DASHBOARD_THREAD_DESKTOP: StoryRect = { x: 48, y: 54, w: 296, h: 206 };
const DASHBOARD_THREAD_COMPACT: StoryRect = { x: 72, y: 48, w: 252, h: 178 };
const DASHBOARD_ICONS_DESKTOP: StoryRect = { x: 620, y: 58, w: 52, h: 204 };
const DASHBOARD_ICONS_COMPACT: StoryRect = { x: 548, y: 54, w: 44, h: 172 };

export type DashboardSpatialLayout = {
  thread: StoryRect;
  actionIcons: StoryRect;
  satelliteScale: number;
};

export function dashboardLayoutForWidth(_viewportWidth: number): DashboardSpatialLayout {
  return {
    thread: DASHBOARD_THREAD_DESKTOP,
    actionIcons: DASHBOARD_ICONS_DESKTOP,
    satelliteScale: STORY_SATELLITE_ICON_SCALE,
  };
}

export type HoursSpatialLayout = {
  orbitRadius: number;
  satelliteScale: number;
};

export function hoursLayoutForWidth(_viewportWidth: number): HoursSpatialLayout {
  return {
    orbitRadius: PERSISTENT_ORB_HOURS_ORBIT_RADIUS,
    satelliteScale: STORY_SATELLITE_ICON_SCALE,
  };
}

export type StorySpatialLayout = {
  viewportWidth: number;
  preserveAspectRatio: StoryPreserveAspectRatio;
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
    preserveAspectRatio: storyPreserveForWidth(viewportWidth),
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
