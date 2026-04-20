import type { Metadata } from "next";

import { SitePageShell } from "@/components/site/site-page-shell";
import { VisionPageContent } from "@/components/site/vision-page-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vision — Agentomatic Labs",
  description:
    "Our mission, story, and leadership—AI that captures every conversation and delivers clarity through dashboards.",
};

export default function VisionPage() {
  return (
    <SitePageShell>
      <VisionPageContent />
    </SitePageShell>
  );
}
