"use client";

import type { CSSProperties } from "react";

import { useHeliosVoice } from "@/lib/helios/helios-provider";
import { useVideoFrame } from "@/lib/helios/use-video-frame";
import {
  persistentOrbDashboardOverlay,
  persistentOrbHitSizePercent,
  persistentOrbOpacity,
  persistentOrbVisible,
  storyStageViewBoxForWidth,
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

  const orbViewBox = storyStageViewBoxForWidth(spatial.viewportWidth);

  const style = {
    opacity: layerOpacity,
    "--story-orb-hit-size-pct": `${persistentOrbHitSizePercent(orbViewBox)}%`,
  } as CSSProperties;

  return { visible: true as const, style, opacity: layerOpacity };
}
