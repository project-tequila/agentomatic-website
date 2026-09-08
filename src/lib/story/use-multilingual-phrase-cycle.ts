"use client";

import { useEffect, useState } from "react";

import { MULTILINGUAL_LANGUAGES, type MultilingualLanguage } from "./multilingual-languages.ts";

/** Type the line, let it sit, then fade — unhurried enough to read the script. */
const TYPE_MS = 2200;
const HOLD_MS = 2600;
const FADE_MS = 700;
const CYCLE_MS = TYPE_MS + HOLD_MS + FADE_MS;

export type MultilingualPhraseCycle = {
  lang: MultilingualLanguage;
  typingReveal: number;
  opacity: number;
};

function cycleAt(elapsed: number, reduceMotion: boolean): MultilingualPhraseCycle {
  const count = MULTILINGUAL_LANGUAGES.length;
  const fallback = MULTILINGUAL_LANGUAGES[0]!;
  if (reduceMotion || count === 0) {
    return { lang: fallback, typingReveal: 1, opacity: 1 };
  }

  const index = Math.floor(elapsed / CYCLE_MS) % count;
  const local = elapsed % CYCLE_MS;
  let typingReveal = 1;
  let fadeOut = 0;
  if (local < TYPE_MS) typingReveal = local / TYPE_MS;
  else if (local > TYPE_MS + HOLD_MS) fadeOut = (local - TYPE_MS - HOLD_MS) / FADE_MS;

  return {
    lang: MULTILINGUAL_LANGUAGES[index]!,
    typingReveal,
    opacity: 1 - fadeOut,
  };
}

function sameCycle(a: MultilingualPhraseCycle, b: MultilingualPhraseCycle) {
  return (
    a.lang.id === b.lang.id &&
    Math.round(a.typingReveal * 24) === Math.round(b.typingReveal * 24) &&
    Math.round(a.opacity * 16) === Math.round(b.opacity * 16)
  );
}

export function useMultilingualPhraseCycle(active: boolean, reduceMotion = false): MultilingualPhraseCycle {
  const [cycle, setCycle] = useState<MultilingualPhraseCycle>(() => cycleAt(0, reduceMotion));

  useEffect(() => {
    if (!active) return;
    if (reduceMotion) {
      queueMicrotask(() => setCycle(cycleAt(0, true)));
      return;
    }

    const started = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const next = cycleAt(now - started, false);
      setCycle((current) => (sameCycle(current, next) ? current : next));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduceMotion]);

  return cycle;
}
