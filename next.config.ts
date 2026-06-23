import type { NextConfig } from "next";

import { APPOINTMENT_BOOKER_URL } from "./src/lib/booker/booker-session";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/signin",
        destination: APPOINTMENT_BOOKER_URL,
        permanent: false,
      },
      {
        source: "/book",
        destination: "/signin",
        permanent: false,
      },
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
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
