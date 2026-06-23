"use client";

import { CALL_THEME } from "@/lib/story/concurrent-reveal";
import { cn } from "@/lib/utils";

export const STORY_GLYPH = {
  cream: "#f5f2eb",
  mint: CALL_THEME.inbound.color,
  amber: CALL_THEME.outbound.color,
  sky: "#74c0fc",
  violet: "#9b87f5",
  rose: "#f783ac",
  slate: "#2b303b",
  muted: "rgba(245,242,235,0.48)",
  ink: "#1c1f26",
} as const;

type LiveProps = {
  live?: boolean;
  className?: string;
};

/** Inbound caller phone — shared across handoff, reminders, etc. */
export function StoryCallerPhone({
  live,
  className,
  showSignal = true,
  screenIcon = "handset",
}: LiveProps & { showSignal?: boolean; screenIcon?: "handset" | "infinity" }) {
  const C = STORY_GLYPH;

  return (
    <g className={cn(live && "story-glyph__caller--live", className)}>
      <circle r="34" fill="rgba(140,255,210,0.08)" />
      <circle r="34" fill="none" stroke={C.mint} strokeWidth="1" opacity="0.35" strokeDasharray="4 6" />
      <rect x="-16" y="-28" width="32" height="56" rx="8" fill={C.ink} stroke={C.mint} strokeWidth="1.8" />
      <rect x="-12" y="-22" width="24" height="38" rx="4" fill={C.slate} opacity="0.9" />
      <circle cx="0" cy="-26" r="1.2" fill={C.mint} opacity="0.8" />
      {screenIcon === "infinity" ? (
        <path
          d="M-8 0 C-8 -4.5 -3 -5.5 0 -2.5 C3 -5.5 8 -4.5 8 0 C8 4.5 3 5.5 0 2.5 C-3 5.5 -8 4.5 -8 0 Z"
          fill="none"
          stroke={C.mint}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M-5 -4 C-5 -9 5 -9 5 -4 C5 2 -3 4 -3 9 L3 9 C3 4 -5 2 -5 -4 Z"
          fill="none"
          stroke={C.mint}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      )}
      {showSignal ? (
        <>
          <path d="M-18 -8 L-24 -2" stroke={C.mint} strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          <path d="M18 6 L24 12" stroke={C.amber} strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
        </>
      ) : null}
    </g>
  );
}

type StoryCalendarProps = LiveProps & {
  booked?: number;
  prominent?: boolean;
  glowFilter?: string;
};

/** Calendar node — shared visual language across story scenes. */
export function StoryCalendarIcon({ live, className, booked = 0, prominent = false, glowFilter }: StoryCalendarProps) {
  const C = STORY_GLYPH;
  const outerR = prominent ? 46 : 38;
  const bodyW = prominent ? 44 : 36;
  const bodyH = prominent ? 40 : 34;

  return (
    <g className={cn(live && "story-glyph__calendar--live", className)}>
      <circle r={outerR + 6} fill="rgba(116,192,252,0.12)" opacity={0.55 + booked * 0.45} />
      <circle
        r={outerR}
        fill="none"
        stroke={C.sky}
        strokeWidth={prominent ? 2 : 1.4}
        opacity={0.35 + booked * 0.4}
        strokeDasharray="6 8"
        className={live ? "story-glyph__calendar-ring" : undefined}
      />
      {glowFilter ? <circle r={outerR - 4} fill="rgba(116,192,252,0.08)" filter={glowFilter} /> : null}
      <rect
        x={-bodyW / 2}
        y={-bodyH / 2 - 4}
        width={bodyW}
        height={bodyH}
        rx="7"
        fill={C.ink}
        stroke={C.sky}
        strokeWidth={prominent ? 2.4 : 1.8}
      />
      <rect x={-bodyW / 2 + 4} y={-bodyH / 2} width={bodyW - 8} height="10" rx="2.5" fill={C.sky} opacity="0.95" />
      {[-10, 0, 10].map((x) => (
        <line key={x} x1={x} y1={-8} x2={x} y2={12} stroke={C.muted} strokeWidth="1.2" />
      ))}
      <rect x={-12} y={2} width="10" height="7" rx="2" fill={C.sky} opacity={0.75 + booked * 0.25} />
      <rect x="2" y={2} width="10" height="7" rx="2" fill="rgba(245,242,235,0.22)" />
      {booked > 0.35 ? (
        <>
          <circle cx={bodyW / 2 - 6} cy={-bodyH / 2 + 2} r="7" fill={C.amber} opacity={0.55 + booked * 0.45} />
          <path
            d={`M${bodyW / 2 - 9} ${-bodyH / 2 + 2} L${bodyW / 2 - 6.5} ${-bodyH / 2 + 4.5} L${bodyW / 2 - 2} ${-bodyH / 2}`}
            fill="none"
            stroke={C.ink}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={booked}
          />
        </>
      ) : null}
    </g>
  );
}

