"use client";

import { useReducedMotion } from "framer-motion";

import { MultilingualTypingLine } from "@/components/site/multilingual-typing-line";
import { featureBandProgress } from "@/lib/story/feature-band-progress";
import {
  MULTILINGUAL_CARD,
  MULTILINGUAL_LANGUAGES,
  multilingualBadgeReveal,
  multilingualCardReveal,
  multilingualCycleDots,
  multilingualLanguageSegment,
  multilingualLinkReveal,
  multilingualOrbPath,
  multilingualSubheadTypingReveal,
  multilingualTickerOffset,
} from "@/lib/story/multilingual-reveal";
import { useStoryScrollPaused } from "@/lib/story/use-story-scroll-paused";
import { STORY_STAGE_PRESERVE, STORY_SATELLITE_ICON_SCALE, storyStageViewBox } from "@/lib/story/persistent-orb";
import { cn } from "@/lib/utils";

type MultilingualSceneProps = {
  story: number;
  opacity: number;
};

const C = {
  cream: "#f5f2eb",
  slate: "#2b303b",
  ink: "#1c1f26",
  muted: "rgba(245,242,235,0.42)",
  mint: "#8cffd2",
};

export function MultilingualScene({ story, opacity: sceneOpacity }: MultilingualSceneProps) {
  const reduceMotion = useReducedMotion();
  const progress = featureBandProgress(story, "multilingual");
  const scrollPaused = useStoryScrollPaused(progress ?? 0, 120);
  const rm = !!reduceMotion;

  if (progress === null || sceneOpacity < 0.02) return null;

  const cardReveal = multilingualCardReveal(progress);
  const linkReveal = multilingualLinkReveal(progress);
  const badgeReveal = multilingualBadgeReveal(progress);
  const segment = multilingualLanguageSegment(progress, rm);
  const subheadTyping = multilingualSubheadTypingReveal(progress, rm);
  const tickerT = multilingualTickerOffset(progress);
  const dots = multilingualCycleDots(progress, rm);
  const orbPath = multilingualOrbPath();
  const { x: cardX, y: cardY, width: cardW, height: cardH } = MULTILINGUAL_CARD;

  const tickerLabels = MULTILINGUAL_LANGUAGES.map((l) => l.label).join("   ·   ");
  const tickerShift = tickerT * (tickerLabels.length * 4.2);

  const scriptSize = segment.lang.script.length > 10 ? 18 : segment.lang.script.length > 8 ? 20 : segment.lang.script.length > 5 ? 24 : 28;
  const dotSpan = cardW - 36;
  const dotStep = dots.length > 1 ? dotSpan / (dots.length - 1) : 0;

  return (
    <svg
      viewBox={storyStageViewBox()}
      preserveAspectRatio={STORY_STAGE_PRESERVE}
      className="multilingual-scene"
      aria-hidden
      style={{ opacity: sceneOpacity }}
    >
      <defs>
        <linearGradient id="multilingualGlass" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#252930" />
          <stop offset="100%" stopColor="#14171e" />
        </linearGradient>
        <linearGradient id="multilingualLinkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={C.mint} stopOpacity="0.55" />
          <stop offset="100%" stopColor={C.mint} stopOpacity="0.12" />
        </linearGradient>
        <clipPath id="multilingualTickerClip">
          <rect x={16} y={cardH - 36} width={cardW - 32} height={22} rx={6} />
        </clipPath>
      </defs>

      <g opacity={linkReveal}>
        <path
          d={orbPath}
          fill="none"
          stroke="url(#multilingualLinkGrad)"
          strokeWidth="1.6"
          strokeDasharray="5 9"
          className={rm ? undefined : "multilingual-scene__link"}
        />
        {!rm ? (
          <circle r="3" fill={C.mint} opacity="0.75">
            <animateMotion dur="2.6s" repeatCount="indefinite" path={orbPath} calcMode="linear" />
          </circle>
        ) : null}
      </g>

      <g
        transform={`translate(${cardX + cardW / 2} ${cardY + cardH / 2}) scale(${STORY_SATELLITE_ICON_SCALE}) translate(${-cardW / 2} ${-cardH / 2})`}
        opacity={cardReveal}
        className="multilingual-scene__card-wrap"
      >
        <rect
          x={0}
          y={0}
          width={cardW}
          height={cardH}
          rx={12}
          fill="url(#multilingualGlass)"
          stroke="rgba(245,242,235,0.1)"
          strokeWidth={1}
          className={cn(!rm && cardReveal > 0.5 && "multilingual-scene__card")}
        />
        <rect
          x={1}
          y={1}
          width={cardW - 2}
          height={cardH - 2}
          rx={11}
          fill="none"
          stroke={segment.lang.color}
          strokeWidth={1}
          strokeOpacity={0.22 + segment.typingReveal * 0.18}
        />

        <g opacity={badgeReveal}>
          <rect x={cardW - 78} y={12} width={62} height={20} rx={6} fill="rgba(140,255,210,0.08)" stroke="rgba(140,255,210,0.28)" strokeWidth={0.8} />
          <text x={cardW - 70} y={25} fill={C.mint} fontSize="9" fontWeight="700" fontFamily="system-ui, sans-serif">
            32+ langs
          </text>
        </g>

        <text x={18} y={28} fill={C.muted} fontSize="8" fontWeight="600" fontFamily="system-ui, sans-serif" letterSpacing="0.14em">
          DETECTED LANGUAGE
        </text>

        <rect
          x={14}
          y={40}
          width={cardW - 28}
          height={96}
          rx={10}
          fill={C.slate}
          stroke={segment.lang.color}
          strokeWidth={1}
          strokeOpacity={0.35 + segment.typingReveal * 0.25}
          className={cn(!rm && "multilingual-scene__hero-panel")}
        />

        <MultilingualTypingLine
          text={segment.lang.label}
          typingReveal={Math.min(1, segment.typingReveal * 1.4)}
          scrollPaused={scrollPaused}
          reduceMotion={rm}
          x={26}
          y={62}
          anchor="start"
          fill={segment.lang.color}
          fillOpacity={0.92}
          fontSize={11}
          fontWeight={700}
        />

        <MultilingualTypingLine
          text={segment.lang.script}
          typingReveal={segment.typingReveal}
          scrollPaused={scrollPaused}
          reduceMotion={rm}
          x={26}
          y={62 + scriptSize + 8}
          anchor="start"
          fill={C.cream}
          fillOpacity={0.95}
          fontSize={scriptSize}
          fontWeight={700}
          className={cn(!rm && "multilingual-scene__script")}
        />

        <MultilingualTypingLine
          text="responding natively"
          typingReveal={subheadTyping}
          scrollPaused={scrollPaused}
          reduceMotion={rm}
          x={26}
          y={118}
          anchor="start"
          fill={C.muted}
          fillOpacity={0.85}
          fontSize={9}
          fontWeight={600}
          letterSpacing="0.06em"
        />

        <g transform={`translate(18 ${cardH - 28})`}>
          {dots.map((dot, i) => (
            <circle
              key={dot.id}
              cx={i * dotStep}
              cy={0}
              r={dot.active ? 2 : 1.2}
              fill={dot.active ? segment.lang.color : C.muted}
              opacity={dot.opacity * cardReveal}
            />
          ))}
        </g>

        <g clipPath="url(#multilingualTickerClip)">
          <text
            x={18 - tickerShift}
            y={cardH - 18}
            fill={C.muted}
            fontSize="8.5"
            fontWeight="500"
            fontFamily="system-ui, sans-serif"
            className={cn(!rm && "multilingual-scene__ticker")}
          >
            {tickerLabels}
            {"   ·   "}
            {tickerLabels}
          </text>
        </g>
      </g>
    </svg>
  );
}
