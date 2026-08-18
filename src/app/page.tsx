import type { Metadata } from "next";

import { HomeImmersiveExperience } from "@/components/site/home-immersive-experience";
import { HomeSeoContent } from "@/components/site/home-seo-content";
import { SitePageShell } from "@/components/site/site-page-shell";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  path: "/",
});

export default function Home() {
  return (
    <SitePageShell immersive3d showContactAndFooter={false}>
      <HomeSeoContent />
      <HomeImmersiveExperience />
    </SitePageShell>
  );
}
