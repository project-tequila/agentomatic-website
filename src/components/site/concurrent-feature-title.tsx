"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";

import { featureBandProgress } from "@/lib/story/feature-band-progress";
import { concurrentTitleLine1Reveal, concurrentTitleLine2Reveal } from "@/lib/story/concurrent-reveal";

type ConcurrentFeatureTitleProps = {
  story: number;
};

function dropTransform(t: number, phaseOffset = 0) {
  if (t <= 0) {
    return { y: -155, x: 0, rotate: -18, opacity: 0, scaleY: 1, scaleX: 1 };
  }

  const opacity = Math.min(1, t * 2.2);
  let y = -155;
  if (t < 0.68) {
    y = -155 + (t / 0.68) * (155 + 10);
  } else if (t < 0.84) {
    y = 10 - ((t - 0.68) / 0.16) * 12;
  } else {
    y = -2 + ((t - 0.84) / 0.16) * 2;
  }

  let x = 0;
  let rotate = 0;
  if (t < 0.62) {
    const p = t / 0.62;
    rotate = -20 * (1 - p) + Math.sin((p + phaseOffset) * Math.PI * 2.4) * 8 * (1 - p * 0.35);
    x = Math.sin((p + phaseOffset) * Math.PI * 4.8) * 4 * (1 - p * 0.25);
  } else {
    const settle = (t - 0.62) / 0.38;
    const damp = (1 - Math.min(1, settle)) ** 2.4;
    const wave = (settle + phaseOffset) * Math.PI * 10;
    rotate = Math.sin(wave) * 3.5 * damp;
    x = Math.sin(wave + 0.9) * 2.5 * damp;
  }

  const scaleY = t < 0.68 ? 1 + (1 - t / 0.68) * 0.05 : t < 0.84 ? 0.9 + ((t - 0.68) / 0.16) * 0.12 : 1;
  const scaleX = t < 0.68 ? 1 + Math.sin(t * Math.PI * 3) * 0.03 : t < 0.84 ? 1.05 - ((t - 0.68) / 0.16) * 0.06 : 1;

  return { y, x, rotate, opacity, scaleY, scaleX };
}

function ConcurrentDropLine({
  text,
  dropReveal,
  reduceMotion,
}: {
  text: string;
  dropReveal: number;
  reduceMotion: boolean;
}) {
  const target = reduceMotion ? 1 : dropReveal;
  const [display, setDisplay] = useState(reduceMotion ? 1 : 0);
  const targetRef = useRef(target);
  targetRef.current = target;

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(1);
      return;
    }

    let raf = 0;
    const tick = () => {
      setDisplay((current) => {
        const goal = targetRef.current;
        const delta = goal - current;
        if (Math.abs(delta) < 0.004) return goal;
        return current + delta * 0.34;
      });
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion]);

  const { y, x, rotate, opacity, scaleY, scaleX } = reduceMotion
    ? { y: 0, x: 0, rotate: 0, opacity: display > 0.05 ? 1 : 0, scaleY: 1, scaleX: 1 }
    : dropTransform(display);

  return (
    <span className="rumik-story__title-drop-slot">
      <span
        className="rumik-story__title-drop"
        style={{
          opacity,
          transform: `translateY(${y}%) translateX(${x}px) rotate(${rotate}deg) scaleY(${scaleY}) scaleX(${scaleX})`,
        }}
      >
        {text}
      </span>
    </span>
  );
}

function ConcurrentFadeLine({
  text,
  fadeReveal,
  reduceMotion,
}: {
  text: string;
  fadeReveal: number;
  reduceMotion: boolean;
}) {
  const target = reduceMotion ? 1 : fadeReveal;
  const [display, setDisplay] = useState(reduceMotion ? 1 : 0);
  const targetRef = useRef(target);
  targetRef.current = target;

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(1);
      return;
    }

    let raf = 0;
    const tick = () => {
      setDisplay((current) => {
        const goal = targetRef.current;
        const delta = goal - current;
        if (Math.abs(delta) < 0.004) return goal;
        return current + delta * 0.36;
      });
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion]);

  return (
    <span style={{ opacity: display, transform: `translateY(${(1 - display) * 10}px)` }}>
      {text}
    </span>
  );
}

export function ConcurrentFeatureTitle({ story }: ConcurrentFeatureTitleProps) {
  const reduceMotion = usePrefersReducedMotion();
  const progress = featureBandProgress(story, "concurrent");
  const motionOff = !!reduceMotion;

  if (progress === null) {
    return (
      <h1 className="rumik-story__title rumik-story__title--concurrent">
        <span>no busy tone.</span>
        <span>ever.</span>
      </h1>
    );
  }

  const line1 = concurrentTitleLine1Reveal(progress, motionOff);
  const line2 = concurrentTitleLine2Reveal(progress, motionOff);

  return (
    <h1 className="rumik-story__title rumik-story__title--concurrent">
      <ConcurrentFadeLine text="no busy tone." fadeReveal={line1} reduceMotion={motionOff} />
      <ConcurrentDropLine text="ever." dropReveal={line2} reduceMotion={motionOff} />
    </h1>
  );
}
