"use client";

import { useReducedMotion } from "framer-motion";

import { featureBandProgress } from "@/lib/story/feature-band-progress";
import { STORY_STAGE_VISUAL_SCALE, STORY_SATELLITE_ICON_SCALE } from "@/lib/story/persistent-orb";
import { cn } from "@/lib/utils";

import { remindersIconSpecs, type StoryIconSpec } from "./story-icon-glyphs";

type StoryFeatureIconBurstProps = {
  story: number;
  featureId: "reminders";
  sceneOpacity: number;
};

const REMINDER_ICON_SIZE = Math.round(22 * STORY_STAGE_VISUAL_SCALE * STORY_SATELLITE_ICON_SCALE);

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function reminderPopTransform(
  progress: number,
  index: number,
  total: number,
  side: "left" | "right",
  reduceMotion: boolean,
) {
  const slot = 1 / (total + 0.5);
  const start = index * slot + 0.06;
  const end = start + slot * 0.72;
  const raw = Math.min(1, Math.max(0, (progress - start) / (end - start)));
  const t = reduceMotion ? (raw > 0.5 ? 1 : 0) : smoothstep(raw);
  const fromX = side === "left" ? -88 : 88;
  const fromY = 28;

  return {
    opacity: t,
    transform: `translate3d(${fromX * (1 - t)}px, ${fromY * (1 - t)}px, 0) scale(${0.35 + t * 0.65})`,
    highlight: t,
  };
}

function IconBubble({
  spec,
  style,
}: {
  spec: StoryIconSpec;
  style: { opacity: number; transform: string; highlight: number };
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
        <Icon size={REMINDER_ICON_SIZE} className="story-feature-icon__glyph" />
      ) : (
        <Icon size={REMINDER_ICON_SIZE} strokeWidth={1.75} className="story-feature-icon__glyph" />
      )}
    </div>
  );
}

export function StoryFeatureIconBurst({ story, featureId, sceneOpacity }: StoryFeatureIconBurstProps) {
  const reduceMotion = useReducedMotion();
  const progress = featureBandProgress(story, featureId);
  if (progress === null || sceneOpacity < 0.02) return null;

  return (
    <div className="story-feature-icon-burst" style={{ opacity: sceneOpacity }} aria-hidden>
      {remindersIconSpecs.map((spec, index) => {
        const style = reminderPopTransform(progress, index, remindersIconSpecs.length, spec.side, !!reduceMotion);
        return <IconBubble key={spec.id} spec={spec} style={style} />;
      })}
    </div>
  );
}
