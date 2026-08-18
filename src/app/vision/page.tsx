import type { Metadata } from "next";

import { SitePageShell } from "@/components/site/site-page-shell";
import { VisionPageContent } from "@/components/site/vision-page-content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "vision — agentomatic",
  description:
    "a voice ai vision for answering visitors, qualifying leads, and turning conversations into memory.",
  path: "/vision",
});

export default function VisionPage() {
  return (
    <SitePageShell>
      <VisionPageContent />
    </SitePageShell>
  );
}
