import { featureChapters } from "./chapters";

/** 0–1 progress inside a feature chapter band, or null if outside the band. */
export function featureBandProgress(story: number, featureId: string) {
  const band = featureChapters.find((chapter) => chapter.id === featureId);
  if (!band || story < band.start || story >= band.end) return null;
  return (story - band.start) / (band.end - band.start);
}

export function featureBandOpacity(story: number, featureId: string, edge = 0.04) {
  const band = featureChapters.find((chapter) => chapter.id === featureId);
  if (!band) return 0;
  if (story < band.start || story >= band.end) return 0;
  if (story < band.start + edge) return (story - band.start) / edge;
  return 1;
}

/**
 * Fade the scene in, then hold at full until the page changes.
 */
export function featureBandOpacitySequential(story: number, featureId: string, fade = 0.022) {
  const band = featureChapters.find((chapter) => chapter.id === featureId);
  if (!band) return 0;
  if (story < band.start || story >= band.end) return 0;
  if (story < band.start + fade) return (story - band.start) / fade;
  return 1;
}

/**
 * Scene progress inside a feature band with sequential fade-in removed.
 * During fade-in: progress stays at 0. After that it plays through and holds at 1.
 */
export function featureBandSceneProgress(story: number, featureId: string, fade = 0.022) {
  const band = featureChapters.find((chapter) => chapter.id === featureId);
  if (!band) return null;
  if (story < band.start || story >= band.end) return null;

  const start = band.start + fade;
  const end = band.end - fade;
  if (end <= start) return 0;
  if (story <= start) return 0;
  if (story >= end) return 1;
  return (story - start) / (end - start);
}
