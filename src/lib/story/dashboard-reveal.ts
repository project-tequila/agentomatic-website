import { interpolate } from "@helios-project/core";

import { gatedBodyTypingReveal } from "./body-typing-reveal";
import { PERSISTENT_ORB } from "./persistent-orb";

export const DASHBOARD_STAGE = {
  width: PERSISTENT_ORB.width,
  height: PERSISTENT_ORB.height,
  orbX: PERSISTENT_ORB.cx,
  orbY: PERSISTENT_ORB.cy,
} as const;

/** Large chat panel — upper-left, clears center orb hub (cx 360, ~r 108). */
export const DASHBOARD_THREAD = { x: 48, y: 28, w: 296, h: 206 } as const;

/** Agent action rail — far right; work icons light up as tasks complete. */
export const DASHBOARD_ACTION_ICONS = { x: 620, y: 44, w: 52, h: 168 } as const;

/** @deprecated use DASHBOARD_ACTION_ICONS */
export const DASHBOARD_QUEUE = DASHBOARD_ACTION_ICONS;

export const DASHBOARD_HEADER_H = 32;
export const DASHBOARD_COMPOSER_H = 28;

/** Vertical space per manager + agent exchange in the scroll feed. */
export const DASHBOARD_EXCHANGE_H = 94;

export type DashboardQueueIcon = "call" | "queue" | "calendar" | "bell";

export type DashboardResponseType = "bookings" | "outbound" | "calendar" | "reminder";

export type DashboardExchange = {
  id: string;
  manager: string;
  responseType: DashboardResponseType;
  icon: DashboardQueueIcon;
  color: string;
};

/** Scroll-synced chat exchanges — each maps to a right-rail action icon. */
export const DASHBOARD_EXCHANGES: DashboardExchange[] = [
  {
    id: "bookings",
    manager: "pull up today's bookings",
    responseType: "bookings",
    icon: "queue",
    color: "#74c0fc",
  },
  {
    id: "waitlist",
    manager: "call the waitlist",
    responseType: "outbound",
    icon: "call",
    color: "#ffc857",
  },
  {
    id: "calendar",
    manager: "block my calendar 2–4pm",
    responseType: "calendar",
    icon: "calendar",
    color: "#9b87f5",
  },
  {
    id: "nudge",
    manager: "ping no-shows",
    responseType: "reminder",
    icon: "bell",
    color: "#8cffd2",
  },
];

type ExchangePhase =
  | "managerTyping"
  | "enter"
  | "flowToOrb"
  | "agentTyping"
  | "agent"
  | "flowToIcon";

type ExchangeSchedule = {
  managerTyping: [number, number];
  enter: [number, number];
  flowToOrb: [number, number];
  agentTyping: [number, number];
  agent: [number, number];
  flowToIcon: [number, number];
  scroll: [number, number] | null;
};

/**
 * Per-exchange scroll choreography:
 * A manager types → B enter → C chat→orb → D agent typing → E agent reply + orb→icon.
 */
