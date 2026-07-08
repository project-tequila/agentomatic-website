"use client";

import {
  CALL_THEME,
  concurrentFlowIntensity,
  concurrentInboundFlowPath,
  concurrentOutboundFlowPath,
  type ConcurrentNetworkPhone,
} from "@/lib/story/concurrent-reveal";
import { cn } from "@/lib/utils";

type CallFlowStreamsProps = {
  orbX: number;
  orbY: number;
  progress: number;
  phones: ConcurrentNetworkPhone[];
  reduceMotion?: boolean;
  viewportWidth?: number;
};

export function CallFlowStreams({
  orbX,
  orbY,
  progress,
  phones,
  reduceMotion = false,
  viewportWidth = 1200,
}: CallFlowStreamsProps) {
  const inboundIntensity = concurrentFlowIntensity(progress, "inbound");
  const outboundIntensity = concurrentFlowIntensity(progress, "outbound");

  if (phones.length === 0) return null;

  return (
    <g className="concurrent-scene__flows" aria-hidden>
      <defs>
        <linearGradient id="flowInbound" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={CALL_THEME.inbound.color} stopOpacity="0.2" />
          <stop offset="78%" stopColor={CALL_THEME.inbound.color} stopOpacity="0.75" />
          <stop offset="100%" stopColor={CALL_THEME.inbound.color} stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="flowOutbound" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={CALL_THEME.outbound.color} stopOpacity="0.15" />
          <stop offset="22%" stopColor={CALL_THEME.outbound.color} stopOpacity="0.75" />
          <stop offset="100%" stopColor={CALL_THEME.outbound.color} stopOpacity="0.2" />
        </linearGradient>
        <filter id="concurrentFlowFluff" x="-30%" y="-40%" width="160%" height="180%">
          <feGaussianBlur stdDeviation="2.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="concurrentHubGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8cffd2" stopOpacity="0.2" />
          <stop offset="55%" stopColor="#74c0fc" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ffc857" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g opacity={Math.max(inboundIntensity, outboundIntensity) * 0.5}>
        {[148, 188, 228, 268].map((rx, i) => (
          <ellipse
            key={rx}
            cx={orbX}
            cy={orbY + 4}
            rx={rx}
            ry={rx * 0.62}
            fill="none"
            stroke="rgba(245,242,235,0.05)"
            strokeWidth="0.7"
            strokeDasharray={i % 2 === 0 ? "2 12" : "4 9"}
            className="concurrent-scene__network-ring"
            style={{ animationDelay: `${i * 0.35}s` }}
          />
        ))}
        <circle cx={orbX} cy={orbY} r="58" fill="url(#concurrentHubGlow)" opacity="0.9" />
      </g>

      {phones.map((phone, i) => {
        const isInbound = phone.direction === "inbound";
        const intensity = isInbound ? inboundIntensity : outboundIntensity;
        const path = isInbound
          ? concurrentInboundFlowPath(phone.x, phone.y, orbX, orbY, phone.depth, i, viewportWidth)
          : concurrentOutboundFlowPath(phone.x, phone.y, orbX, orbY, phone.depth, i, viewportWidth);
        const stroke = isInbound ? "url(#flowInbound)" : "url(#flowOutbound)";
        const dotColor = CALL_THEME[phone.direction].color;
        const pathOpacity = intensity * (0.38 + phone.depth * 0.62) * phone.opacity;
        const strokeW = 1.1 + phone.depth * 0.85;

        return (
          <g key={`flow-${phone.id}`} opacity={pathOpacity}>
            <path
              d={path}
              fill="none"
              stroke={stroke}
              strokeWidth={strokeW + 2.2}
              strokeLinecap="round"
              strokeDasharray="6 10"
              opacity="0.22"
              filter="url(#concurrentFlowFluff)"
              className="concurrent-scene__flow concurrent-scene__flow--fluff"
              style={{ animationDelay: `${i * 0.14}s` }}
            />
            <path
              d={path}
              fill="none"
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinecap="round"
              strokeDasharray="5 9"
              className={cn(
                "concurrent-scene__flow",
                isInbound ? "concurrent-scene__flow--inbound" : "concurrent-scene__flow--outbound",
              )}
              style={{ animationDelay: `${i * 0.14}s` }}
            />
            {!reduceMotion ? (
              <>
                <circle r={2 + phone.depth * 1.4} fill={dotColor} opacity={0.7 + phone.depth * 0.25}>
                  <animateMotion
                    dur={`${1.8 + (1 - phone.depth) * 0.9}s`}
                    repeatCount="indefinite"
                    path={path}
                    calcMode="spline"
                    keyTimes="0;1"
                    keySplines="0.42 0 0.58 1"
                  />
                </circle>
                <circle r={1.2 + phone.depth * 0.8} fill={dotColor} opacity={0.45}>
                  <animateMotion
                    dur={`${2.2 + (1 - phone.depth) * 0.7}s`}
                    repeatCount="indefinite"
                    path={path}
                    begin={`${0.4 + i * 0.1}s`}
                    calcMode="spline"
                    keyTimes="0;1"
                    keySplines="0.42 0 0.58 1"
                  />
                </circle>
              </>
            ) : null}
          </g>
        );
      })}
    </g>
  );
}
