"use client";

import type { CSSProperties, ReactNode } from "react";

import { HubTypingSubhead } from "@/components/site/hub-typing-subhead";
import { StoryBellIcon, STORY_GLYPH } from "@/components/site/story-stage-glyphs";
import {
  GRUNT_HUB_MODULES,
  GRUNT_MODULE_LABELS,
  GRUNT_MODULE_SIZE,
  GRUNT_MODULE_STATUS,
  GRUNT_PLUS_ARMS,
  GRUNT_ROUTE_BRANCHES,
  GRUNT_STAGE,
  GRUNT_STATUS,
  gruntModuleLetterLift,
  gruntModuleLetterOpacity,
  gruntOrbFlowPath,
  gruntOrbIconPosition,
  type GruntHubModuleId,
} from "@/lib/story/grunt-reveal";
import { cn } from "@/lib/utils";

const C = STORY_GLYPH;

/** Shared card chrome — keep in sync with ModuleShell. */
const HUB_CARD_CHROME_TOP = 22;
const HUB_LABEL_GAP = 15;
const HUB_LABEL_FONT_SIZE = 13;

function hubLabelPlacement(moduleId: GruntHubModuleId, halfW: number) {
  switch (moduleId) {
    case "schedule":
      return { x: halfW + 14, anchor: "start" as const };
    case "data":
      return { x: halfW + 8, anchor: "start" as const };
    default:
      return { x: 0, anchor: "middle" as const };
  }
}

function hubLabelOffsetY(moduleId: GruntHubModuleId, cardTop: number) {
  if (moduleId === "schedule") return cardTop + 10;
  return cardTop - HUB_LABEL_GAP;
}

function HubModuleLabelText({
  text,
  labelReveal,
  x,
  y,
  anchor,
  accent,
}: {
  text: string;
  labelReveal: number;
  x: number;
  y: number;
  anchor: "start" | "middle" | "end";
  accent: string;
}) {
  const charW = HUB_LABEL_FONT_SIZE * 0.58;
  const totalW = text.length * charW;
  const underlineX =
    anchor === "middle" ? -totalW / 2 - 4 : anchor === "end" ? x - totalW - 4 : x - 4;

  return (
    <>
      <text
        x={x}
        y={y}
        textAnchor={anchor}
        fill={C.cream}
        fontSize={HUB_LABEL_FONT_SIZE}
        fontWeight="700"
        letterSpacing="0.04em"
        className="grunt-scene__hub-label-text"
      >
        {text.split("").map((ch, i) => {
          const op = gruntModuleLetterOpacity(labelReveal, i, text.length);
          const lift = gruntModuleLetterLift(labelReveal, i, text.length);
          return (
            <tspan key={`${ch}-${i}`} opacity={op} dy={i === 0 ? lift : 0}>
              {ch}
            </tspan>
          );
        })}
      </text>
      <rect x={underlineX} y={y - 14} width={totalW + 8} height={2.5} rx="1" fill={accent} opacity={labelReveal * 0.35} />
    </>
  );
}
const HUB_SUBHEAD_Y = 56;

function hubCardTop(h: number) {
  return -h / 2 - HUB_CARD_CHROME_TOP;
}

type HubModuleTypingProps = {
  subheadTyping: (slot: number) => number;
  scrollPaused: boolean;
  reduceMotion?: boolean;
};

type ModuleShellProps = {
  moduleId: GruntHubModuleId;
  accent: string;
  focused?: boolean;
  hovered?: boolean;
  live?: boolean;
  onHoverChange?: (id: GruntHubModuleId | null) => void;
  children: ReactNode;
};

