"use client";

import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";

import { useHeliosVoice } from "@/lib/helios/helios-provider";
import { useVideoFrame } from "@/lib/helios/use-video-frame";
import { featureBandProgress } from "@/lib/story/feature-band-progress";
import { handoffOrbShift } from "@/lib/story/handoff-reveal";
import { usePersistentOrbHitZone } from "@/lib/story/use-persistent-orb-hit-zone";
import { useStorySpatialLayout } from "@/lib/story/use-story-viewport";
import {
  gruntStageViewBox,
  PERSISTENT_ORB,
  STORY_STAGE_PRESERVE,
  storyStageViewBox,
  persistentOrbIntensity,
  persistentOrbModeBlend,
  persistentOrbVisible,
  type PersistentOrbMode,
} from "@/lib/story/persistent-orb";
import { cn } from "@/lib/utils";

import { FrontdeskVoiceOrb } from "./frontdesk-voice-orb";

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
  const orbVisualStyle = { opacity: hitZone.opacity };

  return (
    <div className="story-illustration-bg__persistent-orb" style={orbVisualStyle}>
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
    </div>
  );
}

export { PERSISTENT_ORB };
