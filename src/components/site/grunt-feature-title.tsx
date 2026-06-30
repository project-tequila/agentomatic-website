"use client";

import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";
import { useScrollTypingDisplay } from "@/lib/story/use-scroll-typing-display";

import { act1BeatProgress } from "@/lib/story/act1-band-progress";
import {
  gruntTitleHandledReveal,
  gruntTitlePhraseTypingReveal,
  gruntTitleStrikeReveal,
} from "@/lib/story/grunt-reveal";
import { useStoryScrollPaused } from "@/lib/story/use-story-scroll-paused";

const PHRASE = "the grunt work.";

/** Hand-drawn marker path — wavy, left to right. */
const MARKER_PATH = "M2 15 C 48 11, 92 17, 138 13 S 228 11, 292 15 S 352 17, 398 13";

type GruntFeatureTitleProps = {
  story: number;
};

function GruntPhraseTyping({
  typingReveal,
  scrollPaused,
  reduceMotion,
}: {
  typingReveal: number;
  scrollPaused: boolean;
  reduceMotion: boolean;
}) {
  const display = useScrollTypingDisplay(typingReveal, scrollPaused, reduceMotion, {
    pausedStep: 0.042,
    lerp: 0.38,
  });

  const len = PHRASE.length;
  const typedUnits = display * len;
  const fullCount = Math.min(len, Math.floor(typedUnits));
  const frac = fullCount < len ? typedUnits - fullCount : 0;
  const incomplete = display < 0.995;
  const showCursor = !reduceMotion && incomplete && display > 0.02;

  if (reduceMotion || display < 0.12 || display > 0.88) {
    return <span className="grunt-title__phrase">{PHRASE}</span>;
  }

  return (
    <span className="grunt-title__phrase grunt-title__phrase--typing">
      {PHRASE.slice(0, fullCount).split("").map((ch, i) => (
        <span key={`${ch}-${i}`}>{ch}</span>
      ))}
      {fullCount < len ? (
        <span key={`partial-${fullCount}`} style={{ opacity: frac }}>
          {PHRASE[fullCount]}
        </span>
      ) : null}
      {showCursor ? <span className="grunt-title__cursor" aria-hidden /> : null}
    </span>
  );
}

function GruntMarkerStrike({ strikeReveal }: { strikeReveal: number }) {
  return (
    <svg className="grunt-title__marker" viewBox="0 0 400 24" preserveAspectRatio="none" aria-hidden>
      <path
        className="grunt-title__marker-bleed"
        d={MARKER_PATH}
        fill="none"
        stroke="#0a0b0d"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.22 * strikeReveal}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - strikeReveal}
      />
      <path
        className="grunt-title__marker-stroke"
        d={MARKER_PATH}
        fill="none"
        stroke="#0a0b0d"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.92 * strikeReveal}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - strikeReveal}
      />
    </svg>
  );
}

function GruntHandled({ handledReveal }: { handledReveal: number }) {
  const t = handledReveal;
  const y = -155 + t * 155;
  const scaleY = 1 + (1 - t) * 0.08;
  const opacity = Math.min(1, t * 1.35);

  return (
    <span className="rumik-story__title-drop-slot grunt-title__handled-slot">
      <span
        className="rumik-story__title-drop grunt-title__handled"
        style={{
          opacity,
          transform: `translateY(${y}%) scaleY(${scaleY}) scaleX(${1 + (1 - t) * 0.04})`,
        }}
      >
        handled
      </span>
    </span>
  );
}

export function GruntFeatureTitle({ story }: GruntFeatureTitleProps) {
  const reduceMotion = usePrefersReducedMotion();
  const progress = act1BeatProgress(story, "grunt");
  const scrollPaused = useStoryScrollPaused(progress ?? 0, 120);
  const motionOff = !!reduceMotion;

  if (progress === null) {
    return (
      <h2 className="rumik-story__title rumik-story__title--grunt">
        <span className="grunt-title__phrase-wrap">
          <span className="grunt-title__phrase">{PHRASE}</span>
        </span>
        <span className="grunt-title__handled grunt-title__handled--static">handled</span>
      </h2>
    );
  }

  const typingReveal = gruntTitlePhraseTypingReveal(progress, motionOff);
  const strikeReveal = gruntTitleStrikeReveal(progress, motionOff);
  const handledReveal = gruntTitleHandledReveal(progress, motionOff);

  return (
    <h2 className="rumik-story__title rumik-story__title--grunt">
      <span className="grunt-title__phrase-wrap">
        <GruntPhraseTyping
          typingReveal={typingReveal}
          scrollPaused={scrollPaused}
          reduceMotion={motionOff}
        />
        <GruntMarkerStrike strikeReveal={strikeReveal} />
      </span>
      <GruntHandled handledReveal={handledReveal} />
    </h2>
  );
}