export function HubModuleFloatingLabel({
  moduleId,
  labelReveal,
  accent,
}: {
  moduleId: GruntHubModuleId;
  labelReveal: number;
  accent: string;
}) {
  const text = GRUNT_MODULE_LABELS[moduleId];
  const { w, h } = GRUNT_MODULE_SIZE[moduleId];
  const halfW = w / 2;
  const top = hubCardTop(h);
  const labelY = hubLabelOffsetY(moduleId, top);
  const placement = hubLabelPlacement(moduleId, halfW);

  return (
    <g transform={`translate(0 ${labelY})`} className="grunt-scene__hub-floating-label">
      <HubModuleLabelText text={text} labelReveal={labelReveal} x={placement.x} y={0} anchor={placement.anchor} accent={accent} />
    </g>
  );
}

function ModuleShell({ moduleId, accent, focused, hovered, live, onHoverChange, children }: ModuleShellProps) {
  const { w, h } = GRUNT_MODULE_SIZE[moduleId];
  const halfW = w / 2;
  const top = hubCardTop(h);
  const cardH = h + HUB_CARD_CHROME_TOP;
  const clipId = `grunt-hub-clip-${moduleId}`;
  const contentY = top + 12;

  return (
    <g
      className={cn(
        "grunt-scene__hub-card",
        live && "grunt-scene__hub-module--live",
        focused && "grunt-scene__hub-module--focus",
        hovered && "grunt-scene__hub-module--hover",
      )}
      filter="url(#gruntModuleShadow)"
      onPointerEnter={() => onHoverChange?.(moduleId)}
      onPointerLeave={() => onHoverChange?.(null)}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={-halfW + 3} y={-8} width={w - 6} height={cardH - 12} rx="10" />
        </clipPath>
      </defs>
      <rect
        x={-halfW - 10}
        y={top - 8}
        width={w + 20}
        height={cardH + 24}
        rx="14"
        className="grunt-scene__hub-hit"
      />
      {focused || hovered ? (
        <rect
          x={-halfW - 12}
          y={top - 10}
          width={w + 24}
          height={cardH + 36}
          rx="16"
          fill={accent}
          opacity={hovered ? 0.14 : 0.1}
          className="grunt-scene__hub-focus-glow"
        />
      ) : null}
      <rect x={-halfW - 2} y={top + cardH - 4} width={w + 4} height="8" rx="4" fill="rgba(0,0,0,0.35)" opacity="0.55" />
      <rect x={-halfW} y={top} width={w} height={cardH} rx="12" fill="url(#gruntModuleGlass)" stroke={accent} strokeWidth={focused || hovered ? 1.8 : 1.1} strokeOpacity={focused || hovered ? 0.7 : 0.35} />
      <rect x={-halfW + 1} y={top + 1} width={w - 2} height={cardH - 2} rx="11" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <g transform={`translate(0 ${contentY})`} clipPath={`url(#${clipId})`}>
        {children}
      </g>
    </g>
  );
}

export function HubGlyphCalendar({ scale = 1 }: { scale?: number }) {
  return (
    <g transform={`scale(${scale})`} className="grunt-scene__orb-glyph grunt-scene__orb-glyph--calendar">
      <rect x="-9" y="-10" width="18" height="16" rx="3" fill={C.ink} stroke={C.sky} strokeWidth="1.2" />
      <rect x="-7" y="-8" width="14" height="4" rx="1.5" fill={C.sky} opacity="0.9" />
      <rect x="-5" y="-2" width="5" height="4" rx="1" fill={C.sky} opacity="0.65" />
      <rect x="1" y="-2" width="5" height="4" rx="1" fill="rgba(255,255,255,0.15)" />
    </g>
  );
}

export function HubGlyphPencil({ scale = 1 }: { scale?: number }) {
  return (
    <g transform={`scale(${scale})`} className="grunt-scene__orb-glyph grunt-scene__orb-glyph--pencil">
      <path d="M-2 8 L8 -6 L10 -4 L0 10 Z" fill={C.amber} stroke={C.amber} strokeWidth="0.8" />
      <path d="M-2 8 L-4 10 L-1 11 L0 10 Z" fill="#e8c4b0" />
      <path d="M8 -6 L10 -4 L6 0 L4 -2 Z" fill={C.cream} opacity="0.85" />
    </g>
  );
}

