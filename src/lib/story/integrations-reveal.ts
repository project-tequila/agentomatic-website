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

export const INTEGRATION_NODES = [
  { id: "phone", x: 102, y: 82 },
  { id: "whatsapp", x: 618, y: 82 },
  { id: "email", x: 98, y: 358 },
  { id: "calendar", x: 622, y: 358 },
] as const;

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
