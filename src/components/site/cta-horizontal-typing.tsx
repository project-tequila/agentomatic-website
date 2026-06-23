"use client";

import { useEffect, useRef, useState } from "react";

import { useStoryScrollPaused } from "@/lib/story/use-story-scroll-paused";
import { cn } from "@/lib/utils";

type CtaHorizontalTypingProps = {
  text: string;
  typingReveal: number;
  scrollSignal: number;
  reduceMotion?: boolean;
  showCursor?: boolean;
  blinkWhenComplete?: boolean;
  className?: string;
};

export function CtaHorizontalTyping({
  text,
  typingReveal,
  scrollSignal,
  reduceMotion = false,
  showCursor = true,
  blinkWhenComplete = true,
  className,
}: CtaHorizontalTypingProps) {
  const scrollPaused = useStoryScrollPaused(scrollSignal, 120);
  const target = reduceMotion ? 1 : typingReveal;
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
        if (scrollPaused && current < goal) {
          return Math.min(goal, current + 0.04);
        }
        if (scrollPaused && current < 1 && goal >= 0.98) {
          return Math.min(1, current + 0.025);
        }
        const delta = goal - current;
        if (Math.abs(delta) < 0.004) return goal;
        return current + delta * 0.38;
      });
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scrollPaused, reduceMotion]);

  const len = text.length;
  const typedUnits = display * len;
  const fullCount = Math.min(len, Math.floor(typedUnits));
  const frac = fullCount < len ? typedUnits - fullCount : 0;
  const incomplete = display < 0.995;
  const complete = display >= 0.995;

  const cursorVisible =
    showCursor &&
    !reduceMotion &&
    display > 0.02 &&
    (incomplete || (blinkWhenComplete && complete));

  const cursorBlink = incomplete ? scrollPaused : blinkWhenComplete && complete;

  return (
    <span className={cn("cta-typing", className)}>
      {text.slice(0, fullCount).split("").map((ch, i) => (
        <span key={`${ch}-${i}`}>{ch}</span>
      ))}
      {fullCount < len ? (
        <span key={`partial-${fullCount}`} style={{ opacity: frac }}>
          {text[fullCount]}
        </span>
      ) : null}
      {cursorVisible ? (
        <span
          className={cn("cta-typing__cursor", cursorBlink && "cta-typing__cursor--blink")}
          aria-hidden
        />
      ) : null}
    </span>
  );
}
