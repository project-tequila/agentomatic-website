import type { Metadata, Viewport } from "next";
import { DM_Sans, IBM_Plex_Mono, Syne } from "next/font/google";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

/** Same pairing as `public/agentomatic_labs_website.html` for shell contact + footer + Vision. */
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
  title: "Agentomatic Labs",
  description: "Agentomatic Labs landing page",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080c18",
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
