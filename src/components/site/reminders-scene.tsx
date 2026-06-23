"use client";

import { type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";

import { CALL_THEME } from "@/lib/story/concurrent-reveal";
import { featureBandProgress } from "@/lib/story/feature-band-progress";
import {
  REMINDERS_CALENDAR,
  REMINDERS_CALLER,
  REMINDERS_STAGE,
  remindersBellToCallerPath,
  remindersBookingReveal,
  remindersCalendarProminence,
  remindersCalendarReveal,
  remindersCallerReveal,
  remindersCallerToOrbFlow,
  remindersCallerToOrbPath,
  remindersOrbToCalendarFlow,
  remindersOrbToCalendarPath,
  remindersReturnFlow,
  remindersSceneComposition,
} from "@/lib/story/reminders-reveal";
import { STORY_STAGE_PRESERVE, storyStageViewBox } from "@/lib/story/persistent-orb";
import {
  STORY_GLYPH,
  StoryBellIcon,
  StoryBookingCard,
  StoryCalendarIcon,
} from "@/components/site/story-stage-glyphs";
import { RealisticPhoneSvg } from "@/components/site/realistic-phone-svg";
import { cn } from "@/lib/utils";

type RemindersSceneProps = {
  story: number;
  opacity: number;
};

export function RemindersScene({ story, opacity: sceneOpacity }: RemindersSceneProps) {
  const reduceMotion = useReducedMotion();
  const progress = featureBandProgress(story, "reminders");
  if (progress === null || sceneOpacity < 0.02) return null;

  const caller = remindersCallerReveal(progress);
  const callerToOrb = remindersCallerToOrbFlow(progress);
  const calendarVisible = remindersCalendarReveal(progress);
  const calendar = remindersCalendarProminence(progress);
  const orbToCalendar = remindersOrbToCalendarFlow(progress);
  const booking = remindersBookingReveal(progress);
  const reminderFlow = remindersReturnFlow(progress);
  const composition = remindersSceneComposition(progress);

  const callerOrbPath = remindersCallerToOrbPath();
  const orbCalendarPath = remindersOrbToCalendarPath();
  const reminderPath = remindersBellToCallerPath();

  const callerLive = callerToOrb > 0.5 && progress < 0.48 && !reduceMotion;
  const calendarRingLive = orbToCalendar > 0.4 && calendarVisible > 0.85 && !reduceMotion;
  const reminderActive = reminderFlow > 0.1;
  const bellRinging = reminderActive && !reduceMotion;
  const callerNudge = reminderActive && progress > 0.55 && !reduceMotion;
  const callerRinging = (callerLive || callerNudge) && !reduceMotion;

  const C = STORY_GLYPH;

  return (
    <svg
      viewBox={storyStageViewBox()}
      preserveAspectRatio={STORY_STAGE_PRESERVE}
      className="reminders-scene"
      aria-hidden
      style={{ opacity: sceneOpacity }}
    >
      <defs>
        <linearGradient id="remindersCallerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={C.mint} stopOpacity="0.55" />
          <stop offset="100%" stopColor={C.mint} stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="remindersCalendarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={C.mint} stopOpacity="0.35" />
          <stop offset="55%" stopColor={C.sky} stopOpacity="0.85" />
          <stop offset="100%" stopColor={C.sky} stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="remindersReminderGrad" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor={CALL_THEME.outbound.color} stopOpacity="0.85" />
          <stop offset="100%" stopColor={CALL_THEME.outbound.color} stopOpacity="0.35" />
        </linearGradient>
        <filter id="remindersCalendarGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx={REMINDERS_STAGE.orbX} cy={REMINDERS_STAGE.orbY} rx="108" ry="72" fill={C.mint} opacity={0.035 * callerToOrb} />
      <ellipse cx={REMINDERS_CALENDAR.x} cy={REMINDERS_CALENDAR.y} rx="88" ry="68" fill={C.sky} opacity={0.05 + calendar * 0.07} />

      {/* Call flow — caller → orb (upper arc) */}
      <g opacity={callerToOrb}>
        <path
          d={callerOrbPath}
          fill="none"
          stroke="url(#remindersCallerGrad)"
          strokeWidth="1.8"
          strokeDasharray="5 8"
          className={reduceMotion ? undefined : "reminders-scene__flow"}
        />
        {!reduceMotion ? (
          <circle r="3" fill={C.mint} opacity="0.85">
            <animateMotion dur="2.1s" repeatCount="indefinite" path={callerOrbPath} calcMode="linear" />
          </circle>
        ) : null}
      </g>

      {/* Booking flow — orb → calendar */}
      <g opacity={orbToCalendar}>
        <path
          d={orbCalendarPath}
          fill="none"
          stroke="url(#remindersCalendarGrad)"
          strokeWidth="2"
          strokeDasharray="6 9"
          className={reduceMotion ? undefined : "reminders-scene__flow reminders-scene__flow--calendar"}
        />
        {!reduceMotion ? (
          <>
            <circle r="3.5" fill={C.sky} opacity="0.9">
              <animateMotion dur="2s" repeatCount="indefinite" path={orbCalendarPath} calcMode="linear" />
            </circle>
            <circle r="2.5" fill={C.mint} opacity="0.75">
              <animateMotion dur="2s" repeatCount="indefinite" path={orbCalendarPath} begin="1s" calcMode="linear" />
            </circle>
          </>
        ) : null}
      </g>

      {/* Reminder flow — orb → caller (lower parallel arc) */}
      <g opacity={reminderFlow}>
        <path
          id="reminders-return-path"
          d={reminderPath}
          fill="none"
          stroke="url(#remindersReminderGrad)"
          strokeWidth="1.8"
          strokeDasharray="5 8"
          className={reduceMotion ? undefined : "reminders-scene__flow reminders-scene__flow--reminder"}
        />
        {!reduceMotion && reminderActive ? (
          <>
            <circle r="3" fill={C.amber} opacity="0.8">
              <animateMotion dur="2.2s" repeatCount="indefinite" path={reminderPath} calcMode="linear" />
            </circle>
            <circle r="2.5" fill={C.amber} opacity="0.55">
              <animateMotion dur="2.2s" repeatCount="indefinite" path={reminderPath} begin="0.75s" calcMode="linear" />
            </circle>
          </>
        ) : null}
      </g>

      <g
        transform={`translate(${REMINDERS_CALLER.x - 32} ${REMINDERS_CALLER.y - 59}) scale(0.82)`}
        opacity={caller * composition}
        className={cn(
          "reminders-scene__caller-phone",
          "concurrent-scene__network-phone",
          "concurrent-scene__network-phone--inbound",
          "concurrent-scene__network-phone--primary",
          callerLive && "concurrent-scene__network-phone--live-in",
          callerRinging && "concurrent-scene__network-phone--ringing-in",
          callerNudge && "reminders-scene__caller-phone--nudge",
        )}
        style={{ "--phone-accent": CALL_THEME.inbound.color } as CSSProperties}
      >
        <RealisticPhoneSvg
          accent={CALL_THEME.inbound.color}
          uid="reminders-caller"
          variant="frontdesk"
          callDirection="inbound"
          minimal
          highlight={0.92}
          showRing={callerLive || callerNudge}
          ringing={callerRinging}
        />
      </g>

      {/* Bell rides the reminder arc continuously — drawn after phone so it stays on the path, not tucked behind */}
      {!reduceMotion && reminderActive ? (
        <g opacity={reminderFlow} className="reminders-scene__bell--on-flow">
          <g className="reminders-scene__bell--ring">
            <StoryBellIcon ringing={bellRinging} scale={0.88} />
          </g>
          <animateMotion dur="2.2s" repeatCount="indefinite" path={reminderPath} calcMode="linear" />
        </g>
      ) : null}

      <g transform={`translate(${REMINDERS_CALENDAR.x} ${REMINDERS_CALENDAR.y})`} opacity={calendar}>
        <StoryCalendarIcon live={calendarRingLive} booked={booking} prominent glowFilter="url(#remindersCalendarGlow)" />
      </g>

      <g transform={`translate(${REMINDERS_CALENDAR.x - 54} ${REMINDERS_CALENDAR.y + 34})`} opacity={booking} className="reminders-scene__booking">
        <StoryBookingCard fillProgress={booking} />
      </g>
    </svg>
  );
}
