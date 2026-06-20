"use client";

import { CtaHorizontalTyping } from "@/components/site/cta-horizontal-typing";
import { cn } from "@/lib/utils";

type StoryBodyTypingProps = {
  text: string;
  typingReveal: number;
  scrollSignal: number;
  reduceMotion?: boolean;
  className?: string;
};

export function StoryBodyTyping({
  text,
  typingReveal,
  scrollSignal,
  reduceMotion = false,
  className,
}: StoryBodyTypingProps) {
  return (
    <CtaHorizontalTyping
      text={text}
      typingReveal={typingReveal}
      scrollSignal={scrollSignal}
      reduceMotion={reduceMotion}
      showCursor={typingReveal > 0.02 && typingReveal < 0.995}
      blinkWhenComplete={false}
      className={cn("story-body-typing", className)}
    />
  );
}
