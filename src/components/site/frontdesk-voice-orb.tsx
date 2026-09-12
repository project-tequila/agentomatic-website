"use client";

import type { RefObject } from "react";

import type { PersistentOrbMode } from "@/lib/story/persistent-orb";
import { PERSISTENT_ORB, PERSISTENT_ORB_OUTER_WAVE_RADIUS } from "@/lib/story/persistent-orb";
import type { VoiceEnergyOrbState } from "@/lib/voice/voice-orb-state";
import { cn } from "@/lib/utils";

import { WaveformRing } from "./waveform-ring";
import type { WaveformOrbState } from "./waveform-ring-math";

type FrontdeskVoiceOrbProps = {
  cx?: number;
  cy?: number;
  pointerX?: number;
  pointerY?: number;
  reduceMotion?: boolean;
  intensity?: number;
  mode?: PersistentOrbMode;
  idSuffix?: string;
  agentState?: VoiceEnergyOrbState;
  levelRef?: RefObject<number>;
};

const MODE_RING_COLORS: Record<PersistentOrbMode, { from: string; to: string }> = {
  hook: { from: "#8cffd2", to: "#74c0fc" },
  grunt: { from: "#ff8787", to: "#ffc857" },
  hours: { from: "#9775fa", to: "#74c0fc" },
  concurrent: { from: "#8cffd2", to: "#74c0fc" },
  integrations: { from: "#8cffd2", to: "#9775fa" },
  multilingual: { from: "#74c0fc", to: "#8cffd2" },
  handoff: { from: "#8cffd2", to: "#f783ac" },
  reminders: { from: "#ffc857", to: "#74c0fc" },
  dashboard: { from: "#9775fa", to: "#8cffd2" },
  cta: { from: "#8cffd2", to: "#74c0fc" },
};

/** Same SVG footprint as the previous glass orb (outer wave radius × 2). */
export const FRONTDESK_ORB_DIAMETER = PERSISTENT_ORB_OUTER_WAVE_RADIUS * 2;

/** Tight SVG crop that still contains the full waveform ring. */
export const FRONTDESK_ORB_VIEWBOX = `${PERSISTENT_ORB.cx - FRONTDESK_ORB_DIAMETER / 2} ${PERSISTENT_ORB.cy - FRONTDESK_ORB_DIAMETER / 2} ${FRONTDESK_ORB_DIAMETER} ${FRONTDESK_ORB_DIAMETER}`;

export function FrontdeskVoiceOrb({
  cx = 280,
  cy = 188,
  pointerX = 0,
  pointerY = 0,
  reduceMotion = false,
  intensity = 1,
  mode = "hook",
  idSuffix = "main",
  agentState,
  levelRef,
}: FrontdeskVoiceOrbProps) {
  const px = reduceMotion ? 0 : pointerX;
  const py = reduceMotion ? 0 : pointerY;
  const tiltX = px * 10;
  const tiltY = py * 8;
  const palette = MODE_RING_COLORS[mode];
  const size = FRONTDESK_ORB_DIAMETER;
  const ringState: WaveformOrbState = agentState ?? "idle";
  const speed = 0.55 + intensity * 0.7;

  return (
    <g
      className={cn("frontdesk-voice-orb", `frontdesk-voice-orb--${mode}`)}
      transform={`translate(${cx + tiltX * 0.35} ${cy + tiltY * 0.35})`}
    >
      <foreignObject
        x={-size / 2}
        y={-size / 2}
        width={size}
        height={size}
        overflow="visible"
        pointerEvents="none"
      >
        <WaveformRing
          key={idSuffix}
          state={ringState}
          size={size}
          speed={speed}
          colorFrom={palette.from}
          colorTo={palette.to}
          levelRef={levelRef}
          reduceMotion={reduceMotion}
        />
      </foreignObject>
    </g>
  );
}
