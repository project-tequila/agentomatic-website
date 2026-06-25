"use client";

import { useReducedMotion } from "framer-motion";

import { featureBandProgress } from "@/lib/story/feature-band-progress";
import { MULTILINGUAL_PROVIDER_HEADLINE, multilingualAvailabilityScript, multilingualHeroLanguage } from "@/lib/story/multilingual-reveal";
import { cn } from "@/lib/utils";

type MultilingualFeatureTitleProps = {
  story: number;
};

export function MultilingualFeatureTitle({ story }: MultilingualFeatureTitleProps) {
  const reduceMotion = useReducedMotion();
  const progress = featureBandProgress(story, "multilingual");
  const motionOff = !!reduceMotion;

  if (progress === null) {
    return (
      <h1 className="rumik-story__title rumik-story__title--multilingual">
        <span>{MULTILINGUAL_PROVIDER_HEADLINE}</span>
        <span className="multilingual-title__line">now available in your language.</span>
      </h1>
    );
  }

  const hero = multilingualHeroLanguage(progress, motionOff);
  const phrase = multilingualAvailabilityScript(hero.id);

  return (
    <h1 className="rumik-story__title rumik-story__title--multilingual">
      <span>{MULTILINGUAL_PROVIDER_HEADLINE}</span>
      <span className="multilingual-title__line">
        <span
          className={cn(
            "multilingual-title__hero",
            !motionOff && "multilingual-title__hero--live",
          )}
          style={{ color: hero.color, opacity: hero.opacity * hero.pulse }}
        >
          {phrase}
        </span>
      </span>
    </h1>
  );
}