export function HubGlyphChat({ scale = 1, live }: { scale?: number; live?: boolean }) {
  return (
    <g transform={`scale(${scale})`} className={cn("grunt-scene__orb-glyph grunt-scene__orb-glyph--chat", live && "grunt-scene__orb-glyph--live")}>
      <rect x="-12" y="-8" width="14" height="10" rx="3" fill={C.ink} stroke={C.mint} strokeWidth="1.1" />
      <path d="M-10 2 L-8 5 L-6 2" fill={C.ink} stroke={C.mint} strokeWidth="0.8" />
      <rect x="-2" y="-11" width="14" height="10" rx="3" fill={C.slate} stroke={C.mint} strokeWidth="1.1" opacity="0.95" />
      <path d="M0 -1 L2 2 L4 -1" fill="none" stroke={C.mint} strokeWidth="0.9" strokeLinecap="round" />
      <circle cx="8" cy="-9" r="2" fill={C.amber} opacity="0.85" />
    </g>
  );
}

export function HubGlyphRoute({ scale = 1, color = ROUTE_ACCENT }: { scale?: number; color?: string }) {
  return (
    <g transform={`scale(${scale})`} className="grunt-scene__orb-glyph grunt-scene__orb-glyph--route">
      <rect x="-5" y="-10" width="10" height="5.5" rx="2.75" fill={C.ink} stroke={color} strokeWidth="1.1" />
      <line x1="0" y1="-4.5" x2="0" y2="-1" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="0" cy="2" r="4" fill={C.ink} stroke={color} strokeWidth="1.2" />
      <circle cx="0" cy="2" r="1.5" fill={color} />
      <path d="M0 6 L-8 11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M0 6 L8 11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="-8" cy="11" r="2.2" fill={C.slate} stroke={color} strokeWidth="0.9" />
      <circle cx="8" cy="11" r="2.2" fill={C.slate} stroke={color} strokeWidth="0.9" />
    </g>
  );
}

export function HubOrbIconFlows({
  flows,
  reduceMotion,
}: {
  flows: { id: GruntHubModuleId; flow: number; arrived: number }[];
  reduceMotion: boolean;
}) {
  if (reduceMotion) return null;

  return (
    <g className="grunt-scene__orb-flows">
      {flows.map(({ id, flow, arrived }) => {
        const mod = GRUNT_HUB_MODULES.find((m) => m.id === id)!;
        const path = gruntOrbFlowPath(mod);
        const traveling = flow > 0.04 && arrived < 0.92;
        const pos = gruntOrbIconPosition(mod, flow);
        const glyph =
          id === "schedule" ? (
            <HubGlyphCalendar scale={1.45} />
          ) : id === "conversations" ? (
            <HubGlyphChat scale={1.4} live={flow > 0.3} />
          ) : id === "data" ? (
            <HubGlyphPencil scale={1.45} />
          ) : (
            <HubGlyphRoute scale={1.45} />
          );

        return (
          <g key={id}>
            <path d={path} fill="none" stroke={accentColor(mod.accent)} strokeWidth="1.4" strokeOpacity={0.18 + flow * 0.18} strokeDasharray="6 12" className="grunt-scene__orb-flow-path" />
            {traveling ? (
              <g transform={`translate(${pos.x} ${pos.y})`} className="grunt-scene__orb-flow-glyph" filter="url(#gruntOrbIconGlow)" opacity={0.85 + flow * 0.15}>
                {glyph}
              </g>
            ) : null}
          </g>
        );
      })}
    </g>
  );
}

const HUB_HERO_ICON_Y = 30;
const HUB_HERO_ICON_SCALE = { chat: 2.55, route: 2.45 } as const;
const ROUTE_ACCENT = C.violet;

