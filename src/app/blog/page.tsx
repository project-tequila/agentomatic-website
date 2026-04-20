import { MarketingSiteIframe } from "@/components/site/marketing-iframe";
import { SitePageShell } from "@/components/site/site-page-shell";

export default function BlogPage() {
  return (
    <SitePageShell>
      <MarketingSiteIframe title="Blog — Agentomatic Labs" scrollable underSiteChrome />
    </SitePageShell>
  );
}
