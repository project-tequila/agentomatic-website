"use client";

import { STORY_GLYPH } from "@/components/site/story-stage-glyphs";
import { useScrollTypingDisplay } from "@/lib/story/use-scroll-typing-display";

const C = STORY_GLYPH;

const SUBHEAD_FONT_SIZE = 8;
const SUBHEAD_CHAR_W = SUBHEAD_FONT_SIZE * 0.64;

export function HubTypingSubhead({
  text,
  typingReveal,
  scrollPaused,
  reduceMotion = false,
  y = 56,
  x = 0,
  anchor = "middle",
}: {
  text: string;
  typingReveal: number;
  scrollPaused: boolean;
  reduceMotion?: boolean;
  y?: number;
  x?: number;
  anchor?: "start" | "middle" | "end";
}) {
  const display = useScrollTypingDisplay(typingReveal, scrollPaused, reduceMotion, {
    pausedStep: 0.045,
    lerp: 0.42,
  });

  const len = text.length;
  const totalW = len * SUBHEAD_CHAR_W;
  const typedUnits = display * len;
  const fullCount = Math.min(len, Math.floor(typedUnits));
  const frac = fullCount < len ? typedUnits - fullCount : 0;
  const typedW = typedUnits * SUBHEAD_CHAR_W;
  const incomplete = display < 0.995;
  const showCursor = !reduceMotion && display > 0.02 && (incomplete || scrollPaused);

  const cursorX =
    anchor === "middle" ? -totalW / 2 + typedW + 1.5 : anchor === "start" ? x + typedW + 1.5 : x - typedW - 1.5;

  return (
    <g className="grunt-scene__hub-typing-subhead-wrap">
      <text
        x={x}
        y={y}
        textAnchor={anchor}
        fill={C.cream}
        fillOpacity={0.72}
        fontSize={SUBHEAD_FONT_SIZE}
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
        letterSpacing="0.08em"
        className="grunt-scene__hub-subhead grunt-scene__hub-typing-subhead"
      >
        {text.split("").map((ch, i) => {
          let op = 0;
          if (i < fullCount) op = 1;
          else if (i === fullCount) op = frac;
          return (
            <tspan key={`${ch}-${i}`} opacity={op}>
              {ch}
            </tspan>
          );
        })}
      </text>
      {showCursor ? (
        <rect
          x={cursorX}
          y={y - 7}
          width={1.6}
          height={8}
          rx={0.4}
          fill={C.cream}
          className={scrollPaused ? "grunt-scene__hub-subhead-cursor" : "grunt-scene__hub-subhead-cursor grunt-scene__hub-subhead-cursor--solid"}
        />
      ) : null}
    </g>
  );
}
