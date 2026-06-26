"use client";

import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";

import { featureBandProgress } from "@/lib/story/feature-band-progress";
import {
  DASHBOARD_COMPOSER_H,
  DASHBOARD_EXCHANGE_H,
  DASHBOARD_EXCHANGES,
  DASHBOARD_HEADER_H,
  DASHBOARD_RAIL_ICONS,
  DASHBOARD_STAGE,
  type DashboardResponseType,
  dashboardActiveComposerIndex,
  dashboardActiveExchangeIndex,
  dashboardActiveTypingIndex,
  dashboardChatScrollOffset,
  dashboardChatToOrbPath,
  dashboardDatabaseBookingCount,
  dashboardExchangeAgentEnter,
  dashboardExchangeAgentReveal,
  dashboardExchangeBubbleEnter,
  dashboardExchangeComposerTyping,
  dashboardExchangeEnterMoment,
  dashboardExchangeFeedDim,
  dashboardExchangeFlowToIcon,
  dashboardExchangeFlowToOrb,
  dashboardExchangeManagerReveal,
  dashboardExchangeTypingEnter,
  dashboardExchangeTypingReveal,
  dashboardFrameReveal,
  dashboardFrameSlide,
  dashboardHeaderLiveIntensity,
  dashboardOrbArcFlow,
  dashboardOrbArcReveal,
  dashboardOrbToIconPath,
  dashboardRailIconIndex,
  dashboardRailItemActive,
  dashboardQueueReveal,
  dashboardSceneComposition,
  dashboardSettlePulse,
} from "@/lib/story/dashboard-reveal";
import { DashboardActionGlyph } from "@/components/site/dashboard-action-glyphs";
import { PremiumChannelGlyph } from "@/components/site/integration-channel-glyphs";
import { STORY_STAGE_PRESERVE, storyStageViewBox } from "@/lib/story/persistent-orb";
import { useStorySpatialLayout } from "@/lib/story/use-story-viewport";
import { STORY_GLYPH } from "@/components/site/story-stage-glyphs";
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

function ActionIcon({ icon, color, active }: { icon: Parameters<typeof DashboardActionGlyph>[0]["icon"]; color: string; active: number }) {
  return <DashboardActionGlyph icon={icon} color={color} active={active} />;
}

