import type { NextConfig } from "next";

import { APPOINTMENT_BOOKER_URL } from "./src/lib/booker/booker-session";

/** Minimal CSP: frame-ancestors only. Do not add script/img/connect
 * directives — Helios/3D, Sanity Studio, GA, Vercel Analytics, and
 * cdn.sanity.io would need unsafe-eval / third-party allowlists and
 * are easy to blank the site with. */
const MINIMAL_CSP = "frame-ancestors 'self'";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: MINIMAL_CSP },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "agentomatic.in" }],
        destination: "https://www.agentomatic.in/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "agentomatic.com" }],
        destination: "https://www.agentomatic.in/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.agentomatic.com" }],
        destination: "https://www.agentomatic.in/:path*",
        permanent: true,
      },
      {
        source: "/book",
        destination: APPOINTMENT_BOOKER_URL,
        permanent: true,
      },
      {
        source: "/signin",
        destination: APPOINTMENT_BOOKER_URL,
        permanent: true,
      },
      {
        source: "/signup",
        destination: `${APPOINTMENT_BOOKER_URL}/register`,
        permanent: true,
      },
      {
        source: "/register",
        destination: `${APPOINTMENT_BOOKER_URL}/register`,
        permanent: true,
      },
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  transpilePackages: ["@helios-project/core", "sanity"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
