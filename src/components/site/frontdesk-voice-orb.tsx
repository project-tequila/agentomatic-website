"use client";

import { useMemo } from "react";

import type { PersistentOrbMode } from "@/lib/story/persistent-orb";
import { cn } from "@/lib/utils";

type FrontdeskVoiceOrbProps = {
  cx?: number;
  cy?: number;
  pointerX?: number;
  pointerY?: number;
  reduceMotion?: boolean;
  intensity?: number;
  mode?: PersistentOrbMode;
  idSuffix?: string;
};

const MODE_WAVE_GRADIENTS: Record<
  PersistentOrbMode,
  { left: string; mid: string; right: string; halo: string; coreMint: string; coreAccent: string }
> = {
  hook: {
    left: "#8cffd2",
    mid: "#74c0fc",
    right: "#9775fa",
    halo: "rgba(140,255,210,0.1)",
    coreMint: "#8cffd2",
    coreAccent: "#74c0fc",
  },
  grunt: {
    left: "#ff8787",
    mid: "#ffc857",
    right: "#8cffd2",
    halo: "rgba(255,135,135,0.14)",
    coreMint: "#ffc857",
    coreAccent: "#ff8787",
  },
  hours: {
    left: "#9775fa",
    mid: "#74c0fc",
    right: "#ffc857",
    halo: "rgba(151,117,250,0.14)",
    coreMint: "#c084fc",
    coreAccent: "#ffc857",
  },
  concurrent: {
    left: "#8cffd2",
    mid: "#74c0fc",
    right: "#ffc857",
    halo: "rgba(140,255,210,0.12)",
    coreMint: "#8cffd2",
    coreAccent: "#5eead4",
  },
  integrations: {
    left: "#8cffd2",
    mid: "#9775fa",
    right: "#ffc857",
    halo: "rgba(151,117,250,0.14)",
    coreMint: "#8cffd2",
    coreAccent: "#9775fa",
  },
  multilingual: {
    left: "#74c0fc",
    mid: "#8cffd2",
    right: "#ffc857",
    halo: "rgba(116,192,252,0.16)",
    coreMint: "#74c0fc",
    coreAccent: "#ffc857",
  },
  handoff: {
    left: "#8cffd2",
    mid: "#8cffd2",
    right: "#f783ac",
    halo: "rgba(247,131,172,0.16)",
    coreMint: "#8cffd2",
    coreAccent: "#f783ac",
  },
  reminders: {
    left: "#ffc857",
    mid: "#ffd43b",
    right: "#74c0fc",
    halo: "rgba(255,200,87,0.16)",
    coreMint: "#ffc857",
    coreAccent: "#ffe066",
  },
  dashboard: {
    left: "#9775fa",
    mid: "#8cffd2",
    right: "#74c0fc",
    halo: "rgba(151,117,250,0.14)",
    coreMint: "#9775fa",
    coreAccent: "#8cffd2",
  },
  cta: {
    left: "#8cffd2",
    mid: "#f5f2eb",
    right: "#74c0fc",
    halo: "rgba(140,255,210,0.18)",
    coreMint: "#8cffd2",
    coreAccent: "#74c0fc",
  },
};

function wavePath(
  cx: number,
  cy: number,
  radius: number,
  amplitude: number,
  frequency: number,
  phase: number,
  pointerX: number,
  pointerY: number,
  pointerStrength: number,
) {
  const steps = 64;
  const parts: string[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const ripple = Math.sin(t * frequency + phase) * amplitude;
    const ripple2 = Math.cos(t * (frequency * 0.62) + phase * 1.35) * (amplitude * 0.52);
    const ripple3 = Math.sin(t * (frequency * 1.35) + phase * 0.7) * (amplitude * 0.28);
    const bias = (pointerX * Math.cos(t) + pointerY * Math.sin(t)) * pointerStrength;
    const r = radius + ripple + ripple2 + ripple3 + bias;
    const x = cx + Math.cos(t) * r;
    const y = cy + Math.sin(t) * r;
    parts.push(i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : `L ${x.toFixed(2)} ${y.toFixed(2)}`);
  }

  return `${parts.join(" ")} Z`;
}

