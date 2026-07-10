"use client";

import { useState } from "react";
import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";

import {
  accentColor,
  ConversationsModule,
  DataModule,
  GruntStaticBackdrop,
  HubHoverStatus,
  HubTendril,
  RouteModule,
  ScheduleModule,
} from "@/components/site/grunt-hub-modules";
import { useSvgGroupMagnetic } from "@/lib/motion/use-svg-group-magnetic";
import { act1BeatProgress } from "@/lib/story/act1-band-progress";
import {
  GRUNT_HUB_MODULES,
  GRUNT_STAGE,
  gruntConversationsLive,
  gruntFocusedModule,
  gruntHubReveal,
  gruntHubSync,
  gruntModuleEnterOffset,
  gruntModuleIconArrived,
  gruntModuleLabelReveal,
  gruntModuleLive,
  gruntModuleReveal,
  gruntSceneReveal,
  gruntTendrilPath,
  gruntTendrilPulse,
  type GruntHubModuleId,
} from "@/lib/story/grunt-reveal";
import { storyStageViewBoxForWidth } from "@/lib/story/persistent-orb";
import { GRUNT_HUB_DESKTOP_AMBIENT_SCALE } from "@/lib/story/story-layout";
import { useStorySpatialLayout } from "@/lib/story/use-story-viewport";
import { STORY_GLYPH } from "@/components/site/story-stage-glyphs";

type GruntSceneProps = {
  story: number;
  opacity: number;
};

const C = STORY_GLYPH;

const GRUNT_MODULE_IDS = GRUNT_HUB_MODULES.map((mod) => mod.id);

function GruntTendrilFilterDefs() {
  return (
    <>
      <filter id="gruntTendrilBlur" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="3.8" />
      </filter>
      {(["sky", "mint", "amber", "violet"] as const).map((accent) => {
        const glowColor = accentColor(accent);
        return (
          <g key={accent}>
            <filter id={`gruntTendrilGlow-${accent}`} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="bloom" />
              <feMerge>
                <feMergeNode in="bloom" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id={`gruntTendrilCore-${accent}`} x="-100%" y="-100%" width="300%" height="300%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor={glowColor} floodOpacity="0.66" />
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={glowColor} floodOpacity="0.35" />
            </filter>
          </g>
        );
      })}
    </>
  );
}

