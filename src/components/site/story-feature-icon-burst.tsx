"use client";

import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";

import { featureBandProgress } from "@/lib/story/feature-band-progress";
import { STORY_SATELLITE_ICON_SCALE } from "@/lib/story/persistent-orb";
import { storyRevealSpread } from "@/lib/story/story-scale";
import { useStorySpatialLayout } from "@/lib/story/use-story-viewport";
import { cn } from "@/lib/utils";

import { remindersIconSpecs, type StoryIconSpec } from "./story-icon-glyphs";

type StoryFeatureIconBurstProps = {
  story: number;
  featureId: "reminders";
  sceneOpacity: number;
};

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function reminderPopTransform(
  progress: number,
  index: number,
  total: number,
  side: "left" | "right",
  reduceMotion: boolean,
  viewportWidth: number,
  iconScale: number,
) {
  const slot = 1 / (total + 0.5);
  const start = index * slot + 0.06;
  const end = start + slot * 0.72;
  const raw = Math.min(1, Math.max(0, (progress - start) / (end - start)));
  const t = reduceMotion ? (raw > 0.5 ? 1 : 0) : smoothstep(raw);
  const spread = storyRevealSpread(1, viewportWidth);
  const fromX = (side === "left" ? -88 : 88) * spread;
  const fromY = 28 * spread;

  return {
    opacity: t,
    transform: `translate3d(${fromX * (1 - t)}px, ${fromY * (1 - t)}px, 0) scale(${(0.35 + t * 0.65) * iconScale})`,
    highlight: t,
  };
}

function IconBubble({
  spec,
  style,
  iconSize,
}: {
  spec: StoryIconSpec;
  style: { opacity: number; transform: string; highlight: number };
  iconSize: number;
}) {
  const { Icon, color, glow, isBrand } = spec;

  return (
    <div
      className={cn("story-feature-icon", style.highlight >= 0.72 && style.opacity > 0.5 && "story-feature-icon--animated")}
      style={{
        opacity: style.opacity,
        transform: style.transform,
        top: spec.top,
        left: spec.left,
        right: spec.right,
        ["--icon-color" as string]: color,
        ["--icon-glow" as string]: glow,
        ["--channel-highlight" as string]: style.highlight,
      }}
    >
      <span className="story-feature-icon__ring" aria-hidden />
      {isBrand ? (
        <Icon size={iconSize} className="story-feature-icon__glyph" />
      ) : (
        <Icon size={iconSize} strokeWidth={1.75} className="story-feature-icon__glyph" />
      )}
    </div>
  );
}

export function StoryFeatureIconBurst({ story, featureId, sceneOpacity }: StoryFeatureIconBurstProps) {
  const reduceMotion = usePrefersReducedMotion();
  const spatial = useStorySpatialLayout();
  const progress = featureBandProgress(story, featureId);
  if (progress === null || sceneOpacity < 0.02) return null;

  const iconScale = spatial.satelliteScale / STORY_SATELLITE_ICON_SCALE;
  const iconSize = Math.round(22 * iconScale * STORY_SATELLITE_ICON_SCALE);

  return (
    <div className="story-feature-icon-burst" style={{ opacity: sceneOpacity }} aria-hidden>
      {remindersIconSpecs.map((spec, index) => {
        const style = reminderPopTransform(
          progress,
          index,
          remindersIconSpecs.length,
          spec.side,
          !!reduceMotion,
          spatial.viewportWidth,
          iconScale,
        );
        return <IconBubble key={spec.id} spec={spec} style={style} iconSize={iconSize} />;
      })}
    </div>
  );
}