function SettledModuleIcon({
  moduleId,
  arrived,
  live,
  x = 0,
  y: yOverride,
}: {
  moduleId: GruntHubModuleId;
  arrived: number;
  live: boolean;
  x?: number;
  y?: number;
}) {
  if (arrived < 0.12) return null;
  const isChat = moduleId === "conversations";
  const isRoute = moduleId === "route";
  const isHero = isChat || isRoute;
  const cardH = GRUNT_MODULE_SIZE[moduleId].h;
  const lift = cardH * 0.1;
  const glyphScale = isChat ? HUB_HERO_ICON_SCALE.chat : isRoute ? HUB_HERO_ICON_SCALE.route : 1.65;
  const y = yOverride ?? (isHero ? HUB_HERO_ICON_Y - lift * 0.25 : 4 - lift);
  const settleScale = 0.88 + arrived * 0.12;
  const iconClass = isChat
    ? "grunt-scene__hub-settled-icon grunt-scene__hub-settled-icon--chat"
    : isRoute
      ? "grunt-scene__hub-settled-icon grunt-scene__hub-settled-icon--route"
      : "grunt-scene__hub-settled-icon";

  return (
    <g
      transform={`translate(${x} ${y}) scale(${settleScale * glyphScale})`}
      opacity={isHero ? 0.45 + arrived * 0.55 : 0.35 + arrived * 0.65}
      className={iconClass}
    >
      {moduleId === "schedule" ? <HubGlyphCalendar scale={1} /> : null}
      {moduleId === "conversations" ? <HubGlyphChat scale={1} live={live} /> : null}
      {moduleId === "data" ? <HubGlyphPencil scale={1} /> : null}
      {moduleId === "route" ? <HubGlyphRoute scale={1} /> : null}
    </g>
  );
}

export function HubPlusArms({ opacity, sync }: { opacity: number; sync: number }) {
  const { orbX, orbY } = GRUNT_STAGE;
  const v = GRUNT_PLUS_ARMS.vertical;
  const h = GRUNT_PLUS_ARMS.horizontal;
  const glow = 0.14 + sync * 0.1;

  return (
    <g opacity={opacity} className="grunt-scene__hub-plus">
      <line x1={v.x} y1={v.y1} x2={v.x} y2={v.y2} stroke={C.mint} strokeWidth="12" strokeLinecap="round" strokeOpacity={glow * 0.32} />
      <line x1={h.x1} y1={h.y} x2={h.x2} y2={h.y} stroke={C.mint} strokeWidth="12" strokeLinecap="round" strokeOpacity={glow * 0.32} />
      <line x1={v.x} y1={v.y1} x2={v.x} y2={v.y2} stroke="url(#gruntPlusArmGrad)" strokeWidth="2" strokeLinecap="round" strokeOpacity={0.4 + sync * 0.22} className="grunt-scene__hub-plus-arm" />
      <line x1={h.x1} y1={h.y} x2={h.x2} y2={h.y} stroke="url(#gruntPlusArmGrad)" strokeWidth="2" strokeLinecap="round" strokeOpacity={0.4 + sync * 0.22} className="grunt-scene__hub-plus-arm" style={{ animationDelay: "0.6s" } as CSSProperties} />
      <circle cx={orbX} cy={orbY} r="14" fill={C.mint} fillOpacity={0.04 + sync * 0.04} className="grunt-scene__hub-plus-node" />
      <circle cx={v.x} cy={v.y1} r="4" fill={C.sky} fillOpacity={0.35} className="grunt-scene__hub-plus-node" />
      <circle cx={v.x} cy={v.y2} r="4" fill={C.amber} fillOpacity={0.35} className="grunt-scene__hub-plus-node" style={{ animationDelay: "0.3s" } as CSSProperties} />
      <circle cx={h.x1} cy={h.y} r="4" fill={ROUTE_ACCENT} fillOpacity={0.35} className="grunt-scene__hub-plus-node" style={{ animationDelay: "0.45s" } as CSSProperties} />
      <circle cx={h.x2} cy={h.y} r="4" fill={C.mint} fillOpacity={0.35} className="grunt-scene__hub-plus-node" style={{ animationDelay: "0.15s" } as CSSProperties} />
    </g>
  );
}

