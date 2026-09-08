import assert from "node:assert/strict";
import { test } from "node:test";

import {
  mapVoiceEnergyOrbState,
  orbAudioEnergy,
  orbIntensityFromEnergy,
} from "./voice/voice-orb-state.ts";

test("mapVoiceEnergyOrbState returns error when status is error", () => {
  assert.equal(
    mapVoiceEnergyOrbState({
      status: "error",
      isAgentSpeaking: true,
      transcripts: [{ role: "user", final: true }],
    }),
    "error",
  );
});

test("mapVoiceEnergyOrbState returns speaking when the agent is speaking", () => {
  assert.equal(
    mapVoiceEnergyOrbState({
      status: "listening",
      isAgentSpeaking: true,
      transcripts: [{ role: "user", final: true }],
    }),
    "speaking",
  );
});

test("mapVoiceEnergyOrbState treats requesting-mic as connecting", () => {
  assert.equal(
    mapVoiceEnergyOrbState({
      status: "requesting-mic",
      isAgentSpeaking: false,
      transcripts: [],
    }),
    "connecting",
  );
});


test("mapVoiceEnergyOrbState returns thinking after a final user turn", () => {
  assert.equal(
    mapVoiceEnergyOrbState({
      status: "listening",
      isAgentSpeaking: false,
      transcripts: [
        { role: "assistant", final: true },
        { role: "user", final: true },
      ],
    }),
    "thinking",
  );
});

test("mapVoiceEnergyOrbState stays listening for partial user transcripts", () => {
  assert.equal(
    mapVoiceEnergyOrbState({
      status: "listening",
      isAgentSpeaking: false,
      transcripts: [{ role: "user", final: false }],
    }),
    "listening",
  );
});

test("mapVoiceEnergyOrbState stays listening after an assistant transcript", () => {
  assert.equal(
    mapVoiceEnergyOrbState({
      status: "listening",
      isAgentSpeaking: false,
      transcripts: [{ role: "assistant", final: true }],
    }),
    "listening",
  );
});

test("mapVoiceEnergyOrbState returns listening with no transcripts", () => {
  assert.equal(
    mapVoiceEnergyOrbState({
      status: "listening",
      isAgentSpeaking: false,
      transcripts: [],
    }),
    "listening",
  );
});

test("mapVoiceEnergyOrbState returns idle when disconnected", () => {
  assert.equal(
    mapVoiceEnergyOrbState({
      status: "idle",
      isAgentSpeaking: false,
      transcripts: [],
    }),
    "idle",
  );
});

test("orbAudioEnergy uses mic floor while listening and punches with input", () => {
  const quiet = orbAudioEnergy("listening", 0, 1);
  const loud = orbAudioEnergy("listening", 1, 0);
  assert.equal(quiet, 0.28);
  assert.equal(loud, 1);
});

test("orbAudioEnergy uses TTS while speaking", () => {
  assert.equal(orbAudioEnergy("speaking", 1, 0), 0.34);
  assert.equal(orbAudioEnergy("speaking", 0, 1), 1);
});

test("orbIntensityFromEnergy stays in the SVG intensity range", () => {
  assert.equal(orbIntensityFromEnergy(0), 0.48);
  assert.equal(orbIntensityFromEnergy(1), 1);
});