export function FrontdeskVoiceOrb({
  cx = 280,
  cy = 188,
  pointerX = 0,
  pointerY = 0,
  reduceMotion = false,
  intensity = 1,
  mode = "hook",
  idSuffix = "main",
}: FrontdeskVoiceOrbProps) {
  const px = reduceMotion ? 0 : pointerX;
  const py = reduceMotion ? 0 : pointerY;
  const tiltX = px * 6;
  const tiltY = py * 5;
  const palette = MODE_WAVE_GRADIENTS[mode];
  const uid = idSuffix;

  const waves = useMemo(() => {
    const layers = [
      { r: 46, amp: 4.8, freq: 5.5, phase: 0, opacity: 0.58, stroke: 1.5 },
      { r: 58, amp: 6.8, freq: 4.4, phase: 0.9, opacity: 0.42, stroke: 1.25 },
      { r: 72, amp: 8.5, freq: 3.8, phase: 1.8, opacity: 0.3, stroke: 1.05 },
      { r: 88, amp: 10.2, freq: 3.2, phase: 2.6, opacity: 0.2, stroke: 0.95 },
      { r: 104, amp: 11.5, freq: 2.8, phase: 3.4, opacity: 0.12, stroke: 0.8 },
    ];

    return layers.map((layer) => ({
      ...layer,
      d: wavePath(
        cx + tiltX * 0.15,
        cy + tiltY * 0.15,
        layer.r * (0.98 + intensity * 0.04),
        layer.amp * (0.85 + intensity * 0.25 + Math.abs(px) * 0.35),
        layer.freq,
        layer.phase + px * 0.8 + py * 0.6,
        px,
        py,
        5 + intensity * 3,
      ),
    }));
  }, [cx, cy, px, py, tiltX, tiltY, intensity]);

  return (
    <g
      className={cn("frontdesk-voice-orb", `frontdesk-voice-orb--${mode}`)}
      transform={`translate(${tiltX * 0.35} ${tiltY * 0.35})`}
    >
      <defs>
        <radialGradient id={`frontdeskOrbCore-${uid}`} cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#f5f2eb" stopOpacity="0.95" />
          <stop offset="35%" stopColor={palette.coreMint} stopOpacity="0.88" />
          <stop offset="72%" stopColor={palette.coreAccent} stopOpacity="0.55" />
          <stop offset="100%" stopColor="#1a2332" stopOpacity="0.95" />
        </radialGradient>
        <radialGradient id={`frontdeskOrbSheen-${uid}`} cx="30%" cy="22%" r="45%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`frontdeskWaveDual-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={palette.left} stopOpacity="0.85" />
          <stop offset="45%" stopColor={palette.mid} stopOpacity="0.55" />
          <stop offset="55%" stopColor={palette.mid} stopOpacity="0.55" />
          <stop offset="100%" stopColor={palette.right} stopOpacity="0.85" />
        </linearGradient>
        <filter id={`frontdeskOrbBlur-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx={cx - 42} cy={cy} rx="38" ry="48" fill="rgba(140,255,210,0.07)" />
      <ellipse cx={cx + 42} cy={cy} rx="38" ry="48" fill="rgba(255,200,87,0.07)" />

      <ellipse cx={cx} cy={cy + 38} rx="36" ry="6" fill="rgba(0,0,0,0.35)" opacity="0.45" />

      {waves.map((wave, i) => (
        <path
          key={i}
          d={wave.d}
          fill="none"
          stroke={`url(#frontdeskWaveDual-${uid})`}
          strokeWidth={wave.stroke}
          opacity={wave.opacity}
          strokeLinecap="round"
          filter={i < 2 ? `url(#frontdeskOrbBlur-${uid})` : undefined}
          className={reduceMotion ? undefined : "frontdesk-voice-orb__wave"}
          style={reduceMotion ? undefined : { animationDelay: `${i * 0.28}s`, transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}

      <circle
        cx={cx}
        cy={cy}
        r="34"
        fill={palette.halo}
        className={reduceMotion ? undefined : "frontdesk-voice-orb__halo"}
      />
      <circle cx={cx} cy={cy} r="26" fill={`url(#frontdeskOrbCore-${uid})`} stroke="rgba(255,255,255,0.22)" strokeWidth="1.2" />
      <circle cx={cx - 8} cy={cy - 10} r="14" fill={`url(#frontdeskOrbSheen-${uid})`} opacity="0.85" />
      <circle cx={cx} cy={cy} r="4" fill="#f5f2eb" opacity="0.92" />
    </g>
  );
}
