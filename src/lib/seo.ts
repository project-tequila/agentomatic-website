import type { Metadata } from "next";

import { CONTACT_EMAIL, CONTACT_PHONE_E164 } from "@/lib/site-contact";

export const DEFAULT_SITE_URL = "https://agentomatic.com";

export const SITE_NAME = "agentomatic";

export { CONTACT_EMAIL } from "@/lib/site-contact";

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

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: path,
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
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
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
  const siteUrl = getSiteUrl().toString();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: siteUrl,
    email: CONTACT_EMAIL,
    description: DEFAULT_DESCRIPTION,
    logo: `${siteUrl}/icon`,
    ...(CONTACT_PHONE_E164 ? { telephone: CONTACT_PHONE_E164 } : {}),
  };
}

export function websiteJsonLd() {
  const siteUrl = getSiteUrl().toString();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    description: DEFAULT_DESCRIPTION,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: siteUrl,
    },
  };
}

export function articleJsonLd({
  title,
  description,
  slug,
  publishedAt,
  authorName,
  imageUrl,
}: {
  title: string;
  description?: string;
  slug: string;
  publishedAt: string;
  authorName?: string;
  imageUrl?: string;
}) {
  const siteUrl = getSiteUrl().toString();
  const url = `${siteUrl}/blog/${slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: publishedAt,
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
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/icon`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}
