"use client";

import { useState } from "react";
import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";

import {  accentColor,
  CircuitGrid,
  ConversationsModule,
  DataModule,
  HubHoverStatus,
  HubOrbIconFlows,
  HubPlusArms,
  HubTendril,
  RouteModule,
  ScheduleModule,
} from "@/components/site/grunt-hub-modules";
import { act1BeatProgress } from "@/lib/story/act1-band-progress";
import {
  GRUNT_HUB_MODULES,
  GRUNT_STAGE,
  gruntConversationFollowUps,
  gruntConversationQueue,
  gruntConversationsLive,
  gruntDataFill,
  gruntFocusedModule,
  gruntHubReveal,
  gruntHubSync,
  gruntModuleBodyReveal,
  gruntModuleEnterOffset,
  gruntModuleFlow,
  gruntModuleIconArrived,
  gruntModuleLabelReveal,
  gruntModuleLive,
  gruntModuleReveal,
  gruntModuleSubheadTypingReveal,
  gruntPlusArmReveal,
  gruntRouteBranches,
  gruntScheduleFill,
  gruntScheduleReminders,
  gruntSceneReveal,
  gruntStressLevel,
  gruntTendrilPath,
  gruntTendrilPulse,
  type GruntHubModuleId,
} from "@/lib/story/grunt-reveal";
import { useStoryScrollPaused } from "@/lib/story/use-story-scroll-paused";
import { gruntStageViewBox, storyStageViewBox } from "@/lib/story/persistent-orb";
import { useStorySpatialLayout } from "@/lib/story/use-story-viewport";
import { STORY_GLYPH } from "@/components/site/story-stage-glyphs";

type GruntSceneProps = {
  story: number;
  opacity: number;
};

const C = STORY_GLYPH;

