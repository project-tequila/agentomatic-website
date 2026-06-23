import type { MetadataRoute } from "next";

import { getSiteUrl, STATIC_ROUTES } from "@/lib/seo";
import { getPublishedPostSlugs } from "@/sanity/fetch";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: new URL(route, siteUrl).toString(),
    lastModified,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));

  const slugs = await getPublishedPostSlugs();
  const blogEntries: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: new URL(`/blog/${slug}`, siteUrl).toString(),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...blogEntries];
}
