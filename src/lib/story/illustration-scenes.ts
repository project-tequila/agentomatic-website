import { interpolate } from "@helios-project/core";

import { ACT1_END, FEATURES_END, act1Beats, featureChapters } from "./chapters";

export type IllustrationSceneId =
  | "hook"
  | "grunt"
  | "hours"
  | "concurrent"
  | "integrations"
  | "multilingual"
  | "handoff"
  | "reminders"
  | "dashboard"
  | "cta";

type SceneBand = {
  id: IllustrationSceneId;
  start: number;
  end: number;
};

const sceneBands: SceneBand[] = [
  ...act1Beats.map((b) => ({ id: b.id as IllustrationSceneId, start: b.start, end: b.end })),
  ...featureChapters.map((f) => ({ id: f.id as IllustrationSceneId, start: f.start, end: f.end })),
  { id: "cta", start: FEATURES_END, end: 1 },
];

const BLEND = 0.018;

export function sceneIllustrationOpacity(story: number, start: number, end: number) {
  const inStart = start - BLEND;
  const inEnd = start + BLEND;
  const outStart = end - BLEND;
  const outEnd = end + BLEND;

  if (story <= inStart || story >= outEnd) return 0;
  if (story < inEnd) return interpolate(story, [inStart, inEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (story > outStart) return interpolate(story, [outStart, outEnd], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return 1;
}

export function visibleIllustrationScenes(story: number) {
  return sceneBands
    .map((band) => ({ id: band.id, opacity: sceneIllustrationOpacity(story, band.start, band.end) }))
    .filter((s) => s.opacity > 0.02);
}

export function illustrationAtmosphere(story: number) {
  const act1 = story < ACT1_END;
  const hoursChapter = featureChapters.find((c) => c.id === "hours");
  const hoursOpacity = hoursChapter
    ? sceneIllustrationOpacity(story, hoursChapter.start, hoursChapter.end)
    : 0;

  const baseGrid = interpolate(story, [0, ACT1_END, FEATURES_END], [0.22, 0.38, 0.32], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return {
    // Dim tech grid under hours sky so night doesn’t read as polka-dot wallpaper.
    grid: baseGrid * (1 - hoursOpacity * 0.95),
    wash: act1 ? "cool" : "warm",
    vignette: interpolate(story, [FEATURES_END, 1], [0.35, 0.65], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  };
}
