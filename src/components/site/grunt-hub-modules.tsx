"use client";

import type { CSSProperties, ReactNode } from "react";

import { STORY_GLYPH } from "@/components/site/story-stage-glyphs";
import {
  GRUNT_HUB_MODULES,
  GRUNT_MODULE_RADIUS,
  GRUNT_MODULE_LABELS,
  GRUNT_MODULE_SIZE,
  GRUNT_MODULE_STATUS,
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
function hubCardTop(h: number) {
  return -h / 2 - HUB_CARD_CHROME_TOP;
}

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
  /** Origin for children — geometric center of the glass card (works at every cardScale). */
  const centerY = top + cardH / 2;

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
          <rect x={-halfW + 3} y={-cardH / 2 + 4} width={w - 6} height={cardH - 8} rx="10" />
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
      <g transform={`translate(0 ${centerY})`} clipPath={`url(#${clipId})`}>
        {children}
      </g>
    </g>
  );
}

const ROUTE_ACCENT = C.violet;
/** Settled card icons — large enough to read, centered at ModuleShell origin. */
const HUB_SETTLED_ICON_SCALE = { schedule: 2.35, chat: 2.5, data: 2.35, route: 2.45 } as const;

/** Custom art assets — used for both in-flight orb icons and settled card icons on all layouts. */
const GRUNT_MODULE_ICONS = {
  schedule: "/story/grunt/scheduling.png",
  conversations: "/story/grunt/conversations.png",
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
      size={24}
    />
  );
}

export function HubGlyphPencil({ scale = 1 }: { scale?: number }) {
  return (
    <HubModuleArtIcon
      src={GRUNT_MODULE_ICONS.data}
      scale={scale}
      className="grunt-scene__orb-glyph grunt-scene__orb-glyph--pencil"
      size={24}
    />
  );
}

export function HubGlyphChat({ scale = 1, live }: { scale?: number; live?: boolean }) {
  return (
    <HubModuleArtIcon
      src={GRUNT_MODULE_ICONS.conversations}
      scale={scale}
      className={cn("grunt-scene__orb-glyph grunt-scene__orb-glyph--chat", live && "grunt-scene__orb-glyph--live")}
      size={24}
    />
  );
}

export function HubGlyphRoute({ scale = 1, color: _color = ROUTE_ACCENT }: { scale?: number; color?: string }) {
  return (
    <HubModuleArtIcon
      src={GRUNT_MODULE_ICONS.route}
      scale={scale}
      className="grunt-scene__orb-glyph grunt-scene__orb-glyph--route"
      size={24}
    />
  );
}

export function HubOrbIconFlows({
  flows,
  reduceMotion,
  modules = GRUNT_HUB_MODULES,
  moduleRadius = GRUNT_MODULE_RADIUS,
}: {
  flows: { id: GruntHubModuleId; flow: number; arrived: number }[];
  reduceMotion: boolean;
  modules?: typeof GRUNT_HUB_MODULES;
  moduleRadius?: number;
}) {
  if (reduceMotion) return null;

  return (
    <g className="grunt-scene__orb-flows">
      {flows.map(({ id, flow, arrived }) => {
        const mod = modules.find((m) => m.id === id)!;
        const path = gruntOrbFlowPath(mod, moduleRadius);
        const traveling = flow > 0.04 && arrived < 0.92;
        const pos = gruntOrbIconPosition(mod, flow, moduleRadius);
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
              <g transform={`translate(${pos.x} ${pos.y})`} className="grunt-scene__orb-flow-glyph" opacity={0.9 + flow * 0.1}>
                {glyph}
              </g>
            ) : null}
          </g>
        );
      })}
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
  if (arrived < 0.12) return null;
  const isChat = moduleId === "conversations";
  const isRoute = moduleId === "route";
  const glyphScale =
    moduleId === "conversations"
      ? HUB_SETTLED_ICON_SCALE.chat
      : moduleId === "route"
        ? HUB_SETTLED_ICON_SCALE.route
        : moduleId === "schedule"
          ? HUB_SETTLED_ICON_SCALE.schedule
          : HUB_SETTLED_ICON_SCALE.data;
  const settleScale = 0.88 + arrived * 0.12;
  const iconClass = isChat
    ? "grunt-scene__hub-settled-icon grunt-scene__hub-settled-icon--chat"
    : isRoute
      ? "grunt-scene__hub-settled-icon grunt-scene__hub-settled-icon--route"
      : "grunt-scene__hub-settled-icon";

  return (
    <g
      transform={`scale(${settleScale * glyphScale})`}
      opacity={0.55 + arrived * 0.45}
      className={iconClass}
    >
      {moduleId === "schedule" ? <HubGlyphCalendar scale={1} /> : null}
      {moduleId === "conversations" ? <HubGlyphChat scale={1} live={live} /> : null}
      {moduleId === "data" ? <HubGlyphPencil scale={1} /> : null}
      {moduleId === "route" ? <HubGlyphRoute scale={1} /> : null}
    </g>
  );
}

