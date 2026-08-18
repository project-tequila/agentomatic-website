import type { MetadataRoute } from "next";

import { canonicalUrl, STATIC_ROUTE_LASTMOD, STATIC_ROUTES } from "@/lib/seo";
import { getPublishedPostsForSitemap } from "@/sanity/fetch";

/**
 * Sitemap must never 500 — Google treats failed sitemap fetches as
 * indexation blockers. Static routes always ship; blog slugs are best-effort.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: canonicalUrl(route),
    lastModified: STATIC_ROUTE_LASTMOD[route],
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));

  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await getPublishedPostsForSitemap();
    blogEntries = posts.map((post) => ({
      url: canonicalUrl(`/blog/${post.slug}`),
      lastModified: post._updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("[sitemap] Failed to load published post slugs; serving static routes only.", error);
  }

  return [...staticEntries, ...blogEntries];
}
