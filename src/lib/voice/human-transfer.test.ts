import assert from "node:assert/strict";
import { test } from "node:test";

import { parseHumanTransferEvent } from "./human-transfer.ts";

test("accepts the canonical type + status payload", () => {
  assert.deepEqual(
    parseHumanTransferEvent({
      type: "human_transfer",
      status: "transferring",
    }),
    { type: "human_transfer", status: "transferring" },
  );
});

test("accepts event envelopes and status aliases", () => {
  assert.equal(
    parseHumanTransferEvent({ event: "human_transfer", state: "connecting" })
      ?.status,
    "transferring",
  );
  assert.equal(
    parseHumanTransferEvent({ type: "human_transfer", status: "success" })
      ?.status,
    "connected",
  );
  assert.equal(
    parseHumanTransferEvent({ type: "human_transfer", status: "error" })
      ?.status,
    "failed",
  );
});

test("ignores unrelated voice messages", () => {
  assert.equal(
    parseHumanTransferEvent({ type: "transcript", text: "hi" }),
    null,
  );
  assert.equal(parseHumanTransferEvent({ event: "clear" }), null);
});