export function GruntScene({ story, opacity: sceneOpacity }: GruntSceneProps) {
  const reduceMotion = usePrefersReducedMotion();
  const spatial = useStorySpatialLayout();
  const progress = act1BeatProgress(story, "grunt");
  const scrollPaused = useStoryScrollPaused(progress ?? 0, 120);
  const [hoveredModule, setHoveredModule] = useState<GruntHubModuleId | null>(null);
  if (progress === null || sceneOpacity < 0.02) return null;

  const rm = !!reduceMotion;
  const reveal = gruntSceneReveal(progress);
  const hubReveal = gruntHubReveal(progress);
  const plusReveal = gruntPlusArmReveal(progress);
  const stress = gruntStressLevel(progress);
  const sync = gruntHubSync(progress);

  const scheduleFill = gruntScheduleFill(progress);
  const scheduleReminders = gruntScheduleReminders(progress);
  const conversationQueue = gruntConversationQueue(progress, rm);
  const conversationFollowUps = gruntConversationFollowUps(progress);
  const dataFill = gruntDataFill(progress);
  const routeBranches = gruntRouteBranches(progress, rm);

  const { orbX, orbY } = GRUNT_STAGE;
  const hubModules = spatial.grunt.modules;
  const moduleRadius = spatial.grunt.moduleRadius;
  const satelliteScale = spatial.grunt.satelliteScale;

  const focusedId = gruntFocusedModule(progress);
  const hoveredMod = hoveredModule ? hubModules.find((m) => m.id === hoveredModule) : null;

  const iconFlows = hubModules.map((mod) => ({
    id: mod.id,
    flow: gruntModuleFlow(progress, mod.revealAt),
    arrived: gruntModuleIconArrived(progress, mod.revealAt),
  }));

  const moduleContent = (id: GruntHubModuleId) => {
    const mod = hubModules.find((m) => m.id === id)!;
    const live = gruntModuleLive(progress, mod.revealAt) && !rm;
    const focused = focusedId === id;
    const hovered = hoveredModule === id;
    const labelReveal = gruntModuleLabelReveal(progress, mod.revealAt);
    const iconArrived = gruntModuleIconArrived(progress, mod.revealAt);
    const iconFlow = gruntModuleFlow(progress, mod.revealAt);
    const bodyReveal = gruntModuleBodyReveal(progress, mod.revealAt);
    const subheadTyping = (slot: number) => gruntModuleSubheadTypingReveal(progress, mod.revealAt, slot);
    const hoverProps = {
      hovered,
      onHoverChange: setHoveredModule,
      labelReveal,
      iconArrived,
      iconFlow,
      bodyReveal,
      subheadTyping,
      scrollPaused,
      reduceMotion: rm,
    };

    switch (id) {
      case "schedule":
        return <ScheduleModule fill={scheduleFill} reminders={scheduleReminders} live={live} focused={focused} {...hoverProps} />;
      case "conversations":
        return (
          <ConversationsModule
            queue={conversationQueue}
            followUps={conversationFollowUps}
            live={gruntConversationsLive(progress) && !rm}
            focused={focused}
            {...hoverProps}
          />
        );
      case "data":
        return <DataModule fill={dataFill} live={live} focused={focused} {...hoverProps} />;
      case "route":
        return <RouteModule branches={routeBranches} live={live} focused={focused} {...hoverProps} />;
    }
  };

  return (
    <svg
      viewBox={gruntStageViewBox()}
      preserveAspectRatio={spatial.preserveAspectRatio}
      className="grunt-scene grunt-scene--hub grunt-scene--hub-plus grunt-scene--interactive"
      aria-hidden
      style={{ opacity: sceneOpacity }}
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
        <filter id="gruntTendrilBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
        <linearGradient id="gruntModuleGlass" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2a303c" />
          <stop offset="48%" stopColor="#1e222b" />
          <stop offset="100%" stopColor="#14171e" />
        </linearGradient>
        <linearGradient id="gruntPlusArmGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={C.violet} stopOpacity="0.15" />
          <stop offset="25%" stopColor={C.sky} stopOpacity="0.55" />
          <stop offset="50%" stopColor={C.mint} stopOpacity="0.85" />
          <stop offset="75%" stopColor={C.amber} stopOpacity="0.55" />
          <stop offset="100%" stopColor={C.mint} stopOpacity="0.15" />
        </linearGradient>
        <radialGradient id="gruntHubCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.mint} stopOpacity={0.1 + sync * 0.08} />
          <stop offset="55%" stopColor={C.mint} stopOpacity={0.04 + sync * 0.03} />
          <stop offset="100%" stopColor={C.mint} stopOpacity="0" />
        </radialGradient>
        <filter id="gruntOrbIconGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#8cffd2" floodOpacity="0.45" />
        </filter>
        <filter id="gruntRouteIconGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#b39cff" floodOpacity="0.55" />
        </filter>
      </defs>

      <CircuitGrid opacity={hubReveal * 0.65} />

      <HubPlusArms opacity={plusReveal * hubReveal} sync={sync} moduleRadius={moduleRadius} />

      <ellipse cx={orbX} cy={orbY} rx="118" ry="86" fill="url(#gruntHubCore)" className="grunt-scene__hub-orb-halo" />
      <ellipse cx={orbX} cy={orbY} rx="92" ry="66" fill={C.mint} opacity={0.025 + stress * 0.035 + sync * 0.04} filter="url(#gruntHubGlow)" />

      {hubModules.map((mod) => {
        const flow = gruntModuleFlow(progress, mod.revealAt);
        const path = gruntTendrilPath(mod, moduleRadius);
        const color = accentColor(mod.accent);
        const live = gruntModuleLive(progress, mod.revealAt) && !rm;
        const focused = focusedId === mod.id;

        return (
          <HubTendril
            key={`tendril-${mod.id}`}
            path={path}
            flow={flow}
            opacity={hubReveal * gruntTendrilPulse(progress, flow) * (focused || hoveredModule === mod.id ? 1.2 : 0.85)}
            color={color}
            live={live || sync > 0.5}
            focused={focused || hoveredModule === mod.id}
            reduceMotion={rm}
          />
        );
      })}

      <HubOrbIconFlows flows={iconFlows} reduceMotion={rm} modules={hubModules} moduleRadius={moduleRadius} />

      {hubModules.map((mod) => {
        const op = gruntModuleReveal(progress, mod.revealAt) * reveal;
        if (op < 0.02) return null;
        const focused = focusedId === mod.id;
        const scale = focused || hoveredModule === mod.id ? 1.04 : 0.98 + op * 0.02;
        const enter = rm ? { x: 0, y: 0 } : gruntModuleEnterOffset(progress, mod);

        return (
          <g
            key={mod.id}
            transform={`translate(${mod.x + enter.x} ${mod.y + enter.y}) scale(${scale * satelliteScale})`}
            opacity={op}
            className="grunt-scene__hub-module-wrap"
          >
            {moduleContent(mod.id)}
          </g>
        );
      })}

      {hoveredMod ? <HubHoverStatus moduleId={hoveredMod.id} /> : null}
    </svg>
  );
}
