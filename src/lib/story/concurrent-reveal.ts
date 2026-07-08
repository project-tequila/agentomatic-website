import { interpolate } from "@helios-project/core";

import { gatedBodyTypingReveal } from "./body-typing-reveal";
import { PERSISTENT_ORB, STORY_SATELLITE_ICON_SCALE } from "./persistent-orb";
import { storyRevealSpread, storySpatialT } from "./story-scale";

export type CallDirection = "inbound" | "outbound";

/** @deprecated HTML backdrop slots — network phones are SVG-positioned now. */
export type ConcurrentPhoneSlot = {
  id: string;
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  scale: number;
  rotate: number;
  direction: CallDirection;
};

export const CALL_THEME = {
  inbound: { color: "#8cffd2", glow: "rgba(140,255,210,0.45)", label: "inbound" },
  outbound: { color: "#ffc857", glow: "rgba(255,200,87,0.45)", label: "outbound" },
} as const;

export const CONCURRENT_STAGE = {
  width: PERSISTENT_ORB.width,
  height: PERSISTENT_ORB.height,
  orbX: PERSISTENT_ORB.cx,
  orbY: PERSISTENT_ORB.cy,
} as const;

export type ConcurrentNetworkNode = {
  id: string;
  direction: CallDirection;
  /** Radians — left hemisphere inbound, right outbound. */
  angle: number;
  /** Base distance from orb center (px). */
  radius: number;
  /** 0 = far / small, 1 = near / large. */
  depth: number;
  rotate: number;
  /** Stagger reveal 0–1 within the chapter. */
  revealAt: number;
};

/** Scattered inbound nodes — wide arc on the left. */
export const INBOUND_NETWORK_NODES: ConcurrentNetworkNode[] = [
  { id: "in-n1", direction: "inbound", angle: 2.68, radius: 248, depth: 0.92, rotate: -12, revealAt: 0.04 },
  { id: "in-n2", direction: "inbound", angle: 2.38, radius: 218, depth: 0.58, rotate: 8, revealAt: 0.09 },
  { id: "in-n3", direction: "inbound", angle: 2.92, radius: 232, depth: 0.72, rotate: -5, revealAt: 0.14 },
  { id: "in-n4", direction: "inbound", angle: 2.12, radius: 268, depth: 0.38, rotate: 14, revealAt: 0.19 },
  { id: "in-n5", direction: "inbound", angle: 3.02, radius: 204, depth: 0.48, rotate: -9, revealAt: 0.24 },
  { id: "in-n6", direction: "inbound", angle: 2.52, radius: 192, depth: 0.82, rotate: 4, revealAt: 0.29 },
  { id: "in-n7", direction: "inbound", angle: 2.78, radius: 278, depth: 0.28, rotate: -7, revealAt: 0.34 },
  { id: "in-n8", direction: "inbound", angle: 2.22, radius: 226, depth: 0.65, rotate: 10, revealAt: 0.39 },
];

/** Scattered outbound nodes — wide arc on the right. */
export const OUTBOUND_NETWORK_NODES: ConcurrentNetworkNode[] = [
  { id: "out-n1", direction: "outbound", angle: 0.58, radius: 246, depth: 0.9, rotate: 12, revealAt: 0.07 },
  { id: "out-n2", direction: "outbound", angle: 0.32, radius: 216, depth: 0.55, rotate: -8, revealAt: 0.12 },
  { id: "out-n3", direction: "outbound", angle: 0.86, radius: 230, depth: 0.7, rotate: 6, revealAt: 0.17 },
  { id: "out-n4", direction: "outbound", angle: 0.14, radius: 272, depth: 0.35, rotate: -11, revealAt: 0.22 },
  { id: "out-n5", direction: "outbound", angle: 1.02, radius: 200, depth: 0.46, rotate: 9, revealAt: 0.27 },
  { id: "out-n6", direction: "outbound", angle: 0.48, radius: 188, depth: 0.8, rotate: -4, revealAt: 0.32 },
  { id: "out-n7", direction: "outbound", angle: 0.72, radius: 282, depth: 0.26, rotate: 7, revealAt: 0.37 },
  { id: "out-n8", direction: "outbound", angle: 0.24, radius: 224, depth: 0.62, rotate: -10, revealAt: 0.42 },
];

export const CONCURRENT_NETWORK_NODES = [...INBOUND_NETWORK_NODES, ...OUTBOUND_NETWORK_NODES];

