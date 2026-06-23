import type { Metadata } from "next";

import { HomeSeoContent } from "@/components/site/home-seo-content";
import { Immersive3DSite } from "@/components/site/immersive-3d-site";
import { RumikStory } from "@/components/site/rumik-story";
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
      <Immersive3DSite>
        <RumikStory />
      </Immersive3DSite>
    </SitePageShell>
  );
}
