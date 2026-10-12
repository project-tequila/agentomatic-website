import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import {
  chooseDemoVoiceEngine,
  chooseDemoVoiceLanguage,
  isDemoVoiceChoiceReady,
  resetDemoVoiceChoice,
} from "./demo-voice-choice.ts";

beforeEach(() => {
  resetDemoVoiceChoice();
});

test("defaults do not make either engine ready", () => {
  assert.equal(isDemoVoiceChoiceReady("speech_llm"), false);
  assert.equal(isDemoVoiceChoiceReady("cascade"), false);
});

test("language then the highlighted Speech LLM enables Start Talk", () => {
  chooseDemoVoiceLanguage("speech_llm", "hi");
  assert.equal(isDemoVoiceChoiceReady("speech_llm"), false);
  chooseDemoVoiceEngine("speech_llm");
  assert.equal(isDemoVoiceChoiceReady("speech_llm"), true);
  assert.equal(isDemoVoiceChoiceReady("cascade"), false);
});

test("language then Cascaded LLM enables Start Talk", () => {
  chooseDemoVoiceLanguage("cascade", "hi");
  chooseDemoVoiceEngine("cascade");
  assert.equal(isDemoVoiceChoiceReady("cascade"), true);
  assert.equal(isDemoVoiceChoiceReady("speech_llm"), false);
});

test("Speech LLM then language enables Start Talk", () => {
  chooseDemoVoiceEngine("speech_llm");
  assert.equal(isDemoVoiceChoiceReady("speech_llm"), false);
  chooseDemoVoiceLanguage("speech_llm", "ta");
  assert.equal(isDemoVoiceChoiceReady("speech_llm"), true);
});

test("Cascaded LLM then language enables Start Talk", () => {
  chooseDemoVoiceEngine("cascade");
  assert.equal(isDemoVoiceChoiceReady("cascade"), false);
  chooseDemoVoiceLanguage("cascade", "ta");
  assert.equal(isDemoVoiceChoiceReady("cascade"), true);
});

test("switching engines requires a new language for the engine you switch to", () => {
  chooseDemoVoiceLanguage("speech_llm", "hi");
  chooseDemoVoiceEngine("speech_llm");
  assert.equal(isDemoVoiceChoiceReady("speech_llm"), true);

  chooseDemoVoiceLanguage("cascade", "bn");
  chooseDemoVoiceEngine("cascade");
  assert.equal(isDemoVoiceChoiceReady("cascade"), false);
  assert.equal(isDemoVoiceChoiceReady("speech_llm"), false);

  chooseDemoVoiceLanguage("cascade", "bn");
  assert.equal(isDemoVoiceChoiceReady("cascade"), true);

  chooseDemoVoiceEngine("speech_llm");
  assert.equal(isDemoVoiceChoiceReady("speech_llm"), false);
  chooseDemoVoiceLanguage("speech_llm", "hi");
  assert.equal(isDemoVoiceChoiceReady("speech_llm"), true);
});

test("re-clicking the same engine does not clear its language", () => {
  chooseDemoVoiceLanguage("speech_llm", "te");
  chooseDemoVoiceEngine("speech_llm");
  chooseDemoVoiceEngine("speech_llm");
  assert.equal(isDemoVoiceChoiceReady("speech_llm"), true);

  chooseDemoVoiceLanguage("cascade", "kn");
  chooseDemoVoiceEngine("cascade");
  chooseDemoVoiceLanguage("cascade", "kn");
  chooseDemoVoiceEngine("cascade");
  assert.equal(isDemoVoiceChoiceReady("cascade"), true);
});

test("the shown language value still counts once clicked", () => {
  chooseDemoVoiceLanguage("speech_llm", "en");
  chooseDemoVoiceLanguage("speech_llm", "en");
  chooseDemoVoiceEngine("speech_llm");
  assert.equal(isDemoVoiceChoiceReady("speech_llm"), true);

  resetDemoVoiceChoice();
  chooseDemoVoiceLanguage("cascade", "en");
  chooseDemoVoiceLanguage("cascade", "en");
  chooseDemoVoiceEngine("cascade");
  assert.equal(isDemoVoiceChoiceReady("cascade"), true);
});