/** @deprecated backdrop HTML slots */
export const INBOUND_PHONE_SLOTS: ConcurrentPhoneSlot[] = [];
export const OUTBOUND_PHONE_SLOTS: ConcurrentPhoneSlot[] = [];
export const CONCURRENT_PHONE_SLOTS = CONCURRENT_NETWORK_NODES;

export const CONCURRENT_HERO_ORBIT_MAX = 218;
export const CONCURRENT_HERO_ORBIT_MIN = 148;

export type ConcurrentPhoneState = {
  opacity: number;
  scale: number;
  translateX: number;
  translateY: number;
  highlight: number;
};

export type ConcurrentNetworkPhone = ConcurrentNetworkNode & {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  highlight: number;
  zIndex: number;
};

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

/** Line 1 — "no busy tone." */
export function concurrentTitleLine1Reveal(progress: number, reduceMotion = false) {
  if (reduceMotion) return progress > 0.06 ? 1 : 0;
  return smoothstep(
    interpolate(progress, [0.04, 0.32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
}

/** Line 2 — "ever." drop settles last. */
export function concurrentTitleLine2Reveal(progress: number, reduceMotion = false) {
  if (reduceMotion) return progress > 0.1 ? 1 : 0;
  return smoothstep(
    interpolate(progress, [0.22, 0.56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
}

/** 0–1 — both title lines complete (line 2 finishes last). */
export function concurrentTitleCompleteReveal(progress: number, reduceMotion = false) {
  return concurrentTitleLine2Reveal(progress, reduceMotion);
}

export function concurrentBodyTypingReveal(progress: number, reduceMotion = false) {
  const titleComplete = concurrentTitleCompleteReveal(progress, reduceMotion);
  return gatedBodyTypingReveal(progress, titleComplete, 0.62, 0.9, reduceMotion);
}

/** Orbit stays wide — phones remain scattered around the orb. */
export function concurrentOrbitRadius(progress: number, viewportWidth = 1200) {
  const spatial = storySpatialT(viewportWidth);
  const scale = 0.88 + spatial * 0.12;
  return interpolate(
    progress,
    [0, 0.5, 1],
    [CONCURRENT_HERO_ORBIT_MAX * scale, 195 * scale, CONCURRENT_HERO_ORBIT_MIN * scale],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
}

/** @deprecated */
export function concurrentBackdropDrift(progress: number) {
  return interpolate(progress, [0, 0.35, 1], [14, 32, 52], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

/** @deprecated */
export function concurrentPhoneState(
  progress: number,
  index: number,
  total: number,
  direction: CallDirection,
  reduceMotion = false,
): ConcurrentPhoneState {
  return { opacity: 0, scale: 0.55, translateX: 0, translateY: 22, highlight: 0 };
}

function nodeReveal(progress: number, revealAt: number, reduceMotion: boolean) {
  const start = revealAt;
  const end = revealAt + 0.14;
  const raw = interpolate(progress, [start, end], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return reduceMotion ? (raw > 0.45 ? 1 : 0) : smoothstep(raw);
}

export type ConcurrentSpatialOptions = {
  radiusScale?: number;
  ySquash?: number;
  satelliteScale?: number;
};

/** Layout a network node with perspective depth. */
export function concurrentNetworkPhoneLayout(
  node: ConcurrentNetworkNode,
  progress: number,
  orbX = CONCURRENT_STAGE.orbX,
  orbY = CONCURRENT_STAGE.orbY,
  reduceMotion = false,
  spatial: ConcurrentSpatialOptions = {},
): ConcurrentNetworkPhone {
  const { radiusScale: spatialRadius = 1, ySquash = 0.82, satelliteScale = STORY_SATELLITE_ICON_SCALE } = spatial;
  const reveal = nodeReveal(progress, node.revealAt, reduceMotion);
  const radiusScale = interpolate(progress, [0, 1], [1.02, 0.96], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const radius = node.radius * radiusScale * spatialRadius;
  const x = orbX + Math.cos(node.angle) * radius;
  const y = orbY + Math.sin(node.angle) * radius * ySquash;
  const depthScale = 0.52 + node.depth * 0.56;
  const scale = depthScale * (0.55 + reveal * 0.45) * satelliteScale;
  const opacity = reveal * (0.22 + node.depth * 0.78);
  const highlight = reveal * (0.35 + node.depth * 0.65);

  return {
    ...node,
    x,
    y,
    scale,
    opacity,
    highlight,
    zIndex: Math.round(node.depth * 100),
  };
}

/** Visible phones sorted back-to-front for paint order. */
export function concurrentVisibleNetworkPhones(
  progress: number,
  reduceMotion = false,
  spatial?: ConcurrentSpatialOptions,
): ConcurrentNetworkPhone[] {
  return CONCURRENT_NETWORK_NODES.map((node) =>
    concurrentNetworkPhoneLayout(node, progress, undefined, undefined, reduceMotion, spatial),
  )
    .filter((phone) => phone.opacity > 0.02)
    .sort((a, b) => a.zIndex - b.zIndex);
}

/** Fluffy inbound link — caller → orb (left to center). */
export function concurrentInboundFlowPath(
  phoneX: number,
  phoneY: number,
  orbX: number,
  orbY: number,
  depth: number,
  seed = 0,
  viewportWidth = 1200,
) {
  const spread = storyRevealSpread(1, viewportWidth);
  const hubX = orbX - 44 * spread;
  const hubY = orbY - 2;
  const fluff = (38 + depth * 42 + (seed % 3) * 8) * spread;
  const sway = ((seed % 5) - 2) * 6 * spread;
  const c1x = phoneX + (hubX - phoneX) * 0.22 + sway;
  const c1y = phoneY - fluff;
  const c2x = phoneX + (hubX - phoneX) * 0.78 - sway * 0.5;
  const c2y = hubY - fluff * 0.38;
  return `M ${phoneX} ${phoneY} C ${c1x} ${c1y} ${c2x} ${c2y} ${hubX} ${hubY}`;
}

/** Fluffy outbound link — orb → caller (center to right). */
export function concurrentOutboundFlowPath(
  phoneX: number,
  phoneY: number,
  orbX: number,
  orbY: number,
  depth: number,
  seed = 0,
  viewportWidth = 1200,
) {
  const spread = storyRevealSpread(1, viewportWidth);
  const hubX = orbX + 44 * spread;
  const hubY = orbY - 2;
  const fluff = (38 + depth * 42 + (seed % 3) * 8) * spread;
  const sway = ((seed % 5) - 2) * 6 * spread;
  const c1x = hubX + (phoneX - hubX) * 0.22 - sway;
  const c1y = hubY - fluff * 0.55;
  const c2x = hubX + (phoneX - hubX) * 0.78 + sway * 0.5;
  const c2y = phoneY - fluff * 0.32;
  return `M ${hubX} ${hubY} C ${c1x} ${c1y} ${c2x} ${c2y} ${phoneX} ${phoneY}`;
}

/** @deprecated */
export function concurrentNetworkFlowPath(
  phoneX: number,
  phoneY: number,
  orbX: number,
  orbY: number,
  depth: number,
  direction: CallDirection,
) {
  return direction === "inbound"
    ? concurrentInboundFlowPath(phoneX, phoneY, orbX, orbY, depth)
    : concurrentOutboundFlowPath(phoneX, phoneY, orbX, orbY, depth);
}

export function concurrentHeroPhoneCounts(progress: number, reduceMotion = false) {
  const phones = concurrentVisibleNetworkPhones(progress, reduceMotion);
  const inbound = phones.filter((p) => p.direction === "inbound").length;
  const outbound = phones.filter((p) => p.direction === "outbound").length;
  return { inbound, outbound, total: inbound + outbound };
}

export function concurrentHeroPhoneCount(progress: number, reduceMotion = false) {
  return concurrentVisibleNetworkPhones(progress, reduceMotion).length;
}

/** @deprecated — use concurrentNetworkPhoneLayout */
export function concurrentHeroPhonePosition(
  side: CallDirection,
  index: number,
  _total: number,
  progress: number,
  orbX = CONCURRENT_STAGE.orbX,
  orbY = CONCURRENT_STAGE.orbY,
  reduceMotion = false,
) {
  const nodes = side === "inbound" ? INBOUND_NETWORK_NODES : OUTBOUND_NETWORK_NODES;
  const node = nodes[index] ?? nodes[0]!;
  const layout = concurrentNetworkPhoneLayout(node, progress, orbX, orbY, reduceMotion);
  return { x: layout.x, y: layout.y, rotate: node.rotate };
}

export function concurrentFlowIntensity(progress: number, direction: CallDirection) {
  const start = direction === "outbound" ? 0.12 : 0.04;
  return interpolate(progress, [start, start + 0.45, 1], [0, 0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}