const SCHEDULE_SLOTS = ["9:00", "11:30", "2:15"] as const;
const SCHEDULE_ICON_X = -22;
const SCHEDULE_ICON_Y = 48;
const SCHEDULE_BARS_X = 12;
const SCHEDULE_BAR_W = 72;

export function ScheduleModule({
  fill,
  reminders,
  live,
  focused,
  hovered,
  labelReveal,
  iconArrived,
  bodyReveal,
  subheadTyping,
  scrollPaused,
  reduceMotion = false,
  onHoverChange,
}: {
  fill: number;
  reminders: number;
  live: boolean;
  focused?: boolean;
  hovered?: boolean;
  labelReveal: number;
  iconArrived: number;
  iconFlow?: number;
  bodyReveal: number;
  onHoverChange?: (id: GruntHubModuleId | null) => void;
} & HubModuleTypingProps) {
  const slotsOn = SCHEDULE_SLOTS.map((_, i) => fill > (i + 1) / (SCHEDULE_SLOTS.length + 1));
  const reminderOn = reminders > 0.35;

  return (
    <>
      <ModuleShell moduleId="schedule" accent={C.sky} focused={focused} hovered={hovered} live={live} onHoverChange={onHoverChange}>
        <SettledModuleIcon moduleId="schedule" arrived={iconArrived} live={live} x={SCHEDULE_ICON_X} y={SCHEDULE_ICON_Y} />
        <g transform={`translate(${SCHEDULE_BARS_X} ${HUB_SUBHEAD_Y + 4})`} opacity={bodyReveal} className="grunt-scene__hub-card-body">
        {SCHEDULE_SLOTS.map((time, i) => {
          const on = slotsOn[i];
          return (
            <g key={time} transform={`translate(0 ${i * 14})`} opacity={on ? 1 : 0.28}>
              <rect x="0" y="0" width={SCHEDULE_BAR_W} height="11" rx="3" fill={C.slate} stroke={C.sky} strokeWidth="0.8" strokeOpacity={on ? 0.55 : 0.2} />
              <rect
                x="2"
                y="2"
                width={on ? SCHEDULE_BAR_W - 4 : 18}
                height="7"
                rx="2"
                fill={C.sky}
                fillOpacity={on ? 0.55 : 0.12}
                className={on && live ? "grunt-scene__schedule-slot--snap" : undefined}
                style={{ animationDelay: `${i * 0.15}s` } as CSSProperties}
              />
              <text x={SCHEDULE_BAR_W - 4} y="8" textAnchor="end" fill={C.muted} fontSize="6.5" fontWeight="600" fontFamily="system-ui, sans-serif">
                {time}
              </text>
            </g>
          );
        })}
      </g>
      <g transform={`translate(${SCHEDULE_BARS_X} ${HUB_SUBHEAD_Y + 48})`} opacity={reminderOn ? 1 : 0.25}>
        <rect x="0" y="0" width={SCHEDULE_BAR_W} height="12" rx="3" fill={C.slate} stroke={C.amber} strokeWidth="0.8" strokeOpacity={reminderOn ? 0.55 : 0.2} />
        <g transform="translate(6 2) scale(0.55)">
          <StoryBellIcon ringing={live && reminderOn} />
        </g>
      </g>
        <HubTypingSubhead
          text="callback reminder"
          typingReveal={subheadTyping(1)}
          scrollPaused={scrollPaused}
          reduceMotion={reduceMotion}
          x={SCHEDULE_BARS_X + 2}
          y={HUB_SUBHEAD_Y + 56}
          anchor="start"
        />
      </ModuleShell>
      <HubModuleFloatingLabel moduleId="schedule" labelReveal={labelReveal} accent={C.sky} />
    </>
  );
}

