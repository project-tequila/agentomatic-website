import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import type { Metadata, Viewport } from "next";
import { DM_Sans, IBM_Plex_Mono, Newsreader } from "next/font/google";

import { JsonLd } from "@/components/site/json-ld";
import { SiteBottomNotices } from "@/components/site/site-bottom-notices";
import { SiteDemoCallRoot } from "@/components/site/site-demo-call-root";
import { COOKIE_CONSENT_KEY } from "@/lib/cookie-consent";
import { organizationJsonLd, rootMetadata, websiteJsonLd } from "@/lib/seo";

import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const harveySerif = Newsreader({
  variable: "--font-harvey-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

const marketingDmSans = DM_Sans({
  variable: "--font-marketing-dm",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
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
        <Script id="cookie-consent-boot" strategy="beforeInteractive">
          {`try{var c=localStorage.getItem(${JSON.stringify(COOKIE_CONSENT_KEY)});if(c==="accepted"||c==="declined")document.documentElement.setAttribute("data-cookie-consent",c)}catch(e){}`}
        </Script>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <SiteDemoCallRoot>
          {children}
          <SiteBottomNotices />
        </SiteDemoCallRoot>
        <Analytics />
      </body>
    </html>
  );
}
