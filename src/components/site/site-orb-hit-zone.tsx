"use client";

import { useReducedMotion } from "framer-motion";

import { useDemoCall } from "@/lib/demo-call/demo-call-context";
import { cn } from "@/lib/utils";

import { FrontdeskVoiceOrb } from "./frontdesk-voice-orb";

type SiteOrbHitZoneProps = {
  variant: "immersive" | "floating";
  className?: string;
};

export function SiteOrbHitZone({ variant, className }: SiteOrbHitZoneProps) {
  const reduceMotion = useReducedMotion();
  const { openDemoCall: openFromContext } = useDemoCall();

  function handleClick() {
    openFromContext();
  }

  return (
    <button
      type="button"
      className={cn("site-orb-hit", `site-orb-hit--${variant}`, className)}
      aria-label="Start a live demo call"
      onClick={handleClick}
    >
      {variant === "floating" ? (
        <span className="site-orb-hit__orb" aria-hidden>
          <svg viewBox="300 150 120 140" className="site-orb-hit__orb-svg" fill="none" preserveAspectRatio="xMidYMid meet">
            <FrontdeskVoiceOrb
              cx={360}
              cy={220}
              pointerX={0}
              pointerY={0}
              reduceMotion={!!reduceMotion}
              intensity={0.85}
              mode="cta"
              idSuffix="float"
            />
          </svg>
        </span>
      ) : null}
      <span className="site-orb-hit__label">tap to try</span>
    </button>
  );
}
