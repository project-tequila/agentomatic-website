"use client";

import { hoursDayNightMix } from "@/lib/story/hours-day-night";
import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";

import { PERSISTENT_ORB, storyStageViewBoxForWidth } from "@/lib/story/persistent-orb";
import { useStorySpatialLayout } from "@/lib/story/use-story-viewport";

type HoursDayNightCycleProps = {
  story: number;
  sceneOpacity: number;
};

const CX = PERSISTENT_ORB.cx;
const CY = PERSISTENT_ORB.cy;

export function HoursDayNightCycle({ story, sceneOpacity }: HoursDayNightCycleProps) {
  const reduceMotion = usePrefersReducedMotion();
  const spatial = useStorySpatialLayout();
  const ORBIT_R = spatial.hours.orbitRadius;
  const mix = hoursDayNightMix(story);
  if (!mix || sceneOpacity < 0.02) return null;

  const { angle, sunWeight, moonWeight, nightSky, dayGlow } = mix;
  const orbX = CX + Math.cos(angle) * ORBIT_R;
  const orbY = CY + Math.sin(angle) * ORBIT_R;

  return (
    <div className="hours-day-cycle-wrap" style={{ opacity: sceneOpacity }} aria-hidden>
      <svg
        viewBox={storyStageViewBoxForWidth(spatial.viewportWidth)}
        className="hours-day-cycle"
        preserveAspectRatio={spatial.preserveAspectRatio}
        suppressHydrationWarning
      >
        <defs>
          <radialGradient id="hoursDayGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffc857" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ffc857" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hoursOrbit" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffc857" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#74c0fc" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.55" />
          </linearGradient>
        </defs>

        <g transform={`translate(${CX} ${CY})`}>
          <circle r={ORBIT_R + 6} fill="url(#hoursDayGlow)" opacity={dayGlow * 0.65} />

          <g className={reduceMotion ? undefined : "hours-day-cycle__orbit"}>
            <circle
              r={ORBIT_R}
              fill="none"
              stroke="url(#hoursOrbit)"
              strokeWidth="1.5"
              strokeDasharray="5 7"
              opacity={0.55}
            />

            {[0, 1, 2, 3].map((tick) => {
              const tickAngle = (tick / 4) * Math.PI * 2 - Math.PI / 2;
              const x1 = Math.cos(tickAngle) * (ORBIT_R - 8);
              const y1 = Math.sin(tickAngle) * (ORBIT_R - 8);
              const x2 = Math.cos(tickAngle) * (ORBIT_R + 8);
              const y2 = Math.sin(tickAngle) * (ORBIT_R + 8);
              return (
                <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(245,242,235,0.35)" strokeWidth="1.2" />
              );
            })}
          </g>
        </g>

        <g transform={`translate(${orbX} ${orbY})`}>
          <g opacity={sunWeight}>
            {!reduceMotion &&
              [0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <line
                  key={deg}
                  x1={Math.cos((deg * Math.PI) / 180) * 28}
                  y1={Math.sin((deg * Math.PI) / 180) * 28}
                  x2={Math.cos((deg * Math.PI) / 180) * 38}
                  y2={Math.sin((deg * Math.PI) / 180) * 38}
                  stroke="#ffc857"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.75"
                  className="hours-day-cycle__ray"
                  style={{ animationDelay: `${deg * 0.01}s` }}
                />
              ))}
            <circle r="22" fill="#ffc857" opacity="0.95" />
            <circle r="30" fill="#ffc857" opacity="0.18" className={reduceMotion ? undefined : "hours-day-cycle__sun-halo"} />
          </g>

          <g opacity={moonWeight}>
            <circle r="20" fill="#e2e8f0" opacity="0.95" />
            <circle cx="8" cy="-5" r="16" fill="#0b1220" opacity={Math.max(0.55, nightSky)} />
            <circle r="32" fill="#93c5fd" opacity="0.1" className={reduceMotion ? undefined : "hours-day-cycle__moon-halo"} />
          </g>
        </g>
      </svg>
    </div>
  );
}
