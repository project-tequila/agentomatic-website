import { interpolate } from "@helios-project/core";

/** Story scroll bands for the 3D phone → AI → calendar/CRM sequence. */
export const PHONE_ENTER_START = 0.14;
export const PHONE_ENTER_END = 0.3;
export const INCOMING_START = 0.24;
export const INCOMING_END = 0.48;
export const AI_ENGINE_START = 0.4;
export const AI_ENGINE_PEAK = 0.52;
export const AI_ENGINE_END = 0.66;
export const DATA_SPLIT_START = 0.56;
export const DATA_SPLIT_END = 0.78;
export const JOURNEY_FADE_START = 0.86;
export const JOURNEY_FADE_END = 0.94;

export function journeySceneOpacity(story: number) {
  return interpolate(story, [0.1, 0.16, JOURNEY_FADE_START, JOURNEY_FADE_END], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function phoneEnterProgress(story: number) {
  return interpolate(story, [PHONE_ENTER_START, PHONE_ENTER_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function phoneOpacity(story: number) {
  const enter = phoneEnterProgress(story);
  const exit = interpolate(story, [0.42, 0.54], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return enter * exit;
}

export function incomingCallIntensity(story: number) {
  const enter = interpolate(story, [INCOMING_START, INCOMING_START + 0.08], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(story, [INCOMING_END - 0.06, INCOMING_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return enter * exit;
}

export function aiEngineOpacity(story: number) {
  const enter = interpolate(story, [AI_ENGINE_START, AI_ENGINE_PEAK], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(story, [AI_ENGINE_END - 0.08, AI_ENGINE_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return enter * exit;
}

export function dataSplitProgress(story: number) {
  return interpolate(story, [DATA_SPLIT_START, DATA_SPLIT_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function splitIconsOpacity(story: number) {
  const enter = dataSplitProgress(story);
  const exit = interpolate(story, [JOURNEY_FADE_START, JOURNEY_FADE_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return enter * exit;
}
