"use client";

import type { ReactNode } from "react";

import { STORY_GLYPH } from "@/components/site/story-stage-glyphs";
import {
  GRUNT_MODULE_LABELS,
  GRUNT_MODULE_SIZE,
  GRUNT_MODULE_STATUS,
  GRUNT_PLUS_ARMS,
  GRUNT_STAGE,
  GRUNT_STATUS,
  gruntModuleLetterLift,
  gruntModuleLetterOpacity,
  type GruntHubModuleId,
} from "@/lib/story/grunt-reveal";
import { cn } from "@/lib/utils";

const C = STORY_GLYPH;

/** Label sits below icon — unified placement for all hub modules. */
const HUB_LABEL_GAP_BELOW = 44;
const HUB_LABEL_FONT_SIZE = 13;
/** Icon center Y — unchanged from prior card-body center so arm positions stay stable. */
const HUB_ICON_CENTER_Y = -11;
const HUB_ORB_GLYPH_SIZE = 30;

function hubLabelOffsetY() {
  return HUB_ICON_CENTER_Y + HUB_LABEL_GAP_BELOW;
}

function HubModuleLabelText({
  text,
  labelReveal,
  x,
  y,
  anchor,
}: {
  text: string;
  labelReveal: number;
  x: number;
  y: number;
  anchor: "start" | "middle" | "end";
}) {
  return (
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
  );
}
type ModuleShellProps = {
  moduleId: GruntHubModuleId;
  accent: string;
  focused?: boolean;
  hovered?: boolean;
  live?: boolean;
  onHoverChange?: (id: GruntHubModuleId | null) => void;
  magX?: number;
  magY?: number;
  setMagRef?: (node: SVGGElement | null) => void;
  children: ReactNode;
};

export function HubModuleFloatingLabel({
  moduleId,
  labelReveal,
}: {
  moduleId: GruntHubModuleId;
  labelReveal: number;
}) {
  const text = GRUNT_MODULE_LABELS[moduleId];
  const labelY = hubLabelOffsetY();

  return (
    <g transform={`translate(0 ${labelY})`} className="grunt-scene__hub-floating-label">
      <HubModuleLabelText text={text} labelReveal={labelReveal} x={0} y={0} anchor="middle" />
    </g>
  );
}

function ModuleShell({
  moduleId,
  accent,
  focused,
  hovered,
  live,
  onHoverChange,
  magX = 0,
  magY = 0,
  setMagRef,
  children,
}: ModuleShellProps) {
  const { w, h } = GRUNT_MODULE_SIZE[moduleId];
  const halfW = w / 2;
  const halfH = h / 2;

  return (
    <g
      className={cn(
        "grunt-scene__hub-card",
        live && "grunt-scene__hub-module--live",
        focused && "grunt-scene__hub-module--focus",
        hovered && "grunt-scene__hub-module--hover",
      )}
      onPointerEnter={() => onHoverChange?.(moduleId)}
      onPointerLeave={() => onHoverChange?.(null)}
    >
      <rect
        x={-halfW - 12}
        y={-halfH - 12}
        width={w + 24}
        height={h + 24}
        rx="14"
        className="grunt-scene__hub-hit"
      />
      {hovered ? (
        <ellipse
          cx={0}
          cy={HUB_ICON_CENTER_Y}
          rx={halfW * 0.72}
          ry={halfH * 0.72}
          fill={accent}
          opacity={0.16}
          className="grunt-scene__hub-focus-glow"
        />
      ) : null}
      <g transform={`translate(0 ${HUB_ICON_CENTER_Y})`}>
        {setMagRef ? (
          <g
            ref={setMagRef}
            transform={`translate(${magX} ${magY})`}
            className="concurrent-scene__phone-magnetic"
          >
            {children}
          </g>
        ) : (
          children
        )}
      </g>
    </g>
  );
}

const ROUTE_ACCENT = C.violet;
/** Settled hub icons — single scale for all modules (25% smaller than prior 3.0). */
const HUB_SETTLED_ICON_SCALE = 2.25;
const HUB_MODULE_VISUAL_SCALE: Record<GruntHubModuleId, number> = {
  schedule: 1,
  conversations: 1,
  data: 0.86,
  /** call-routing.png is full-bleed; inset others ~22–28% — match their on-screen size. */
  route: 0.78,
};

/** Custom art assets — used for both in-flight orb icons and settled card icons on all layouts. */
const GRUNT_MODULE_ICONS = {
  schedule: "/story/grunt/scheduling.gif",
  conversations: "/story/grunt/conversations.gif",
  data: "/story/grunt/data-entry.png",
  route: "/story/grunt/call-routing.png",
} as const;

