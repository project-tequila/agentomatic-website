import { interpolate } from "@helios-project/core";

import { gatedBodyTypingReveal } from "./body-typing-reveal";
import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import { Calendar, Mail, Phone } from "lucide-react";

import { WhatsAppGlyph } from "@/components/site/story-icon-glyphs";

type GlyphProps = {
  size?: number;
  className?: string;
};

export type IntegrationChannel = {
  id: string;
  label: string;
  side: "left" | "right";
  top: string;
  left?: string;
  right?: string;
  color: string;
  glow: string;
  Icon: LucideIcon | ComponentType<GlyphProps>;
  isBrand?: boolean;
};

/** Wider stage — orb center with channels at corners. */
export const INTEGRATION_STAGE = {
  width: 720,
  height: 440,
  orbX: 360,
  orbY: 220,
} as const;

export type IntegrationNode = { id: string; x: number; y: number };

/** Equal-radius ring — every channel the same distance from the orb (matching link length). */
const INTEGRATION_NODE_ANGLES = [
  { id: "phone", deg: 200 },
  { id: "whatsapp", deg: 340 },
  { id: "email", deg: 160 },
  { id: "calendar", deg: 20 },
] as const;

function integrationNodesAtRadius(radius: number): IntegrationNode[] {
  const { orbX, orbY } = INTEGRATION_STAGE;
  return INTEGRATION_NODE_ANGLES.map(({ id, deg }) => {
    const rad = (deg * Math.PI) / 180;
    return {
      id,
      x: Math.round(orbX + radius * Math.cos(rad)),
      y: Math.round(orbY + radius * Math.sin(rad)),
    };
  });
}

/** Wide corner layout — desktop; equidistant nodes, bottom pair above copy band. */
export const INTEGRATION_NODES_DESKTOP: readonly IntegrationNode[] = integrationNodesAtRadius(200);

/** Tighter ring — survives portrait slice crop above the copy band. */
export const INTEGRATION_NODES_COMPACT: readonly IntegrationNode[] = integrationNodesAtRadius(168);

/** @deprecated use integrationLayoutForWidth */
export const INTEGRATION_NODES = INTEGRATION_NODES_DESKTOP;

export type IntegrationLayout = {
  nodes: readonly IntegrationNode[];
  satelliteScale: number;
  /** Scales SVG hub circles (base r=48 / ring r=58). */
  hubScale: number;
};

function lerpIntegrationNodes(
  from: readonly IntegrationNode[],
  to: readonly IntegrationNode[],
  t: number,
): IntegrationNode[] {
  return from.map((node, index) => {
    const target = to[index];
    if (!target) return { ...node };
    return {
      id: node.id,
      x: node.x + (target.x - node.x) * t,
      y: node.y + (target.y - node.y) * t,
    };
  });
}

/** Responsive node positions + icon scale for slice-crop safe zones. */
export function integrationLayoutForWidth(viewportWidth: number): IntegrationLayout {
  if (viewportWidth <= 480) {
    return { nodes: INTEGRATION_NODES_COMPACT, satelliteScale: 0.72, hubScale: 0.88 };
  }

  if (viewportWidth <= 900) {
    const t = (900 - viewportWidth) / (900 - 480);
    return {
      nodes: lerpIntegrationNodes(INTEGRATION_NODES_DESKTOP, INTEGRATION_NODES_COMPACT, t * 0.88),
      satelliteScale: 0.62 + (0.72 - 0.62) * (1 - t),
      hubScale: 0.72 + (0.88 - 0.72) * (1 - t),
    };
  }

  return { nodes: INTEGRATION_NODES_DESKTOP, satelliteScale: 0.62, hubScale: 0.72 };
}

/** Channels finish by ~66% of the band — gap before body line appears. */
export const INTEGRATIONS_CHANNEL_WINDOW = 0.66;

export const INTEGRATION_CHANNELS: IntegrationChannel[] = [
  { id: "phone", label: "phone", side: "left", top: "6%", left: "2%", color: "#ff8787", glow: "rgba(255,135,135,0.72)", Icon: Phone },
  {
    id: "whatsapp",
    label: "whatsapp",
    side: "right",
    top: "10%",
    right: "0%",
    color: "#22c55e",
    glow: "rgba(34,197,94,0.68)",
    Icon: WhatsAppGlyph,
    isBrand: true,
  },
  { id: "email", label: "email", side: "left", top: "58%", left: "4%", color: "#c084fc", glow: "rgba(192,132,252,0.68)", Icon: Mail },
  { id: "calendar", label: "calendar", side: "right", top: "62%", right: "2%", color: "#ffc857", glow: "rgba(255,200,87,0.68)", Icon: Calendar },
];

export type ChannelRevealState = {
  opacity: number;
  translateX: number;
  translateY: number;
  scale: number;
  highlight: number;
  separator: number;
};

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

/** Scroll progress 0–1 inside the integrations chapter band. */
export function integrationChannelState(progress: number, index: number, reduceMotion = false): ChannelRevealState {
  const total = INTEGRATION_CHANNELS.length;
  const slot = INTEGRATIONS_CHANNEL_WINDOW / total;
  const start = index * slot;
  const peak = start + slot * 0.52;
  const side = INTEGRATION_CHANNELS[index]?.side ?? "left";

  if (progress < start) {
    return { opacity: 0, translateX: side === "left" ? -120 : 120, translateY: 32, scale: 0.72, highlight: 0, separator: 0 };
  }

  const raw = interpolate(progress, [start, peak], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const enter = reduceMotion ? (raw > 0.4 ? 1 : 0) : smoothstep(raw);
  const fromX = (side === "left" ? -1 : 1) * 120 * (1 - enter);
  const fromY = 32 * (1 - enter);

  const separator =
    index < total - 1
      ? smoothstep(interpolate(progress, [peak * 0.72, start + slot * 0.92], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))
      : 0;

  return {
    opacity: enter,
    translateX: fromX,
    translateY: fromY,
    scale: 0.72 + enter * 0.28,
    highlight: enter,
    separator,
  };
}

/** 0–1 — all channel words + trailing period visible. */
export function integrationsTitleCompleteReveal(progress: number, reduceMotion = false) {
  const calendar = integrationChannelState(progress, 3, reduceMotion);
  return calendar.highlight;
}

export function integrationsBodyReveal(progress: number, reduceMotion = false) {
  const titleComplete = integrationsTitleCompleteReveal(progress, reduceMotion);
  return gatedBodyTypingReveal(progress, titleComplete, 0.7, 0.95, reduceMotion);
}

export function integrationsHoldPhase(progress: number) {
  return progress >= INTEGRATIONS_CHANNEL_WINDOW && progress < 0.88;
}
