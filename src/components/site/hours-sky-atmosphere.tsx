"use client";

import type { CSSProperties } from "react";

import { hoursDayNightMix } from "@/lib/story/hours-day-night";
import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";

type HoursSkyAtmosphereProps = {
  story: number;
  sceneOpacity: number;
};

type StarSpec = {
  x: number;
  y: number;
  r: number;
  base: number;
  twinkle: number;
  delay: number;
  layer: 0 | 1 | 2;
};

/** Deterministic PRNG so SSR and client star fields match. */
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function buildStars(): StarSpec[] {
  const rand = mulberry32(0x484f5552); // "HOUR"
  const stars: StarSpec[] = [];

  // Far dust — many tiny points
  for (let i = 0; i < 96; i++) {
    stars.push({
      x: rand() * 100,
      y: rand() * 100,
      r: 0.12 + rand() * 0.22,
      base: 0.22 + rand() * 0.38,
      twinkle: 0.35 + rand() * 0.45,
      delay: rand() * 5.5,
      layer: 0,
    });
  }

  // Mid field — clearer pinpoints
  for (let i = 0; i < 48; i++) {
    stars.push({
      x: rand() * 100,
      y: rand() * 92,
      r: 0.22 + rand() * 0.38,
      base: 0.4 + rand() * 0.4,
      twinkle: 0.45 + rand() * 0.45,
      delay: rand() * 4.2,
      layer: 1,
    });
  }

  // Near bright — sparse, soft glow via filter
  for (let i = 0; i < 14; i++) {
    stars.push({
      x: 4 + rand() * 92,
      y: 3 + rand() * 78,
      r: 0.38 + rand() * 0.42,
      base: 0.55 + rand() * 0.4,
      twinkle: 0.55 + rand() * 0.4,
      delay: rand() * 3.8,
      layer: 2,
    });
  }

  return stars;
}

const STARS = buildStars();

export function HoursSkyAtmosphere({ story, sceneOpacity }: HoursSkyAtmosphereProps) {
  const reduceMotion = usePrefersReducedMotion();
  const mix = hoursDayNightMix(story);

  if (!mix || sceneOpacity < 0.02) return null;

  const { dayMix, starOpacity, dayGlow, nightSky } = mix;
  const nightOpacity = 1 - dayMix;
  const mistOpacity = nightSky * 0.55 + (1 - dayMix) * 0.25;
  const horizonWarm = dayGlow * 0.85;

  return (
    <div
      className="hours-sky"
      style={
        {
          opacity: sceneOpacity,
          "--hours-day-mix": dayMix.toFixed(4),
          "--hours-night-mix": nightOpacity.toFixed(4),
          "--hours-star-opacity": starOpacity.toFixed(4),
          "--hours-day-glow": dayGlow.toFixed(4),
          "--hours-horizon-warm": horizonWarm.toFixed(4),
        } as CSSProperties
      }
      aria-hidden
    >
      <div className="hours-sky__day" style={{ opacity: dayMix }} />
      <div className="hours-sky__day-haze" style={{ opacity: dayMix * 0.9 }} />
      <div className="hours-sky__sun-bloom" style={{ opacity: dayGlow }} />

      <div className="hours-sky__night" style={{ opacity: nightOpacity }} />
      <div className="hours-sky__milky" style={{ opacity: mistOpacity }} />

      <svg
        className="hours-sky__stars"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: starOpacity }}
      >
        {STARS.map((star, index) => (
          <circle
            key={`${star.layer}-${index}`}
            className={
              reduceMotion
                ? `hours-sky__star hours-sky__star--l${star.layer}`
                : `hours-sky__star hours-sky__star--l${star.layer} hours-sky__star--twinkle`
            }
            cx={star.x}
            cy={star.y}
            r={star.r}
            fill={star.layer === 2 ? "#e8eef8" : "#d7e0f0"}
            style={
              {
                opacity: star.base,
                "--star-twinkle": star.twinkle,
                animationDelay: reduceMotion ? undefined : `${star.delay}s`,
                animationDuration: reduceMotion ? undefined : `${2.4 + (index % 5) * 0.55}s`,
              } as CSSProperties
            }
          />
        ))}
      </svg>

      {/* Soft vignette so sky meets editorial edges without hard ink bands */}
      <div className="hours-sky__edge" />
    </div>
  );
}
