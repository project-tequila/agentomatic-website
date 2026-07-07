"use client";

import { interpolate } from "@helios-project/core";
import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";

import { featureBandProgress } from "@/lib/story/feature-band-progress";
import { PERSISTENT_ORB, storyStageViewBoxForWidth } from "@/lib/story/persistent-orb";
import { useStorySpatialLayout } from "@/lib/story/use-story-viewport";

type HoursDayNightCycleProps = {
  story: number;
  sceneOpacity: number;
};

const W = PERSISTENT_ORB.width;
const H = PERSISTENT_ORB.height;
const CX = PERSISTENT_ORB.cx;
const CY = PERSISTENT_ORB.cy;

const STARS = [
  { x: 92, y: 56, r: 1.6 },
  { x: 164, y: 38, r: 2 },
  { x: 242, y: 52, r: 1.4 },
  { x: 576, y: 48, r: 1.8 },
  { x: 628, y: 88, r: 1.5 },
  { x: 530, y: 28, r: 1.7 },
  { x: 654, y: 132, r: 1.3 },
  { x: 72, y: 132, r: 1.4 },
  { x: 144, y: 104, r: 1.7 },
  { x: 602, y: 24, r: 1.6 },
  { x: 668, y: 172, r: 1.2 },
  { x: 52, y: 172, r: 1.3 },
  { x: 360, y: 32, r: 1.5 },
  { x: 688, y: 240, r: 1.4 },
  { x: 40, y: 248, r: 1.3 },
];

export function HoursDayNightCycle({ story, sceneOpacity }: HoursDayNightCycleProps) {
  const reduceMotion = usePrefersReducedMotion();
  const spatial = useStorySpatialLayout();
  const ORBIT_R = spatial.hours.orbitRadius;
  const progress = featureBandProgress(story, "hours");
  if (progress === null || sceneOpacity < 0.02) return null;

  const cycle = progress;
  const angle = cycle * Math.PI * 2 - Math.PI / 2;
  const orbX = CX + Math.cos(angle) * ORBIT_R;
  const orbY = CY + Math.sin(angle) * ORBIT_R;

  const sunWeight = Math.max(0, -Math.sin(angle));
  const moonWeight = Math.max(0, Math.sin(angle));
  const nightSky = interpolate(moonWeight, [0, 0.45, 1], [0, 0.55, 0.88], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const starOpacity = interpolate(moonWeight, [0.25, 0.55, 1], [0, 0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dayGlow = interpolate(sunWeight, [0, 0.5, 1], [0, 0.45, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div className="hours-day-cycle-wrap" style={{ opacity: sceneOpacity }} aria-hidden>
      <div className="hours-day-cycle__sky" style={{ opacity: nightSky }} />

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
            <stop offset="50%" stopColor="#9775fa" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#74c0fc" stopOpacity="0.55" />
          </linearGradient>
        </defs>

        {STARS.map((star, index) => (
          <circle
            key={`${star.x}-${star.y}`}
            cx={star.x}
            cy={star.y}
            r={star.r}
            fill="#f5f2eb"
            opacity={starOpacity * (0.55 + (index % 3) * 0.15)}
            className={reduceMotion ? undefined : "hours-day-cycle__star"}
            style={reduceMotion ? undefined : { animationDelay: `${index * 0.22}s` }}
          />
        ))}

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
            <circle cx="8" cy="-5" r="16" fill="#1e1b4b" opacity={Math.max(0.55, nightSky)} />
            <circle r="32" fill="#c084fc" opacity="0.12" className={reduceMotion ? undefined : "hours-day-cycle__moon-halo"} />
          </g>
        </g>
      </svg>
    </div>
  );
}
