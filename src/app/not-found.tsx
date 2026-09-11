import type { Metadata } from "next";
import Link from "next/link";

import { SiteMain, SitePageHeader } from "@/components/site/marketing-page";
import { SitePageShell } from "@/components/site/site-page-shell";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "page not found — agentomatic",
  description: "this page isn't on agentomatic.in. go home or write us from the contact form.",
  path: "/404",
  robots: { index: false, follow: true },
});

export default function NotFound() {
  return (
    <SitePageShell>
      <SiteMain>
        <SitePageHeader
          kicker="404"
          title="this page isn't here."
          lead="the link may have moved. the home story and the contact form are still open."
        />
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="site-btn site-btn--cream">
            back home
          </Link>
          <Link href="/contact" className="site-btn site-btn--outline">
            contact us
          </Link>
        </div>
      </SiteMain>
    </SitePageShell>
  );
}
