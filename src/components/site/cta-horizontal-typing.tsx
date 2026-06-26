"use client";

import { useStoryScrollPaused } from "@/lib/story/use-story-scroll-paused";
import { useScrollTypingDisplay } from "@/lib/story/use-scroll-typing-display";
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
  const display = useScrollTypingDisplay(typingReveal, scrollPaused, reduceMotion);

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
