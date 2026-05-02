import type { Metadata } from "next";

import { SitePageShell } from "@/components/site/site-page-shell";
import { VisionPageContent } from "@/components/site/vision-page-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vision - Agentomatic Voice",
  description:
    "A minimal voice AI vision for answering visitors, qualifying leads, and turning conversations into memory.",
};

export default function VisionPage() {
  return (
    <SitePageShell>
      <VisionPageContent />
    </SitePageShell>
  );
}