function HubModuleArtIcon({
  src,
  scale = 1,
  className,
  size = 22,
}: {
  src: string;
  scale?: number;
  className?: string;
  size?: number;
}) {
  const half = size / 2;
  return (
    <g transform={`scale(${scale})`} className={className}>
      <image
        href={src}
        x={-half}
        y={-half}
        width={size}
        height={size}
        preserveAspectRatio="xMidYMid meet"
        className="grunt-scene__module-art-icon"
      />
    </g>
  );
}

export function HubGlyphCalendar({ scale = 1 }: { scale?: number }) {
  return (
    <HubModuleArtIcon
      src={GRUNT_MODULE_ICONS.schedule}
      scale={scale}
      className="grunt-scene__orb-glyph grunt-scene__orb-glyph--calendar"
      size={HUB_ORB_GLYPH_SIZE}
    />
  );
}

export function HubGlyphPencil({ scale = 1 }: { scale?: number }) {
  return (
    <HubModuleArtIcon
      src={GRUNT_MODULE_ICONS.data}
      scale={scale}
      className="grunt-scene__orb-glyph grunt-scene__orb-glyph--pencil"
      size={HUB_ORB_GLYPH_SIZE}
    />
  );
}

export function HubGlyphChat({ scale = 1, live }: { scale?: number; live?: boolean }) {
  return (
    <HubModuleArtIcon
      src={GRUNT_MODULE_ICONS.conversations}
      scale={scale}
      className={cn("grunt-scene__orb-glyph grunt-scene__orb-glyph--chat", live && "grunt-scene__orb-glyph--live")}
      size={HUB_ORB_GLYPH_SIZE}
    />
  );
}

export function HubGlyphRoute({ scale = 1, color: _color = ROUTE_ACCENT }: { scale?: number; color?: string }) {
  return (
    <HubModuleArtIcon
      src={GRUNT_MODULE_ICONS.route}
      scale={scale}
      className="grunt-scene__orb-glyph grunt-scene__orb-glyph--route"
      size={HUB_ORB_GLYPH_SIZE}
    />
  );
}

/** Minimal static backdrop — no pulsing dots or animated rings. */
export function GruntStaticBackdrop({ opacity }: { opacity: number }) {
  const { width, height } = GRUNT_STAGE;
  const { vertical, horizontal } = GRUNT_PLUS_ARMS;

  return (
    <g opacity={opacity * 0.42} className="grunt-scene__static-backdrop">
      <rect x="0" y="0" width={width} height={height} fill="url(#gruntStaticWash)" />
      <line
        x1={vertical.x}
        y1={vertical.y1}
        x2={vertical.x}
        y2={vertical.y2}
        stroke={C.mint}
        strokeWidth="0.6"
        strokeOpacity="0.035"
      />
      <line
        x1={horizontal.x1}
        y1={horizontal.y}
        x2={horizontal.x2}
        y2={horizontal.y}
        stroke={C.mint}
        strokeWidth="0.6"
        strokeOpacity="0.035"
      />
    </g>
  );
}

function SettledModuleIcon({
  moduleId,
  arrived,
  live,
}: {
  moduleId: GruntHubModuleId;
  arrived: number;
  live: boolean;
}) {
  if (arrived < 0.04) return null;
  const isChat = moduleId === "conversations";
  const isRoute = moduleId === "route";
  const isSchedule = moduleId === "schedule";
  const isData = moduleId === "data";
  const visualScale = HUB_MODULE_VISUAL_SCALE[moduleId];
  const settleScale = 0.78 + arrived * 0.22;
  const iconClass = isChat
    ? "grunt-scene__hub-settled-icon grunt-scene__hub-settled-icon--chat"
    : isRoute
      ? "grunt-scene__hub-settled-icon grunt-scene__hub-settled-icon--route"
      : isSchedule
        ? "grunt-scene__hub-settled-icon grunt-scene__hub-settled-icon--schedule"
        : isData
          ? "grunt-scene__hub-settled-icon grunt-scene__hub-settled-icon--data"
          : "grunt-scene__hub-settled-icon";

  return (
    <g transform={`scale(${settleScale * HUB_SETTLED_ICON_SCALE * visualScale})`} opacity={arrived} className={iconClass}>
      {moduleId === "schedule" ? <HubGlyphCalendar scale={1} /> : null}
      {moduleId === "conversations" ? <HubGlyphChat scale={1} live={live} /> : null}
      {moduleId === "data" ? <HubGlyphPencil scale={1} /> : null}
      {moduleId === "route" ? <HubGlyphRoute scale={1} /> : null}
    </g>
  );
}

type HubModuleCardProps = {
  live: boolean;
  focused?: boolean;
  hovered?: boolean;
  labelReveal: number;
  iconArrived: number;
  onHoverChange?: (id: GruntHubModuleId | null) => void;
  magX?: number;
  magY?: number;
  setMagRef?: (node: SVGGElement | null) => void;
};

