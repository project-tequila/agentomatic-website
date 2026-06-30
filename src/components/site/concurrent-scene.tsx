"use client";

import { useCallback, useState, type CSSProperties } from "react";
import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";

import { featureBandProgress } from "@/lib/story/feature-band-progress";
import {
  CALL_THEME,
  CONCURRENT_STAGE,
  concurrentVisibleNetworkPhones,
  type ConcurrentNetworkPhone,
} from "@/lib/story/concurrent-reveal";
import { storyStageViewBox } from "@/lib/story/persistent-orb";
import { useStorySpatialLayout } from "@/lib/story/use-story-viewport";
import { cn } from "@/lib/utils";

import { CallFlowStreams } from "./call-flow-streams";
import { RealisticPhoneSvg } from "./realistic-phone-svg";

type ConcurrentSceneProps = {
  story: number;
  opacity: number;
};

const ORB = { x: CONCURRENT_STAGE.orbX, y: CONCURRENT_STAGE.orbY };

function NetworkPhone({
  phone,
  dualActive,
  reduceMotion,
  onToggle,
}: {
  phone: ConcurrentNetworkPhone;
  dualActive: boolean;
  reduceMotion: boolean;
  onToggle: (id: string) => void;
}) {
  const theme = CALL_THEME[phone.direction];
  const isPrimary = phone.depth >= 0.7;
  const live = phone.highlight >= 0.42 && phone.opacity > 0.18;
  const ringing = phone.direction === "inbound" && live;

  return (
    <g
      transform={`translate(${phone.x - 32} ${phone.y - 59}) rotate(${phone.rotate}) scale(${phone.scale})`}
      opacity={phone.opacity}
    >
      <g
        className={cn(
          "concurrent-scene__network-phone",
          `concurrent-scene__network-phone--${phone.direction}`,
          `concurrent-scene__network-phone--depth-${phone.depth >= 0.66 ? "near" : phone.depth >= 0.4 ? "mid" : "far"}`,
          isPrimary && "concurrent-scene__network-phone--primary",
          live && (phone.direction === "inbound" ? "concurrent-scene__network-phone--live-in" : "concurrent-scene__network-phone--live-out"),
          ringing && "concurrent-scene__network-phone--ringing-in",
          dualActive && "concurrent-scene__network-phone--dual-active",
        )}
        style={
          {
            "--phone-accent": theme.color,
            animationDelay: `${phone.revealAt * 1200}ms`,
          } as CSSProperties
        }
        onClick={() => onToggle(phone.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle(phone.id);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`${phone.direction} call phone`}
      >
        <g className="concurrent-scene__network-phone__motion">
          <RealisticPhoneSvg
            accent={theme.color}
            highlight={isPrimary ? 0.95 : 0.72 + phone.depth * 0.2}
            uid={phone.id}
            showRing={isPrimary || live}
            variant="frontdesk"
            callDirection={phone.direction}
            useAccentVar={dualActive}
            minimal
            ringing={ringing}
          />
        </g>
      </g>
    </g>
  );
}

export function ConcurrentScene({ story, opacity: sceneOpacity }: ConcurrentSceneProps) {
  const reduceMotion = usePrefersReducedMotion();
  const spatial = useStorySpatialLayout();
  const [dualPhones, setDualPhones] = useState<Set<string>>(() => new Set());

  const toggleDual = useCallback((id: string) => {
    setDualPhones((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const progress = featureBandProgress(story, "concurrent");
  if (progress === null || sceneOpacity < 0.02) return null;

  const phones = concurrentVisibleNetworkPhones(progress, !!reduceMotion, {
    radiusScale: spatial.concurrent.radiusScale,
    ySquash: spatial.concurrent.ySquash,
    satelliteScale: spatial.concurrent.satelliteScale,
  });

  return (
    <svg
      viewBox={storyStageViewBox()}
      preserveAspectRatio={spatial.preserveAspectRatio}
      className="concurrent-scene"
      aria-hidden
      style={{ opacity: sceneOpacity }}
    >
      <CallFlowStreams orbX={ORB.x} orbY={ORB.y} progress={progress} phones={phones} reduceMotion={!!reduceMotion} />

      {phones.map((phone) => (
        <NetworkPhone
          key={phone.id}
          phone={phone}
          dualActive={dualPhones.has(phone.id)}
          reduceMotion={!!reduceMotion}
          onToggle={toggleDual}
        />
      ))}
    </svg>
  );
}
