import assert from "node:assert/strict";
import { test } from "node:test";

import {
  DEFAULT_DEMO_VOICE_LANGUAGE,
  normalizeVoiceLanguage,
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

test("canChangeDemoWebVoiceLanguage only when idle or error", () => {
  assert.equal(canChangeDemoWebVoiceLanguage("idle"), true);
  assert.equal(canChangeDemoWebVoiceLanguage("error"), true);
  assert.equal(canChangeDemoWebVoiceLanguage("connecting"), false);
  assert.equal(canChangeDemoWebVoiceLanguage("listening"), false);
});
