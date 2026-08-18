import assert from "node:assert/strict";
import { test } from "node:test";

import {
  articleJsonLd,
  canonicalUrl,
  organizationJsonLd,
  pageMetadata,
  rootMetadata,
  websiteJsonLd,
} from "./seo.ts";

const HOMEPAGE = "https://www.agentomatic.in/";

test("canonicalUrl('/') is the homepage with a trailing slash", () => {
  assert.equal(canonicalUrl("/"), HOMEPAGE);
});

test("canonicalUrl strips trailing slashes on non-home paths", () => {
  assert.equal(canonicalUrl("/agents"), "https://www.agentomatic.in/agents");
  assert.equal(canonicalUrl("/agents/"), "https://www.agentomatic.in/agents");
  assert.equal(canonicalUrl("/blog/hello-world"), "https://www.agentomatic.in/blog/hello-world");
});

test("organizationJsonLd().url matches the homepage canonical character-for-character", () => {
  assert.equal(organizationJsonLd().url, canonicalUrl("/"));
  assert.equal(organizationJsonLd().url, HOMEPAGE);
});

test("websiteJsonLd().url matches the homepage canonical character-for-character", () => {
  assert.equal(websiteJsonLd().url, canonicalUrl("/"));
  assert.equal(websiteJsonLd().url, HOMEPAGE);
  assert.equal(websiteJsonLd().publisher.url, HOMEPAGE);
});

test("pageMetadata and rootMetadata emit absolute homepage canonicals", () => {
  const home = pageMetadata({ title: "home", path: "/" });
  assert.equal(home.alternates?.canonical, HOMEPAGE);
  assert.equal(home.openGraph?.url, HOMEPAGE);

  assert.equal(rootMetadata.alternates?.canonical, HOMEPAGE);
  assert.equal(rootMetadata.openGraph?.url, HOMEPAGE);
});

test("articleJsonLd dateModified falls back to publishedAt then prefers _updatedAt", () => {
  const publishedAt = "2026-01-15T00:00:00.000Z";
  const updatedAt = "2026-08-01T12:00:00.000Z";

  const withoutUpdate = articleJsonLd({
    title: "note",
    slug: "note",
    publishedAt,
  });
  assert.equal(withoutUpdate.dateModified, publishedAt);
  assert.equal(withoutUpdate.url, "https://www.agentomatic.in/blog/note");

  const withUpdate = articleJsonLd({
    title: "note",
    slug: "note",
    publishedAt,
    dateModified: updatedAt,
  });
  assert.equal(withUpdate.dateModified, updatedAt);
});
