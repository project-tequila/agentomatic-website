import assert from "node:assert/strict";
import { test } from "node:test";

import { magneticTransformTarget } from "./motion/magnetic-dom.ts";

type FakeNode = {
  id: string;
  querySelector: (selector: string) => FakeNode | null;
};

function hostWithoutInner(): FakeNode {
  return {
    id: "button",
    querySelector: () => null,
  };
}

function hostWithInner(inner: FakeNode): FakeNode {
  return {
    id: "button",
    querySelector: (selector: string) =>
      selector.includes("magnetic-inner") ? inner : null,
  };
}

test("magneticTransformTarget uses the host when no React-owned inner exists", () => {
  const button = hostWithoutInner();
  assert.equal(magneticTransformTarget(button), button);
});

test("magneticTransformTarget prefers an existing .magnetic-inner instead of inventing a wrapper", () => {
  const inner: FakeNode = { id: "inner", querySelector: () => null };
  const button = hostWithInner(inner);
  assert.equal(magneticTransformTarget(button), inner);
});
