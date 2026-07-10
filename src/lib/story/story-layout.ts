import { HANDOFF_SPATIAL_COMPACT, HANDOFF_SPATIAL_DESKTOP } from "./handoff-reveal";
import {
  PERSISTENT_ORB,
  PERSISTENT_ORB_HOURS_ORBIT_RADIUS,
  STORY_ORB_SCALE,
  storyPreserveForWidth,
  type StoryPreserveAspectRatio,
} from "./persistent-orb";
import { integrationLayoutForWidth, type IntegrationLayout } from "./integrations-reveal";
import type { GruntHubModule } from "./grunt-reveal";
import { GRUNT_MODULE_RADIUS } from "./grunt-reveal";
import { REMINDERS_SPATIAL_COMPACT, REMINDERS_SPATIAL_DESKTOP } from "./reminders-reveal";
import {
  lerpPoint,
  lerpRect,
  lerpValue,
  storyCompactSpreadMultiplier,
  storyCompactT,
  storySatelliteScaleForWidth,
  type StoryPoint,
  type StoryRect,
} from "./story-scale";

export { STORY_BREAKPOINT_MOBILE, STORY_BREAKPOINT_TABLET } from "./story-scale";
export type { StoryPoint, StoryRect } from "./story-scale";
export { lerpPoint, lerpRect, lerpValue, storyCompactT } from "./story-scale";

export type ConcurrentSpatialLayout = {
  radiusScale: number;
  ySquash: number;
  satelliteScale: number;
};

export function concurrentLayoutForWidth(viewportWidth: number): ConcurrentSpatialLayout {
  const t = storyCompactT(viewportWidth);
  const spread = storyCompactSpreadMultiplier(viewportWidth);
  return {
    /** Desktop keeps historical 0.75 inset; compact spreads phones into meet-fit slack. */
    radiusScale: STORY_ORB_SCALE * spread * lerpValue(1, 1.08, t),
    ySquash: lerpValue(0.82, 0.9, t),
    satelliteScale: storySatelliteScaleForWidth(viewportWidth),
  };
}

export function gruntModulesForRadius(
  moduleRadius: number,
  orbX = PERSISTENT_ORB.cx,
  orbY = PERSISTENT_ORB.cy,
): GruntHubModule[] {
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
  cardScale: number;
};

/** Hub module card boost on mobile/tablet — mild; spread handles de-cluttering. */
export const GRUNT_HUB_CARD_SCALE_COMPACT = 1.06;

/** Hub inset on desktop — shrinks orb/backdrop corridor without rescaling icon art. */
export const GRUNT_HUB_DESKTOP_AMBIENT_SCALE = 0.8;

export function gruntLayoutForWidth(viewportWidth: number): GruntSpatialLayout {
  const spread = storyCompactSpreadMultiplier(viewportWidth);
  const t = storyCompactT(viewportWidth);
  const desktopTighten = viewportWidth > 900 ? GRUNT_HUB_DESKTOP_AMBIENT_SCALE : 1;
  const moduleRadius = GRUNT_MODULE_RADIUS * spread * lerpValue(1, 1.28, t) * desktopTighten;
  return {
    moduleRadius,
    modules: gruntModulesForRadius(moduleRadius, PERSISTENT_ORB.cx, PERSISTENT_ORB.cy),
    satelliteScale: storySatelliteScaleForWidth(viewportWidth),
    cardScale: lerpValue(1, GRUNT_HUB_CARD_SCALE_COMPACT, t),
  };
}

const MULTILINGUAL_CARD_DESKTOP = { x: 458, y: 148, width: 228, height: 188 } as const;
const MULTILINGUAL_CARD_COMPACT = { x: 408, y: 138, width: 192, height: 164 } as const;

export type MultilingualSpatialLayout = {
  card: { x: number; y: number; width: number; height: number };
  satelliteScale: number;
};

export function multilingualLayoutForWidth(viewportWidth: number): MultilingualSpatialLayout {
  const t = storyCompactT(viewportWidth);
  const card = lerpRect(
    {
      x: MULTILINGUAL_CARD_DESKTOP.x,
      y: MULTILINGUAL_CARD_DESKTOP.y,
      w: MULTILINGUAL_CARD_DESKTOP.width,
      h: MULTILINGUAL_CARD_DESKTOP.height,
    },
    {
      x: MULTILINGUAL_CARD_COMPACT.x,
      y: MULTILINGUAL_CARD_COMPACT.y,
      w: MULTILINGUAL_CARD_COMPACT.width,
      h: MULTILINGUAL_CARD_COMPACT.height,
    },
    t,
  );
  return {
    card: { x: card.x, y: card.y, width: card.w, height: card.h },
    satelliteScale: storySatelliteScaleForWidth(viewportWidth),
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
  return {
    caller,
    callerConnectX: lerpValue(desktop.callerConnectX, compact.callerConnectX, t),
    humanStart: lerpPoint(desktop.humanStart, compact.humanStart, t),
    humanEnd: lerpPoint(desktop.humanEnd, compact.humanEnd, t),
    orbShift: lerpValue(desktop.orbShift, compact.orbShift, t),
    satelliteScale: storySatelliteScaleForWidth(viewportWidth),
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
  const desktop = REMINDERS_SPATIAL_DESKTOP;
  const compact = REMINDERS_SPATIAL_COMPACT;
  const caller = lerpPoint(desktop.caller, compact.caller, t);
  return {
    caller,
    callerConnectX: lerpValue(desktop.callerConnectX, compact.callerConnectX, t),
    calendar: lerpPoint(desktop.calendar, compact.calendar, t),
    satelliteScale: storySatelliteScaleForWidth(viewportWidth),
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

export function dashboardLayoutForWidth(viewportWidth: number): DashboardSpatialLayout {
  const t = storyCompactT(viewportWidth);
  return {
    thread: lerpRect(DASHBOARD_THREAD_DESKTOP, DASHBOARD_THREAD_COMPACT, t),
    actionIcons: lerpRect(DASHBOARD_ICONS_DESKTOP, DASHBOARD_ICONS_COMPACT, t),
    satelliteScale: storySatelliteScaleForWidth(viewportWidth),
  };
}

export type HoursSpatialLayout = {
  orbitRadius: number;
  satelliteScale: number;
};

const HOURS_ORBIT_COMPACT = PERSISTENT_ORB_HOURS_ORBIT_RADIUS * 1.4;

export function hoursLayoutForWidth(viewportWidth: number): HoursSpatialLayout {
  const t = storyCompactT(viewportWidth);
  return {
    orbitRadius: lerpValue(PERSISTENT_ORB_HOURS_ORBIT_RADIUS, HOURS_ORBIT_COMPACT, t),
    satelliteScale: storySatelliteScaleForWidth(viewportWidth),
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
  const satelliteScale = storySatelliteScaleForWidth(viewportWidth);
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