export function ConversationsModule({
  queue,
  followUps,
  live,
  focused,
  hovered,
  labelReveal,
  iconArrived,
  bodyReveal,
  subheadTyping,
  scrollPaused,
  reduceMotion = false,
  onHoverChange,
}: {
  queue: number;
  followUps: number;
  live: boolean;
  focused?: boolean;
  hovered?: boolean;
  labelReveal: number;
  iconArrived: number;
  iconFlow?: number;
  bodyReveal: number;
  onHoverChange?: (id: GruntHubModuleId | null) => void;
} & HubModuleTypingProps) {
  const threadCount = Math.min(2, Math.ceil(followUps * 2));

  return (
    <>
      <HubModuleFloatingLabel moduleId="conversations" labelReveal={labelReveal} accent={C.mint} />
      <ModuleShell moduleId="conversations" accent={C.mint} focused={focused} hovered={hovered} live={live} onHoverChange={onHoverChange}>
        <SettledModuleIcon moduleId="conversations" arrived={iconArrived} live={live} />
        <HubTypingSubhead
          text="IN QUEUE"
          typingReveal={subheadTyping(0)}
          scrollPaused={scrollPaused}
          reduceMotion={reduceMotion}
          y={HUB_SUBHEAD_Y}
        />
        <g opacity={bodyReveal} className="grunt-scene__hub-card-body">
          <g transform={`translate(-52 ${HUB_SUBHEAD_Y + 8})`}>
            {[1, 2, 3].map((n) => {
              const waiting = n <= queue;
              return (
                <g key={n} transform={`translate(0 ${n * 12})`} opacity={waiting ? 1 : 0.22}>
                  <circle cx="8" cy="8" r="6" fill={C.slate} stroke={C.mint} strokeWidth="1.2" />
                  <text x="8" y="11" textAnchor="middle" fill={C.cream} fontSize="8" fontWeight="800" fontFamily="system-ui, sans-serif">
                    {n}
                  </text>
                  <rect x="20" y="4" width={36 - n * 4} height="3" rx="1.5" fill={C.mint} opacity={waiting ? 0.45 : 0.15} />
                </g>
              );
            })}
          </g>
        </g>
        <HubTypingSubhead
          text="open threads"
          typingReveal={subheadTyping(1)}
          scrollPaused={scrollPaused}
          reduceMotion={reduceMotion}
          y={HUB_SUBHEAD_Y + 38}
        />
        <g opacity={followUps > 0.2 ? 1 : 0.3} transform={`translate(0 ${HUB_SUBHEAD_Y + 46})`}>
          {Array.from({ length: threadCount }, (_, i) => (
            <g key={i} transform={`translate(-52 ${6 + i * 10})`} className={live ? "grunt-scene__hub-card--wait" : undefined} style={{ animationDelay: `${i * 0.2}s` } as CSSProperties}>
              <rect x="0" y="0" width="104" height="8" rx="3" fill={C.slate} stroke={C.mint} strokeWidth="0.6" strokeOpacity="0.45" />
              <rect x="4" y="3" width={48 - i * 8} height="2" rx="1" fill={C.muted} opacity="0.55" />
            </g>
          ))}
        </g>
      </ModuleShell>
    </>
  );
}

