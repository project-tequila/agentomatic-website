import assert from "node:assert/strict";
import { test } from "node:test";

import {
  getVoiceDemoStatusCopy,
  resolveVoiceDemoUiStatus,
} from "./voice-demo-status.ts";

test("prefers an error over a live connection", () => {
  assert.equal(
    resolveVoiceDemoUiStatus({
      hookStatus: "listening",
      isAgentSpeaking: true,
      hasError: true,
    }),
    "error",
  );
});

test("maps agent playback separately from listening", () => {
  assert.equal(
    resolveVoiceDemoUiStatus({
      hookStatus: "listening",
      isAgentSpeaking: true,
      hasError: false,
    }),
    "agent-speaking",
  );
});

test("prefers human-transfer phases over listening", () => {
  assert.equal(
    resolveVoiceDemoUiStatus({
      hookStatus: "listening",
      isAgentSpeaking: false,
      hasError: false,
      humanTransferStatus: "transferring",
    }),
    "transferring",
  );
  assert.equal(
    resolveVoiceDemoUiStatus({
      hookStatus: "listening",
      isAgentSpeaking: true,
      hasError: false,
      humanTransferStatus: "connected",
    }),
    "transfer-connected",
  );
  assert.equal(
    resolveVoiceDemoUiStatus({
      hookStatus: "listening",
      isAgentSpeaking: false,
      hasError: false,
      humanTransferStatus: "failed",
    }),
    "transfer-failed",
  );
});

test("shows live human-transfer copy without a fake callback promise", () => {
  const transferring = getVoiceDemoStatusCopy("transferring");
  assert.match(transferring.label, /connecting you to a human/i);
  assert.equal(transferring.detail.toLowerCase().includes("we will call you"), false);

  const connected = getVoiceDemoStatusCopy("transfer-connected");
  assert.equal(connected.label, "Connected");

  const failed = getVoiceDemoStatusCopy("transfer-failed");
  assert.match(failed.label, /transfer failed/i);
  assert.equal(failed.detail.toLowerCase().includes("we will call you"), false);
});
