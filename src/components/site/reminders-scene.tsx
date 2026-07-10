"use client";

import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";

import { CALL_THEME } from "@/lib/story/concurrent-reveal";
import { useSvgGroupMagnetic } from "@/lib/motion/use-svg-group-magnetic";
import { useStoryFlowMagnetic } from "@/lib/motion/use-story-flow-magnetic";
import { featureBandSceneProgress } from "@/lib/story/feature-band-progress";
import {
  REMINDERS_STAGE,
  remindersBellToCallerPath,
  remindersCalendarProminence,
  remindersCallerReveal,
  remindersCallerToOrbFlow,
  remindersCallerToOrbPath,
  remindersOrbToCalendarFlow,
  remindersOrbToCalendarPath,
  remindersReturnFlow,
  remindersSceneComposition,
} from "@/lib/story/reminders-reveal";
import { storyStageViewBoxForWidth } from "@/lib/story/persistent-orb";
import { useStorySpatialLayout } from "@/lib/story/use-story-viewport";
import { STORY_GLYPH, StoryBellIcon } from "@/components/site/story-stage-glyphs";
import { StoryChannelArtIcon } from "@/components/site/integration-channel-glyphs";
import { cn } from "@/lib/utils";

const REMINDERS_CALLER_ART = "/story/reminders/phone-conversation.png";
/** Shared art size for phone + calendar satellites flanking the orb. */
const REMINDERS_SATELLITE_ART_SIZE = 104;
const REMINDERS_SATELLITE_SCALE = 1;

function RemindersCallerArtIcon({ size = REMINDERS_SATELLITE_ART_SIZE }: { size?: number }) {
  const half = size / 2;
  return (
    <image
      href={REMINDERS_CALLER_ART}
      x={-half}
      y={-half}
      width={size}
      height={size}
      preserveAspectRatio="xMidYMid meet"
      className="reminders-scene__caller-art"
    />
  );
}

type RemindersSceneProps = {
  story: number;
  opacity: number;
};

