"use client";

import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";

import { featureBandProgress } from "@/lib/story/feature-band-progress";
import {
  MULTILINGUAL_LANGUAGE_ROSTER,
  MULTILINGUAL_PROVIDER_HEADLINE,
  multilingualAvailabilityScript,
} from "@/lib/story/multilingual-reveal";
import { useMultilingualPhraseCycle } from "@/lib/story/use-multilingual-phrase-cycle";

type MultilingualFeatureTitleProps = {
  story: number;
};

export function MultilingualFeatureTitle({ story }: MultilingualFeatureTitleProps) {
  const reduceMotion = usePrefersReducedMotion();
  const progress = featureBandProgress(story, "multilingual");
  const motionOff = !!reduceMotion;
  const active = progress !== null;
  const cycle = useMultilingualPhraseCycle(active, motionOff);

  if (progress === null) {
    return (
      <h2 className="rumik-story__title rumik-story__title--multilingual">
        <span>{MULTILINGUAL_PROVIDER_HEADLINE}</span>
        <span className="multilingual-title__line">now available in your language.</span>
      </h2>
    );
  }

  const phrase = multilingualAvailabilityScript(cycle.lang.id);
  const typedCount = Math.max(0, Math.min(phrase.length, Math.ceil(phrase.length * cycle.typingReveal)));
  const typed = phrase.slice(0, typedCount);

  return (
    <h2 className="rumik-story__title rumik-story__title--multilingual">
      <span>{MULTILINGUAL_PROVIDER_HEADLINE}</span>
      <span className="multilingual-title__lang" style={{ color: cycle.lang.color }}>
        {cycle.lang.label}
      </span>
      <span className="multilingual-title__line">
        <span
          className="multilingual-title__hero"
          style={{ color: cycle.lang.color, opacity: cycle.opacity }}
        >
          {typed}
          {!motionOff && cycle.typingReveal < 0.995 && cycle.opacity > 0.2 ? (
            <span className="multilingual-title__cursor" aria-hidden>
              |
            </span>
          ) : null}
        </span>
      </span>
      <span className="multilingual-title__roster">{MULTILINGUAL_LANGUAGE_ROSTER}</span>
    </h2>
  );
}
