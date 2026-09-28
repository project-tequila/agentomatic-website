import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildDemoWebVoiceGatewayPayload,
  getApiGatewayBaseUrl,
  getDemoWebVoiceSessionUrl,
} from "./voice-gateway.ts";

test("getApiGatewayBaseUrl strips trailing slash and adds https", () => {
  const previous = process.env.API_GATEWAY_URL;
  process.env.API_GATEWAY_URL = "gateway.example.com/";
  try {
    assert.equal(getApiGatewayBaseUrl(), "https://gateway.example.com");
  } finally {
    if (previous === undefined) delete process.env.API_GATEWAY_URL;
    else process.env.API_GATEWAY_URL = previous;
  }
});

test("buildDemoWebVoiceGatewayPayload is language plus optional speech_path", () => {
  assert.deepEqual(buildDemoWebVoiceGatewayPayload({ language: "hi", speechPath: "speech_llm" }), {
    language: "hi",
    speech_path: "speech_llm",
  });
  assert.deepEqual(buildDemoWebVoiceGatewayPayload({ language: "or" }), { language: "or" });
  assert.deepEqual(buildDemoWebVoiceGatewayPayload({ speechPath: "cascade" }), {
    speech_path: "cascade",
  });
  assert.deepEqual(buildDemoWebVoiceGatewayPayload(), {});
  const payload = buildDemoWebVoiceGatewayPayload({ language: "en", speechPath: "cascade" });
  assert.equal("model" in payload, false);
  assert.deepEqual(Object.keys(payload).toSorted(), ["language", "speech_path"]);
});

test("buildDemoWebVoiceGatewayPayload forwards only catalog language and allowlisted speech_path", () => {
  assert.deepEqual(buildDemoWebVoiceGatewayPayload({ language: "not-a-lang" }), {});
  assert.deepEqual(buildDemoWebVoiceGatewayPayload({ language: "kok" }), {});
  assert.deepEqual(buildDemoWebVoiceGatewayPayload({ language: "   " }), {});
  assert.deepEqual(buildDemoWebVoiceGatewayPayload({ language: "en", speechPath: "phone" }), {
    language: "en",
  });
  assert.deepEqual(buildDemoWebVoiceGatewayPayload({ language: "af", speechPath: "speech_llm" }), {
    language: "af",
    speech_path: "speech_llm",
  });
  assert.deepEqual(buildDemoWebVoiceGatewayPayload({ language: "zh-CN", speechPath: "speech_llm" }), {
    language: "zh-Hans",
    speech_path: "speech_llm",
  });
  assert.deepEqual(buildDemoWebVoiceGatewayPayload({ language: "kok", speechPath: "cascade" }), {
    language: "kok",
    speech_path: "cascade",
  });
  assert.deepEqual(buildDemoWebVoiceGatewayPayload({ language: "hi-IN", speechPath: "cascade" }), {
    language: "hi",
    speech_path: "cascade",
  });
  assert.deepEqual(buildDemoWebVoiceGatewayPayload({ language: "af", speechPath: "cascade" }), {
    speech_path: "cascade",
  });
  assert.deepEqual(buildDemoWebVoiceGatewayPayload({ language: "od", speechPath: "speech_llm" }), {
    language: "or",
    speech_path: "speech_llm",
  });
  assert.deepEqual(buildDemoWebVoiceGatewayPayload({ language: "or", speechPath: "cascade" }), {
    language: "od",
    speech_path: "cascade",
  });
});

test("getDemoWebVoiceSessionUrl targets the locked demo mint path", () => {
  const previous = process.env.API_GATEWAY_URL;
  process.env.API_GATEWAY_URL = "https://gateway.example.com";
  try {
    assert.equal(
      getDemoWebVoiceSessionUrl(),
      "https://gateway.example.com/api/v1/ai/demo/web-voice-session",
    );
  } finally {
    if (previous === undefined) delete process.env.API_GATEWAY_URL;
    else process.env.API_GATEWAY_URL = previous;
  }
});