export function RemindersScene({ story, opacity: sceneOpacity }: RemindersSceneProps) {
  const reduceMotion = usePrefersReducedMotion();
  const spatialLayout = useStorySpatialLayout();
  const remindersSpatial = {
    caller: spatialLayout.reminders.caller,
    callerConnectX: spatialLayout.reminders.callerConnectX,
    calendar: spatialLayout.reminders.calendar,
  };
  const satelliteScale = spatialLayout.reminders.satelliteScale;
  const progress = featureBandSceneProgress(story, "reminders");

  const C = STORY_GLYPH;

  const { offsets, setGroupRef } = useSvgGroupMagnetic(["caller", "calendar"], {
    strength: 0.4,
    maxDisplacement: 12,
    radiusFactor: 1.15,
    disabled: !!reduceMotion,
  });

  const callerMag = offsets.caller ?? { x: 0, y: 0 };
  const calendarMag = offsets.calendar ?? { x: 0, y: 0 };

  const { offsets: flowOffsets, setGroupRef: setFlowRef } = useStoryFlowMagnetic(
    ["callerOrb", "orbCalendar", "reminderReturn"],
    { disabled: !!reduceMotion },
  );
  const callerOrbMag = flowOffsets.callerOrb ?? { x: 0, y: 0 };
  const orbCalendarMag = flowOffsets.orbCalendar ?? { x: 0, y: 0 };
  const reminderReturnMag = flowOffsets.reminderReturn ?? { x: 0, y: 0 };

  if (progress === null || sceneOpacity < 0.02) return null;

  const caller = remindersCallerReveal(progress);
  const callerToOrb = remindersCallerToOrbFlow(progress);
  const calendar = remindersCalendarProminence(progress);
  const orbToCalendar = remindersOrbToCalendarFlow(progress);
  const reminderFlow = remindersReturnFlow(progress);
  const composition = remindersSceneComposition(progress);

  const callerOrbPath = remindersCallerToOrbPath(undefined, remindersSpatial);
  const orbCalendarPath = remindersOrbToCalendarPath(undefined, remindersSpatial);
  const reminderPath = remindersBellToCallerPath(undefined, remindersSpatial);

  const callerLive = callerToOrb > 0.5 && progress < 0.48 && !reduceMotion;
  const reminderActive = reminderFlow > 0.1;
  const bellRinging = reminderActive && !reduceMotion;
  const callerNudge = reminderActive && progress > 0.55 && !reduceMotion;
  const callerRinging = (callerLive || callerNudge) && !reduceMotion;

  return (
    <svg
      viewBox={storyStageViewBoxForWidth(spatialLayout.viewportWidth)}
      preserveAspectRatio={spatialLayout.preserveAspectRatio}
      suppressHydrationWarning
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
      </defs>

      <ellipse cx={REMINDERS_STAGE.orbX} cy={REMINDERS_STAGE.orbY} rx="108" ry="72" fill={C.mint} opacity={0.035 * callerToOrb} />

      {/* Call flow — caller → orb (upper arc) */}
      <g opacity={callerToOrb}>
        <g
          ref={(node) => setFlowRef("callerOrb", node)}
          transform={`translate(${callerOrbMag.x} ${callerOrbMag.y})`}
          className="story-flow-magnetic"
        >
          <path
            d={callerOrbPath}
            fill="none"
            stroke="url(#remindersCallerGrad)"
            strokeWidth="1.8"
            strokeDasharray="5 8"
            className="reminders-scene__flow"
          />
          {!reduceMotion ? (
            <circle r="3" fill={C.mint} opacity="0.85">
              <animateMotion dur="2.1s" repeatCount="indefinite" path={callerOrbPath} calcMode="linear" />
            </circle>
          ) : null}
        </g>
      </g>

      {/* Booking flow — orb → calendar */}
      <g opacity={orbToCalendar}>
        <g
          ref={(node) => setFlowRef("orbCalendar", node)}
          transform={`translate(${orbCalendarMag.x} ${orbCalendarMag.y})`}
          className="story-flow-magnetic"
        >
          <path
            d={orbCalendarPath}
            fill="none"
            stroke="url(#remindersCalendarGrad)"
            strokeWidth="2"
            strokeDasharray="6 9"
            className="reminders-scene__flow reminders-scene__flow--calendar"
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
      </g>

      {/* Reminder flow — orb → caller (lower parallel arc) */}
      <g opacity={reminderFlow}>
        <g
          ref={(node) => setFlowRef("reminderReturn", node)}
          transform={`translate(${reminderReturnMag.x} ${reminderReturnMag.y})`}
          className="story-flow-magnetic"
        >
          <path
            id="reminders-return-path"
            d={reminderPath}
            fill="none"
            stroke="url(#remindersReminderGrad)"
            strokeWidth="1.8"
            strokeDasharray="5 8"
            className="reminders-scene__flow reminders-scene__flow--reminder"
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
      </g>

      <g
        transform={`translate(${remindersSpatial.caller.x} ${remindersSpatial.caller.y}) scale(${REMINDERS_SATELLITE_SCALE * satelliteScale})`}
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
      >
        <g
          ref={(node) => setGroupRef("caller", node)}
          transform={`translate(${callerMag.x} ${callerMag.y})`}
          className="concurrent-scene__phone-magnetic"
        >
          <g className="concurrent-scene__network-phone__motion">
            <RemindersCallerArtIcon />
          </g>
        </g>
      </g>

      {/* Bell rides the reminder arc continuously — drawn after phone so it stays on the path, not tucked behind */}
      {!reduceMotion && reminderActive ? (
        <g opacity={reminderFlow} className="reminders-scene__bell--on-flow">
          <g className="reminders-scene__bell--ring">
            <StoryBellIcon ringing={bellRinging} scale={0.88 * satelliteScale} />
          </g>
          <animateMotion dur="2.2s" repeatCount="indefinite" path={reminderPath} calcMode="linear" />
        </g>
      ) : null}

      <g
        transform={`translate(${remindersSpatial.calendar.x} ${remindersSpatial.calendar.y}) scale(${REMINDERS_SATELLITE_SCALE * satelliteScale})`}
        opacity={calendar}
      >
        <g
          ref={(node) => setGroupRef("calendar", node)}
          transform={`translate(${calendarMag.x} ${calendarMag.y})`}
          className="concurrent-scene__phone-magnetic"
          opacity={0.92}
        >
          <StoryChannelArtIcon src="/story/integrations/calendar.png" channelId="calendar" size={REMINDERS_SATELLITE_ART_SIZE} />
        </g>
      </g>

    </svg>
  );
}
