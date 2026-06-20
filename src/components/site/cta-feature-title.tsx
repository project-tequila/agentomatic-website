"use client";

import { useReducedMotion } from "framer-motion";

import { CtaHorizontalTyping } from "@/components/site/cta-horizontal-typing";
import {
  ctaChapterProgress,
  ctaTitleLine1TypingReveal,
  ctaTitleLine2TypingReveal,
} from "@/lib/story/cta-reveal";

type CtaFeatureTitleProps = {
  story: number;
};

export function CtaFeatureTitle({ story }: CtaFeatureTitleProps) {
  const reduceMotion = useReducedMotion();
  const progress = ctaChapterProgress(story);
  const motionOff = !!reduceMotion;

  if (progress === null) {
    return (
      <h1 className="rumik-story__title rumik-story__title--cta">
        <span>try it</span>
        <span>live.</span>
      </h1>
    );
  }

  const line1 = ctaTitleLine1TypingReveal(progress, motionOff);
  const line2 = ctaTitleLine2TypingReveal(progress, motionOff);
  const line1Done = line1 >= 0.995;

  return (
    <h1 className="rumik-story__title rumik-story__title--cta">
      <span className="rumik-story__title-line">
        <CtaHorizontalTyping
          text="try it"
          typingReveal={line1}
          scrollSignal={progress}
          reduceMotion={motionOff}
          showCursor={!line1Done}
          blinkWhenComplete={false}
        />
      </span>
      <span className="rumik-story__title-line">
        <CtaHorizontalTyping
          text="live."
          typingReveal={line2}
          scrollSignal={progress}
          reduceMotion={motionOff}
          showCursor={line1Done}
          blinkWhenComplete
        />
      </span>
    </h1>
  );
}
