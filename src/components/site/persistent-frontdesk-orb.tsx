"use client";

import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";

import { useHeliosVoice } from "@/lib/helios/helios-provider";
import { useVideoFrame } from "@/lib/helios/use-video-frame";
import { usePersistentOrbHitZone } from "@/lib/story/use-persistent-orb-hit-zone";
import { useStorySpatialLayout } from "@/lib/story/use-story-viewport";
import {
  PERSISTENT_ORB,
  storyStageViewBoxForWidth,
  persistentOrbIntensity,
  persistentOrbModeBlend,
  persistentOrbVisible,
  type PersistentOrbMode,
} from "@/lib/story/persistent-orb";
import { cn } from "@/lib/utils";

import { FrontdeskVoiceOrb } from "./frontdesk-voice-orb";
import { HoursDayNightCycle } from "./hours-day-night-cycle";

type PersistentFrontdeskOrbProps = {
  story: number;
  hoursSceneOpacity?: number;
};

function OrbInstance({
  mode,
  opacity,
  pointerX,
  pointerY,
  intensity,
  reduceMotion,
  idSuffix,
}: {
  mode: PersistentOrbMode;
  opacity: number;
  pointerX: number;
  pointerY: number;
  intensity: number;
  reduceMotion: boolean;
  idSuffix: string;
}) {
  if (opacity < 0.02) return null;

  return (
    <g opacity={opacity}>
      <g className={cn("persistent-orb__instance", `persistent-orb__instance--${mode}`)}>
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
    </g>
  );
}

export function PersistentFrontdeskOrb({ story, hoursSceneOpacity = 0 }: PersistentFrontdeskOrbProps) {
  const reduceMotion = usePrefersReducedMotion();
  const spatial = useStorySpatialLayout();
  const { helios } = useHeliosVoice();
  const { inputProps } = useVideoFrame(helios);
  const pointerX = inputProps.pointerX ?? 0;
  const pointerY = inputProps.pointerY ?? 0;

  const hitZone = usePersistentOrbHitZone();

  if (!persistentOrbVisible(story) || !hitZone.visible) return null;

  const { mode, blend, nextMode } = persistentOrbModeBlend(story);
  const intensity = persistentOrbIntensity(story);
  const orbViewBox = storyStageViewBoxForWidth(spatial.viewportWidth);
  const orbVisualStyle = { opacity: hitZone.opacity };

  return (
    <div
      className="story-illustration-bg__persistent-orb"
      data-orb-mode={mode}
      style={orbVisualStyle}
    >
      <div className="story-illustration-bg__persistent-orb-pin" aria-hidden>
        {hoursSceneOpacity > 0.02 ? (
          <HoursDayNightCycle story={story} sceneOpacity={hoursSceneOpacity} />
        ) : null}
        <svg
          viewBox={orbViewBox}
          className="story-illustration-bg__persistent-orb-svg"
          preserveAspectRatio={spatial.preserveAspectRatio}
          suppressHydrationWarning
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
            />
          ) : null}
        </svg>
      </div>
    </div>
  );
}

export { PERSISTENT_ORB };
