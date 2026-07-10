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
  if (story < band.start - edge || story >= band.end + edge) return 0;
  if (story < band.start + edge) return (story - (band.start - edge)) / (edge * 2);
  if (story > band.end - edge) return (band.end + edge - story) / (edge * 2);
  return 1;
}

/**
 * Sequential crossfade: no pre-start or post-end bleed.
 * This prevents the next feature's UI/scene from appearing before the copy has switched.
 */
export function featureBandOpacitySequential(story: number, featureId: string, fade = 0.022) {
  const band = featureChapters.find((chapter) => chapter.id === featureId);
  if (!band) return 0;
  if (story < band.start || story >= band.end) return 0;
  if (story < band.start + fade) return (story - band.start) / fade;
  if (story > band.end - fade) return (band.end - story) / fade;
  return 1;
}

/**
 * Scene progress inside a feature band with sequential fade margins removed.
 * During fade-in: progress stays at 0.
 * During fade-out: progress stays at 1.
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
