"use client";

import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";

import { useDemoCall } from "@/lib/demo-call/demo-call-context";
import { useHeliosVoice } from "@/lib/helios/helios-provider";
import { useVideoFrame } from "@/lib/helios/use-video-frame";
import { heliosFromRealtimeVoice } from "@/lib/voice/demo-web-voice-errors";
import { useDemoWebVoice } from "@/lib/voice/demo-web-voice-context";
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

import { HoursDayNightCycle } from "./hours-day-night-cycle";
import { VoiceAgenticOrb, type VoiceAgenticOrbState } from "./voice-agentic-orb";

type PersistentFrontdeskOrbProps = {
  story: number;
  hoursSceneOpacity?: number;
};

function mapVoiceState(status: string, isAgentSpeaking: boolean): VoiceAgenticOrbState {
  if (isAgentSpeaking) return "speaking";
  if (status === "connecting") return "connecting";
  if (status === "listening") return "listening";
  return "idle";
}

function OrbPhotoInstance({
  mode,
  opacity,
  intensity,
  voiceState,
  energy,
  reduceMotion,
}: {
  mode: PersistentOrbMode;
  opacity: number;
  intensity: number;
  voiceState: VoiceAgenticOrbState;
  energy: number;
  reduceMotion: boolean;
}) {
  if (opacity < 0.02) return null;

  const blendedEnergy = Math.min(1, energy * (0.55 + intensity * 0.45));

  return (
    <div
      className={cn("persistent-orb__photo-instance", `persistent-orb__photo-instance--${mode}`)}
      style={{ opacity }}
    >
      <VoiceAgenticOrb
        voiceState={voiceState}
        energy={blendedEnergy}
        reduceMotion={reduceMotion}
        variant={mode === "dashboard" ? "soft-halo" : "primary"}
        size="min(20rem, 48vw)"
      />
    </div>
  );
}

export function PersistentFrontdeskOrb({ story, hoursSceneOpacity = 0 }: PersistentFrontdeskOrbProps) {
  const reduceMotion = usePrefersReducedMotion();
  const spatial = useStorySpatialLayout();
  const { helios } = useHeliosVoice();
  const { inputProps } = useVideoFrame(helios);
  const { isOpen } = useDemoCall();
  const { status, isAgentSpeaking } = useDemoWebVoice();

  const hitZone = usePersistentOrbHitZone();

  const voiceActive =
    status === "connecting" || status === "listening" || isAgentSpeaking;
  if (!persistentOrbVisible(story) || !hitZone.visible) return null;
  if (voiceActive || isOpen) return null;

  const { mode, blend, nextMode } = persistentOrbModeBlend(story);
  const intensity = persistentOrbIntensity(story);
  const orbViewBox = storyStageViewBoxForWidth(spatial.viewportWidth);
  const orbVisualStyle = { opacity: hitZone.opacity };
  const voiceMapped = heliosFromRealtimeVoice({ status, isAgentSpeaking });
  const voiceState = mapVoiceState(status, isAgentSpeaking);
  const baseEnergy = Math.max(voiceMapped.energy, 0.22 + intensity * 0.18);

  return (
    <div
      className="story-illustration-bg__persistent-orb"
      data-orb-mode={mode}
      style={orbVisualStyle}
    >
      <div
        className="story-illustration-bg__persistent-orb-pin"
        aria-hidden
        data-viewbox={orbViewBox}
      >
        {hoursSceneOpacity > 0.02 ? (
          <HoursDayNightCycle story={story} sceneOpacity={hoursSceneOpacity} />
        ) : null}
        <div className="story-illustration-bg__persistent-orb-photo">
          <OrbPhotoInstance
            mode={mode}
            opacity={1 - blend}
            intensity={intensity}
            voiceState={voiceState}
            energy={baseEnergy}
            reduceMotion={!!reduceMotion}
          />
          {blend > 0.02 ? (
            <OrbPhotoInstance
              mode={nextMode}
              opacity={blend}
              intensity={intensity}
              voiceState={voiceState}
              energy={baseEnergy}
              reduceMotion={!!reduceMotion}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export { PERSISTENT_ORB };
