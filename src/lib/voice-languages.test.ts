import assert from "node:assert/strict";
import { test } from "node:test";

import {
  CASCADE_VOICE_LANGUAGE_OPTIONS,
  DEFAULT_DEMO_VOICE_LANGUAGE,
  normalizeSpeechLlmLanguage,
  normalizeVoiceLanguage,
  parseDemoVoiceEngine,
  parseDemoWebVoicePost,
  parseDemoWebVoiceSessionBody,
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

test("parseDemoWebVoiceSessionBody accepts a speech_llm catalog language", () => {
  assert.deepEqual(
    parseDemoWebVoiceSessionBody({ language: "hi", speech_path: "speech_llm" }),
    { ok: true, language: "hi", speechPath: "speech_llm" },
  );
  assert.deepEqual(
    parseDemoWebVoiceSessionBody({ language: "af", speech_path: "speech_llm" }),
    { ok: true, language: "af", speechPath: "speech_llm" },
  );
  assert.deepEqual(
    parseDemoWebVoiceSessionBody({ language: "zh-Hans", speech_path: "speech_llm" }),
    { ok: true, language: "zh-Hans", speechPath: "speech_llm" },
  );
  assert.deepEqual(parseDemoWebVoiceSessionBody({ language: "zh-CN", speech_path: "speech_llm" }), {
    ok: true,
    language: "zh-Hans",
    speechPath: "speech_llm",
  });
});

test("parseDemoWebVoiceSessionBody accepts a cascade catalog language", () => {
  assert.deepEqual(parseDemoWebVoiceSessionBody({ language: "hi", speech_path: "cascade" }), {
    ok: true,
    language: "hi",
    speechPath: "cascade",
  });
  assert.deepEqual(parseDemoWebVoiceSessionBody({ language: "hi-IN", speech_path: "cascade" }), {
    ok: true,
    language: "hi",
    speechPath: "cascade",
  });
  assert.deepEqual(parseDemoWebVoiceSessionBody({ language: "kok", speech_path: "cascade" }), {
    ok: true,
    language: "kok",
    speechPath: "cascade",
  });
});

test("parseDemoWebVoiceSessionBody rejects cascade-only codes for speech_llm", () => {
  assert.deepEqual(parseDemoWebVoiceSessionBody({ language: "kok", speech_path: "speech_llm" }), {
    ok: false,
    error: "language must be a speech_llm catalog code.",
  });
  assert.deepEqual(parseDemoWebVoiceSessionBody({ language: "not-a-lang", speech_path: "speech_llm" }), {
    ok: false,
    error: "language must be a speech_llm catalog code.",
  });
});

test("parseDemoWebVoiceSessionBody rejects speech_llm-only codes for cascade", () => {
  assert.deepEqual(parseDemoWebVoiceSessionBody({ language: "af", speech_path: "cascade" }), {
    ok: false,
    error: "language must be a cascade catalog code.",
  });
  assert.deepEqual(parseDemoWebVoiceSessionBody({ language: "zh-Hans", speech_path: "cascade" }), {
    ok: false,
    error: "language must be a cascade catalog code.",
  });
});

test("parseDemoWebVoiceSessionBody still rejects an invalid speech_path", () => {
  assert.deepEqual(parseDemoWebVoiceSessionBody({ language: "en", speech_path: "phone" }), {
    ok: false,
    error: "speech_path must be speech_llm or cascade.",
  });
  assert.deepEqual(parseDemoWebVoiceSessionBody({ speech_path: "SPEECH_LLM" }), {
    ok: false,
    error: "speech_path must be speech_llm or cascade.",
  });
});

test("Odia alias follows the engine normalizer: or for speech_llm, od for cascade", () => {
  assert.deepEqual(parseDemoWebVoiceSessionBody({ language: "or", speech_path: "speech_llm" }), {
    ok: true,
    language: "or",
    speechPath: "speech_llm",
  });
  assert.deepEqual(parseDemoWebVoiceSessionBody({ language: "od", speech_path: "speech_llm" }), {
    ok: true,
    language: "or",
    speechPath: "speech_llm",
  });
  assert.deepEqual(parseDemoWebVoiceSessionBody({ language: "od", speech_path: "cascade" }), {
    ok: true,
    language: "od",
    speechPath: "cascade",
  });
  assert.deepEqual(parseDemoWebVoiceSessionBody({ language: "or", speech_path: "cascade" }), {
    ok: true,
    language: "od",
    speechPath: "cascade",
  });
});

test("parseDemoWebVoiceSessionBody omits empty language and omitted speech_path", () => {
  assert.deepEqual(parseDemoWebVoiceSessionBody({}), { ok: true });
  assert.deepEqual(parseDemoWebVoiceSessionBody({ language: "   " }), { ok: true });
  assert.deepEqual(parseDemoWebVoiceSessionBody({ speech_path: "cascade" }), {
    ok: true,
    speechPath: "cascade",
  });
  assert.deepEqual(parseDemoWebVoiceSessionBody({ language: "af" }), {
    ok: true,
    language: "af",
  });
  assert.deepEqual(parseDemoWebVoiceSessionBody({ language: "kok" }), {
    ok: false,
    error: "language must be a speech_llm catalog code.",
  });
});

test("parseDemoWebVoicePost rejects a non-JSON POST before mint", () => {
  assert.deepEqual(parseDemoWebVoicePost({ contentType: null, body: { language: "en" } }), {
    ok: false,
    error: "Invalid JSON body.",
  });
  assert.deepEqual(
    parseDemoWebVoicePost({ contentType: "text/plain", body: { language: "en", speech_path: "speech_llm" } }),
    { ok: false, error: "Invalid JSON body." },
  );
  assert.deepEqual(parseDemoWebVoicePost({ contentType: "application/json", body: null }), {
    ok: false,
    error: "Invalid JSON body.",
  });
  assert.deepEqual(parseDemoWebVoicePost({ contentType: "application/json", body: ["en"] }), {
    ok: false,
    error: "Invalid JSON body.",
  });
});

test("parseDemoWebVoicePost rejects unknown speech_path and unknown language", () => {
  assert.deepEqual(
    parseDemoWebVoicePost({
      contentType: "application/json",
      body: { language: "en", speech_path: "phone" },
    }),
    { ok: false, error: "speech_path must be speech_llm or cascade." },
  );
  assert.deepEqual(
    parseDemoWebVoicePost({
      contentType: "application/json",
      body: { language: "not-a-lang" },
    }),
    { ok: false, error: "language must be a speech_llm catalog code." },
  );
  assert.deepEqual(
    parseDemoWebVoicePost({
      contentType: "application/json",
      body: { language: "kok", speech_path: "speech_llm" },
    }),
    { ok: false, error: "language must be a speech_llm catalog code." },
  );
  assert.deepEqual(
    parseDemoWebVoicePost({
      contentType: "application/json",
      body: { language: "af", speech_path: "cascade" },
    }),
    { ok: false, error: "language must be a cascade catalog code." },
  );
});

test("parseDemoWebVoicePost accepts speech_llm and cascade catalog codes", () => {
  assert.deepEqual(
    parseDemoWebVoicePost({
      contentType: "application/json; charset=utf-8",
      body: { language: "hi", speech_path: "speech_llm" },
    }),
    { ok: true, language: "hi", speechPath: "speech_llm" },
  );
  assert.deepEqual(
    parseDemoWebVoicePost({
      contentType: "application/json",
      body: { language: "zh-CN", speech_path: "speech_llm" },
    }),
    { ok: true, language: "zh-Hans", speechPath: "speech_llm" },
  );
  assert.deepEqual(
    parseDemoWebVoicePost({
      contentType: "application/json",
      body: { language: "kok", speech_path: "cascade" },
    }),
    { ok: true, language: "kok", speechPath: "cascade" },
  );
  assert.deepEqual(
    parseDemoWebVoicePost({
      contentType: "application/json",
      body: { language: "en-US", speech_path: "cascade" },
    }),
    { ok: true, language: "en", speechPath: "cascade" },
  );
  assert.deepEqual(parseDemoWebVoicePost({ contentType: "application/json", body: {} }), {
    ok: true,
  });
  assert.deepEqual(
    parseDemoWebVoicePost({ contentType: "application/json", body: { language: "af" } }),
    { ok: true, language: "af" },
  );
});

test("canChangeDemoWebVoiceLanguage only when idle or error", () => {
  assert.equal(canChangeDemoWebVoiceLanguage("idle"), true);
  assert.equal(canChangeDemoWebVoiceLanguage("error"), true);
  assert.equal(canChangeDemoWebVoiceLanguage("connecting"), false);
  assert.equal(canChangeDemoWebVoiceLanguage("listening"), false);
});
