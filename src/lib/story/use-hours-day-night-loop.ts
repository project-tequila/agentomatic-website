"use client";

import { useEffect, useRef, useState } from "react";

import {
  hoursBandProgress,
  hoursDayNightMixFromProgress,
  type HoursDayNightMix,
} from "./hours-day-night";

/** One unhurried day→night→day while the 24/7 slide is held. */
const CYCLE_MS = 22000;

type LoopListener = (progress: number) => void;

const listeners = new Set<LoopListener>();
let raf = 0;
let originMs = 0;

function wrappedProgress(now: number) {
  const t = (now - originMs) / CYCLE_MS;
  return t - Math.floor(t);
}

function tick(now: number) {
  const progress = wrappedProgress(now);
  listeners.forEach((listener) => listener(progress));
  raf = requestAnimationFrame(tick);
}

function subscribeHoursDayNightLoop(seed: number, listener: LoopListener) {
  if (listeners.size === 0) {
    originMs = performance.now() - seed * CYCLE_MS;
    raf = requestAnimationFrame(tick);
  }
  listeners.add(listener);
  listener(wrappedProgress(performance.now()));
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
}

export function useHoursDayNightMix(story: number, reduceMotion = false): HoursDayNightMix | null {
  const inHours = hoursBandProgress(story) !== null;
  const storyRef = useRef(story);
  storyRef.current = story;

  const [mix, setMix] = useState<HoursDayNightMix | null>(() => {
    const progress = hoursBandProgress(story);
    return progress === null ? null : hoursDayNightMixFromProgress(progress);
  });

  useEffect(() => {
    if (!inHours) {
      queueMicrotask(() => setMix(null));
      return;
    }

    const seed = hoursBandProgress(storyRef.current) ?? 0;
    if (reduceMotion) {
      queueMicrotask(() => setMix(hoursDayNightMixFromProgress(seed)));
      return;
    }

    return subscribeHoursDayNightLoop(seed, (progress) => {
      setMix(hoursDayNightMixFromProgress(progress));
    });
  }, [inHours, reduceMotion]);

  return mix;
}
