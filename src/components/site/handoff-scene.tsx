"use client";

import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";
import type { CSSProperties } from "react";

import { featureBandProgress } from "@/lib/story/feature-band-progress";
import { CALL_THEME } from "@/lib/story/concurrent-reveal";
import {
  HANDOFF_STAGE,
  handoffCallerReveal,
  handoffCallerToHumanFlow,
  handoffCallerToHumanPath,
  handoffCallerToOrbFlow,
  handoffCallerToOrbPath,
  handoffHumanReveal,
  handoffLayout,
  handoffRoutineReveal,
  handoffSummaryPath,
  handoffSummaryReveal,
  handoffTransferIntensity,
  handoffTransferPeak,
  handoffWarmHandoffLabel,
} from "@/lib/story/handoff-reveal";
import { STORY_STAGE_PRESERVE, storyStageViewBox } from "@/lib/story/persistent-orb";
import { useStorySpatialLayout } from "@/lib/story/use-story-viewport";
import { StoryHumanAgent } from "@/components/site/story-stage-glyphs";
import { RealisticPhoneSvg } from "@/components/site/realistic-phone-svg";
import { cn } from "@/lib/utils";

type HandoffSceneProps = {
  story: number;
  opacity: number;
};

const C = {
  cream: "#f5f2eb",
  mint: CALL_THEME.inbound.color,
  amber: CALL_THEME.outbound.color,
  rose: "#f783ac",
  slate: "#2b303b",
  muted: "rgba(245,242,235,0.48)",
  ink: "#1c1f26",
};

function PillLabel({
  x,
  y,
  text,
  color,
  opacity,
  align = "middle",
  prominent = false,
}: {
  x: number;
  y: number;
  text: string;
  color: string;
  opacity: number;
  align?: "start" | "middle";
  prominent?: boolean;
}) {
  const fontSize = prominent ? 13 : 11;
  const padY = prominent ? 17 : 14;
  const h = prominent ? 34 : 28;
  const w = text.length * (prominent ? 8.2 : 7.4) + (prominent ? 36 : 28);
  const px = align === "middle" ? x - w / 2 : x;

  return (
    <g opacity={opacity} className={cn(prominent && "handoff-scene__warm-label")}>
      <rect
        x={px}
        y={y - padY}
        width={w}
        height={h}
        rx={prominent ? 10 : 8}
        fill={prominent ? "rgba(18,20,24,0.94)" : "rgba(18,20,24,0.88)"}
        stroke={color}
        strokeWidth={prominent ? 2.2 : 1.4}
      />
      <text
        x={px + (prominent ? 18 : 14)}
        y={y + (prominent ? 5 : 4)}
        fill={color}
        fontSize={fontSize}
        fontWeight={prominent ? 700 : 600}
        fontFamily="system-ui, sans-serif"
      >
        {text}
      </text>
    </g>
  );
}

function CallerPhone({
  caller,
  satelliteScale,
  opacity,
  live,
  ringing,
}: {
  caller: { x: number; y: number };
  satelliteScale: number;
  opacity: number;
  live: boolean;
  ringing: boolean;
}) {
  return (
    <g
      transform={`translate(${caller.x - 32} ${caller.y - 59}) scale(${0.82 * satelliteScale})`}
      opacity={opacity}
      className={cn(
        "handoff-scene__caller-phone",
        "concurrent-scene__network-phone",
        "concurrent-scene__network-phone--inbound",
        "concurrent-scene__network-phone--primary",
        live && "concurrent-scene__network-phone--live-in",
        ringing && "concurrent-scene__network-phone--ringing-in",
      )}
      style={{ "--phone-accent": CALL_THEME.inbound.color } as CSSProperties}
    >
      <RealisticPhoneSvg
        accent={CALL_THEME.inbound.color}
        uid="handoff-caller"
        variant="frontdesk"
        callDirection="inbound"
        minimal
        highlight={0.92}
        showRing={live}
        ringing={ringing}
      />
    </g>
  );
}

function HumanAgent({
  x,
  y,
  scale,
  satelliteScale,
  ringOpacity,
  live,
}: {
  x: number;
  y: number;
  scale: number;
  satelliteScale: number;
  ringOpacity: number;
  live: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <StoryHumanAgent
        scale={scale * satelliteScale}
        ringOpacity={ringOpacity}
        live={live}
        className={cn(live && "handoff-scene__human--live")}
      />
    </g>
  );
}

