"use client";

import { useReducedMotion } from "framer-motion";

import { featureBandProgress } from "@/lib/story/feature-band-progress";
import {
  DASHBOARD_ACTION_ICONS,
  DASHBOARD_COMPOSER_H,
  DASHBOARD_EXCHANGE_H,
  DASHBOARD_EXCHANGES,
  DASHBOARD_HEADER_H,
  DASHBOARD_STAGE,
  DASHBOARD_THREAD,
  type DashboardQueueIcon,
  type DashboardResponseType,
  dashboardActiveComposerIndex,
  dashboardActiveTypingIndex,
  dashboardChatScrollOffset,
  dashboardChatToOrbPath,
  dashboardExchangeAgentReveal,
  dashboardExchangeComposerTyping,
  dashboardExchangeEnterMoment,
  dashboardExchangeFlowToIcon,
  dashboardExchangeFlowToOrb,
  dashboardExchangeManagerReveal,
  dashboardExchangeTypingReveal,
  dashboardFrameReveal,
  dashboardFrameSlide,
  dashboardOrbArcFlow,
  dashboardOrbArcReveal,
  dashboardOrbToIconPath,
  dashboardQueueItemActive,
  dashboardQueueReveal,
  dashboardSceneComposition,
  dashboardSettlePulse,
} from "@/lib/story/dashboard-reveal";
import { STORY_STAGE_PRESERVE, storyStageViewBox } from "@/lib/story/persistent-orb";
import { STORY_GLYPH, StoryBellIcon } from "@/components/site/story-stage-glyphs";
import { cn } from "@/lib/utils";

type DashboardSceneProps = {
  story: number;
  opacity: number;
};

function managerBubbleWidth(text: string) {
  return Math.min(248, text.length * 5.6 + 24);
}

function typedCharOpacity(index: number, typingReveal: number, textLen: number) {
  const units = typingReveal * textLen;
  if (index < Math.floor(units)) return 1;
  if (index === Math.floor(units)) return units - Math.floor(units);
  return 0;
}

function ActionIcon({ icon, color, active }: { icon: DashboardQueueIcon; color: string; active: number }) {
  const lit = active > 0.35;
  if (icon === "call") {
    return (
      <g opacity={0.35 + active * 0.65}>
        <rect x={-10} y={-12} width={20} height={24} rx={5} fill="rgba(18,20,24,0.95)" stroke={color} strokeWidth={lit ? 1.6 : 1.1} />
        <path d="M-4 -6 C-4 -9 4 -9 4 -6 C4 -2 0 -1 0 3 L0 6" fill="none" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
        {lit ? <circle r={14} fill="none" stroke={color} strokeWidth={1} opacity={0.35 * active} className="dashboard-scene__queue-ring" /> : null}
      </g>
    );
  }
  if (icon === "queue") {
    return (
      <g opacity={0.35 + active * 0.65}>
        <rect x={-11} y={-11} width={22} height={22} rx={6} fill="rgba(18,20,24,0.95)" stroke={color} strokeWidth={lit ? 1.6 : 1.1} />
        <path d="M-5 -3 L-1 1 L5 -5" fill="none" stroke={color} strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" opacity={lit ? 1 : 0.5} />
        <line x1={-5} y1={4} x2={5} y2={4} stroke={color} strokeWidth={1.1} strokeLinecap="round" opacity={0.55} />
        <line x1={-5} y1={7} x2={2} y2={7} stroke={color} strokeWidth={1.1} strokeLinecap="round" opacity={0.4} />
      </g>
    );
  }
  if (icon === "calendar") {
    return (
      <g opacity={0.35 + active * 0.65}>
        <rect x={-11} y={-12} width={22} height={24} rx={5} fill="rgba(18,20,24,0.95)" stroke={color} strokeWidth={lit ? 1.6 : 1.1} />
        <rect x={-8} y={-9} width={16} height={5} rx={2} fill={color} opacity={0.85} />
        <rect x={-6} y={-1} width={6} height={5} rx={1.5} fill={color} opacity={lit ? 0.9 : 0.45} />
        <rect x={2} y={-1} width={6} height={5} rx={1.5} fill="rgba(245,242,235,0.18)" />
        {lit ? <circle r={14} fill="none" stroke={color} strokeWidth={1} opacity={0.3 * active} className="dashboard-scene__queue-ring" /> : null}
      </g>
    );
  }
  return (
    <g opacity={0.35 + active * 0.65} className={lit ? "dashboard-scene__queue-bell" : undefined}>
      <StoryBellIcon ringing={lit && active > 0.6} scale={0.72} />
    </g>
  );
}