export function DataModule({
  fill,
  live,
  focused,
  hovered,
  labelReveal,
  iconArrived,
  bodyReveal,
  subheadTyping,
  scrollPaused,
  reduceMotion = false,
  onHoverChange,
}: {
  fill: number;
  live: boolean;
  focused?: boolean;
  hovered?: boolean;
  labelReveal: number;
  iconArrived: number;
  iconFlow?: number;
  bodyReveal: number;
  onHoverChange?: (id: GruntHubModuleId | null) => void;
} & HubModuleTypingProps) {
  const lines = Math.min(4, Math.floor(fill * 4.2));

  return (
    <>
      <HubModuleFloatingLabel moduleId="data" labelReveal={labelReveal} accent={C.amber} />
      <ModuleShell moduleId="data" accent={C.amber} focused={focused} hovered={hovered} live={live} onHoverChange={onHoverChange}>
        <SettledModuleIcon moduleId="data" arrived={iconArrived} live={live} />
        <HubTypingSubhead
          text="capture details"
          typingReveal={subheadTyping(0)}
          scrollPaused={scrollPaused}
          reduceMotion={reduceMotion}
          y={HUB_SUBHEAD_Y}
        />
        <g opacity={bodyReveal} className="grunt-scene__hub-card-body">
          <g transform={`translate(-48 ${HUB_SUBHEAD_Y + 8})`}>
            <rect x="0" y="0" width="44" height="54" rx="4" fill={C.slate} stroke={C.amber} strokeWidth="1.2" />
            <rect x="4" y="4" width="36" height="8" rx="2" fill={C.amber} fillOpacity="0.35" />
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x="6"
                y={16 + i * 9}
                width={i < lines ? 32 : 18}
                height="4"
                rx="2"
                fill={C.amber}
                opacity={i < lines ? 0.7 : 0.18}
                className={i === lines - 1 && live ? "grunt-scene__hub-typing-line" : undefined}
              />
            ))}
            {live && lines > 0 ? (
              <rect x={8 + (lines % 3) * 8} y={16 + (lines - 1) * 9} width="2" height="5" fill={C.cream} className="grunt-scene__form-cursor" />
            ) : null}
          </g>
          <g transform={`translate(8 ${HUB_SUBHEAD_Y + 4})`}>
            <ellipse cx="16" cy="48" rx="16" ry="4" fill="rgba(0,0,0,0.35)" />
            <rect x="4" y="16" width="24" height="32" rx="4" fill={C.slate} stroke={C.amber} strokeWidth="1.2" />
            <rect x="7" y="20" width="18" height="6" rx="2" fill={C.amber} fillOpacity={0.25 + fill * 0.55} />
            <rect x="7" y="30" width="18" height="6" rx="2" fill={C.amber} fillOpacity={0.15 + fill * 0.45} />
            <rect x="7" y="40" width="18" height="6" rx="2" fill={C.amber} fillOpacity={0.1 + fill * 0.35} />
          </g>
        </g>
      </ModuleShell>
    </>
  );
}

const ROUTE_SUBHEAD_Y = 6;
const ROUTE_DIAGRAM_Y = 14;
const ROUTE_ICON_Y = 53;

export function RouteModule({
  branches,
  live,
  focused,
  hovered,
  labelReveal,
  iconArrived,
  iconFlow = 0,
  bodyReveal,
  subheadTyping,
  scrollPaused,
  reduceMotion = false,
  onHoverChange,
}: {
  branches: number;
  live: boolean;
  focused?: boolean;
  hovered?: boolean;
  labelReveal: number;
  iconArrived: number;
  iconFlow?: number;
  bodyReveal: number;
  onHoverChange?: (id: GruntHubModuleId | null) => void;
} & HubModuleTypingProps) {
  const routeIconArrived = Math.max(iconArrived, iconFlow * 0.88);

  return (
    <>
      <HubModuleFloatingLabel moduleId="route" labelReveal={labelReveal} accent={ROUTE_ACCENT} />
      <ModuleShell moduleId="route" accent={ROUTE_ACCENT} focused={focused} hovered={hovered} live={live} onHoverChange={onHoverChange}>
        <HubTypingSubhead
          text="right department"
          typingReveal={subheadTyping(0)}
          scrollPaused={scrollPaused}
          reduceMotion={reduceMotion}
          y={ROUTE_SUBHEAD_Y}
        />
        <g opacity={bodyReveal} className="grunt-scene__hub-card-body" transform={`translate(0 ${ROUTE_DIAGRAM_Y})`}>
          <circle cx="0" cy="0" r="5" fill={C.ink} stroke={ROUTE_ACCENT} strokeWidth="1" opacity="0.85" />
          {GRUNT_ROUTE_BRANCHES.map((b, i) => {
            const active = i < branches;
            const rad = (b.angle * Math.PI) / 180;
            const len = 14;
            const ex = Math.cos(rad) * len;
            const ey = Math.sin(rad) * len;
            const branchColor = ["#b4a0ff", "#9b87f5", "#7c6cdf"][i]!;
            return (
              <g key={b.id} opacity={active ? 1 : 0.22}>
                <line
                  x1="0"
                  y1="0"
                  x2={ex}
                  y2={ey}
                  stroke={ROUTE_ACCENT}
                  strokeWidth="1.1"
                  strokeOpacity={active ? 0.65 : 0.25}
                  strokeDasharray="3 5"
                  className={active && live ? "grunt-scene__route-flow" : undefined}
                  style={{ animationDelay: `${i * 0.12}s` } as CSSProperties}
                />
                <rect x={ex - 10} y={ey - 6} width="20" height="10" rx="3" fill={C.slate} stroke={branchColor} strokeWidth="1" />
                <text x={ex} y={ey + 1} textAnchor="middle" fill={C.cream} fontSize="5" fontWeight="700" fontFamily="system-ui, sans-serif">
                  {b.label}
                </text>
                {active && live ? (
                  <circle r="2" fill={branchColor}>
                    <animateMotion dur={`${1.2 + i * 0.15}s`} repeatCount="indefinite" path={`M0 0 L${ex} ${ey}`} calcMode="linear" />
                  </circle>
                ) : null}
              </g>
            );
          })}
        </g>
        <SettledModuleIcon moduleId="route" arrived={routeIconArrived} live={live} y={ROUTE_ICON_Y} />
      </ModuleShell>
    </>
  );
}

