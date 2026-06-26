"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";

import { featureBandProgress } from "@/lib/story/feature-band-progress";
import { remindersTitleDropReveal } from "@/lib/story/reminders-reveal";

type RemindersFeatureTitleProps = {
  story: number;
};

/** Drop + tumble + damped vibration until straight. */
function dropTransform(t: number, phaseOffset = 0) {
  if (t <= 0) {
    return { y: -220, x: 0, rotate: -22, opacity: 0, scaleY: 1, scaleX: 1 };
  }

  const opacity = Math.min(1, t * 2.4);
  let y = -220;
  if (t < 0.68) {
    y = -220 + (t / 0.68) * (220 + 12);
  } else if (t < 0.84) {
    y = 12 - ((t - 0.68) / 0.16) * 15;
  } else {
    y = -3 + ((t - 0.84) / 0.16) * 3;
  }

  let x = 0;
  let rotate = 0;

  if (t < 0.62) {
    const p = t / 0.62;
    rotate = -26 * (1 - p) + Math.sin((p + phaseOffset) * Math.PI * 2.8) * 10 * (1 - p * 0.35);
    x = Math.sin((p + phaseOffset) * Math.PI * 5.2) * 5 * (1 - p * 0.25);
  } else {
    const settle = (t - 0.62) / 0.38;
    const damp = (1 - Math.min(1, settle)) ** 2.4;
    const wave = (settle + phaseOffset) * Math.PI * 12;
    rotate = Math.sin(wave) * 4.2 * damp;
    x = Math.sin(wave + 0.9) * 3.2 * damp;
    y += Math.sin(wave + 1.6) * 1.8 * damp;
  }

  const scaleY = t < 0.68 ? 1 + (1 - t / 0.68) * 0.05 : t < 0.84 ? 0.9 + ((t - 0.68) / 0.16) * 0.12 : 1;
  const scaleX = t < 0.68 ? 1 + Math.sin(t * Math.PI * 3) * 0.03 : t < 0.84 ? 1.05 - ((t - 0.68) / 0.16) * 0.06 : 1;

  return { y, x, rotate, opacity, scaleY, scaleX };
}

function RemindersDropLine({
  text,
  dropReveal,
  reduceMotion,
  phaseOffset = 0,
}: {
  text: string;
  dropReveal: number;
  reduceMotion: boolean;
  phaseOffset?: number;
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
    : dropTransform(display, phaseOffset);

  return (
    <span className="rumik-story__title-drop-slot reminders-title__drop-slot">
      <span
        className="rumik-story__title-drop reminders-title__drop"
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

export function RemindersFeatureTitle({ story }: RemindersFeatureTitleProps) {
  const reduceMotion = usePrefersReducedMotion();
  const progress = featureBandProgress(story, "reminders");
  const motionOff = !!reduceMotion;

  if (progress === null) {
    return (
      <h1 className="rumik-story__title rumik-story__title--reminders">
        <span>smart</span>
        <span>reminders.</span>
      </h1>
    );
  }

  const smartDrop = remindersTitleDropReveal(progress, 0, motionOff);
  const remindersDrop = remindersTitleDropReveal(progress, 1, motionOff);

  return (
    <h1 className="rumik-story__title rumik-story__title--reminders">
      <RemindersDropLine text="smart" dropReveal={smartDrop} reduceMotion={motionOff} phaseOffset={0} />
      <RemindersDropLine text="reminders." dropReveal={remindersDrop} reduceMotion={motionOff} phaseOffset={0.14} />
    </h1>
  );
}
