import assert from "node:assert/strict";
import { test } from "node:test";

import {
  CASCADE_VOICE_LANGUAGE_OPTIONS,
  DEFAULT_DEMO_VOICE_LANGUAGE,
  normalizeSpeechLlmLanguage,
  normalizeVoiceLanguage,
  parseDemoVoiceEngine,
  SPEECH_LLM_LANGUAGE_OPTIONS,
  VOICE_LANGUAGE_OPTIONS,
} from "./voice-languages.ts";
import { canChangeDemoWebVoiceLanguage } from "./voice/demo-web-voice-language.ts";

test("VOICE_LANGUAGE_OPTIONS includes English and Hindi", () => {
  const values = VOICE_LANGUAGE_OPTIONS.map((option) => option.value);
  assert.ok(values.includes("en"));
  assert.ok(values.includes("hi"));
});

test("normalizeVoiceLanguage maps legacy or to od and falls back to default", () => {
  assert.equal(normalizeVoiceLanguage("or"), "od");
  assert.equal(normalizeVoiceLanguage("hi-IN"), "hi");
  assert.equal(normalizeVoiceLanguage("not-a-lang"), DEFAULT_DEMO_VOICE_LANGUAGE);
  assert.equal(normalizeVoiceLanguage(undefined), DEFAULT_DEMO_VOICE_LANGUAGE);
});

test("speech and cascade language speakers stay separate", () => {
  const speech = SPEECH_LLM_LANGUAGE_OPTIONS.map((option) => option.value);
  const cascade = CASCADE_VOICE_LANGUAGE_OPTIONS.map((option) => option.value);
  assert.equal(CASCADE_VOICE_LANGUAGE_OPTIONS, VOICE_LANGUAGE_OPTIONS);
  assert.ok(speech.includes("en"));
  assert.ok(speech.includes("zh-Hans"));
  assert.ok(speech.includes("or"));
  assert.equal(speech.includes("od"), false);
  assert.ok(cascade.includes("od"));
  assert.ok(cascade.includes("kok"));
  assert.equal(cascade.includes("zh-Hans"), false);
  assert.equal(normalizeSpeechLlmLanguage("od"), "or");
  assert.equal(normalizeSpeechLlmLanguage("zh-CN"), "zh-Hans");
  assert.equal(normalizeSpeechLlmLanguage("kok"), "en");
  assert.equal(parseDemoVoiceEngine("speech_llm"), "speech_llm");
  assert.equal(parseDemoVoiceEngine("cascade"), "cascade");
  assert.equal(parseDemoVoiceEngine("phone"), null);
});

test("canChangeDemoWebVoiceLanguage only when idle or error", () => {
  assert.equal(canChangeDemoWebVoiceLanguage("idle"), true);
  assert.equal(canChangeDemoWebVoiceLanguage("error"), true);
  assert.equal(canChangeDemoWebVoiceLanguage("connecting"), false);
  assert.equal(canChangeDemoWebVoiceLanguage("listening"), false);
});
