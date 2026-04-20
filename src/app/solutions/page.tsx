import { MarketingSiteIframe } from "@/components/site/marketing-iframe";
import { SitePageShell } from "@/components/site/site-page-shell";

export default function SolutionsPage() {
  return (
    <SitePageShell>
      <MarketingSiteIframe title="Solutions — Agentomatic Labs" scrollable underSiteChrome />
    </SitePageShell>
  );
}