function ManagerBubble({
  text,
  feedW,
  opacity,
  live,
}: {
  text: string;
  feedW: number;
  opacity: number;
  live?: boolean;
}) {
  const w = managerBubbleWidth(text);
  const x = feedW - w;
  const C = STORY_GLYPH;
  return (
    <g opacity={opacity} transform={`translate(${x} 0)`} className={cn(live && "dashboard-scene__bubble--live")}>
      <rect x={0} y={0} width={w} height={30} rx={9} fill="rgba(18,20,24,0.94)" stroke={C.violet} strokeWidth={1.3} strokeOpacity={0.5} />
      <text x={11} y={19} fill={C.cream} fontSize={10} fontWeight={500} fontFamily="system-ui, sans-serif">
        {text}
      </text>
    </g>
  );
}

function ComposerTypingText({
  text,
  typingReveal,
  y,
  width,
  reduceMotion,
}: {
  text: string;
  typingReveal: number;
  y: number;
  width: number;
  reduceMotion: boolean;
}) {
  const C = STORY_GLYPH;
  const reveal = reduceMotion ? 1 : typingReveal;
  const len = text.length;
  const showCursor = !reduceMotion && reveal > 0.02 && reveal < 0.995;
  const cursorX = 12 + Math.min(width - 24, reveal * len * 5.6 + 4);

  return (
    <g className="dashboard-scene__composer-typing">
      {text.split("").map((ch, i) => (
        <text
          key={`${ch}-${i}`}
          x={12 + i * 5.6}
          y={y}
          fill={C.cream}
          fontSize={9.5}
          fontWeight={500}
          fontFamily="system-ui, sans-serif"
          opacity={typedCharOpacity(i, reveal, len)}
        >
          {ch}
        </text>
      ))}
      {showCursor ? (
        <rect
          x={cursorX}
          y={y - 10}
          width={1.2}
          height={11}
          rx={0.6}
          fill={C.mint}
          className="dashboard-scene__typing-cursor"
        />
      ) : null}
    </g>
  );
}

function TypingDots({ opacity, reduceMotion }: { opacity: number; reduceMotion: boolean }) {
  const C = STORY_GLYPH;
  return (
    <g opacity={opacity} transform="translate(0 36)" className="dashboard-scene__typing">
      <circle cx={10} cy={7} r={8} fill="rgba(140,255,210,0.12)" stroke={C.mint} strokeWidth={1} />
      <circle cx={10} cy={7} r={3} fill={C.mint} opacity={0.85} />
      <rect x={24} y={0} width={34} height={14} rx={7} fill="rgba(18,20,24,0.88)" stroke="rgba(140,255,210,0.35)" strokeWidth={1} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={i * 9 + 31} cy={7} r={2} fill={C.mint} opacity={0.85}>
          {!reduceMotion ? (
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" begin={`${i * 0.16}s`} />
          ) : null}
        </circle>
      ))}
    </g>
  );
}

function BookingsReply({ opacity, complete, reduceMotion }: { opacity: number; complete: number; reduceMotion: boolean }) {
  const C = STORY_GLYPH;
  const count = Math.round(8 + complete * 4);
  return (
    <g opacity={opacity} transform="translate(0 36)">
      <rect x={0} y={0} width={158} height={42} rx={10} fill="rgba(18,20,24,0.94)" stroke={C.mint} strokeWidth={1.3} strokeOpacity={0.42} />
      <rect x={8} y={8} width={52} height={26} rx={6} fill="rgba(116,192,252,0.14)" stroke={C.sky} strokeWidth={1.1} className={!reduceMotion && complete > 0.6 ? "dashboard-scene__booking-badge" : undefined} />
      <text x={16} y={25} fill={C.sky} fontSize={11} fontWeight={700} fontFamily="system-ui, sans-serif">
        {count}
      </text>
      <text x={34} y={25} fill={C.muted} fontSize={8} fontWeight={500} fontFamily="system-ui, sans-serif">
        today
      </text>
      <rect x={72} y={13} width={72} height={4} rx={2} fill={C.sky} opacity={0.45 + complete * 0.35} />
      <rect x={72} y={23} width={52 * complete} height={4} rx={2} fill={C.muted} />
      <rect x={72} y={31} width={40 * complete} height={3} rx={1.5} fill="rgba(245,242,235,0.18)" />
    </g>
  );
}