export function HubHoverStatus({ moduleId }: { moduleId: GruntHubModuleId }) {
  return (
    <g transform={`translate(${GRUNT_STATUS.x} ${GRUNT_STATUS.y})`} className="grunt-scene__hover-status-wrap">
      <text fill={STORY_GLYPH.cream} fontSize="12" fontWeight="500" fontFamily="system-ui, sans-serif" className="grunt-scene__hover-status grunt-scene__status-text">
        {GRUNT_MODULE_STATUS[moduleId]}
      </text>
    </g>
  );
}

export function CircuitGrid({ opacity }: { opacity: number }) {
  const lines: string[] = [];
  for (let x = 80; x < 640; x += 48) lines.push(`M${x} 60 L${x} 380`);
  for (let y = 80; y < 360; y += 48) lines.push(`M60 ${y} L660 ${y}`);

  return (
    <g opacity={opacity * 0.1} className="grunt-scene__circuit-grid">
      {lines.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={C.mint} strokeWidth="0.5" />
      ))}
    </g>
  );
}

export function HubTendril({
  path,
  flow,
  opacity,
  color,
  live,
  focused,
  reduceMotion,
}: {
  path: string;
  flow: number;
  opacity: number;
  color: string;
  live: boolean;
  focused?: boolean;
  reduceMotion: boolean;
}) {
  if (opacity < 0.02) return null;

  const pulse = live && !reduceMotion;
  const cadence = `${2.6 - flow * 0.8}s`;

  return (
    <g opacity={opacity} className="grunt-scene__hub-tendril">
      <path d={path} fill="none" stroke={color} strokeWidth={focused ? 10 : 7} strokeOpacity={focused ? 0.1 : 0.06} strokeLinecap="round" filter="url(#gruntTendrilBlur)" />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={focused ? 1.6 : 1.1}
        strokeOpacity={0.38 + flow * 0.4 + (focused ? 0.12 : 0)}
        strokeLinecap="round"
        strokeDasharray="8 18"
        className={pulse ? "grunt-scene__tendril--live" : undefined}
        style={pulse ? ({ "--grunt-atc-cadence": cadence } as CSSProperties) : undefined}
      />
    </g>
  );
}

export function accentColor(accent: "mint" | "sky" | "amber" | "violet") {
  return { mint: C.mint, sky: C.sky, amber: C.amber, violet: C.violet }[accent];
}
