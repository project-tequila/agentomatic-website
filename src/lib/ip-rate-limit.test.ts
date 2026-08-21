import assert from "node:assert/strict";
import { test } from "node:test";

import { SlidingWindowRateLimiter, clientIpFromHeaders } from "./ip-rate-limit.ts";

test("allows up to the limit within the window", () => {
  const limiter = new SlidingWindowRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });
  const now = 1_000_000;

  for (let i = 0; i < 5; i++) {
    assert.equal(limiter.tryConsume("1.1.1.1", now), true);
  }
});

test("rejects the sixth request in the same window", () => {
  const limiter = new SlidingWindowRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });
  const now = 1_000_000;

  for (let i = 0; i < 5; i++) {
    limiter.tryConsume("1.1.1.1", now);
  }

  assert.equal(limiter.tryConsume("1.1.1.1", now), false);
});

test("isolates counters per key", () => {
  const limiter = new SlidingWindowRateLimiter({ limit: 1, windowMs: 10 * 60 * 1000 });
  const now = 1_000_000;

  assert.equal(limiter.tryConsume("a", now), true);
  assert.equal(limiter.tryConsume("b", now), true);
  assert.equal(limiter.tryConsume("a", now), false);
});

test("allows again after timestamps fall outside the window", () => {
  const limiter = new SlidingWindowRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });
  const start = 1_000_000;

  for (let i = 0; i < 5; i++) {
    limiter.tryConsume("1.1.1.1", start);
  }

  assert.equal(limiter.tryConsume("1.1.1.1", start + 10 * 60 * 1000), true);
});

test("clientIpFromHeaders prefers x-forwarded-for first hop", () => {
  const headers = new Headers({ "x-forwarded-for": "203.0.113.9, 10.0.0.1" });
  assert.equal(clientIpFromHeaders(headers, "127.0.0.1"), "203.0.113.9");
});

test("clientIpFromHeaders falls back when forwarded is missing", () => {
  assert.equal(clientIpFromHeaders(new Headers(), "127.0.0.1"), "127.0.0.1");
});
