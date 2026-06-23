"use client";

import { useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";

import { useHeliosVoice } from "@/lib/helios/helios-provider";
import { useVideoFrame } from "@/lib/helios/use-video-frame";
import { featureBandProgress } from "@/lib/story/feature-band-progress";
import { handoffOrbShift } from "@/lib/story/handoff-reveal";
import {
  gruntStageViewBox,
  PERSISTENT_ORB,
  STORY_STAGE_PRESERVE,
  storyStageViewBox,
  persistentOrbHitShiftPercent,
  persistentOrbHitSizePercent,
  persistentOrbIntensity,
  persistentOrbDashboardOverlay,
  persistentOrbModeBlend,
  persistentOrbOpacity,
  persistentOrbVisible,
  type PersistentOrbMode,
} from "@/lib/story/persistent-orb";
import { cn } from "@/lib/utils";

import { FrontdeskVoiceOrb } from "./frontdesk-voice-orb";
import { SiteOrbHitZone } from "./site-orb-hit-zone";

type PersistentFrontdeskOrbProps = {
  story: number;
};

function OrbInstance({
  mode,
  opacity,
  pointerX,
  pointerY,
  intensity,
  reduceMotion,
  idSuffix,
  shiftX = 0,
}: {
  mode: PersistentOrbMode;
  opacity: number;
  pointerX: number;
  pointerY: number;
  intensity: number;
  reduceMotion: boolean;
  idSuffix: string;
  shiftX?: number;
}) {
  if (opacity < 0.02) return null;

  return (
    <g transform={shiftX ? `translate(${shiftX} 0)` : undefined} opacity={opacity} className={cn("persistent-orb__instance", `persistent-orb__instance--${mode}`)}>
      <FrontdeskVoiceOrb
        cx={PERSISTENT_ORB.cx}
        cy={PERSISTENT_ORB.cy}
        pointerX={pointerX}
        pointerY={pointerY}
        reduceMotion={reduceMotion}
        intensity={intensity}
        mode={mode}
        idSuffix={idSuffix}
      />
    </g>
  );
}

export function PersistentFrontdeskOrb({ story }: PersistentFrontdeskOrbProps) {
  const reduceMotion = useReducedMotion();
  const { helios } = useHeliosVoice();
  const { inputProps } = useVideoFrame(helios);
  const pointerX = inputProps.pointerX ?? 0;
  const pointerY = inputProps.pointerY ?? 0;

  if (!persistentOrbVisible(story)) return null;

  const layerOpacity = persistentOrbOpacity(story) * persistentOrbDashboardOverlay(story);
  const { mode, blend, nextMode } = persistentOrbModeBlend(story);
  const intensity = persistentOrbIntensity(story);
  const handoffProgress = featureBandProgress(story, "handoff");
  const orbShiftX = handoffProgress !== null ? handoffOrbShift(handoffProgress) : 0;

  if (layerOpacity < 0.02) return null;

  const orbViewBox = mode === "grunt" || nextMode === "grunt" ? gruntStageViewBox() : storyStageViewBox();
  const orbHitStyle = {
    opacity: layerOpacity,
    "--story-orb-hit-shift-x": `${persistentOrbHitShiftPercent(orbShiftX, orbViewBox)}%`,
    "--story-orb-hit-size-pct": `${persistentOrbHitSizePercent(orbViewBox)}%`,
  } as CSSProperties;

  return (
    <div className="story-illustration-bg__persistent-orb" style={orbHitStyle}>
      <svg
        viewBox={orbViewBox}
        className="story-illustration-bg__persistent-orb-svg"
        preserveAspectRatio={STORY_STAGE_PRESERVE}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <OrbInstance
          mode={mode}
          opacity={1 - blend}
          pointerX={pointerX}
          pointerY={pointerY}
          intensity={intensity}
          reduceMotion={!!reduceMotion}
          idSuffix="a"
          shiftX={orbShiftX}
        />
        {blend > 0.02 ? (
          <OrbInstance
            mode={nextMode}
            opacity={blend}
            pointerX={pointerX}
            pointerY={pointerY}
            intensity={intensity}
            reduceMotion={!!reduceMotion}
            idSuffix="b"
            shiftX={orbShiftX}
          />
        ) : null}
      </svg>
      <SiteOrbHitZone variant="immersive" />
    </div>
  );
}

export { PERSISTENT_ORB };
