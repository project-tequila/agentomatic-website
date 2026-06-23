"use client";

import { useReducedMotion } from "framer-motion";

import { featureBandProgress } from "@/lib/story/feature-band-progress";
import {
  INTEGRATION_CHANNELS,
  INTEGRATION_NODES,
  INTEGRATION_STAGE,
  integrationChannelState,
} from "@/lib/story/integrations-reveal";
import { STORY_STAGE_PRESERVE, STORY_SATELLITE_ICON_SCALE, storyStageViewBox } from "@/lib/story/persistent-orb";
import { cn } from "@/lib/utils";

import { IntegrationFlowStreams } from "./integration-flow-streams";
import { PremiumChannelGlyph } from "./integration-channel-glyphs";

type IntegrationsSceneProps = {
  story: number;
  opacity: number;
};

function channelNode(id: string) {
  return INTEGRATION_NODES.find((node) => node.id === id);
}

export function IntegrationsScene({ story, opacity: sceneOpacity }: IntegrationsSceneProps) {
  const reduceMotion = useReducedMotion();

  const progress = featureBandProgress(story, "integrations");
  if (progress === null || sceneOpacity < 0.02) return null;

  return (
    <svg
      viewBox={storyStageViewBox()}
      preserveAspectRatio={STORY_STAGE_PRESERVE}
      className="integrations-scene"
      aria-hidden
      style={{ opacity: sceneOpacity }}
    >
      <defs>
        {INTEGRATION_CHANNELS.map((ch) => (
          <filter key={ch.id} id={`int-glow-${ch.id}`} x="-80%" y="-80%" width="260%" height="260%">
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor={ch.color} floodOpacity="0.55" />
          </filter>
        ))}
        <linearGradient id="intGlass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(18,20,24,0.92)" />
        </linearGradient>
      </defs>

      <IntegrationFlowStreams
        orbX={INTEGRATION_STAGE.orbX}
        orbY={INTEGRATION_STAGE.orbY}
        progress={progress}
        reduceMotion={!!reduceMotion}
      />

      {INTEGRATION_CHANNELS.map((channel, index) => {
        const node = channelNode(channel.id);
        if (!node) return null;

        const state = integrationChannelState(progress, index, !!reduceMotion);
        const side = node.x < INTEGRATION_STAGE.orbX ? -1 : 1;
        const tx = node.x + state.translateX * side * 0.28;
        const ty = node.y + state.translateY * 0.28;
        const animated = state.highlight >= 0.72 && state.opacity > 0.5;

        return (
          <g
            key={channel.id}
            transform={`translate(${tx} ${ty}) scale(${state.scale * STORY_SATELLITE_ICON_SCALE})`}
            opacity={state.opacity}
            filter={`url(#int-glow-${channel.id})`}
          >
            <g
              className={cn(animated && !reduceMotion && "integrations-scene__icon--live")}
              style={animated ? { animationDelay: `${index * 0.18}s` } : undefined}
            >
              <circle
                r="58"
                fill="none"
                stroke={channel.color}
                strokeWidth="1.2"
                opacity={0.18 + state.highlight * 0.35}
                className={animated && !reduceMotion ? "integrations-scene__icon-ring" : undefined}
                style={animated ? { animationDelay: `${index * 0.18}s` } : undefined}
              />
              <circle r="48" fill="url(#intGlass)" stroke={channel.color} strokeWidth="2" opacity="0.98" />
              <circle r="48" fill={channel.color} opacity={0.06 + state.highlight * 0.08} />
              <g opacity={0.82 + state.highlight * 0.18}>
                <PremiumChannelGlyph id={channel.id} color={channel.color} uid={channel.id} />
              </g>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
