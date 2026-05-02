import type { Metadata, Viewport } from "next";
import { DM_Sans, IBM_Plex_Mono, Syne } from "next/font/google";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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

export const metadata: Metadata = {
  title: "Agentomatic Voice",
  description: "A minimal voice AI agent experience for calls, leads, and visitor conversations.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050607",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ibmPlexMono.variable} ${marketingSyne.variable} ${marketingDmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
