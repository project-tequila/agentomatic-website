"use client";

import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";

import { useSvgGroupMagnetic } from "@/lib/motion/use-svg-group-magnetic";
import { featureBandProgress } from "@/lib/story/feature-band-progress";
import {
  INTEGRATION_CHANNELS,
  INTEGRATION_STAGE,
  type IntegrationNode,
  integrationChannelState,
} from "@/lib/story/integrations-reveal";
import { storyStageViewBoxForWidth } from "@/lib/story/persistent-orb";
import { useStorySpatialLayout } from "@/lib/story/use-story-viewport";
import { cn } from "@/lib/utils";

import { IntegrationFlowStreams } from "./integration-flow-streams";
import { PremiumChannelGlyph } from "./integration-channel-glyphs";

type IntegrationsSceneProps = {
  story: number;
  opacity: number;
};

const CHANNEL_IDS = INTEGRATION_CHANNELS.map((ch) => ch.id);

function channelNode(nodes: readonly IntegrationNode[], id: string) {
  return nodes.find((node) => node.id === id);
}

export function IntegrationsScene({ story, opacity: sceneOpacity }: IntegrationsSceneProps) {
  const reduceMotion = usePrefersReducedMotion();
  const spatial = useStorySpatialLayout();
  const { nodes, satelliteScale, hubScale } = spatial.integrations;
  const { offsets, setGroupRef } = useSvgGroupMagnetic(CHANNEL_IDS, {
    strength: 0.42,
    maxDisplacement: 14,
    radiusFactor: 1.2,
    disabled: !!reduceMotion,
  });

  const progress = featureBandProgress(story, "integrations");
  if (progress === null || sceneOpacity < 0.02) return null;

  return (
    <svg
      viewBox={storyStageViewBoxForWidth(spatial.viewportWidth)}
      preserveAspectRatio={spatial.preserveAspectRatio}
      suppressHydrationWarning
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
        nodes={nodes}
        progress={progress}
        reduceMotion={!!reduceMotion}
        viewportWidth={spatial.viewportWidth}
      />

      {INTEGRATION_CHANNELS.map((channel, index) => {
        const node = channelNode(nodes, channel.id);
        if (!node) return null;

        const state = integrationChannelState(progress, index, !!reduceMotion, spatial.viewportWidth);
        const side = node.x < INTEGRATION_STAGE.orbX ? -1 : 1;
        const mag = offsets[channel.id] ?? { x: 0, y: 0 };
        const tx = node.x + state.translateX * side * 0.22;
        const ty = node.y + state.translateY * 0.22;
        const animated = state.highlight >= 0.72 && state.opacity > 0.5;
        const hubR = 48 * hubScale;
        const ringR = 58 * hubScale;

        return (
          <g
            key={channel.id}
            transform={`translate(${tx} ${ty}) scale(${state.scale * satelliteScale})`}
            opacity={state.opacity}
            filter={`url(#int-glow-${channel.id})`}
          >
            {/* Magnetic pull in local hub space so layout scale stays responsive. */}
            <g
              ref={(el) => setGroupRef(channel.id, el)}
              transform={`translate(${mag.x} ${mag.y})`}
              className="integrations-scene__channel-hub"
            >
              <g
                className={cn(animated && "integrations-scene__icon--live")}
                style={animated ? { animationDelay: `${index * 0.18}s` } : undefined}
              >
                <circle
                  r={ringR}
                  fill="none"
                  stroke={channel.color}
                  strokeWidth="1.2"
                  opacity={0.18 + state.highlight * 0.35}
                  className={animated ? "integrations-scene__icon-ring" : undefined}
                  style={animated ? { animationDelay: `${index * 0.18}s` } : undefined}
                />
                <circle r={hubR} fill="url(#intGlass)" stroke={channel.color} strokeWidth="2" opacity="0.98" />
                <circle r={hubR} fill={channel.color} opacity={0.06 + state.highlight * 0.08} />
                <g opacity={0.82 + state.highlight * 0.18} transform={`scale(${hubScale})`}>
                  <PremiumChannelGlyph id={channel.id} color={channel.color} uid={channel.id} />
                </g>
              </g>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
