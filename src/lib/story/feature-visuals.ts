import type { FeatureChapter } from "./chapters";
import { featureChapters } from "./chapters";

export const journeyPalette = {
  mint: "#8cffd2",
  sky: "#74c0fc",
  violet: "#9775fa",
  amber: "#ffc857",
  coral: "#ff8787",
  cream: "#f5f2eb",
  ink: "#1c1f26",
  slate: "#2b303b",
  rose: "#f783ac",
  indigo: "#748ffc",
} as const;

export type FeatureAccent = {
  primary: string;
  secondary: string;
  glow: string;
};

export const featureAccents: Record<string, FeatureAccent> = {
  hours: { primary: journeyPalette.indigo, secondary: journeyPalette.violet, glow: "#bac8ff" },
  concurrent: { primary: journeyPalette.amber, secondary: journeyPalette.coral, glow: "#ffe066" },
  integrations: { primary: journeyPalette.violet, secondary: journeyPalette.sky, glow: "#d0bfff" },
  multilingual: { primary: journeyPalette.sky, secondary: journeyPalette.amber, glow: "#a5d8ff" },
  handoff: { primary: journeyPalette.rose, secondary: journeyPalette.mint, glow: "#ffc9c9" },
  reminders: { primary: journeyPalette.sky, secondary: journeyPalette.amber, glow: "#a5d8ff" },
  dashboard: { primary: journeyPalette.mint, secondary: journeyPalette.indigo, glow: "#96f2d7" },
};

export function featureCardOpacity(story: number, feature: FeatureChapter) {
  const pad = (feature.end - feature.start) * 0.12;
  const enter = feature.start + pad;
  const exit = feature.end - pad;
  if (story < feature.start || story >= feature.end) return 0;
  if (story < enter) return (story - feature.start) / (enter - feature.start);
  if (story > exit) return (feature.end - story) / (feature.end - exit);
  return 1;
}

export function activeFeatureScene(story: number) {
  const feature = featureChapters.find((chapter) => story >= chapter.start && story < chapter.end);
  if (!feature) return null;
  const accent = featureAccents[feature.id];
  if (!accent) return null;
  return { feature, accent, opacity: featureCardOpacity(story, feature) };
}
