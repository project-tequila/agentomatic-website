"use client";

import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";

import { featureBandProgress } from "@/lib/story/feature-band-progress";
import {
  INTEGRATION_CHANNELS,
  integrationChannelState,
} from "@/lib/story/integrations-reveal";
import { cn } from "@/lib/utils";

type IntegrationsFeatureTitleProps = {
  story: number;
};

function ChannelWord({
  index,
  progress,
  reduceMotion,
}: {
  index: number;
  progress: number;
  reduceMotion: boolean;
}) {
  const channel = INTEGRATION_CHANNELS[index];
  if (!channel) return null;

  const state = integrationChannelState(progress, index, reduceMotion);
  const live = state.highlight >= 0.72 && state.opacity > 0.5;

  return (
    <span
      className={cn("integrations-channels__item", live && !reduceMotion && "integrations-channels__item--live")}
      style={{
        opacity: state.opacity,
        transform: `translate3d(${state.translateX * 0.06}px, ${state.translateY * 0.1}px, 0) scale(${0.88 + state.scale * 0.12})`,
        ["--channel-color" as string]: channel.color,
        ["--channel-glow" as string]: channel.glow,
        ["--channel-highlight" as string]: state.highlight,
      }}
    >
      <span className="integrations-channels__label">{channel.label}</span>
    </span>
  );
}

function ChannelSep({
  index,
  progress,
  reduceMotion,
}: {
  index: number;
  progress: number;
  reduceMotion: boolean;
}) {
  const state = integrationChannelState(progress, index, reduceMotion);

  return (
    <span className="integrations-channels__sep" style={{ opacity: state.opacity }} aria-hidden>
      ·
    </span>
  );
}

export function IntegrationsFeatureTitle({ story }: IntegrationsFeatureTitleProps) {
  const reduceMotion = usePrefersReducedMotion();
  const progress = featureBandProgress(story, "integrations");
  const motionOff = !!reduceMotion;

  if (progress === null) {
    return (
      <h2 className="rumik-story__title rumik-story__title--integrations">
        <span className="integrations-channels">
          <span className="integrations-channels__row">
            <span>phone · whatsapp</span>
          </span>
          <span className="integrations-channels__row">
            <span>· email · calendar.</span>
          </span>
        </span>
      </h2>
    );
  }

  const calendar = integrationChannelState(progress, 3, motionOff);

  return (
    <h2 className="rumik-story__title rumik-story__title--integrations">
      <span className="integrations-channels">
        <span className="integrations-channels__row">
          <ChannelWord index={0} progress={progress} reduceMotion={motionOff} />
          <ChannelSep index={1} progress={progress} reduceMotion={motionOff} />
          <ChannelWord index={1} progress={progress} reduceMotion={motionOff} />
        </span>
        <span className="integrations-channels__row">
          <ChannelSep index={2} progress={progress} reduceMotion={motionOff} />
          <ChannelWord index={2} progress={progress} reduceMotion={motionOff} />
          <ChannelSep index={3} progress={progress} reduceMotion={motionOff} />
          <ChannelWord index={3} progress={progress} reduceMotion={motionOff} />
          <span className="integrations-channels__period" style={{ opacity: calendar.opacity }}>
            .
          </span>
        </span>
      </span>
    </h2>
  );
}
