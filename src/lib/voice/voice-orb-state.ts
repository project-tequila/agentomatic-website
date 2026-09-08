/**
 * Shared Talk-to-Agent orb motion states.
 * Volume is separate (getInputVolume / getOutputVolume); state drives motion, not palette swaps.
 */
export type VoiceEnergyOrbState =
  | "idle"
  | "connecting"
  | "listening"
  | "thinking"
  | "speaking"
  | "error";

export type VoiceEnergyOrbTranscriptHint = {
  role: "user" | "assistant";
  final: boolean;
};

export type VoiceEnergyOrbStateInput = {
  status: "idle" | "requesting-mic" | "connecting" | "listening" | "error";
  isAgentSpeaking: boolean;
  transcripts: readonly VoiceEnergyOrbTranscriptHint[];
};

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

/**
 * Map realtime-voice status + transcript tail onto orb motion.
 * Priority: error → speaking → connecting → thinking (final user turn) → listening → idle.
 */
export function mapVoiceEnergyOrbState(input: VoiceEnergyOrbStateInput): VoiceEnergyOrbState {
  if (input.status === "error") return "error";
  if (input.isAgentSpeaking) return "speaking";
  if (input.status === "connecting" || input.status === "requesting-mic") return "connecting";
  if (input.status === "listening") {
    const last = input.transcripts[input.transcripts.length - 1];
    if (last?.role === "user" && last.final) return "thinking";
    return "listening";
  }
  return "idle";
}

/**
 * Mix agent state with live RMS so the existing SVG orb stays alive at rest
 * and punches when you or the agent speak.
 */
export function orbAudioEnergy(
  state: VoiceEnergyOrbState,
  inputVolume: number,
  outputVolume: number,
): number {
  const input = clamp01(inputVolume);
  const output = clamp01(outputVolume);

  switch (state) {
    case "speaking":
      return clamp01(0.34 + output * 0.66);
    case "listening":
      return clamp01(0.28 + input * 0.72);
    case "connecting":
      return 0.38;
    case "thinking":
      return 0.32;
    case "error":
      return 0.2;
    default:
      return 0.12;
  }
}

export function orbIntensityFromEnergy(energy: number): number {
  return 0.48 + clamp01(energy) * 0.52;
}