type StoryHumanProps = LiveProps & {
  scale?: number;
  ringOpacity?: number;
};

/** Team member bust — shared handoff / human-transfer scenes. */
export function StoryHumanAgent({ live, className, scale = 1, ringOpacity = 0 }: StoryHumanProps) {
  const C = STORY_GLYPH;

  return (
    <g transform={`scale(${scale})`} className={cn(live && "story-glyph__human--live", className)}>
      <circle
        r="46"
        fill="none"
        stroke={C.rose}
        strokeWidth="1.6"
        opacity={0.15 + ringOpacity * 0.45}
        className={live ? "story-glyph__human-ring" : undefined}
      />
      <circle r="38" fill="none" stroke={C.cream} strokeWidth="1" opacity={0.12 + ringOpacity * 0.35} />
      <path d="M-30 42 Q-30 28 -14 24 L14 24 Q30 28 30 42 Q0 36 -30 42 Z" fill={C.slate} opacity="0.95" />
      <path d="M-16 24 L-8 32 L8 32 L16 24 Q0 28 -16 24 Z" fill={C.cream} opacity="0.88" />
      <rect x="-7" y="14" width="14" height="12" rx="4" fill="#d4a88a" />
      <ellipse cx="0" cy="-2" rx="21" ry="25" fill="#e8c4b0" />
      <path d="M-20 2 C-20 -18 20 -18 20 2 C14 -4 0 -8 -14 -4 C-18 -2 -20 0 -20 2 Z" fill={C.ink} opacity="0.92" />
      <ellipse cx="-8" cy="-2" rx="2.2" ry="2.8" fill={C.ink} opacity="0.72" />
      <ellipse cx="8" cy="-2" rx="2.2" ry="2.8" fill={C.ink} opacity="0.72" />
      <path d="M-7 8 Q0 13 7 8" fill="none" stroke="#b88468" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M-22 -6 C-22 -24 22 -24 22 -6" fill="none" stroke={C.mint} strokeWidth="2.2" strokeLinecap="round" />
      <rect x="-24" y="-8" width="8" height="14" rx="3" fill={C.ink} stroke={C.mint} strokeWidth="1.2" />
      <rect x="16" y="-8" width="8" height="14" rx="3" fill={C.ink} stroke={C.mint} strokeWidth="1.2" />
      <path d="M16 -1 L24 4 L24 10" fill="none" stroke={C.mint} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="24" cy="11" r="2.2" fill={C.mint} opacity="0.85" />
      <circle cx="22" cy="-24" r="10" fill="rgba(18,20,24,0.92)" stroke={C.mint} strokeWidth="1.3" />
      <path d="M18 -24 L21 -21 L27 -27" fill="none" stroke={C.mint} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

type StoryBellProps = LiveProps & {
  scale?: number;
  ringing?: boolean;
};

export function StoryBellIcon({ ringing, className, scale = 1 }: StoryBellProps) {
  const C = STORY_GLYPH;

  return (
    <g transform={`scale(${scale})`} className={cn(ringing && "story-glyph__bell--ring", className)}>
      <circle r="18" fill="rgba(255,200,87,0.14)" />
      <circle r="18" fill="none" stroke={C.amber} strokeWidth="1.2" opacity="0.45" />
      <path
        d="M-7 -2 C-7 -10 7 -10 7 -2 C7 4 10 6 10 10 L-10 10 C-10 6 -7 4 -7 -2 Z"
        fill="none"
        stroke={C.amber}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M-4 10 C-4 13 4 13 4 10" fill="none" stroke={C.amber} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="9" cy="-8" r="2.2" fill={C.amber} opacity="0.9" />
    </g>
  );
}

/** Booking card — bars only, no labels. */
export function StoryBookingCard({ fillProgress = 1, className }: { fillProgress?: number; className?: string }) {
  const C = STORY_GLYPH;

  return (
    <g className={className}>
      <rect x="0" y="0" width="108" height="52" rx="6" fill={C.slate} stroke={C.sky} strokeWidth="1.6" />
      <rect x="12" y="14" width="56" height="5" rx="2" fill={C.sky} opacity="0.55" />
      <rect x="12" y="26" width={72 * fillProgress} height="5" rx="2" fill={C.muted} />
      <rect x="12" y="36" width={52 * fillProgress} height="5" rx="2" fill="rgba(245,242,235,0.22)" />
      <circle cx="94" cy="14" r="5" fill={C.amber} opacity={0.55 + fillProgress * 0.4} />
    </g>
  );
}
