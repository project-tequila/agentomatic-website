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
