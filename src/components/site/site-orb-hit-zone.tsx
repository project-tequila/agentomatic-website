"use client";

import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";

import { openDemoCall } from "@/lib/demo-call/open-demo-call";
import { useDemoWebVoice } from "@/lib/voice/demo-web-voice-context";
import { cn } from "@/lib/utils";

import { VoiceAgenticOrb } from "./voice-agentic-orb";

type SiteOrbHitZoneProps = {
  variant: "immersive" | "floating";
  className?: string;
};

export function SiteOrbHitZone({ variant, className }: SiteOrbHitZoneProps) {
  const reduceMotion = usePrefersReducedMotion();
  const { start } = useDemoWebVoice();

  function handleClick() {
    openDemoCall();
    void start();
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
          <VoiceAgenticOrb
            voiceState="idle"
            energy={0.72}
            reduceMotion={!!reduceMotion}
            size="100%"
          />
        </span>
      ) : null}
      <span className="site-orb-hit__label">Talk</span>
    </button>
  );
}
