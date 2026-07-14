import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import { DM_Sans, IBM_Plex_Mono, Newsreader } from "next/font/google";

import { JsonLd } from "@/components/site/json-ld";
import { SiteDemoCallRoot } from "@/components/site/site-demo-call-root";
import { organizationJsonLd, rootMetadata, websiteJsonLd } from "@/lib/seo";

import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const harveySerif = Newsreader({
  variable: "--font-harvey-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const marketingDmSans = DM_Sans({
  variable: "--font-marketing-dm",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#121418",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ibmPlexMono.variable} ${marketingDmSans.variable} ${harveySerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[var(--brand-ink)] text-[var(--rumik-text)]" suppressHydrationWarning>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <SiteDemoCallRoot>{children}</SiteDemoCallRoot>
        <Analytics />
        <GoogleAnalytics gaId="G-DTVTGE7GB6" />
      </body>
    </html>
  );
}