const EXCHANGE_SCHEDULE: ExchangeSchedule[] = [
  {
    managerTyping: [0.14, 0.2],
    enter: [0.2, 0.205],
    flowToOrb: [0.205, 0.225],
    agentTyping: [0.225, 0.235],
    agent: [0.235, 0.29],
    flowToIcon: [0.275, 0.3],
    scroll: [0.29, 0.335],
  },
  {
    managerTyping: [0.335, 0.395],
    enter: [0.395, 0.4],
    flowToOrb: [0.4, 0.42],
    agentTyping: [0.42, 0.43],
    agent: [0.43, 0.485],
    flowToIcon: [0.47, 0.495],
    scroll: [0.485, 0.53],
  },
  {
    managerTyping: [0.53, 0.59],
    enter: [0.59, 0.595],
    flowToOrb: [0.595, 0.615],
    agentTyping: [0.615, 0.625],
    agent: [0.625, 0.68],
    flowToIcon: [0.665, 0.69],
    scroll: [0.68, 0.725],
  },
  {
    managerTyping: [0.725, 0.785],
    enter: [0.785, 0.79],
    flowToOrb: [0.79, 0.81],
    agentTyping: [0.81, 0.82],
    agent: [0.82, 0.88],
    flowToIcon: [0.865, 0.895],
    scroll: null,
  },
];

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function clampPhase(progress: number, range: [number, number]) {
  return interpolate(progress, range, [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

function exchangePhase(progress: number, index: number, phase: ExchangePhase) {
  const schedule = EXCHANGE_SCHEDULE[index];
  if (!schedule) return 0;
  return smoothstep(clampPhase(progress, schedule[phase]));
}

/** Chat shell slides up and fades in. */
export function dashboardFrameReveal(progress: number) {
  return smoothstep(clampPhase(progress, [0.03, 0.15]));
}

export function dashboardFrameSlide(progress: number, reduceMotion = false) {
  if (reduceMotion) return dashboardFrameReveal(progress) > 0.5 ? 0 : 16;
  const reveal = dashboardFrameReveal(progress);
  return interpolate(reveal, [0, 1], [22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

/** Right action rail fades in with the thread. */
export function dashboardQueueReveal(progress: number) {
  return smoothstep(clampPhase(progress, [0.08, 0.2]));
}

/** Feed translateY — scrolls completed exchanges upward. */
export function dashboardChatScrollOffset(progress: number) {
  let offset = 0;
  for (const schedule of EXCHANGE_SCHEDULE) {
    if (!schedule.scroll) continue;
    offset += DASHBOARD_EXCHANGE_H * smoothstep(clampPhase(progress, schedule.scroll));
  }
  return offset;
}

/** Phase A — manager message char typing in composer (0→1). */
export function dashboardExchangeComposerTyping(progress: number, index: number) {
  return exchangePhase(progress, index, "managerTyping");
}

/** Phase B — brief enter / send moment after typing completes. */
export function dashboardExchangeEnterMoment(progress: number, index: number) {
  const schedule = EXCHANGE_SCHEDULE[index];
  if (!schedule) return 0;
  const t = clampPhase(progress, schedule.enter);
  if (t <= 0) return 0;
  if (t >= 1) return 0;
  return Math.sin(t * Math.PI);
}

/** Manager bubble visible once the message is sent (enter phase onward). */
export function dashboardExchangeManagerReveal(progress: number, index: number) {
  const schedule = EXCHANGE_SCHEDULE[index];
  if (!schedule) return 0;
  return smoothstep(clampPhase(progress, [schedule.enter[0], schedule.enter[1] + 0.008]));
}

/** Phase C — flow particle chat → orb. */
export function dashboardExchangeFlowToOrb(progress: number, index: number) {
  const flow = exchangePhase(progress, index, "flowToOrb");
  const agent = exchangePhase(progress, index, "agent");
  return flow * (1 - agent * 0.35);
}

/** Phase D — agent typing indicator before reply. */
export function dashboardExchangeTypingReveal(progress: number, index: number) {
  const typing = exchangePhase(progress, index, "agentTyping");
  const agent = exchangePhase(progress, index, "agent");
  return typing * (1 - agent * 0.85);
}

/** Phase E — agent response reveal. */
export function dashboardExchangeAgentReveal(progress: number, index: number) {
  return exchangePhase(progress, index, "agent");
}

/** Phase E — flow orb → right action icon. */
export function dashboardExchangeFlowToIcon(progress: number, index: number) {
  const flow = exchangePhase(progress, index, "flowToIcon");
  const agent = exchangePhase(progress, index, "agent");
  return flow * (0.45 + agent * 0.55);
}

/** Which exchange is currently showing agent typing dots. */
export function dashboardActiveTypingIndex(progress: number) {
  for (let i = 0; i < DASHBOARD_EXCHANGES.length; i++) {
    if (dashboardExchangeTypingReveal(progress, i) > 0.08) return i;
  }
  return -1;
}

/** Which exchange is currently typing in the composer. */
export function dashboardActiveComposerIndex(progress: number) {
  for (let i = 0; i < DASHBOARD_EXCHANGES.length; i++) {
    const typing = dashboardExchangeComposerTyping(progress, i);
    const sent = dashboardExchangeManagerReveal(progress, i);
    if (typing > 0.02 && sent < 0.15) return i;
  }
  return -1;
}

/** Action icon pulses when its matching exchange completes. */
export function dashboardQueueItemActive(progress: number, index: number) {
  const iconFlow = dashboardExchangeFlowToIcon(progress, index);
  const agent = dashboardExchangeAgentReveal(progress, index);
  const hold = interpolate(progress, [0.72, 0.92], [1, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const active = Math.max(iconFlow, smoothstep(agent));
  return active * (agent > 0.75 ? hold : 1);
}

/** Chat→orb hub arc — intensifies as exchanges land. */
export function dashboardOrbArcReveal(progress: number) {
  return smoothstep(clampPhase(progress, [0.12, 0.32]));
}

/** Flow intensity on the chat→orb arc (particles + dash motion). */
export function dashboardOrbArcFlow(progress: number) {
  const arc = dashboardOrbArcReveal(progress);
  const actions = interpolate(progress, [0.25, 0.82], [0.25, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const settle = dashboardSettlePulse(progress);
  return arc * (0.4 + actions * 0.45 + settle * 0.15);
}

/** @deprecated use dashboardExchangeFlowToIcon */
export function dashboardExchangeArcBurst(progress: number, index: number) {
  return dashboardExchangeFlowToIcon(progress, index);
}

/** Subtle pulse once the feed settles. */
export function dashboardSettlePulse(progress: number) {
  return smoothstep(clampPhase(progress, [0.82, 0.96]));
}

export function dashboardSceneComposition(progress: number) {
  return smoothstep(clampPhase(progress, [0.05, 0.18]));
}

/** Title line drop — 0 = above viewport, 1 = settled. */
export function dashboardTitleDropReveal(progress: number, line: 0 | 1, reduceMotion = false) {
  if (reduceMotion) return progress > 0.08 ? 1 : 0;
  const band = line === 0 ? [0.04, 0.38] : [0.14, 0.48];
  return smoothstep(clampPhase(progress, band as [number, number]));
}

export function dashboardTitleCompleteReveal(progress: number, reduceMotion = false) {
  return dashboardTitleDropReveal(progress, 1, reduceMotion);
}

export function dashboardBodyReveal(progress: number, reduceMotion = false) {
  const titleComplete = dashboardTitleCompleteReveal(progress, reduceMotion);
  return gatedBodyTypingReveal(progress, titleComplete, 0.52, 0.82, reduceMotion);
}

/** Arc from chat panel right edge into the orb hub. */
export function dashboardChatToOrbPath(orbX = DASHBOARD_STAGE.orbX, orbY = DASHBOARD_STAGE.orbY) {
  const thread = DASHBOARD_THREAD;
  const startX = thread.x + thread.w - 6;
  const startY = thread.y + thread.h * 0.44;
  const endX = orbX - 44;
  const endY = orbY - 10;
  const midX = (startX + endX) / 2 + 16;
  const midY = Math.min(startY, endY) - 30;
  return `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;
}

/** @deprecated use dashboardChatToOrbPath */
export function dashboardOrbArcPath(orbX = DASHBOARD_STAGE.orbX, orbY = DASHBOARD_STAGE.orbY) {
  return dashboardChatToOrbPath(orbX, orbY);
}

/** Per-exchange arc from orb hub to the matching right-rail icon. */
export function dashboardOrbToIconPath(index: number, orbX = DASHBOARD_STAGE.orbX, orbY = DASHBOARD_STAGE.orbY) {
  const icons = DASHBOARD_ACTION_ICONS;
  const itemY = icons.y + 28 + index * 40;
  const startX = orbX + 42;
  const startY = orbY - 6;
  const endX = icons.x + 2;
  const endY = itemY;
  const midX = (startX + endX) / 2 + 14;
  const midY = (startY + endY) / 2 - 22;
  return `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;
}

/** @deprecated spur pointed left queue → chat; use dashboardOrbToIconPath */
export function dashboardQueueSpurPath(index: number) {
  return dashboardOrbToIconPath(index);
}
