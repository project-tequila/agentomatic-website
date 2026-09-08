import { act1Beats } from "./chapters";

/** 0–1 progress inside an Act 1 beat band, or null if outside. */
export function act1BeatProgress(story: number, beatId: string) {
  const band = act1Beats.find((beat) => beat.id === beatId);
  if (!band || story < band.start || story >= band.end) return null;
  return (story - band.start) / (band.end - band.start);
}

export function act1BeatOpacity(story: number, beatId: string, edge = 0.04) {
  const band = act1Beats.find((beat) => beat.id === beatId);
  if (!band) return 0;
  if (story < band.start || story >= band.end) return 0;
  if (story < band.start + edge) return (story - band.start) / edge;
  return 1;
}
