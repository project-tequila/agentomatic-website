"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

export type VoiceAgenticOrbState = "idle" | "connecting" | "listening" | "speaking";

type VoiceAgenticOrbProps = {
  voiceState?: VoiceAgenticOrbState;
  energy?: number;
  reduceMotion?: boolean;
  className?: string;
  variant?: "primary" | "soft-halo";
  /** CSS length for orb diameter, e.g. `min(18rem, 42vw)` */
  size?: string;
  priority?: boolean;
};

const ORB_ASSETS = {
  primary: "/marketing/voice-agentic-orb-primary.png",
  "soft-halo": "/marketing/voice-agentic-orb-soft-halo.png",
} as const;

export function VoiceAgenticOrb({
  voiceState = "idle",
  energy = 0.35,
  reduceMotion = false,
  className,
  variant = "primary",
  size = "min(18rem, 42vw)",
  priority = false,
}: VoiceAgenticOrbProps) {
  const clampedEnergy = Math.min(1, Math.max(0.12, energy));

  return (
    <div
      className={cn(
        "voice-agentic-orb",
        `voice-agentic-orb--${voiceState}`,
        reduceMotion && "voice-agentic-orb--reduced",
        className,
      )}
      style={
        {
          "--orb-energy": clampedEnergy.toFixed(3),
          "--orb-size": size,
        } as CSSProperties
      }
      aria-hidden
    >
      <div className="voice-agentic-orb__field">
        <div className="voice-agentic-orb__halo" />
        <div className="voice-agentic-orb__caustics" />
        <div className="voice-agentic-orb__core">
          <Image
            src={ORB_ASSETS[variant]}
            alt=""
            width={768}
            height={512}
            sizes="(max-width: 768px) 70vw, 22rem"
            priority={priority}
            draggable={false}
          />
        </div>
        <div className="voice-agentic-orb__rim" />
        <div className="voice-agentic-orb__dust" />
      </div>
    </div>
  );
}
