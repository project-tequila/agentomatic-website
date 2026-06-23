"use client";

import {
  INTEGRATION_CHANNELS,
  INTEGRATION_NODES,
  integrationChannelState,
} from "@/lib/story/integrations-reveal";

type IntegrationFlowStreamsProps = {
  orbX: number;
  orbY: number;
  progress: number;
  reduceMotion?: boolean;
};

const ORB_RADIUS = 38;
const ICON_RADIUS = 54;

function linkGeometry(nodeX: number, nodeY: number, orbX: number, orbY: number) {
  const dx = orbX - nodeX;
  const dy = orbY - nodeY;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;

  const x1 = nodeX + ux * ICON_RADIUS;
  const y1 = nodeY + uy * ICON_RADIUS;
  const x2 = orbX - ux * ORB_RADIUS;
  const y2 = orbY - uy * ORB_RADIUS;
  const cx = (x1 + x2) / 2 + uy * 22;
  const cy = (y1 + y2) / 2 - ux * 22;

  const path = `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;

  return { path, x1, y1, x2, y2 };
}

export function IntegrationFlowStreams({ orbX, orbY, progress, reduceMotion = false }: IntegrationFlowStreamsProps) {
  return (
    <g className="integrations-scene__flows" aria-hidden>
      <defs>
        {INTEGRATION_CHANNELS.map((ch) => {
          const node = INTEGRATION_NODES.find((n) => n.id === ch.id);
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
              <stop offset="0%" stopColor={ch.color} stopOpacity="0.15" />
              <stop offset="50%" stopColor={ch.color} stopOpacity="0.7" />
              <stop offset="100%" stopColor={ch.color} stopOpacity="0.25" />
            </linearGradient>
          );
        })}
      </defs>

      {INTEGRATION_NODES.map((node, index) => {
        const channel = INTEGRATION_CHANNELS[index];
        if (!channel) return null;

        const state = integrationChannelState(progress, index, reduceMotion);
        const intensity = state.opacity * state.highlight;
        if (intensity < 0.04) return null;

        const { path, x1, y1, x2, y2 } = linkGeometry(node.x, node.y, orbX, orbY);
        const delay = index * 0.35;

        return (
          <g key={`flow-${node.id}`} opacity={0.25 + intensity * 0.75}>
            <path
              d={path}
              fill="none"
              stroke={`url(#intFlow-${channel.id})`}
              strokeWidth="1.6"
              strokeDasharray="6 9"
              opacity="0.75"
              className={reduceMotion ? undefined : "integrations-scene__flow"}
              style={reduceMotion ? undefined : { animationDelay: `${delay}s` }}
            />
            <path
              d={path}
              fill="none"
              stroke={channel.color}
              strokeWidth="0.8"
              strokeDasharray="2 14"
              opacity="0.35"
              className={reduceMotion ? undefined : "integrations-scene__flow integrations-scene__flow--accent"}
              style={reduceMotion ? undefined : { animationDelay: `${delay + 0.12}s` }}
            />

            {!reduceMotion ? (
              <>
                <circle r="3" fill={channel.color} opacity="0.85">
                  <animateMotion dur="2.2s" repeatCount="indefinite" path={path} begin={`${delay}s`} calcMode="linear" />
                  <animate attributeName="opacity" values="0.3;0.95;0.3" dur="2.2s" repeatCount="indefinite" begin={`${delay}s`} />
                </circle>
                <circle r="2.2" fill={channel.color} opacity="0.55">
                  <animateMotion dur="2.2s" repeatCount="indefinite" path={path} begin={`${delay + 1.1}s`} calcMode="linear" />
                </circle>
                <circle r="2.5" fill="#f5f2eb" opacity="0.7">
                  <animateMotion
                    dur="2.6s"
                    repeatCount="indefinite"
                    path={path}
                    begin={`${delay + 0.55}s`}
                    calcMode="linear"
                    keyPoints="1;0"
                    keyTimes="0;1"
                  />
                  <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.6s" repeatCount="indefinite" begin={`${delay + 0.55}s`} />
                </circle>
              </>
            ) : null}

            <circle cx={x1} cy={y1} r="2" fill={channel.color} opacity={0.4 + intensity * 0.35} />
            <circle cx={x2} cy={y2} r="2" fill={channel.color} opacity={0.35 + intensity * 0.3} />
          </g>
        );
      })}
    </g>
  );
}
