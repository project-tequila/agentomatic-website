import { interpolate } from "@helios-project/core";

import { gatedBodyTypingReveal } from "./body-typing-reveal";
import { PERSISTENT_ORB } from "./persistent-orb";

export const REMINDERS_STAGE = {
  width: PERSISTENT_ORB.width,
  height: PERSISTENT_ORB.height,
  orbX: PERSISTENT_ORB.cx,
  orbY: PERSISTENT_ORB.cy,
} as const;

/** Inbound caller — extreme left. */
export const REMINDERS_CALLER = { x: 48, y: PERSISTENT_ORB.cy };

/** Where the reminder arc meets the caller — same anchor as inbound call flow. */
export const REMINDERS_BELL_PATH_END = {
  x: REMINDERS_CALLER.x + 44,
  y: REMINDERS_CALLER.y,
};

/** Calendar + booking anchor — upper right, nudged inward. */
export const REMINDERS_CALENDAR = { x: 572, y: 188 };

export function remindersCallerToOrbPath(orbX = REMINDERS_STAGE.orbX) {
  const { x: cx, y: cy } = REMINDERS_CALLER;
  const startX = cx + 44;
  return `M ${startX} ${cy} Q ${(startX + orbX) / 2 - 10} ${cy - 34} ${orbX - 42} ${cy}`;
}

export function remindersOrbToCalendarPath(orbX = REMINDERS_STAGE.orbX) {
  const { x: cx, y: cy } = REMINDERS_CALENDAR;
  const sx = orbX + 40;
  const sy = REMINDERS_STAGE.orbY - 6;
  const midX = (sx + cx) / 2;
  const midY = Math.min(sy, cy) - 42;
  return `M ${sx} ${sy} Q ${midX} ${midY} ${cx - 34} ${cy + 8}`;
}

/** Reminder path — mirror of caller→orb on a lower parallel arc (orb back to caller). */
export function remindersBellToCallerPath(orbX = REMINDERS_STAGE.orbX) {
  const { x: endX, y: endY } = REMINDERS_BELL_PATH_END;
  const y = REMINDERS_STAGE.orbY;
  const startX = orbX - 42;
  const midX = (startX + endX) / 2 - 10;
  const midY = y + 38;
  return `M ${startX} ${y} Q ${midX} ${midY} ${endX} ${endY}`;
}

/** @deprecated use remindersBellToCallerPath */
export function remindersReturnPath(orbX = REMINDERS_STAGE.orbX) {
  return remindersBellToCallerPath(orbX);
}

export function remindersCallerReveal(progress: number) {
  return interpolate(progress, [0.04, 0.16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

/** Phase 1 — call captured: caller → orb (stays visible as a dim parallel path later). */
export function remindersCallerToOrbFlow(progress: number) {
  const fadeIn = interpolate(progress, [0.06, 0.26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const soften = interpolate(progress, [0.38, 0.52], [1, 0.34], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hold = interpolate(progress, [0.52, 1], [0.34, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (progress < 0.38) return fadeIn;
  if (progress < 0.52) return soften;
  return hold;
}

export function remindersCalendarReveal(progress: number) {
  return interpolate(progress, [0.22, 0.38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

/** Keeps calendar visually strong once booking lands through chapter end. */
export function remindersCalendarProminence(progress: number) {
  const visible = remindersCalendarReveal(progress);
  const booked = interpolate(progress, [0.42, 0.56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hold = interpolate(progress, [0.56, 1], [1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return visible * (0.72 + booked * hold * 0.28);
}

/** Phase 2 — booking: orb → calendar (holds through reminder phase). */
export function remindersOrbToCalendarFlow(progress: number) {
  const fadeIn = interpolate(progress, [0.26, 0.44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hold = interpolate(progress, [0.44, 1], [1, 0.62], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return fadeIn * hold;
}

export function remindersBookingReveal(progress: number) {
  const rise = interpolate(progress, [0.34, 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hold = interpolate(progress, [0.5, 1], [1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return rise * hold;
}

/** Phase 3 — reminder nudge: orb → caller. */
export function remindersReturnFlow(progress: number) {
  const bookingDone = interpolate(progress, [0.48, 0.56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flow = interpolate(progress, [0.52, 0.88], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hold = interpolate(progress, [0.88, 1], [1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return bookingDone * Math.max(flow, hold * bookingDone);
}

export function remindersBellTravel(progress: number) {
  const bookingDone = interpolate(progress, [0.48, 0.56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const travel = interpolate(progress, [0.54, 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const loop = interpolate(progress, [0.8, 1], [1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { travel: bookingDone * Math.max(travel, loop), arrive: bookingDone * loop };
}

export function remindersBellAtCaller(progress: number) {
  const arrive = interpolate(progress, [0.76, 0.88], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hold = interpolate(progress, [0.88, 1], [1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return Math.max(arrive, hold);
}

/** Combined scene strength — keeps the full flow readable through the chapter. */
export function remindersSceneComposition(progress: number) {
  return interpolate(progress, [0.08, 0.22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

/** Title line drop — 0 = above viewport, 1 = settled. */
export function remindersTitleDropReveal(progress: number, line: 0 | 1, reduceMotion = false) {
  if (reduceMotion) return progress > 0.08 ? 1 : 0;
  const band = line === 0 ? [0.04, 0.38] : [0.14, 0.48];
  return smoothstep(
    interpolate(progress, band, [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
}

/** 0–1 — both title lines settled (second line finishes last). */
export function remindersTitleCompleteReveal(progress: number, reduceMotion = false) {
  return remindersTitleDropReveal(progress, 1, reduceMotion);
}

export function remindersBodyReveal(progress: number, reduceMotion = false) {
  const titleComplete = remindersTitleCompleteReveal(progress, reduceMotion);
  return gatedBodyTypingReveal(progress, titleComplete, 0.52, 0.82, reduceMotion);
}
