"use client";

import { useReducedMotion } from "framer-motion";

import { featureBandProgress } from "@/lib/story/feature-band-progress";
import { multilingualHeroLanguage } from "@/lib/story/multilingual-reveal";
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
      <h1 className="rumik-story__title">
        <span>32+ languages.</span>
        <span>native fluency.</span>
      </h1>
    );
  }

  const hero = multilingualHeroLanguage(progress, motionOff);

  return (
    <h1 className="rumik-story__title rumik-story__title--multilingual">
      <span>32+ languages.</span>
      <span className="multilingual-title__line">
        <span
          className={cn("multilingual-title__hero", !motionOff && "multilingual-title__hero--live")}
          style={{ color: hero.color, opacity: hero.opacity * hero.pulse }}
        >
          {hero.script}
        </span>
        <span className="multilingual-title__rest" style={{ opacity: hero.opacity }}>
          {" "}
          · native fluency.
        </span>
      </span>
    </h1>
  );
}
