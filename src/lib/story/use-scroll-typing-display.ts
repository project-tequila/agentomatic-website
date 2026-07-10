"use client";

import { useEffect, useRef, useState } from "react";

type ScrollTypingOptions = {
  /** Easing toward scroll target while the user is moving. */
  lerp?: number;
  /** Character cadence while scroll is paused. */
  pausedStep?: number;
  /** Finish cadence when the scroll target is nearly complete. */
  completeStep?: number;
};

function prefersCoarsePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

/**
 * Smooth 0–1 typing reveal. Uses a stable RAF loop (refs for target + pause)
 * so iOS touch scroll does not restart the animator every frame.
 */
export function useScrollTypingDisplay(
  typingReveal: number,
  scrollPaused: boolean,
  reduceMotion = false,
  options: ScrollTypingOptions = {},
): number {
  const target = reduceMotion ? 1 : typingReveal;
  const [display, setDisplay] = useState(reduceMotion ? 1 : 0);
  const targetRef = useRef(target);
  const pausedRef = useRef(scrollPaused);
  const reduceMotionRef = useRef(reduceMotion);
  const coarseRef = useRef(false);

  const lerp = options.lerp ?? 0.38;
  const pausedStep = options.pausedStep ?? 0.04;
  const completeStep = options.completeStep ?? 0.025;

  useEffect(() => {
    coarseRef.current = prefersCoarsePointer();
  }, []);

  useEffect(() => {
    targetRef.current = target;
    pausedRef.current = scrollPaused;
    reduceMotionRef.current = reduceMotion;
  }, [target, scrollPaused, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) {
      queueMicrotask(() => setDisplay(1));
      return;
    }

    let raf = 0;
    const tick = () => {
      setDisplay((current) => {
        if (reduceMotionRef.current) return 1;

        const goal = targetRef.current;
        const paused = pausedRef.current;
        const coarse = coarseRef.current;
        const activeLerp = coarse ? Math.max(lerp, 0.58) : lerp;

        if (paused && current < goal) {
          return Math.min(goal, current + pausedStep);
        }
        if (paused && current < 1 && goal >= 0.98) {
          return Math.min(1, current + completeStep);
        }

        // On touch, bind tightly to scroll so scrubbing reveals text immediately.
        if (coarse && !paused && goal > current + 0.08) {
          return Math.min(goal, current + Math.max(activeLerp, 0.72) * (goal - current));
        }

        const delta = goal - current;
        if (Math.abs(delta) < 0.004) return goal;
        return current + delta * activeLerp;
      });
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion, lerp, pausedStep, completeStep]);

  return reduceMotion ? 1 : display;
}
