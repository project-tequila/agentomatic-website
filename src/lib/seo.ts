import type { Metadata } from "next";

import { CONTACT_EMAIL, CONTACT_PHONE_E164 } from "./site-contact.ts";

/** Canonical production origin — always `.in` (never `.com`). */
export const DEFAULT_SITE_URL = "https://www.agentomatic.in";

export const SITE_NAME = "agentomatic";

export { CONTACT_EMAIL } from "./site-contact.ts";

export const DEFAULT_TITLE = "agentomatic — ai frontdesk";

export const DEFAULT_DESCRIPTION =
  "streamline your front desk with ai — routine calls handled automatically, warm human transfer when it matters. phone, whatsapp, email, and calendar in one place.";

export const STATIC_ROUTES = [
  "/",
  "/solutions",
  "/vision",
  "/about",
  "/pricing",
  "/blog",
  "/contact",
  "/agents",
  "/privacy",
] as const;

/**
 * File-stable lastmod per static route (ISO date). Bump a value when that
 * route’s public content ships. Never use `new Date()` at sitemap generate time.
 */
export const STATIC_ROUTE_LASTMOD = {
  "/": "2026-08-18",
  "/solutions": "2026-08-12",
  "/vision": "2026-08-12",
  "/about": "2026-07-28",
  "/pricing": "2026-08-05",
  "/blog": "2026-08-15",
  "/contact": "2026-08-01",
  "/agents": "2026-08-12",
  "/privacy": "2026-06-15",
} as const satisfies Record<(typeof STATIC_ROUTES)[number], string>;

const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: SITE_NAME,
} as const;

export function getSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
  const normalized = raw.endsWith("/") ? raw.slice(0, -1) : raw;
  return new URL(normalized);
}

/** Origin without trailing slash — safe for `${origin}/path` joins. */
export function getSiteOrigin(): string {
  // Never use URL.href/toString() here — those include a trailing slash and
  // produce broken joins like `https://www.agentomatic.in//icon`.
  return getSiteUrl().origin.replace(/\/$/, "");
}

/**
 * Absolute canonical URL for a site path.
 * Homepage `/` keeps the trailing slash; every other path is origin + path with
 * no trailing slash. Emit this string (not a relative `/`) so Next 16
 * metadataBase composition cannot drop the homepage slash.
 */
export function canonicalUrl(path: string): string {
  const origin = getSiteOrigin();
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  const pathname = withSlash.replace(/\/+$/, "") || "/";

  if (pathname === "/") {
    return `${origin}/`;
  }

  return `${origin}${pathname}`;
}

type PageMetadataOptions = {
  title: string;
  description?: string;
  path: string;
  openGraph?: Metadata["openGraph"];
  twitterImages?: string[];
  robots?: Metadata["robots"];
};

export function pageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  openGraph,
  twitterImages,
  robots,
}: PageMetadataOptions): Metadata {
  const images = twitterImages ?? [DEFAULT_OG_IMAGE.url];
  const url = canonicalUrl(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
      ...openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
    ...(robots ? { robots } : {}),
  };
}

export const rootMetadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: DEFAULT_TITLE,
    template: "%s",
  },
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: canonicalUrl("/"),
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: canonicalUrl("/"),
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export function organizationJsonLd() {
  const origin = getSiteOrigin();
  const url = canonicalUrl("/");

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url,
    email: CONTACT_EMAIL,
    description: DEFAULT_DESCRIPTION,
    logo: `${origin}/icon`,
    ...(CONTACT_PHONE_E164 ? { telephone: CONTACT_PHONE_E164 } : {}),
  };
}

export function websiteJsonLd() {
  const url = canonicalUrl("/");

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url,
    description: DEFAULT_DESCRIPTION,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url,
    },
  };
}

export function articleJsonLd({
  title,
  description,
  slug,
  publishedAt,
  dateModified,
  authorName,
  imageUrl,
}: {
  title: string;
  description?: string;
  slug: string;
  publishedAt: string;
  dateModified?: string;
  authorName?: string;
  imageUrl?: string;
}) {
  const origin = getSiteOrigin();
  const url = canonicalUrl(`/blog/${slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: publishedAt,
    dateModified: dateModified ?? publishedAt,
    url,
    ...(imageUrl ? { image: [imageUrl] } : {}),
    ...(authorName
      ? {
          author: {
            "@type": "Person",
            name: authorName,
          },
        }
      : {}),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: canonicalUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: `${origin}/icon`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}
