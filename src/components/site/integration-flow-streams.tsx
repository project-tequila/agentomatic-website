"use client";

import {
  INTEGRATION_CHANNELS,
  type IntegrationNode,
  integrationChannelState,
} from "@/lib/story/integrations-reveal";
import { useStoryFlowMagnetic } from "@/lib/motion/use-story-flow-magnetic";

type IntegrationFlowStreamsProps = {
  orbX: number;
  orbY: number;
  nodes: readonly IntegrationNode[];
  progress: number;
  reduceMotion?: boolean;
  viewportWidth?: number;
  /** Channel currently under the pointer — brightens that link. */
  focusedId?: string | null;
  /** 0–1 soft ecosystem sync wave radiating from the orb. */
  syncPulse?: number;
};

const ORB_RADIUS = 38;
const ICON_RADIUS = 54;
/** Reference chord so particle timing stays consistent across layouts. */
const LINK_CHORD_REFERENCE = 108;

export type LinkGeometry = {
  path: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  chord: number;
  ux: number;
  uy: number;
};

export function linkGeometry(nodeX: number, nodeY: number, orbX: number, orbY: number): LinkGeometry {
  const dx = orbX - nodeX;
  const dy = orbY - nodeY;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;

  const x1 = nodeX + ux * ICON_RADIUS;
  const y1 = nodeY + uy * ICON_RADIUS;
  const x2 = orbX - ux * ORB_RADIUS;
  const y2 = orbY - uy * ORB_RADIUS;
  const chord = Math.hypot(x2 - x1, y2 - y1) || 1;
  /** Mild bow — connection, not a pipeline. */
  const bow = 14 * (chord / LINK_CHORD_REFERENCE);
  const cx = (x1 + x2) / 2 + uy * bow;
  const cy = (y1 + y2) / 2 - ux * bow;

  const path = `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;

  return { path, x1, y1, x2, y2, chord, ux, uy };
}

/** How far (stage units) to ease a hub toward the orb on focus. */
export function towardOrbPull(nodeX: number, nodeY: number, orbX: number, orbY: number, amount = 7) {
  const dx = orbX - nodeX;
  const dy = orbY - nodeY;
  const len = Math.hypot(dx, dy) || 1;
  return { x: (dx / len) * amount, y: (dy / len) * amount };
}

function ambientParticles(
  channelId: string,
  path: string,
  color: string,
  chord: number,
  delayBase: number,
  reduceMotion: boolean,
) {
  if (reduceMotion) return null;

  const travel = 4.8 * (chord / LINK_CHORD_REFERENCE);
  const travelBack = 5.4 * (chord / LINK_CHORD_REFERENCE);
  const specs = [
    { r: 1.35, opacity: 0.55, dur: travel, begin: delayBase, reverse: false },
    { r: 1.1, opacity: 0.4, dur: travel, begin: delayBase + travel * 0.33, reverse: false },
    { r: 1.2, opacity: 0.45, dur: travelBack, begin: delayBase + 0.4, reverse: true },
    { r: 0.95, opacity: 0.32, dur: travelBack, begin: delayBase + travelBack * 0.45, reverse: true },
  ];

  return specs.map((spec, i) => (
    <circle
      key={`${channelId}-p-${i}`}
      r={spec.r}
      fill={color}
      opacity={spec.opacity}
      className="integrations-scene__particle"
    >
      <animateMotion
        dur={`${spec.dur}s`}
        repeatCount="indefinite"
        path={path}
        begin={`${spec.begin}s`}
        calcMode="linear"
        {...(spec.reverse ? { keyPoints: "1;0", keyTimes: "0;1" } : {})}
      />
      <animate
        attributeName="opacity"
        values={`0;${spec.opacity};${spec.opacity};0`}
        keyTimes="0;0.12;0.88;1"
        dur={`${spec.dur}s`}
        repeatCount="indefinite"
        begin={`${spec.begin}s`}
      />
    </circle>
  ));
}

export function IntegrationFlowStreams({
  orbX,
  orbY,
  nodes,
  progress,
  reduceMotion = false,
  viewportWidth = 1200,
  focusedId = null,
  syncPulse = 0,
}: IntegrationFlowStreamsProps) {
  const flowIds = nodes.map((n) => n.id);
  const { offsets, setGroupRef } = useStoryFlowMagnetic(flowIds, { disabled: !!reduceMotion });

  return (
    <g className="integrations-scene__flows" aria-hidden>
      <defs>
        {INTEGRATION_CHANNELS.map((ch) => {
          const node = nodes.find((n) => n.id === ch.id);
          const x1 = node ? node.x : orbX;
          const y1 = node ? node.y : orbY;

          return (
            <linearGradient
              key={`grad-${ch.id}`}
              id={`intFlow-${ch.id}`}
              gradientUnits="userSpaceOnUse"
              x1={x1}
              y1={y1}
              x2={orbX}
              y2={orbY}
            >
              <stop offset="0%" stopColor={ch.color} stopOpacity="0.05" />
              <stop offset="45%" stopColor={ch.color} stopOpacity="0.45" />
              <stop offset="100%" stopColor={ch.color} stopOpacity="0.12" />
            </linearGradient>
          );
        })}
        <filter id="intLinkGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Soft sync ring — confirmation radiates from the hub. */}
      {syncPulse > 0.02 && !reduceMotion ? (
        <circle
          cx={orbX}
          cy={orbY}
          r={48 + syncPulse * 160}
          fill="none"
          stroke="rgba(245,242,235,0.55)"
          strokeWidth={1.2 - syncPulse * 0.6}
          opacity={(1 - syncPulse) * 0.55}
          className="integrations-scene__sync-ring"
        />
      ) : null}

      {nodes.map((node, index) => {
        const channel = INTEGRATION_CHANNELS[index];
        if (!channel) return null;

        const state = integrationChannelState(progress, index, reduceMotion, viewportWidth);
        if (state.opacity < 0.04) return null;

        const { path, x1, y1, x2, y2, chord } = linkGeometry(node.x, node.y, orbX, orbY);
        const focused = focusedId === channel.id;
        const linkOpacity = 0.12 + state.opacity * 0.28 + (focused ? 0.55 : 0) + syncPulse * 0.35;
        const delay = index * 0.55;
        const mag = offsets[node.id] ?? { x: 0, y: 0 };

        return (
          <g
            key={`flow-${node.id}`}
            opacity={state.opacity}
            className="integrations-scene__link-group story-flow-magnetic"
            ref={(el) => setGroupRef(node.id, el)}
            transform={`translate(${mag.x} ${mag.y})`}
          >
            {/* Always-on faint connection — presence, not throughput. */}
            <path
              d={path}
              fill="none"
              stroke={channel.color}
              strokeWidth={focused ? 1.1 : 0.7}
              opacity={0.12 + (focused ? 0.2 : 0)}
              strokeLinecap="round"
            />

            {/* Luminous active link on hover. */}
            <path
              d={path}
              fill="none"
              stroke={`url(#intFlow-${channel.id})`}
              strokeWidth={focused ? 2.4 : 1.2}
              opacity={focused ? Math.min(1, linkOpacity) : linkOpacity * 0.55}
              strokeLinecap="round"
              filter={focused ? "url(#intLinkGlow)" : undefined}
              className={focused ? "integrations-scene__link--focus" : "integrations-scene__link--idle"}
            />

            {focused ? (
              <path
                d={path}
                fill="none"
                stroke="#f5f2eb"
                strokeWidth="0.9"
                opacity="0.45"
                strokeLinecap="round"
                strokeDasharray="3 10"
                className="integrations-scene__link-sheen"
              />
            ) : null}

            {ambientParticles(channel.id, path, channel.color, chord, delay, reduceMotion)}

            <circle
              cx={x1}
              cy={y1}
              r={focused ? 2.4 : 1.6}
              fill={channel.color}
              opacity={0.25 + state.opacity * 0.25 + (focused ? 0.35 : 0) + syncPulse * 0.4}
            />
            <circle
              cx={x2}
              cy={y2}
              r={focused ? 2.2 : 1.5}
              fill={channel.color}
              opacity={0.2 + state.opacity * 0.2 + (focused ? 0.3 : 0) + syncPulse * 0.45}
            />
          </g>
        );
      })}
    </g>
  );
}
