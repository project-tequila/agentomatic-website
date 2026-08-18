import assert from "node:assert/strict";
import { test } from "node:test";

import { getApiGatewayBaseUrl, getDemoWebVoiceSessionUrl } from "./voice-gateway.ts";

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
