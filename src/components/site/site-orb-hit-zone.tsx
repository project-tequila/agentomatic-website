"use client";

import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";

import { useBeginVoiceDemo } from "@/lib/demo-call/use-begin-voice-demo";
import { cn } from "@/lib/utils";

import { FrontdeskVoiceOrb } from "./frontdesk-voice-orb";

type SiteOrbHitZoneProps = {
  variant: "immersive" | "floating";
  className?: string;
};

export function SiteOrbHitZone({ variant, className }: SiteOrbHitZoneProps) {
  const reduceMotion = usePrefersReducedMotion();
  const beginVoiceDemo = useBeginVoiceDemo();
  function handleClick() {
    beginVoiceDemo();
  }

  return (
    <button
      type="button"
      className={cn("site-orb-hit", `site-orb-hit--${variant}`, className)}
      aria-label="Talk to Agent"
      data-testid="site-orb-talk"
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
      <span className="site-orb-hit__label">Talk</span>
    </button>
  );
}