export function ScheduleModule({
  live,
  focused,
  hovered,
  labelReveal,
  iconArrived,
  onHoverChange,
  magX,
  magY,
  setMagRef,
}: HubModuleCardProps) {
  return (
    <>
      <ModuleShell
        moduleId="schedule"
        accent={C.sky}
        focused={focused}
        hovered={hovered}
        live={live}
        onHoverChange={onHoverChange}
        magX={magX}
        magY={magY}
        setMagRef={setMagRef}
      >
        <SettledModuleIcon moduleId="schedule" arrived={iconArrived} live={live} />
      </ModuleShell>
      <HubModuleFloatingLabel moduleId="schedule" labelReveal={labelReveal} />
    </>
  );
}

export function ConversationsModule({
  live,
  focused,
  hovered,
  labelReveal,
  iconArrived,
  onHoverChange,
  magX,
  magY,
  setMagRef,
}: HubModuleCardProps) {
  return (
    <>
      <ModuleShell
        moduleId="conversations"
        accent={C.mint}
        focused={focused}
        hovered={hovered}
        live={live}
        onHoverChange={onHoverChange}
        magX={magX}
        magY={magY}
        setMagRef={setMagRef}
      >
        <SettledModuleIcon moduleId="conversations" arrived={iconArrived} live={live} />
      </ModuleShell>
      <HubModuleFloatingLabel moduleId="conversations" labelReveal={labelReveal} />
    </>
  );
}

export function DataModule({
  live,
  focused,
  hovered,
  labelReveal,
  iconArrived,
  onHoverChange,
  magX,
  magY,
  setMagRef,
}: HubModuleCardProps) {
  return (
    <>
      <ModuleShell
        moduleId="data"
        accent={C.amber}
        focused={focused}
        hovered={hovered}
        live={live}
        onHoverChange={onHoverChange}
        magX={magX}
        magY={magY}
        setMagRef={setMagRef}
      >
        <SettledModuleIcon moduleId="data" arrived={iconArrived} live={live} />
      </ModuleShell>
      <HubModuleFloatingLabel moduleId="data" labelReveal={labelReveal} />
    </>
  );
}

export function RouteModule({
  live,
  focused,
  hovered,
  labelReveal,
  iconArrived,
  onHoverChange,
  magX,
  magY,
  setMagRef,
}: HubModuleCardProps) {
  return (
    <>
      <ModuleShell
        moduleId="route"
        accent={ROUTE_ACCENT}
        focused={focused}
        hovered={hovered}
        live={live}
        onHoverChange={onHoverChange}
        magX={magX}
        magY={magY}
        setMagRef={setMagRef}
      >
        <SettledModuleIcon moduleId="route" arrived={iconArrived} live={live} />
      </ModuleShell>
      <HubModuleFloatingLabel moduleId="route" labelReveal={labelReveal} />
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

export function HubTendril({
  path,
  opacity,
  color,
  accent,
  focused,
  reduceMotion,
  compact = false,
}: {
  path: string;
  opacity: number;
  color: string;
  accent: "mint" | "sky" | "amber" | "violet";
  focused?: boolean;
  reduceMotion?: boolean;
  compact?: boolean;
}) {
  if (opacity < 0.02) return null;

  const bloomW = compact ? (focused ? 11 : 8) : focused ? 17 : 13;
  const midW = compact ? (focused ? 4 : 3) : focused ? 6 : 5;
  const coreW = compact ? (focused ? 1.4 : 1.1) : focused ? 1.8 : 1.4;

  return (
    <g opacity={opacity} className={cn("grunt-scene__hub-tendril", `grunt-scene__hub-tendril--${accent}`)}>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={bloomW}
        strokeOpacity={focused ? 0.18 : 0.13}
        strokeLinecap="round"
        filter={`url(#gruntTendrilGlow-${accent})`}
      />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={midW}
        strokeOpacity={focused ? 0.27 : 0.20}
        strokeLinecap="round"
        filter="url(#gruntTendrilBlur)"
      />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={coreW}
        strokeOpacity={focused ? 0.64 : 0.50}
        strokeLinecap="round"
        strokeDasharray={compact ? "6 10" : "10 16"}
        filter={`url(#gruntTendrilCore-${accent})`}
        className={cn(
          "grunt-scene__hub-tendril-dash",
          reduceMotion && "grunt-scene__hub-tendril-dash--static",
        )}
      />
    </g>
  );
}

export function accentColor(accent: "mint" | "sky" | "amber" | "violet") {
  return { mint: C.mint, sky: C.sky, amber: C.amber, violet: C.violet }[accent];
}
