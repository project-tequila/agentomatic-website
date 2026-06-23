export type VoiceHeliosState = "idle" | "listening" | "speaking";

export type VoiceHeliosInputProps = {
  voiceState: VoiceHeliosState;
  energy: number;
  pointerX: number;
  pointerY: number;
  scrollProgress: number;
  /** Full rumik story timeline (0–1). */
  storyProgress: number;
  /** Hero cinema timeline: walk in → sit at desk (0–1). */
  sceneProgress: number;
};

export const defaultVoiceHeliosInput: VoiceHeliosInputProps = {
  voiceState: "idle",
  energy: 0.18,
  pointerX: 0,
  pointerY: 0,
  scrollProgress: 0,
  storyProgress: 0,
  sceneProgress: 0,
};
