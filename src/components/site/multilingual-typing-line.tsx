"use client";

import { useEffect, useRef, useState } from "react";

type MultilingualTypingLineProps = {
  text: string;
  typingReveal: number;
  scrollPaused: boolean;
  reduceMotion?: boolean;
  x?: number;
  y?: number;
  anchor?: "start" | "middle" | "end";
  fill?: string;
  fillOpacity?: number;
  fontSize?: number;
  fontWeight?: number;
  letterSpacing?: string;
  className?: string;
  cursorClassName?: string;
};

const CHAR_W_SCALE = 0.62;

export function MultilingualTypingLine({
  text,
  typingReveal,
  scrollPaused,
  reduceMotion = false,
  x = 0,
  y = 0,
  anchor = "start",
  fill = "#f5f2eb",
  fillOpacity = 0.85,
  fontSize = 11,
  fontWeight = 700,
  letterSpacing = "0.02em",
  className,
  cursorClassName = "multilingual-scene__cursor",
}: MultilingualTypingLineProps) {
  const target = reduceMotion ? 1 : typingReveal;
  const [display, setDisplay] = useState(0);
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
          return Math.min(goal, current + 0.05);
        }
        const delta = goal - current;
        if (Math.abs(delta) < 0.004) return goal;
        return current + delta * 0.4;
      });
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scrollPaused, reduceMotion]);

  const len = text.length;
  const charW = fontSize * CHAR_W_SCALE;
  const totalW = len * charW;
  const typedUnits = display * len;
  const fullCount = Math.min(len, Math.floor(typedUnits));
  const frac = fullCount < len ? typedUnits - fullCount : 0;
  const typedW = typedUnits * charW;
  const incomplete = display < 0.995;
  const showCursor = !reduceMotion && display > 0.02 && (incomplete || scrollPaused);

  const cursorX =
    anchor === "middle" ? -totalW / 2 + typedW + 1.5 : anchor === "start" ? x + typedW + 1.5 : x - typedW - 1.5;

  return (
    <g className={className}>
      <text
        x={x}
        y={y}
        textAnchor={anchor}
        fill={fill}
        fillOpacity={fillOpacity}
        fontSize={fontSize}
        fontWeight={fontWeight}
        fontFamily="system-ui, sans-serif"
        letterSpacing={letterSpacing}
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
          y={y - fontSize + 2}
          width={1.4}
          height={fontSize + 1}
          rx={0.3}
          fill={fill}
          fillOpacity={0.9}
          className={scrollPaused ? cursorClassName : `${cursorClassName} multilingual-scene__cursor--solid`}
        />
      ) : null}
    </g>
  );
}