function CallSummaryCard({
  x,
  y,
  opacity,
  fillProgress,
  scale,
  glow,
  satelliteScale,
}: {
  x: number;
  y: number;
  opacity: number;
  fillProgress: number;
  scale: number;
  glow: number;
  satelliteScale: number;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale * satelliteScale})`}
      opacity={opacity}
      className="handoff-scene__summary"
      filter={glow > 0.35 ? "url(#handoffSummaryGlow)" : undefined}
    >
      <rect x="0" y="0" width="188" height="72" rx="10" fill={C.slate} stroke={C.mint} strokeWidth="2.2" />
      <rect x="0" y="0" width="188" height="72" rx="10" fill="none" stroke={C.rose} strokeWidth="1.2" opacity={0.35 + glow * 0.45} />
      <text x="16" y="24" fill={C.mint} fontSize="12" fontWeight="700" fontFamily="system-ui, sans-serif">
        call summary
      </text>
      <rect x="16" y="34" width={132 * fillProgress} height="6" rx="2.5" fill={C.muted} />
      <rect x="16" y="46" width={104 * fillProgress} height="6" rx="2.5" fill="rgba(245,242,235,0.28)" />
      <rect x="16" y="58" width={78 * fillProgress} height="6" rx="2.5" fill="rgba(245,242,235,0.2)" />
    </g>
  );
}

function TransferBeacon({
  x,
  y,
  intensity,
  reduceMotion,
}: {
  x: number;
  y: number;
  intensity: number;
  reduceMotion: boolean;
}) {
  if (intensity < 0.08) return null;

  return (
    <g transform={`translate(${x} ${y})`} opacity={intensity} className="handoff-scene__beacon">
      <circle r="52" fill="url(#handoffBeaconGrad)" opacity="0.55" />
      <circle r="28" fill="none" stroke={C.cream} strokeWidth="1.6" opacity="0.55" />
      <circle r="10" fill={C.rose} opacity="0.85" />
      <circle r="4" fill={C.cream} />
    </g>
  );
}

export function HandoffScene({ story, opacity: sceneOpacity }: HandoffSceneProps) {
  const reduceMotion = usePrefersReducedMotion();
  const spatialLayout = useStorySpatialLayout();
  const handoffSpatial = {
    caller: spatialLayout.handoff.caller,
    callerConnectX: spatialLayout.handoff.callerConnectX,
    humanStart: spatialLayout.handoff.humanStart,
    humanEnd: spatialLayout.handoff.humanEnd,
    orbShift: spatialLayout.handoff.orbShift,
  };
  const satelliteScale = spatialLayout.handoff.satelliteScale;
  const progress = featureBandProgress(story, "handoff");
  if (progress === null || sceneOpacity < 0.02) return null;

  const layout = handoffLayout(progress, handoffSpatial);
  const caller = handoffCallerReveal(progress);
  const callerToOrb = handoffCallerToOrbFlow(progress);
  const callerToHuman = handoffCallerToHumanFlow(progress);
  const routine = handoffRoutineReveal(progress);
  const transferIntensity = handoffTransferIntensity(progress);
  const transferPeak = handoffTransferPeak(progress);
  const human = handoffHumanReveal(progress, !!reduceMotion);
  const warmHandoff = handoffWarmHandoffLabel(progress);
  const summary = handoffSummaryReveal(progress, layout);
  const callerOrbPath = handoffCallerToOrbPath(layout.orbX, handoffSpatial);
  const callerHumanPath = handoffCallerToHumanPath(layout, handoffSpatial);
  const summaryPath = handoffSummaryPath(layout);
  const callerLive = (callerToOrb > 0.4 || callerToHuman > 0.4) && !reduceMotion;
  const callerRinging = callerToOrb > 0.35 && callerToHuman < 0.2 && !reduceMotion;
  const humanLive = callerToHuman > 0.42 && human.ring > 0.35 && !reduceMotion;
  const transferMidX = (layout.orbX + layout.humanX) / 2;
  const transferMidY = (HANDOFF_STAGE.orbY + layout.humanY) / 2 - 18;

  return (
    <svg
      viewBox={storyStageViewBox()}
      preserveAspectRatio={STORY_STAGE_PRESERVE}
      className="handoff-scene"
      aria-hidden
      style={{ opacity: sceneOpacity }}
    >
      <defs>
        <linearGradient id="handoffCallerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={C.mint} stopOpacity="0.55" />
          <stop offset="100%" stopColor={C.mint} stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="handoffCallerHumanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={C.mint} stopOpacity="0.45" />
          <stop offset="55%" stopColor={C.rose} stopOpacity="0.65" />
          <stop offset="100%" stopColor={C.rose} stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="handoffTransferGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={C.mint} stopOpacity="0.75" />
          <stop offset="45%" stopColor={C.cream} stopOpacity="0.95" />
          <stop offset="100%" stopColor={C.rose} stopOpacity="1" />
        </linearGradient>
        <radialGradient id="handoffBeaconGrad">
          <stop offset="0%" stopColor={C.rose} stopOpacity="0.55" />
          <stop offset="55%" stopColor={C.mint} stopOpacity="0.22" />
          <stop offset="100%" stopColor={C.mint} stopOpacity="0" />
        </radialGradient>
        <filter id="handoffPathGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="handoffSummaryGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse
        cx={transferMidX}
        cy={transferMidY}
        rx={140 + transferPeak * 36}
        ry={96 + transferPeak * 24}
        fill={C.rose}
        opacity={0.03 + transferPeak * 0.09}
      />
      <ellipse cx={layout.orbX} cy={HANDOFF_STAGE.orbY} rx="118" ry="78" fill={C.mint} opacity={0.04 * routine} />
      <ellipse cx={layout.humanX} cy={layout.humanY} rx="88" ry="68" fill={C.rose} opacity={0.05 * human.opacity + transferPeak * 0.06} />

      <g opacity={callerToOrb}>
        <path
          d={callerOrbPath}
          fill="none"
          stroke="url(#handoffCallerGrad)"
          strokeWidth="1.6"
          strokeDasharray="5 8"
          className="handoff-scene__flow"
        />
        {!reduceMotion ? (
          <circle r="3" fill={C.mint} opacity="0.85">
            <animateMotion dur="2.2s" repeatCount="indefinite" path={callerOrbPath} calcMode="linear" />
          </circle>
        ) : null}
      </g>

      <g opacity={callerToHuman}>
        <path
          d={callerHumanPath}
          fill="none"
          stroke="url(#handoffCallerHumanGrad)"
          strokeWidth="2"
          strokeDasharray="5 8"
          className="handoff-scene__flow handoff-scene__flow--human"
        />
        {!reduceMotion ? (
          <>
            <circle r="3.5" fill={C.rose} opacity="0.9">
              <animateMotion dur="2.4s" repeatCount="indefinite" path={callerHumanPath} calcMode="linear" />
            </circle>
            <circle r="2.5" fill={C.mint} opacity="0.75">
              <animateMotion dur="2.4s" repeatCount="indefinite" path={callerHumanPath} begin="1.2s" calcMode="linear" />
            </circle>
          </>
        ) : null}
      </g>

      <CallerPhone
        caller={handoffSpatial.caller}
        satelliteScale={satelliteScale}
        opacity={caller}
        live={callerLive}
        ringing={callerRinging}
      />

      <g opacity={transferIntensity}>
        <path
          d={summaryPath}
          fill="none"
          stroke="url(#handoffTransferGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          opacity={0.28 + transferPeak * 0.22}
          filter="url(#handoffPathGlow)"
        />
        <path
          d={summaryPath}
          fill="none"
          stroke="url(#handoffTransferGrad)"
          strokeWidth="3.6"
          strokeDasharray="8 10"
          strokeLinecap="round"
          className="handoff-scene__transfer handoff-scene__transfer--hero"
          filter="url(#handoffPathGlow)"
        />
        {!reduceMotion ? (
          <>
            <circle r="6" fill={C.cream} opacity="0.95" filter="url(#handoffPathGlow)">
              <animateMotion dur="2.1s" repeatCount="indefinite" path={summaryPath} calcMode="linear" />
            </circle>
            <circle r="5" fill={C.mint} opacity="0.9">
              <animateMotion dur="2.1s" repeatCount="indefinite" path={summaryPath} begin="0.7s" calcMode="linear" />
            </circle>
            <circle r="4.5" fill={C.rose} opacity="0.95">
              <animateMotion dur="2.1s" repeatCount="indefinite" path={summaryPath} begin="1.4s" calcMode="linear" />
            </circle>
          </>
        ) : null}
      </g>

      <TransferBeacon x={transferMidX} y={transferMidY} intensity={transferPeak * 0.92} reduceMotion={!!reduceMotion} />

      <HumanAgent
        x={layout.humanX}
        y={layout.humanY}
        scale={human.scale}
        satelliteScale={satelliteScale}
        ringOpacity={Math.max(human.ring, callerToHuman * 0.85)}
        live={humanLive}
      />

      <PillLabel
        x={layout.humanX}
        y={layout.humanY - 58}
        text="human handoff"
        color={C.cream}
        opacity={warmHandoff}
        prominent
      />

      <CallSummaryCard
        x={summary.x}
        y={summary.y}
        opacity={summary.opacity}
        fillProgress={summary.slide}
        scale={summary.scale}
        glow={summary.glow}
        satelliteScale={satelliteScale}
      />
    </svg>
  );
}
