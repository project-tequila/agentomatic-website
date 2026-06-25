"use client";

import type { CSSProperties } from "react";

import { useHeliosVoice } from "@/lib/helios/helios-provider";
import { useVideoFrame } from "@/lib/helios/use-video-frame";
import { featureBandProgress } from "@/lib/story/feature-band-progress";
import { handoffOrbShift } from "@/lib/story/handoff-reveal";
import {
  gruntStageViewBox,
  persistentOrbDashboardOverlay,
  persistentOrbHitShiftPercent,
  persistentOrbHitSizePercent,
  persistentOrbModeBlend,
  persistentOrbOpacity,
  persistentOrbVisible,
  storyStageViewBox,
} from "@/lib/story/persistent-orb";
import { useStorySpatialLayout } from "@/lib/story/use-story-viewport";

export function usePersistentOrbHitZone() {
  const spatial = useStorySpatialLayout();
  const { helios } = useHeliosVoice();
  const { inputProps } = useVideoFrame(helios);
  const story = inputProps.storyProgress ?? 0;

  if (!persistentOrbVisible(story)) {
    return { visible: false as const, style: undefined, opacity: 0 };
  }

  const layerOpacity = persistentOrbOpacity(story) * persistentOrbDashboardOverlay(story);
  if (layerOpacity < 0.02) {
    return { visible: false as const, style: undefined, opacity: 0 };
  }

  const { mode, nextMode } = persistentOrbModeBlend(story);
  const handoffProgress = featureBandProgress(story, "handoff");
  const handoffSpatial = {
    caller: spatial.handoff.caller,
    callerConnectX: spatial.handoff.callerConnectX,
    humanStart: spatial.handoff.humanStart,
    humanEnd: spatial.handoff.humanEnd,
    orbShift: spatial.handoff.orbShift,
  };
  const orbShiftX = handoffProgress !== null ? handoffOrbShift(handoffProgress, handoffSpatial) : 0;
  const orbViewBox = mode === "grunt" || nextMode === "grunt" ? gruntStageViewBox() : storyStageViewBox();

  const style = {
    opacity: layerOpacity,
    "--story-orb-hit-shift-x": `${persistentOrbHitShiftPercent(orbShiftX, orbViewBox)}%`,
    "--story-orb-hit-size-pct": `${persistentOrbHitSizePercent(orbViewBox)}%`,
  } as CSSProperties;

  return { visible: true as const, style, opacity: layerOpacity };
}
