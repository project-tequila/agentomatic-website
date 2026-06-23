import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { DM_Sans, IBM_Plex_Mono, Newsreader, Syne } from "next/font/google";

import { JsonLd } from "@/components/site/json-ld";
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

const marketingSyne = Syne({
  variable: "--font-marketing-syne",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

const marketingDmSans = DM_Sans({
  variable: "--font-marketing-dm",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
      className={`${ibmPlexMono.variable} ${marketingSyne.variable} ${marketingDmSans.variable} ${harveySerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#121418] text-white" suppressHydrationWarning>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