function OutboundReply({ opacity, complete, reduceMotion }: { opacity: number; complete: number; reduceMotion: boolean }) {
  const C = STORY_GLYPH;
  const live = complete > 0.3 && complete < 0.85 && !reduceMotion;
  return (
    <g opacity={opacity} transform="translate(0 36)">
      <rect x={0} y={0} width={166} height={42} rx={10} fill="rgba(18,20,24,0.94)" stroke={C.mint} strokeWidth={1.3} strokeOpacity={0.42} />
      <g transform="translate(18 21)" className={live ? "dashboard-scene__phone-pulse" : undefined}>
        <circle r={12} fill="rgba(255,200,87,0.12)" stroke={C.amber} strokeWidth={1.2} opacity={0.55 + complete * 0.4} />
        <path d="M-4 -5 C-4 -8 4 -8 4 -5 C4 -1 0 0 0 4 L0 6" fill="none" stroke={C.amber} strokeWidth={1.2} strokeLinecap="round" />
      </g>
      <text x={36} y={19} fill={C.cream} fontSize={9.5} fontWeight={600} fontFamily="system-ui, sans-serif">
        3 outbound
      </text>
      {complete > 0.65 ? (
        <g transform="translate(136 21)" className={!reduceMotion ? "dashboard-scene__check--pop" : undefined} opacity={complete}>
          <circle r={7} fill="rgba(140,255,210,0.16)" stroke={C.mint} strokeWidth={1.1} />
          <path d="M-3 0 L-1.2 1.8 L3.2 -2.2" fill="none" stroke={C.mint} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : (
        <circle cx={136} cy={21} r={3} fill={C.amber} opacity={0.4 + complete * 0.5} className={live ? "dashboard-scene__action-dot" : undefined} />
      )}
      <text x={36} y={31} fill={C.muted} fontSize={8} fontFamily="system-ui, sans-serif">
        waitlist queued
      </text>
    </g>
  );
}

function CalendarReply({ opacity, complete, reduceMotion }: { opacity: number; complete: number; reduceMotion: boolean }) {
  const C = STORY_GLYPH;
  return (
    <g opacity={opacity} transform="translate(0 36)">
      <rect x={0} y={0} width={174} height={42} rx={10} fill="rgba(18,20,24,0.94)" stroke={C.mint} strokeWidth={1.3} strokeOpacity={0.42} />
      <g transform="translate(18 21)" className={!reduceMotion && complete > 0.5 ? "dashboard-scene__calendar-block" : undefined}>
        <rect x={-10} y={-12} width={20} height={22} rx={4} fill={C.ink} stroke={C.violet} strokeWidth={1.2} />
        <rect x={-8} y={-10} width={16} height={5} rx={1.5} fill={C.violet} opacity={0.9} />
        <rect x={-6} y={-2} width={12} height={8} rx={2} fill={C.violet} opacity={0.35 + complete * 0.55} />
      </g>
      <text x={36} y={19} fill={C.cream} fontSize={9.5} fontWeight={600} fontFamily="system-ui, sans-serif">
        2–4pm blocked
      </text>
      {complete > 0.6 ? (
        <g transform="translate(144 21)" className={!reduceMotion ? "dashboard-scene__check--pop" : undefined} opacity={complete}>
          <circle r={7} fill="rgba(140,255,210,0.16)" stroke={C.mint} strokeWidth={1.1} />
          <path d="M-3 0 L-1.2 1.8 L3.2 -2.2" fill="none" stroke={C.mint} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : null}
      <text x={36} y={31} fill={C.muted} fontSize={8} fontFamily="system-ui, sans-serif">
        calendar updated
      </text>
    </g>
  );
}

function ReminderReply({ opacity, complete, reduceMotion }: { opacity: number; complete: number; reduceMotion: boolean }) {
  const C = STORY_GLYPH;
  const ringing = complete > 0.4 && complete < 0.9 && !reduceMotion;
  return (
    <g opacity={opacity} transform="translate(0 36)">
      <rect x={0} y={0} width={142} height={42} rx={10} fill="rgba(18,20,24,0.94)" stroke={C.mint} strokeWidth={1.3} strokeOpacity={0.42} />
      <g transform="translate(16 21) scale(0.72)">
        <StoryBellIcon ringing={ringing} />
      </g>
      <text x={34} y={19} fill={C.cream} fontSize={9.5} fontWeight={600} fontFamily="system-ui, sans-serif">
        no-shows nudged
      </text>
      {complete > 0.55 ? (
        <g transform="translate(116 21)" className={!reduceMotion ? "dashboard-scene__check--pop" : undefined} opacity={complete}>
          <circle r={7} fill="rgba(140,255,210,0.16)" stroke={C.mint} strokeWidth={1.1} />
          <path d="M-3 0 L-1.2 1.8 L3.2 -2.2" fill="none" stroke={C.mint} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : null}
      <text x={34} y={31} fill={C.muted} fontSize={8} fontFamily="system-ui, sans-serif">
        2 reminders sent
      </text>
    </g>
  );
}

function AgentReply({
  type,
  opacity,
  complete,
  reduceMotion,
}: {
  type: DashboardResponseType;
  opacity: number;
  complete: number;
  reduceMotion: boolean;
}) {
  if (type === "bookings") return <BookingsReply opacity={opacity} complete={complete} reduceMotion={reduceMotion} />;
  if (type === "outbound") return <OutboundReply opacity={opacity} complete={complete} reduceMotion={reduceMotion} />;
  if (type === "calendar") return <CalendarReply opacity={opacity} complete={complete} reduceMotion={reduceMotion} />;
  return <ReminderReply opacity={opacity} complete={complete} reduceMotion={reduceMotion} />;
}

export function DashboardScene({ story, opacity: sceneOpacity }: DashboardSceneProps) {
  const reduceMotion = useReducedMotion();
  const motionOff = !!reduceMotion;
  const progress = featureBandProgress(story, "dashboard");
  if (progress === null || sceneOpacity < 0.02) return null;

  const frame = dashboardFrameReveal(progress);
  const slideY = dashboardFrameSlide(progress, motionOff);
  const queueRail = dashboardQueueReveal(progress);
  const composition = dashboardSceneComposition(progress);
  const scrollOffset = dashboardChatScrollOffset(progress);
  const settle = dashboardSettlePulse(progress);
  const arcReveal = dashboardOrbArcReveal(progress);
  const arcFlow = dashboardOrbArcFlow(progress);
  const typingIndex = dashboardActiveTypingIndex(progress);
  const composerIndex = dashboardActiveComposerIndex(progress);
  const enterPulse = composerIndex >= 0 ? dashboardExchangeEnterMoment(progress, composerIndex) : 0;

  const C = STORY_GLYPH;
  const thread = DASHBOARD_THREAD;
  const icons = DASHBOARD_ACTION_ICONS;
  const orbX = DASHBOARD_STAGE.orbX;
  const orbY = DASHBOARD_STAGE.orbY;

  const contentTop = thread.y + DASHBOARD_HEADER_H + 6;
  const contentH = thread.h - DASHBOARD_HEADER_H - DASHBOARD_COMPOSER_H - 12;
  const feedW = thread.w - 28;
  const feedX = thread.x + 14;
  const composerY = thread.y + thread.h - DASHBOARD_COMPOSER_H - 8;
  const composerW = thread.w - 24;

  const chatToOrbPath = dashboardChatToOrbPath(orbX, orbY);
  const arcLive = arcFlow > 0.35 && !motionOff;

  const activeComposerText = composerIndex >= 0 ? DASHBOARD_EXCHANGES[composerIndex]?.manager ?? "" : "";
  const activeComposerReveal = composerIndex >= 0 ? dashboardExchangeComposerTyping(progress, composerIndex) : 0;

  return (
    <svg
      viewBox={storyStageViewBox()}
      preserveAspectRatio={STORY_STAGE_PRESERVE}
      className="dashboard-scene"
      aria-hidden
      style={{ opacity: sceneOpacity * composition }}
    >
      <defs>
        <linearGradient id="dashboardThreadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={C.mint} stopOpacity="0.12" />
          <stop offset="55%" stopColor={C.violet} stopOpacity="0.18" />
          <stop offset="100%" stopColor={C.mint} stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="dashboardArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={C.mint} stopOpacity="0.65" />
          <stop offset="55%" stopColor={C.violet} stopOpacity="0.55" />
          <stop offset="100%" stopColor={C.mint} stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="dashboardIconGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={C.violet} stopOpacity="0.45" />
          <stop offset="100%" stopColor={C.mint} stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="dashboardFeedFade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.15" />
          <stop offset="12%" stopColor="white" stopOpacity="1" />
          <stop offset="88%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0.2" />
        </linearGradient>
        <filter id="dashboardThreadGlow" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="dashboardFeedClip">
          <rect x={feedX} y={contentTop} width={feedW} height={contentH} rx={8} />
        </clipPath>
        <mask id="dashboardFeedMask">
          <rect x={feedX} y={contentTop} width={feedW} height={contentH} rx={8} fill="url(#dashboardFeedFade)" />
        </mask>
      </defs>

      <ellipse cx={orbX} cy={orbY + 12} rx={108} ry={68} fill={C.violet} opacity={0.025 + arcFlow * 0.05} />

      <g opacity={arcReveal * frame * 0.78}>
        <path
          d={chatToOrbPath}
          fill="none"
          stroke="url(#dashboardArcGrad)"
          strokeWidth={2}
          strokeDasharray="6 8"
          className={arcLive ? "dashboard-scene__flow" : undefined}
        />
        {!motionOff && arcFlow > 0.2 ? (
          <>
            <circle r={3.2} fill={C.mint} opacity={0.85 * arcFlow}>
              <animateMotion dur="2.3s" repeatCount="indefinite" path={chatToOrbPath} calcMode="linear" />
            </circle>
            <circle r={2.6} fill={C.violet} opacity={0.75 * arcFlow}>
              <animateMotion dur="2.3s" repeatCount="indefinite" path={chatToOrbPath} calcMode="linear" begin="0.75s" />
            </circle>
          </>
        ) : null}
      </g>

      {DASHBOARD_EXCHANGES.map((item, i) => {
        const flowOrb = dashboardExchangeFlowToOrb(progress, i);
        const flowIcon = dashboardExchangeFlowToIcon(progress, i);
        const iconPath = dashboardOrbToIconPath(i, orbX, orbY);
        if (flowOrb < 0.08 && flowIcon < 0.08) return null;
        return (
          <g key={`flow-${item.id}`} opacity={queueRail}>
            {flowOrb > 0.08 ? (
              <g opacity={flowOrb * 0.9}>
                <path
                  d={chatToOrbPath}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={1.6}
                  strokeDasharray="4 6"
                  opacity={0.55}
                  className={!motionOff ? "dashboard-scene__flow" : undefined}
                />
                {!motionOff ? (
                  <circle r={2.4} fill={C.mint} opacity={0.95 * flowOrb}>
                    <animateMotion dur="1.1s" repeatCount="1" path={chatToOrbPath} calcMode="linear" fill="freeze" />
                  </circle>
                ) : null}
              </g>
            ) : null}
            {flowIcon > 0.08 ? (
              <g opacity={flowIcon}>
                <path
                  d={iconPath}
                  fill="none"
                  stroke="url(#dashboardIconGrad)"
                  strokeWidth={1.5}
                  strokeDasharray="4 6"
                  className={!motionOff ? "dashboard-scene__spur-flow" : undefined}
                />
                {!motionOff ? (
                  <circle r={2.6} fill={item.color} opacity={0.92 * flowIcon}>
                    <animateMotion dur="1.4s" repeatCount="indefinite" path={iconPath} calcMode="linear" />
                  </circle>
                ) : null}
              </g>
            ) : null}
          </g>
        );
      })}

      <g opacity={queueRail * frame} transform={`translate(0 ${slideY * 0.5})`}>
        <rect x={icons.x} y={icons.y} width={icons.w} height={icons.h} rx={10} fill="rgba(18,20,24,0.55)" stroke="rgba(245,242,235,0.08)" strokeWidth={1} />
        {DASHBOARD_EXCHANGES.map((item, i) => {
          const active = dashboardQueueItemActive(progress, i);
          const iy = icons.y + 28 + i * 40;
          return (
            <g
              key={item.id}
              transform={`translate(${icons.x + icons.w / 2} ${iy})`}
              className={cn(active > 0.5 && !motionOff && "dashboard-scene__queue-item--live")}
            >
              <ActionIcon icon={item.icon} color={item.color} active={active} />
            </g>
          );
        })}
      </g>

      <g opacity={frame} transform={`translate(0 ${slideY})`} className="dashboard-scene__thread" filter="url(#dashboardThreadGlow)">
        <rect x={thread.x} y={thread.y} width={thread.w} height={thread.h} rx={14} fill={C.ink} stroke="rgba(245,242,235,0.14)" strokeWidth={1.2} />
        <rect x={thread.x} y={thread.y} width={thread.w} height={DASHBOARD_HEADER_H} rx={14} fill="url(#dashboardThreadGrad)" />
        <line
          x1={thread.x + 12}
          y1={thread.y + DASHBOARD_HEADER_H}
          x2={thread.x + thread.w - 12}
          y2={thread.y + DASHBOARD_HEADER_H}
          stroke="rgba(245,242,235,0.08)"
          strokeWidth={1}
        />

        <g opacity={queueRail} transform={`translate(${thread.x + 14} ${thread.y + 20})`}>
          <circle r={3.5} fill={C.mint} opacity={0.85} className={settle > 0.4 && !motionOff ? "dashboard-scene__live-dot" : undefined} />
          <text x={10} y={3.5} fill={C.cream} fontSize={9.5} fontWeight={600} fontFamily="system-ui, sans-serif" letterSpacing="0.06em" opacity={0.72}>
            front desk
          </text>
        </g>

        <rect
          x={feedX}
          y={contentTop}
          width={feedW}
          height={contentH}
          rx={8}
          fill="rgba(28,31,38,0.45)"
          stroke="rgba(245,242,235,0.05)"
          strokeWidth={1}
          opacity={queueRail}
        />

        <g clipPath="url(#dashboardFeedClip)" mask="url(#dashboardFeedMask)">
          <g transform={`translate(${feedX} ${contentTop + 6}) translate(0 ${-scrollOffset})`} className="dashboard-scene__feed">
            {DASHBOARD_EXCHANGES.map((exchange, i) => {
              const managerOpacity = dashboardExchangeManagerReveal(progress, i);
              const agentOpacity = dashboardExchangeAgentReveal(progress, i);
              const typingOpacity = dashboardExchangeTypingReveal(progress, i);
              const managerLive = managerOpacity > 0.7 && agentOpacity < 0.15 && !motionOff;

              return (
                <g key={exchange.id} transform={`translate(0 ${i * DASHBOARD_EXCHANGE_H})`}>
                  <ManagerBubble text={exchange.manager} feedW={feedW} opacity={managerOpacity} live={managerLive} />
                  {typingIndex === i ? <TypingDots opacity={typingOpacity} reduceMotion={motionOff} /> : null}
                  <AgentReply
                    type={exchange.responseType}
                    opacity={agentOpacity}
                    complete={agentOpacity}
                    reduceMotion={motionOff}
                  />
                </g>
              );
            })}
          </g>
        </g>

        <g opacity={0.35 + settle * 0.35 + enterPulse * 0.45}>
          <rect
            x={thread.x + 12}
            y={composerY}
            width={composerW}
            height={22}
            rx={7}
            fill="rgba(18,20,24,0.92)"
            stroke={enterPulse > 0.2 ? C.mint : "rgba(245,242,235,0.1)"}
            strokeWidth={enterPulse > 0.2 ? 1.4 : 1}
            strokeOpacity={0.35 + enterPulse * 0.65}
            className={cn(
              !motionOff && "dashboard-scene__composer-shimmer",
              enterPulse > 0.15 && !motionOff && "dashboard-scene__composer-enter",
            )}
          />
          {composerIndex >= 0 && activeComposerText ? (
            <g transform={`translate(${thread.x + 16} 0)`}>
              <ComposerTypingText
                text={activeComposerText}
                typingReveal={activeComposerReveal}
                y={composerY + 15}
                width={composerW - 8}
                reduceMotion={motionOff}
              />
            </g>
          ) : (
            <rect
              x={thread.x + 20}
              y={composerY + 9}
              width={composerW - 72}
              height={3}
              rx={1.5}
              fill="rgba(245,242,235,0.08)"
            />
          )}
          <rect
            x={thread.x + thread.w - 38}
            y={composerY + 3}
            width={20}
            height={16}
            rx={4}
            fill={C.mint}
            opacity={0.7 + settle * 0.25 + enterPulse * 0.3}
            className={cn(
              settle > 0.5 && !motionOff && "dashboard-scene__send-pulse",
              enterPulse > 0.15 && !motionOff && "dashboard-scene__send-enter",
            )}
          />
          <path
            d={`M${thread.x + thread.w - 33} ${composerY + 8} L${thread.x + thread.w - 28} ${composerY + 12} L${thread.x + thread.w - 33} ${composerY + 16}`}
            fill="none"
            stroke={C.ink}
            strokeWidth={1.3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  );
}