export function GruntScene({ story, opacity: sceneOpacity }: GruntSceneProps) {
  const reduceMotion = usePrefersReducedMotion();
  const spatial = useStorySpatialLayout();
  const progress = act1BeatProgress(story, "grunt");
  const [hoveredModule, setHoveredModule] = useState<GruntHubModuleId | null>(null);
  const rm = !!reduceMotion;

  const { offsets: iconOffsets, setGroupRef: setIconRef } = useSvgGroupMagnetic(GRUNT_MODULE_IDS, {
    strength: 0.4,
    maxDisplacement: 12,
    radiusFactor: 1.15,
    disabled: rm,
  });

  if (progress === null || sceneOpacity < 0.02) return null;
  const reveal = gruntSceneReveal(progress);
  const hubReveal = gruntHubReveal(progress);
  const sync = gruntHubSync(progress);

  const { orbX, orbY } = GRUNT_STAGE;
  const hubModules = spatial.grunt.modules;
  const moduleRadius = spatial.grunt.moduleRadius;
  const satelliteScale = spatial.grunt.satelliteScale;
  const cardScale = spatial.grunt.cardScale;

  const focusedId = gruntFocusedModule(progress);
  const hoveredMod = hoveredModule ? hubModules.find((m) => m.id === hoveredModule) : null;
  const hubAmbientScale = spatial.viewportWidth > 900 ? GRUNT_HUB_DESKTOP_AMBIENT_SCALE : 1;

  const moduleContent = (id: GruntHubModuleId) => {
    const mod = hubModules.find((m) => m.id === id)!;
    const live = gruntModuleLive(progress, mod.revealAt) && !rm;
    const focused = focusedId === id;
    const hovered = hoveredModule === id;
    const labelReveal = gruntModuleLabelReveal(progress, mod.revealAt);
    const iconArrived = gruntModuleIconArrived(progress, mod.revealAt);
    const mag = iconOffsets[id] ?? { x: 0, y: 0 };
    const cardProps = {
      live,
      focused,
      hovered,
      onHoverChange: setHoveredModule,
      labelReveal,
      iconArrived,
      magX: mag.x,
      magY: mag.y,
      setMagRef: (node: SVGGElement | null) => setIconRef(id, node),
    };

    switch (id) {
      case "schedule":
        return <ScheduleModule {...cardProps} />;
      case "conversations":
        return <ConversationsModule {...cardProps} live={gruntConversationsLive(progress) && !rm} />;
      case "data":
        return <DataModule {...cardProps} />;
      case "route":
        return <RouteModule {...cardProps} />;
    }
  };

  return (
    <>
      <svg
        viewBox={storyStageViewBoxForWidth(spatial.viewportWidth)}
        preserveAspectRatio={spatial.preserveAspectRatio}
        suppressHydrationWarning
        className="grunt-scene grunt-scene--hub grunt-scene--hub-plus grunt-scene--interactive"
        aria-hidden
        style={{ opacity: sceneOpacity * reveal }}
      >
        <defs>
          <filter id="gruntHubGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="gruntModuleShadow" x="-40%" y="-30%" width="180%" height="180%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000000" floodOpacity="0.35" />
          </filter>
          <linearGradient id="gruntModuleGlass" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2a303c" />
            <stop offset="48%" stopColor="#1e222b" />
            <stop offset="100%" stopColor="#14171e" />
          </linearGradient>
          <radialGradient id="gruntHubCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.mint} stopOpacity={0.08 + sync * 0.06} />
            <stop offset="55%" stopColor={C.mint} stopOpacity={0.03 + sync * 0.025} />
            <stop offset="100%" stopColor={C.mint} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gruntStaticWash" cx="50%" cy="46%" r="58%">
            <stop offset="0%" stopColor={C.mint} stopOpacity="0.035" />
            <stop offset="42%" stopColor={C.violet} stopOpacity="0.015" />
            <stop offset="100%" stopColor="#0a0c10" stopOpacity="0" />
          </radialGradient>
          <GruntTendrilFilterDefs />
        </defs>

        <g transform={`translate(${orbX} ${orbY}) scale(${hubAmbientScale}) translate(${-orbX} ${-orbY})`}>
          <GruntStaticBackdrop opacity={hubReveal} />
          <ellipse cx={orbX} cy={orbY} rx="96" ry="68" fill="url(#gruntHubCore)" opacity={hubReveal} />
        </g>

        {hubModules.map((mod) => {
          const modReveal = gruntModuleReveal(progress, mod.revealAt);
          const path = gruntTendrilPath(mod, moduleRadius);
          const color = accentColor(mod.accent);
          const focused = focusedId === mod.id;
          const tendrilOp =
            hubReveal * gruntTendrilPulse(progress, mod.revealAt) * (focused || hoveredModule === mod.id ? 1.13 : 1);

          if (modReveal < 0.02 && tendrilOp < 0.02) return null;

          return (
            <HubTendril
              key={`tendril-${mod.id}`}
              path={path}
              opacity={tendrilOp}
              color={color}
              accent={mod.accent}
              focused={focused || hoveredModule === mod.id}
              reduceMotion={rm}
            />
          );
        })}

        {hubModules.map((mod) => {
          const op = gruntModuleReveal(progress, mod.revealAt);
          if (op < 0.02) return null;
          const focused = focusedId === mod.id;
          const scale = focused || hoveredModule === mod.id ? 1.04 : 0.98 + op * 0.02;
          const enter = rm ? { x: 0, y: 0 } : gruntModuleEnterOffset(progress, mod, spatial.viewportWidth);

          return (
            <g
              key={mod.id}
              transform={`translate(${mod.x + enter.x} ${mod.y + enter.y}) scale(${scale * satelliteScale * cardScale})`}
              opacity={op}
              className="grunt-scene__hub-module-wrap"
            >
              {moduleContent(mod.id)}
            </g>
          );
        })}

        {hoveredMod ? <HubHoverStatus moduleId={hoveredMod.id} /> : null}
      </svg>
    </>
  );
}
