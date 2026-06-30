"use client";

import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";
import { useScrollTypingDisplay } from "@/lib/story/use-scroll-typing-display";

import { featureBandProgress } from "@/lib/story/feature-band-progress";
import { handoffTaglineGlow, handoffTaglineTypingReveal } from "@/lib/story/handoff-reveal";
import { useStoryScrollPaused } from "@/lib/story/use-story-scroll-paused";
import { cn } from "@/lib/utils";

const TAGLINE = "Right when it's needed.";

type HandoffFeatureTitleProps = {
  story: number;
};

function HandoffTagline({
  typingReveal,
  scrollPaused,
  reduceMotion,
  glow,
}: {
  typingReveal: number;
  scrollPaused: boolean;
  reduceMotion: boolean;
  glow: number;
}) {
  const display = useScrollTypingDisplay(typingReveal, scrollPaused, reduceMotion, {
    pausedStep: 0.038,
    lerp: 0.4,
    completeStep: 0.024,
  });

  const len = TAGLINE.length;
  const typedUnits = display * len;
  const fullCount = Math.min(len, Math.floor(typedUnits));
  const frac = fullCount < len ? typedUnits - fullCount : 0;
  const incomplete = display < 0.995;
  const showCursor = !reduceMotion && display > 0.02 && (incomplete || scrollPaused);

  return (
    <span
      className={cn("handoff-title__tagline", glow > 0.35 && "handoff-title__tagline--live")}
      style={{ ["--handoff-glow" as string]: glow }}
    >
      {TAGLINE.split("").map((ch, i) => {
        let op = 0;
        if (i < fullCount) op = 1;
        else if (i === fullCount) op = frac;
        return (
          <span key={`${ch}-${i}`} style={{ opacity: op }}>
            {ch}
          </span>
        );
      })}
      {showCursor ? (
        <span
          className={cn(
            "handoff-title__cursor",
            scrollPaused && "handoff-title__cursor--blink",
          )}
          aria-hidden
        />
      ) : null}
    </span>
  );
}

export function HandoffFeatureTitle({ story }: HandoffFeatureTitleProps) {
  const reduceMotion = usePrefersReducedMotion();
  const progress = featureBandProgress(story, "handoff");
  const scrollPaused = useStoryScrollPaused(progress ?? 0, 120);
  const motionOff = !!reduceMotion;

  if (progress === null) {
    return (
      <h2 className="rumik-story__title rumik-story__title--handoff">
        <span className="handoff-title__line">Human Support,</span>
        <span className="handoff-title__line">{TAGLINE}</span>
      </h2>
    );
  }

  const typingReveal = handoffTaglineTypingReveal(progress, motionOff);
  const glow = handoffTaglineGlow(progress);

  return (
    <h2 className="rumik-story__title rumik-story__title--handoff">
      <span className="handoff-title__line">Human Support,</span>
      <span className="handoff-title__line">
        <HandoffTagline
          typingReveal={typingReveal}
          scrollPaused={scrollPaused}
          reduceMotion={motionOff}
          glow={glow}
        />
      </span>
    </h2>
  );
}
