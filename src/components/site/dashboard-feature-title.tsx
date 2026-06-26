"use client";

import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";
import { useScrollTypingDisplay } from "@/lib/story/use-scroll-typing-display";

import { featureBandProgress } from "@/lib/story/feature-band-progress";
import { dashboardTitleDropReveal } from "@/lib/story/dashboard-reveal";

type DashboardFeatureTitleProps = {
  story: number;
};

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

function DashboardDropLine({
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
  const display = useScrollTypingDisplay(dropReveal, false, reduceMotion, { lerp: 0.34 });

  const { y, x, rotate, opacity, scaleY, scaleX } = reduceMotion
    ? { y: 0, x: 0, rotate: 0, opacity: display > 0.05 ? 1 : 0, scaleY: 1, scaleX: 1 }
    : dropTransform(display, phaseOffset);

  return (
    <span className="rumik-story__title-drop-slot dashboard-title__drop-slot">
      <span
        className="rumik-story__title-drop dashboard-title__drop"
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

export function DashboardFeatureTitle({ story }: DashboardFeatureTitleProps) {
  const reduceMotion = usePrefersReducedMotion();
  const progress = featureBandProgress(story, "dashboard");
  const motionOff = !!reduceMotion;

  if (progress === null) {
    return (
      <h1 className="rumik-story__title rumik-story__title--dashboard">
        <span>your ops</span>
        <span>command center.</span>
      </h1>
    );
  }

  const line1Drop = dashboardTitleDropReveal(progress, 0, motionOff);
  const line2Drop = dashboardTitleDropReveal(progress, 1, motionOff);

  return (
    <h1 className="rumik-story__title rumik-story__title--dashboard">
      <DashboardDropLine text="your ops" dropReveal={line1Drop} reduceMotion={motionOff} phaseOffset={0} />
      <DashboardDropLine text="command center." dropReveal={line2Drop} reduceMotion={motionOff} phaseOffset={0.14} />
    </h1>
  );
}
