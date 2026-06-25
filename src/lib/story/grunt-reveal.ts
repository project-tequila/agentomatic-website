import { interpolate } from "@helios-project/core";

import { gatedBodyTypingReveal } from "./body-typing-reveal";
import { PERSISTENT_ORB } from "./persistent-orb";

export const GRUNT_STAGE = {
  width: PERSISTENT_ORB.width,
  height: PERSISTENT_ORB.height,
  orbX: PERSISTENT_ORB.cx,
  orbY: PERSISTENT_ORB.cy,
} as const;

/** Equal distance from orb center (prior spread pulled in 20%). */
export const GRUNT_ARM_LENGTH = 152;

/** Card centers — distance from orb along each plus arm. */
export const GRUNT_MODULE_RADIUS = 150;

export const GRUNT_MODULE_LABELS: Record<GruntHubModuleId, string> = {
  schedule: "scheduling",
  conversations: "conversations",
  data: "data entry",
  route: "call routing",
};

export type GruntHubModuleId = "schedule" | "conversations" | "data" | "route";

export type GruntHubModule = {
  id: GruntHubModuleId;
  x: number;
  y: number;
  revealAt: number;
  accent: "mint" | "sky" | "amber" | "violet";
};

const { orbX, orbY } = GRUNT_STAGE;

/** Plus (+) layout — equal spacing on all four arms. */
export const GRUNT_HUB_MODULES: GruntHubModule[] = [
  { id: "schedule", x: orbX, y: orbY - GRUNT_MODULE_RADIUS, revealAt: 0.06, accent: "sky" },
  { id: "conversations", x: orbX + GRUNT_MODULE_RADIUS, y: orbY, revealAt: 0.24, accent: "mint" },
  { id: "data", x: orbX, y: orbY + GRUNT_MODULE_RADIUS, revealAt: 0.42, accent: "amber" },
  { id: "route", x: orbX - GRUNT_MODULE_RADIUS, y: orbY, revealAt: 0.6, accent: "violet" },
];

export const GRUNT_PLUS_ARMS = {
  vertical: { x: orbX, y1: orbY - GRUNT_MODULE_RADIUS, y2: orbY + GRUNT_MODULE_RADIUS },
  horizontal: { y: orbY, x1: orbX - GRUNT_MODULE_RADIUS, x2: orbX + GRUNT_MODULE_RADIUS },
} as const;

export const GRUNT_STATUS = { x: 36, y: 378 } as const;

export const GRUNT_MODULE_SIZE: Record<GruntHubModuleId, { w: number; h: number }> = {
  schedule: { w: 148, h: 104 },
  conversations: { w: 118, h: 108 },
  data: { w: 112, h: 108 },
  route: { w: 118, h: 108 },
};

export const GRUNT_MODULE_STATUS: Record<GruntHubModuleId, string> = {
  schedule: "scheduling the day",
  conversations: "managing every conversation",
  data: "capturing every detail",
  route: "routing to the right department",
};

export const GRUNT_ROUTE_BRANCHES = [
  { id: "a", angle: 148, label: "dept a" },
  { id: "b", angle: 180, label: "dept b" },
  { id: "c", angle: 212, label: "dept c" },
] as const;

function clamp01(t: number) {
  return Math.max(0, Math.min(1, t));
}