function ManagerBubble({
  text,
  feedW,
  opacity,
  enter,
  live,
}: {
  text: string;
  feedW: number;
  opacity: number;
  enter: number;
  live?: boolean;
}) {
  const w = managerBubbleWidth(text);
  const x = feedW - w;
  const C = STORY_GLYPH;
  const slideX = (1 - enter) * 12;
  const slideY = (1 - enter) * 8;
  return (
    <g
      opacity={opacity * Math.min(1, enter * 1.15)}
      transform={`translate(${x + slideX} ${slideY})`}
      className={cn(live && "dashboard-scene__bubble--live")}
    >
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

function TypingDots({ opacity, enter, reduceMotion }: { opacity: number; enter: number; reduceMotion: boolean }) {
  const C = STORY_GLYPH;
  const slideY = (1 - enter) * 8;
  return (
    <g
      opacity={opacity * enter}
      transform={`translate(0 ${36 + slideY})`}
      className="dashboard-scene__typing"
    >
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

function ReplyGlyph({ id, color, x, y, scale = 0.22 }: { id: string; color: string; x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <PremiumChannelGlyph id={id} color={color} uid={`reply-${id}`} />
    </g>
  );
}

function DatabaseReply({ opacity, complete, reduceMotion }: { opacity: number; complete: number; reduceMotion: boolean }) {
  const C = STORY_GLYPH;
  const count = dashboardDatabaseBookingCount(complete, reduceMotion);
  const counting = complete > 0.08 && complete < 0.92 && !reduceMotion;
  return (
    <g opacity={opacity} transform="translate(0 36)">
      <rect x={0} y={0} width={158} height={42} rx={10} fill="rgba(18,20,24,0.94)" stroke={C.mint} strokeWidth={1.3} strokeOpacity={0.42} />
      <ReplyGlyph id="database" color={C.sky} x={18} y={21} />
      <text
        x={36}
        y={19}
        fill={C.cream}
        fontSize={9.5}
        fontWeight={600}
        fontFamily="system-ui, sans-serif"
        className={counting ? "dashboard-scene__booking-badge" : undefined}
      >
        {count} bookings
      </text>
      <rect x={72} y={13} width={72} height={4} rx={2} fill={C.sky} opacity={0.45 + complete * 0.35} />
      <rect x={72} y={23} width={52 * complete} height={4} rx={2} fill={C.muted} />
      <rect x={72} y={31} width={40 * complete} height={3} rx={1.5} fill="rgba(245,242,235,0.18)" />
      {complete > 0.65 ? (
        <g transform="translate(136 21)" className="dashboard-scene__check--pop" opacity={complete}>
          <circle r={7} fill="rgba(140,255,210,0.16)" stroke={C.mint} strokeWidth={1.1} />
          <path d="M-3 0 L-1.2 1.8 L3.2 -2.2" fill="none" stroke={C.mint} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : null}
      <text x={36} y={31} fill={C.muted} fontSize={8} fontFamily="system-ui, sans-serif">
        records synced
      </text>
    </g>
  );
}

function PhoneReply({ opacity, complete, reduceMotion }: { opacity: number; complete: number; reduceMotion: boolean }) {
  const C = STORY_GLYPH;
  const live = complete > 0.3 && complete < 0.85 && !reduceMotion;
  return (
    <g opacity={opacity} transform="translate(0 36)">
      <rect x={0} y={0} width={166} height={42} rx={10} fill="rgba(18,20,24,0.94)" stroke={C.mint} strokeWidth={1.3} strokeOpacity={0.42} />
      <g transform="translate(18 21)" className={live ? "dashboard-scene__phone-pulse" : undefined}>
        <ReplyGlyph id="phone" color={C.amber} x={0} y={0} scale={0.24} />
      </g>
      <text x={36} y={19} fill={C.cream} fontSize={9.5} fontWeight={600} fontFamily="system-ui, sans-serif">
        3 outbound
      </text>
      {complete > 0.65 ? (
        <g transform="translate(136 21)" className="dashboard-scene__check--pop" opacity={complete}>
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
      <g transform="translate(18 21)" className={complete > 0.5 ? "dashboard-scene__calendar-block" : undefined}>
        <ReplyGlyph id="calendar" color={C.amber} x={0} y={0} scale={0.24} />
      </g>
      <text x={36} y={19} fill={C.cream} fontSize={9.5} fontWeight={600} fontFamily="system-ui, sans-serif">
        2–4pm blocked
      </text>
      {complete > 0.6 ? (
        <g transform="translate(144 21)" className="dashboard-scene__check--pop" opacity={complete}>
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
  const live = complete > 0.4 && complete < 0.9 && !reduceMotion;
  return (
    <g opacity={opacity} transform="translate(0 36)">
      <rect x={0} y={0} width={142} height={42} rx={10} fill="rgba(18,20,24,0.94)" stroke={C.mint} strokeWidth={1.3} strokeOpacity={0.42} />
      <g transform="translate(16 21)" className={live ? "dashboard-scene__queue-bell" : undefined}>
        <ReplyGlyph id="whatsapp" color="#22c55e" x={0} y={0} scale={0.24} />
      </g>
      <text x={34} y={19} fill={C.cream} fontSize={9.5} fontWeight={600} fontFamily="system-ui, sans-serif">
        no-shows nudged
      </text>
      {complete > 0.55 ? (
        <g transform="translate(116 21)" className="dashboard-scene__check--pop" opacity={complete}>
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
  if (type === "database") return <DatabaseReply opacity={opacity} complete={complete} reduceMotion={reduceMotion} />;
  if (type === "phone") return <PhoneReply opacity={opacity} complete={complete} reduceMotion={reduceMotion} />;
  if (type === "calendar") return <CalendarReply opacity={opacity} complete={complete} reduceMotion={reduceMotion} />;
  return <ReminderReply opacity={opacity} complete={complete} reduceMotion={reduceMotion} />;
}

export function DashboardScene({ story, opacity: sceneOpacity }: DashboardSceneProps) {
  const reduceMotion = usePrefersReducedMotion();
  const spatial = useStorySpatialLayout();
  const motionOff = !!reduceMotion;
  const progress = featureBandProgress(story, "dashboard");
  if (progress === null || sceneOpacity < 0.02) return null;

  const frame = dashboardFrameReveal(progress);
  const slideY = dashboardFrameSlide(progress, motionOff);
  const queueRail = dashboardQueueReveal(progress);
  const composition = dashboardSceneComposition(progress);
  const scrollOffset = dashboardChatScrollOffset(progress);
  const settle = dashboardSettlePulse(progress);
  const headerLive = dashboardHeaderLiveIntensity(progress);
  const arcReveal = dashboardOrbArcReveal(progress);
  const arcFlow = dashboardOrbArcFlow(progress);
  const typingIndex = dashboardActiveTypingIndex(progress);
  const composerIndex = dashboardActiveComposerIndex(progress);
  const activeExchangeIdx = dashboardActiveExchangeIndex(progress);
  const enterPulse = composerIndex >= 0 ? dashboardExchangeEnterMoment(progress, composerIndex) : 0;

  const C = STORY_GLYPH;
  const thread = spatial.dashboard.thread;
  const icons = spatial.dashboard.actionIcons;
  const satelliteScale = spatial.dashboard.satelliteScale;
  const orbX = DASHBOARD_STAGE.orbX;
  const orbY = DASHBOARD_STAGE.orbY;

  const contentTop = thread.y + DASHBOARD_HEADER_H + 6;
  const contentH = thread.h - DASHBOARD_HEADER_H - DASHBOARD_COMPOSER_H - 12;
  const feedW = thread.w - 28;
  const feedX = thread.x + 14;
  const composerY = thread.y + thread.h - DASHBOARD_COMPOSER_H - 8;
  const composerW = thread.w - 24;

  const chatToOrbPath = dashboardChatToOrbPath(orbX, orbY, thread);
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

      {activeExchangeIdx >= 0 ? (() => {
        const i = activeExchangeIdx;
        const item = DASHBOARD_EXCHANGES[i];
        const flowOrb = dashboardExchangeFlowToOrb(progress, i);
        const flowIcon = dashboardExchangeFlowToIcon(progress, i);
        const railIdx = dashboardRailIconIndex(item.icon);
        const iconPath = dashboardOrbToIconPath(railIdx, orbX, orbY, icons);
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
                  className="dashboard-scene__flow"
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
                  className="dashboard-scene__spur-flow"
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
      })() : null}

      <g opacity={queueRail * frame} transform={`translate(0 ${slideY * 0.5})`}>
        <rect x={icons.x} y={icons.y} width={icons.w} height={icons.h} rx={10} fill="rgba(18,20,24,0.55)" stroke="rgba(245,242,235,0.08)" strokeWidth={1} />
        {DASHBOARD_RAIL_ICONS.map((item, i) => {
          const active = dashboardRailItemActive(progress, i);
          const iy = icons.y + 24 + i * 36;
          return (
            <g
              key={item.id}
              transform={`translate(${icons.x + icons.w / 2} ${iy}) scale(${satelliteScale})`}
              className={cn(active > 0.5 && "dashboard-scene__queue-item--live")}
            >
              <ActionIcon icon={item.id} color={item.color} active={active} />
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
          <circle
            r={3.5}
            fill={C.mint}
            opacity={0.65 + headerLive * 0.35}
            className={headerLive > 0.35 ? "dashboard-scene__live-dot" : undefined}
          />
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
              const bubbleEnter = dashboardExchangeBubbleEnter(progress, i);
              const agentEnter = dashboardExchangeAgentEnter(progress, i);
              const typingEnter = dashboardExchangeTypingEnter(progress, i);
              const feedDim = dashboardExchangeFeedDim(progress, i);
              const managerLive = managerOpacity > 0.7 && agentOpacity < 0.15 && !motionOff;
              const agentSlideY = (1 - agentEnter) * 10;

              return (
                <g key={exchange.id} transform={`translate(0 ${i * DASHBOARD_EXCHANGE_H})`} opacity={feedDim}>
                  <ManagerBubble
                    text={exchange.manager}
                    feedW={feedW}
                    opacity={managerOpacity}
                    enter={bubbleEnter}
                    live={managerLive}
                  />
                  {typingIndex === i ? (
                    <TypingDots opacity={typingOpacity} enter={typingEnter} reduceMotion={motionOff} />
                  ) : null}
                  <g transform={`translate(0 ${agentSlideY})`} className="dashboard-scene__agent-reply">
                    <AgentReply
                      type={exchange.responseType}
                      opacity={agentOpacity * agentEnter}
                      complete={agentOpacity}
                      reduceMotion={motionOff}
                    />
                  </g>
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
              "dashboard-scene__composer-shimmer",
              enterPulse > 0.15 && "dashboard-scene__composer-enter",
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
              settle > 0.5 && "dashboard-scene__send-pulse",
              enterPulse > 0.15 && "dashboard-scene__send-enter",
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