export function HubPlusArms({
  opacity,
  sync,
  moduleRadius = GRUNT_MODULE_RADIUS,
}: {
  opacity: number;
  sync: number;
  moduleRadius?: number;
}) {
  const { orbX, orbY } = GRUNT_STAGE;
  const v = { x: orbX, y1: orbY - moduleRadius, y2: orbY + moduleRadius };
  const h = { y: orbY, x1: orbX - moduleRadius, x2: orbX + moduleRadius };
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

type HubModuleCardProps = {
  live: boolean;
  focused?: boolean;
  hovered?: boolean;
  labelReveal: number;
  iconArrived: number;
  iconFlow?: number;
  onHoverChange?: (id: GruntHubModuleId | null) => void;
};

export function ScheduleModule({
  live,
  focused,
  hovered,
  labelReveal,
  iconArrived,
  onHoverChange,
}: HubModuleCardProps) {
  return (
    <>
      <ModuleShell moduleId="schedule" accent={C.sky} focused={focused} hovered={hovered} live={live} onHoverChange={onHoverChange}>
        <SettledModuleIcon moduleId="schedule" arrived={iconArrived} live={live} />
      </ModuleShell>
      <HubModuleFloatingLabel moduleId="schedule" labelReveal={labelReveal} accent={C.sky} />
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
}: HubModuleCardProps) {
  return (
    <>
      <HubModuleFloatingLabel moduleId="conversations" labelReveal={labelReveal} accent={C.mint} />
      <ModuleShell moduleId="conversations" accent={C.mint} focused={focused} hovered={hovered} live={live} onHoverChange={onHoverChange}>
        <SettledModuleIcon moduleId="conversations" arrived={iconArrived} live={live} />
      </ModuleShell>
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
}: HubModuleCardProps) {
  return (
    <>
      <HubModuleFloatingLabel moduleId="data" labelReveal={labelReveal} accent={C.amber} />
      <ModuleShell moduleId="data" accent={C.amber} focused={focused} hovered={hovered} live={live} onHoverChange={onHoverChange}>
        <SettledModuleIcon moduleId="data" arrived={iconArrived} live={live} />
      </ModuleShell>
    </>
  );
}

export function RouteModule({
  live,
  focused,
  hovered,
  labelReveal,
  iconArrived,
  iconFlow = 0,
  onHoverChange,
}: HubModuleCardProps) {
  const routeIconArrived = Math.max(iconArrived, iconFlow * 0.88);

  return (
    <>
      <HubModuleFloatingLabel moduleId="route" labelReveal={labelReveal} accent={ROUTE_ACCENT} />
      <ModuleShell moduleId="route" accent={ROUTE_ACCENT} focused={focused} hovered={hovered} live={live} onHoverChange={onHoverChange}>
        <SettledModuleIcon moduleId="route" arrived={routeIconArrived} live={live} />
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
