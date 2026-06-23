import type { Metadata } from "next";

export { viewport } from "next-sanity/studio";

export const metadata: Metadata = {
  title: "Agentomatic CMS",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