export function gruntStressLevel(progress: number) {
  return interpolate(progress, [0, 0.4, 0.78, 1], [0, 0.32, 0.72, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function gruntSceneReveal(progress: number) {
  return interpolate(progress, [0.02, 0.14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

export function gruntHubReveal(progress: number) {
  return interpolate(progress, [0.04, 0.22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

export function gruntPlusArmReveal(progress: number) {
  return interpolate(progress, [0.08, 0.38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

export function gruntModuleReveal(progress: number, revealAt: number) {
  return interpolate(progress, [revealAt, revealAt + 0.16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function gruntModuleFlow(progress: number, revealAt: number) {
  return interpolate(progress, [revealAt + 0.05, revealAt + 0.52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function gruntModuleLive(progress: number, revealAt: number) {
  const f = gruntModuleFlow(progress, revealAt);
  return f > 0.2 && progress < revealAt + 0.78;
}

export function gruntModuleEnterOffset(progress: number, module: GruntHubModule) {
  const t = 1 - gruntModuleReveal(progress, module.revealAt);
  const ease = t * t;
  const spread = 32;
  switch (module.id) {
    case "schedule":
      return { x: 0, y: -spread * ease };
    case "conversations":
      return { x: spread * ease, y: 0 };
    case "data":
      return { x: 0, y: spread * ease };
    case "route":
      return { x: -spread * ease, y: 0 };
  }
}

/** Soft curve from orb to module card edge — tendrils. */
export function gruntTendrilPath(module: GruntHubModule, moduleRadius = GRUNT_MODULE_RADIUS) {
  return gruntFlowPath(module, moduleRadius - 46, moduleRadius);
}

/** Icons travel the open corridor before each card. */
export function gruntOrbFlowPath(module: GruntHubModule, moduleRadius = GRUNT_MODULE_RADIUS) {
  return gruntFlowPath(module, moduleRadius * 0.62, moduleRadius);
}

function gruntFlowPath(module: GruntHubModule, reach: number, moduleRadius = GRUNT_MODULE_RADIUS) {
  const dx = module.x - orbX;
  const dy = module.y - orbY;
  const len = Math.hypot(dx, dy) || 1;
  const endX = orbX + (dx / len) * reach;
  const endY = orbY + (dy / len) * reach;
  const fluff = 18;

  if (Math.abs(dy) >= Math.abs(dx)) {
    const side = dy < 0 ? -fluff : fluff;
    return `M ${orbX} ${orbY} C ${orbX + side} ${orbY + (endY - orbY) * 0.28}, ${orbX - side * 0.55} ${orbY + (endY - orbY) * 0.62}, ${endX} ${endY}`;
  }

  const side = dx < 0 ? -fluff : fluff;
  return `M ${orbX} ${orbY} C ${orbX + (endX - orbX) * 0.28} ${orbY + side}, ${orbX + (endX - orbX) * 0.62} ${orbY - side * 0.55}, ${endX} ${endY}`;
}

export function gruntModuleFlowAnchor(mod: GruntHubModule, moduleRadius = GRUNT_MODULE_RADIUS) {
  const dx = mod.x - orbX;
  const dy = mod.y - orbY;
  const len = Math.hypot(dx, dy) || 1;
  const stop = moduleRadius * 0.62;
  return { x: orbX + (dx / len) * stop, y: orbY + (dy / len) * stop };
}

/** Scroll-synced icon position along the arm (0 = orb, 1 = card approach). */
export function gruntOrbIconPosition(module: GruntHubModule, flow: number, moduleRadius = GRUNT_MODULE_RADIUS) {
  const anchor = gruntModuleFlowAnchor(module, moduleRadius);
  const t = clamp01(flow);
  return {
    x: orbX + (anchor.x - orbX) * t,
    y: orbY + (anchor.y - orbY) * t,
  };
}

/** Icon has reached the card — unlocks in-card content. */
export function gruntModuleIconArrived(progress: number, revealAt: number) {
  const flow = gruntModuleFlow(progress, revealAt);
  return interpolate(flow, [0.78, 0.98], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

/** In-card text/details fade in after the icon lands. */
export function gruntModuleBodyReveal(progress: number, revealAt: number) {
  return interpolate(gruntModuleIconArrived(progress, revealAt), [0.45, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/** Scroll-driven typing progress for in-card subheadings (0 = empty, 1 = full line). */
export function gruntModuleSubheadTypingReveal(progress: number, revealAt: number, slot = 0) {
  const icon = gruntModuleIconArrived(progress, revealAt);
  if (icon < 0.08) return 0;

  const typeStart = revealAt + 0.1 + slot * 0.11;
  const typeEnd = revealAt + 0.58 + slot * 0.13;
  return interpolate(progress, [typeStart, typeEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/** Letter-by-letter label above each card. */
export function gruntModuleLabelReveal(progress: number, revealAt: number) {
  return interpolate(gruntModuleFlow(progress, revealAt), [0.12, 0.55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function gruntModuleLetterOpacity(labelReveal: number, index: number, total: number) {
  const start = (index / total) * 0.55;
  const end = start + 0.38;
  return interpolate(labelReveal, [start, end], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

export function gruntModuleLetterLift(labelReveal: number, index: number, total: number) {
  const op = gruntModuleLetterOpacity(labelReveal, index, total);
  return (1 - op) * 10;
}

export function gruntTendrilPulse(progress: number, flow: number) {
  return clamp01(flow * (0.45 + gruntStressLevel(progress) * 0.55));
}

export function gruntScheduleFill(progress: number) {
  return interpolate(progress, [0.08, 0.58], [0.08, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

export function gruntScheduleReminders(progress: number) {
  return interpolate(progress, [0.16, 0.64], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

export function gruntConversationQueue(progress: number, reduceMotion = false) {
  const raw = interpolate(progress, [0.24, 0.62], [1, 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return reduceMotion ? Math.round(raw) : Math.floor(raw);
}

export function gruntConversationFollowUps(progress: number) {
  return interpolate(progress, [0.3, 0.72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

export function gruntConversationsLive(progress: number) {
  return gruntModuleLive(progress, GRUNT_HUB_MODULES.find((m) => m.id === "conversations")!.revealAt);
}

export function gruntDataFill(progress: number) {
  return interpolate(progress, [0.42, 0.82], [0.12, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

export function gruntRouteBranches(progress: number, reduceMotion = false) {
  const raw = interpolate(progress, [0.6, 0.9], [0, GRUNT_ROUTE_BRANCHES.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return reduceMotion ? Math.round(raw) : Math.floor(raw);
}

export function gruntHubSync(progress: number) {
  return interpolate(progress, [0.74, 0.96], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

/** Average icon-travel progress across all four hub modules. */
export function gruntHubAverageFlow(progress: number) {
  const total = GRUNT_HUB_MODULES.reduce((sum, mod) => sum + gruntModuleFlow(progress, mod.revealAt), 0);
  return total / GRUNT_HUB_MODULES.length;
}

/** Hub illustration considered complete — sync band + all modules substantially arrived. */
export function gruntHubImageComplete(progress: number) {
  const avgFlow = gruntHubAverageFlow(progress);
  const routeMod = GRUNT_HUB_MODULES.find((m) => m.id === "route")!;
  const routeFlow = gruntModuleFlow(progress, routeMod.revealAt);
  const coreModulesDone = GRUNT_HUB_MODULES.filter((m) => m.id !== "route").every(
    (mod) => gruntModuleIconArrived(progress, mod.revealAt) >= 0.92,
  );
  return avgFlow >= 0.86 && coreModulesDone && routeFlow >= 0.48 && gruntHubSync(progress) > 0.08;
}

/** Title line 1 — types in parallel with the four block animations, finishes early. */
export function gruntTitlePhraseTypingReveal(progress: number, reduceMotion = false) {
  if (reduceMotion) return progress > 0.06 ? 1 : 0;
  return interpolate(gruntHubAverageFlow(progress), [0.04, 0.72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/** Marker strike draws once the phrase has finished typing. */
export function gruntTitleStrikeReveal(progress: number, reduceMotion = false) {
  const typed = gruntTitlePhraseTypingReveal(progress, reduceMotion);
  return interpolate(typed, [0.94, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

/** "handled" — only after the hub image animation has completed. */
export function gruntTitleHandledReveal(progress: number, reduceMotion = false) {
  if (reduceMotion) return gruntHubImageComplete(progress) ? 1 : 0;
  if (!gruntHubImageComplete(progress)) return 0;
  return interpolate(gruntHubSync(progress), [0.22, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/** 0–1 — phrase typed, struck, and "handled" has dropped in. */
export function gruntTitleCompleteReveal(progress: number, reduceMotion = false) {
  return gruntTitleHandledReveal(progress, reduceMotion);
}

export function gruntBodyTypingReveal(progress: number, reduceMotion = false) {
  const titleComplete = gruntTitleCompleteReveal(progress, reduceMotion);
  return gatedBodyTypingReveal(progress, titleComplete, 0.84, 0.98, reduceMotion);
}

export function gruntFocusedModule(progress: number): GruntHubModuleId | null {
  if (progress < GRUNT_HUB_MODULES[0]!.revealAt) return null;
  if (progress <= 0.28) return "schedule";
  if (progress <= 0.48) return "conversations";
  if (progress <= 0.68) return "data";
  return "route";
}

export function gruntHubModule(id: GruntHubModuleId) {
  return GRUNT_HUB_MODULES.find((m) => m.id === id)!;
}

export function gruntRouteBranchPos(angleDeg: number, length: number) {
  const rad = (angleDeg * Math.PI) / 180;
  const cx = GRUNT_HUB_MODULES.find((m) => m.id === "route")!.x;
  const cy = GRUNT_HUB_MODULES.find((m) => m.id === "route")!.y;
  return { x: cx + Math.cos(rad) * length, y: cy + Math.sin(rad) * length };
}
