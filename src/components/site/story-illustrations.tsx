"use client";

import type { IllustrationSceneId } from "@/lib/story/illustration-scenes";
import { STORY_STAGE_PRESERVE, storyStageViewBox } from "@/lib/story/persistent-orb";

import type { ComponentType, ReactNode } from "react";

const C = {
  cream: "#f5f2eb",
  mint: "#8cffd2",
  sky: "#74c0fc",
  violet: "#9775fa",
  amber: "#ffc857",
  coral: "#ff8787",
  ink: "#1c1f26",
  slate: "#2b303b",
  muted: "rgba(245,242,235,0.48)",
  rose: "#f783ac",
  stroke: "rgba(245,242,235,0.68)",
};

type SceneProps = { className?: string };

function Frame({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <svg
      viewBox={storyStageViewBox()}
      preserveAspectRatio={STORY_STAGE_PRESERVE}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

function HookIllustration({ className }: SceneProps) {
  return (
    <Frame className={className}>
      <circle cx="420" cy="120" r="72" fill="url(#glowMint)" opacity="0.35" />
      <path d="M200 130 Q280 90 360 130" stroke={C.mint} strokeWidth="1.5" opacity="0.45" fill="none" />
      <defs>
        <radialGradient id="glowMint" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.mint} stopOpacity="0.35" />
          <stop offset="100%" stopColor={C.mint} stopOpacity="0" />
        </radialGradient>
      </defs>
    </Frame>
  );
}

function GruntIllustration({ className }: SceneProps) {
  return <Frame className={className} />;
}

function HandoffIllustration({ className }: SceneProps) {
  return <Frame className={className} />;
}

function ConcurrentIllustration({ className }: SceneProps) {
  return (
    <Frame className={className}>
      {[160, 280, 400].map((x, i) => (
        <g key={x} transform={`translate(${x - 280} 0)`}>
          <rect x="248" y="108" width="64" height="108" rx="10" fill={C.ink} stroke={i === 1 ? C.amber : C.stroke} strokeWidth="1.2" />
          <path
            d="M262 148 Q280 132 298 148 Q280 164 262 148"
            fill="none"
            stroke={i === 1 ? C.amber : C.mint}
            strokeWidth="1.5"
            opacity="0.8"
          />
          {[0, 1, 2, 3].map((b) => (
            <rect key={b} x={268 + b * 8} y="188" width="4" height={12 + (b % 2) * 8} rx="1" fill={C.muted} />
          ))}
        </g>
      ))}
    </Frame>
  );
}

function IntegrationsIllustration({ className }: SceneProps) {
  return <Frame className={className} />;
}

function MultilingualIllustration({ className }: SceneProps) {
  return <Frame className={className} />;
}

function HoursIllustration({ className }: SceneProps) {
  return <Frame className={className} />;
}

function RemindersIllustration({ className }: SceneProps) {
  return (
    <Frame className={className}>
      <rect x="248" y="228" width="120" height="52" rx="6" fill={C.slate} stroke={C.stroke} strokeWidth="1" opacity="0.85" />
      <rect x="262" y="242" width="72" height="6" rx="2" fill={C.muted} />
      <rect x="262" y="256" width="48" height="6" rx="2" fill="rgba(245,242,235,0.2)" />
      <text x="262" y="236" fill={C.amber} fontSize="9" fontFamily="system-ui">
        upcoming
      </text>
    </Frame>
  );
}

function DashboardIllustration({ className }: SceneProps) {
  return (
    <Frame className={className}>
      <rect x="100" y="88" width="360" height="220" rx="12" fill={C.ink} stroke={C.stroke} strokeWidth="1.2" />
      {[
        { x: 120, y: 108, w: 100, h: 72 },
        { x: 232, y: 108, w: 100, h: 72 },
        { x: 344, y: 108, w: 96, h: 72 },
        { x: 120, y: 196, w: 320, h: 96 },
      ].map((t, i) => (
        <rect key={i} x={t.x} y={t.y} width={t.w} height={t.h} rx="6" fill={C.slate} stroke="rgba(245,242,235,0.12)" strokeWidth="1" />
      ))}
      {[0, 1, 2, 3, 4, 5, 6].map((b) => (
        <rect key={b} x={140 + b * 18} y={248 - (b % 4) * 14} width="10" height={(b % 4) * 14 + 20} rx="2" fill={b % 2 === 0 ? C.mint : C.violet} opacity="0.65" />
      ))}
    </Frame>
  );
}

function CtaIllustration({ className }: SceneProps) {
  return <Frame className={className} />;
}

const SCENES: Record<IllustrationSceneId, ComponentType<SceneProps>> = {
  hook: HookIllustration,
  grunt: GruntIllustration,
  hours: HoursIllustration,
  concurrent: ConcurrentIllustration,
  integrations: IntegrationsIllustration,
  multilingual: MultilingualIllustration,
  handoff: HandoffIllustration,
  reminders: RemindersIllustration,
  dashboard: DashboardIllustration,
  cta: CtaIllustration,
};

export function StoryIllustration({ id, className }: { id: IllustrationSceneId; className?: string }) {
  const Scene = SCENES[id];
  return <Scene className={className} />;
}
