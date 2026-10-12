import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import {
  chooseDemoVoiceEngine,
  chooseDemoVoiceLanguage,
  clearDemoVoiceLanguage,
  getDemoVoiceChoice,
  isDemoVoiceChoiceReady,
  resetDemoVoiceChoice,
} from "./demo-voice-choice.ts";

beforeEach(() => {
  resetDemoVoiceChoice();
});

test("defaults make Speech LLM ready and leave cascade inactive until selected", () => {
  const choice = getDemoVoiceChoice();
  assert.equal(choice.engine, "speech_llm");
  assert.equal(choice.speechLanguage, "en");
  assert.equal(choice.cascadeLanguage, "en");
  assert.equal(isDemoVoiceChoiceReady("speech_llm"), true);
  assert.equal(isDemoVoiceChoiceReady("cascade"), false);

  chooseDemoVoiceEngine("cascade");
  assert.equal(isDemoVoiceChoiceReady("cascade"), true);
  assert.equal(isDemoVoiceChoiceReady("speech_llm"), false);
});

test("reset returns to the seeded defaults", () => {
  chooseDemoVoiceLanguage("speech_llm", "hi");
  chooseDemoVoiceEngine("cascade");
  chooseDemoVoiceLanguage("cascade", "ta");
  resetDemoVoiceChoice();

  assert.deepEqual(getDemoVoiceChoice(), {
    engine: "speech_llm",
    speechLanguage: "en",
    cascadeLanguage: "en",
  });
  assert.equal(isDemoVoiceChoiceReady("speech_llm"), true);
  assert.equal(isDemoVoiceChoiceReady("cascade"), false);
});

test("choosing a language or engine updates the store and keeps the active engine ready", () => {
  chooseDemoVoiceLanguage("speech_llm", "hi");
  assert.equal(getDemoVoiceChoice().speechLanguage, "hi");
  assert.equal(isDemoVoiceChoiceReady("speech_llm"), true);

  chooseDemoVoiceEngine("cascade");
  chooseDemoVoiceLanguage("cascade", "bn");
  assert.equal(getDemoVoiceChoice().engine, "cascade");
  assert.equal(getDemoVoiceChoice().cascadeLanguage, "bn");
  assert.equal(isDemoVoiceChoiceReady("cascade"), true);
  assert.equal(isDemoVoiceChoiceReady("speech_llm"), false);

  chooseDemoVoiceEngine("speech_llm");
  assert.equal(isDemoVoiceChoiceReady("speech_llm"), true);
  assert.equal(isDemoVoiceChoiceReady("cascade"), false);
});

test("active engine with a null or empty language is not ready", () => {
  clearDemoVoiceLanguage("speech_llm");
  assert.equal(getDemoVoiceChoice().speechLanguage, null);
  assert.equal(isDemoVoiceChoiceReady("speech_llm"), false);

  chooseDemoVoiceLanguage("speech_llm", "");
  assert.equal(isDemoVoiceChoiceReady("speech_llm"), false);

  chooseDemoVoiceLanguage("speech_llm", "   ");
  assert.equal(isDemoVoiceChoiceReady("speech_llm"), false);

  chooseDemoVoiceEngine("cascade");
  clearDemoVoiceLanguage("cascade");
  assert.equal(isDemoVoiceChoiceReady("cascade"), false);
  assert.equal(isDemoVoiceChoiceReady("speech_llm"), false);
});

test("a missing engine is not ready", () => {
  assert.equal(
    isDemoVoiceChoiceReady("speech_llm", {
      engine: null,
      speechLanguage: "en",
      cascadeLanguage: "en",
    }),
    false,
  );
  assert.equal(isDemoVoiceChoiceReady("speech_llm"), true);
});

test("a passed snapshot is judged instead of the module store", () => {
  assert.equal(
    isDemoVoiceChoiceReady("cascade", {
      engine: "cascade",
      speechLanguage: null,
      cascadeLanguage: "hi",
    }),
    true,
  );
  assert.equal(
    isDemoVoiceChoiceReady("speech_llm", {
      engine: "cascade",
      speechLanguage: "en",
      cascadeLanguage: "hi",
    }),
    false,
  );
  assert.equal(getDemoVoiceChoice().engine, "speech_llm");
});

test("re-clicking the same engine or language does not clear its pick", () => {
  chooseDemoVoiceLanguage("speech_llm", "te");
  chooseDemoVoiceEngine("speech_llm");
  chooseDemoVoiceEngine("speech_llm");
  chooseDemoVoiceLanguage("speech_llm", "te");
  assert.equal(getDemoVoiceChoice().speechLanguage, "te");
  assert.equal(isDemoVoiceChoiceReady("speech_llm"), true);

  chooseDemoVoiceEngine("cascade");
  chooseDemoVoiceLanguage("cascade", "kn");
  chooseDemoVoiceLanguage("cascade", "kn");
  chooseDemoVoiceEngine("cascade");
  assert.equal(getDemoVoiceChoice().cascadeLanguage, "kn");
  assert.equal(isDemoVoiceChoiceReady("cascade"), true);
});
