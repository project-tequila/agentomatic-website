"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";

import { featureBandSceneProgress } from "@/lib/story/feature-band-progress";
import {
  INTEGRATION_CHANNELS,
  INTEGRATION_STAGE,
  type IntegrationNode,
  integrationChannelState,
} from "@/lib/story/integrations-reveal";
import { storyStageViewBoxForWidth } from "@/lib/story/persistent-orb";
import { useStorySpatialLayout } from "@/lib/story/use-story-viewport";
import { cn } from "@/lib/utils";

import { IntegrationFlowStreams, towardOrbPull } from "./integration-flow-streams";
import { PremiumChannelGlyph } from "./integration-channel-glyphs";
import { useSvgGroupMagnetic } from "@/lib/motion/use-svg-group-magnetic";

type IntegrationsSceneProps = {
  story: number;
  opacity: number;
};

const CHANNEL_IDS = INTEGRATION_CHANNELS.map((ch) => ch.id);
const HOVER_PULL_PX = 7;
const SYNC_PULSE_MS = 1100;

function channelNode(nodes: readonly IntegrationNode[], id: string) {
  return nodes.find((node) => node.id === id);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function applyOrbChannelTint(color: string | null, strength: number) {
  const root = document.documentElement;
  if (!color || strength < 0.01) {
    root.style.removeProperty("--integrations-orb-tint");
    root.style.removeProperty("--integrations-orb-tint-strength");
    return;
  }
  root.style.setProperty("--integrations-orb-tint", color);
  root.style.setProperty("--integrations-orb-tint-strength", strength.toFixed(3));
}

export function IntegrationsScene({ story, opacity: sceneOpacity }: IntegrationsSceneProps) {
  const reduceMotion = usePrefersReducedMotion();
  const spatial = useStorySpatialLayout();
  const { nodes, satelliteScale, hubScale } = spatial.integrations;
  const progress = featureBandSceneProgress(story, "integrations");

  const { offsets: iconOffsets, setGroupRef: setIconRef } = useSvgGroupMagnetic(CHANNEL_IDS, {
    strength: 0.4,
    maxDisplacement: 12,
    radiusFactor: 1.15,
    disabled: !!reduceMotion,
  });

  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [syncPulse, setSyncPulse] = useState(0);
  const [pullOffsets, setPullOffsets] = useState<Record<string, { x: number; y: number }>>(
    () => Object.fromEntries(CHANNEL_IDS.map((id) => [id, { x: 0, y: 0 }])),
  );
  const rafRef = useRef(0);
  const syncRafRef = useRef(0);
  const tickPullRef = useRef<() => void>(() => {});

  const tickPull = useCallback(() => {
    let settling = false;
    setPullOffsets((prev) => {
      const next: Record<string, { x: number; y: number }> = { ...prev };
      for (const id of CHANNEL_IDS) {
        const node = channelNode(nodes, id);
        if (!node) continue;
        const target =
          focusedId === id && !reduceMotion
            ? towardOrbPull(node.x, node.y, INTEGRATION_STAGE.orbX, INTEGRATION_STAGE.orbY, HOVER_PULL_PX)
            : { x: 0, y: 0 };
        const cur = next[id] ?? { x: 0, y: 0 };
        const x = lerp(cur.x, target.x, 0.14);
        const y = lerp(cur.y, target.y, 0.14);
        next[id] = { x, y };
        if (
          Math.abs(x - target.x) > 0.05 ||
          Math.abs(y - target.y) > 0.05 ||
          Math.abs(x) > 0.05 ||
          Math.abs(y) > 0.05
        ) {
          settling = true;
        }
      }
      return next;
    });

    if (settling || focusedId) {
      rafRef.current = requestAnimationFrame(() => tickPullRef.current());
    } else {
      rafRef.current = 0;
    }
  }, [focusedId, nodes, reduceMotion]);

  useEffect(() => {
    tickPullRef.current = tickPull;
  }, [tickPull]);

  const startPullLoop = useCallback(() => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(() => tickPullRef.current());
  }, []);

  const runSyncPulse = useCallback(() => {
    if (reduceMotion) return;
    if (syncRafRef.current) cancelAnimationFrame(syncRafRef.current);
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / SYNC_PULSE_MS);
      // Ease out: soft wash then fade.
      const envelope = t < 0.28 ? t / 0.28 : 1 - (t - 0.28) / 0.72;
      setSyncPulse(Math.max(0, envelope));
      if (t < 1) {
        syncRafRef.current = requestAnimationFrame(step);
      } else {
        setSyncPulse(0);
        syncRafRef.current = 0;
      }
    };
    syncRafRef.current = requestAnimationFrame(step);
  }, [reduceMotion]);

  const onChannelEnter = useCallback(
    (id: string) => {
      setFocusedId(id);
      const ch = INTEGRATION_CHANNELS.find((c) => c.id === id);
      applyOrbChannelTint(ch?.color ?? null, 0.55);
      startPullLoop();
      runSyncPulse();
    },
    [runSyncPulse, startPullLoop],
  );

  const onChannelLeave = useCallback(() => {
    setFocusedId(null);
    applyOrbChannelTint(null, 0);
    startPullLoop();
  }, [startPullLoop]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (syncRafRef.current) cancelAnimationFrame(syncRafRef.current);
      applyOrbChannelTint(null, 0);
    };
  }, []);

  // Clear tint when leaving the chapter.
  useEffect(() => {
    if (progress === null || sceneOpacity < 0.02) {
      applyOrbChannelTint(null, 0);
      queueMicrotask(() => {
        setFocusedId(null);
        setSyncPulse(0);
      });
    }
  }, [progress, sceneOpacity]);

  if (progress === null || sceneOpacity < 0.02) return null;

  const focusedChannel = focusedId ? INTEGRATION_CHANNELS.find((c) => c.id === focusedId) : null;

  return (
    <svg
      viewBox={storyStageViewBoxForWidth(spatial.viewportWidth)}
      preserveAspectRatio={spatial.preserveAspectRatio}
      suppressHydrationWarning
      className="integrations-scene integrations-scene--ecosystem"
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
        focusedId={focusedId}
        syncPulse={syncPulse}
      />

      {INTEGRATION_CHANNELS.map((channel, index) => {
        const node = channelNode(nodes, channel.id);
        if (!node) return null;

        const state = integrationChannelState(progress, index, !!reduceMotion, spatial.viewportWidth);
        const side = node.x < INTEGRATION_STAGE.orbX ? -1 : 1;
        const pull = pullOffsets[channel.id] ?? { x: 0, y: 0 };
        const tx = node.x + state.translateX * side * 0.22 + pull.x;
        const ty = node.y + state.translateY * 0.22 + pull.y;
        const focused = focusedId === channel.id;
        const lit = focused || syncPulse > 0.08;
        const hubR = 48 * hubScale;
        const ringR = 58 * hubScale;
        const glowBoost = (focused ? 0.22 : 0) + syncPulse * 0.28;
        const mag = iconOffsets[channel.id] ?? { x: 0, y: 0 };

        return (
          <g
            key={channel.id}
            transform={`translate(${tx} ${ty}) scale(${state.scale * satelliteScale})`}
            opacity={state.opacity}
            filter={`url(#int-glow-${channel.id})`}
            className={cn(
              "integrations-scene__channel",
              focused && "integrations-scene__channel--focused",
              lit && "integrations-scene__channel--lit",
            )}
          >
            <g
              ref={(node) => setIconRef(channel.id, node)}
              transform={`translate(${mag.x} ${mag.y})`}
              className="concurrent-scene__phone-magnetic integrations-scene__channel-hub"
            >
              <circle
                r={ringR}
                fill="none"
                stroke={channel.color}
                strokeWidth={focused ? 1.6 : 1.2}
                opacity={0.16 + state.highlight * 0.28 + glowBoost}
                className={cn(lit && !reduceMotion && "integrations-scene__icon-ring--soft")}
              />
              <circle r={hubR} fill="url(#intGlass)" stroke={channel.color} strokeWidth="2" opacity="0.98" />
              <circle r={hubR} fill={channel.color} opacity={0.06 + state.highlight * 0.08 + glowBoost * 0.35} />
              <g opacity={0.82 + state.highlight * 0.18 + glowBoost * 0.2} transform={`scale(${hubScale})`}>
                <PremiumChannelGlyph id={channel.id} color={channel.color} uid={channel.id} />
              </g>

              {/* Invisible hit target — enables hover on illustration layer. */}
              <circle
                r={ringR + 10}
                fill="transparent"
                className="integrations-scene__hub-hit"
                onPointerEnter={() => onChannelEnter(channel.id)}
                onPointerLeave={onChannelLeave}
              />
            </g>
          </g>
        );
      })}

      {/* Optional orb-adjacent tint disc when a channel is focused (complements CSS on persistent orb). */}
      {focusedChannel && !reduceMotion ? (
        <circle
          cx={INTEGRATION_STAGE.orbX}
          cy={INTEGRATION_STAGE.orbY}
          r={72}
          fill={focusedChannel.color}
          opacity={0.07}
          className="integrations-scene__orb-tint"
        />
      ) : null}
    </svg>
  );
}
