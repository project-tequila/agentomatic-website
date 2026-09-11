import type { Metadata } from "next";
import Link from "next/link";

import { SiteMain, SitePageHeader } from "@/components/site/marketing-page";
import { SitePageShell } from "@/components/site/site-page-shell";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "request received — agentomatic",
  description: "we have your note. a person on our side will follow up with a voice-agent walkthrough.",
  path: "/contact/thanks",
  robots: { index: false, follow: false },
});

export default function ContactThanksPage() {
  return (
    <SitePageShell>
      <SiteMain>
        <SitePageHeader
          kicker="thank you"
          title="request received."
          lead="a person on our side reads it and follows up with a voice-agent walkthrough."
        />
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="site-btn site-btn--cream">
            back home
          </Link>
          <Link href="/pricing" className="site-btn site-btn--outline">
            see pricing
          </Link>
        </div>
      </SiteMain>
    </SitePageShell>
  );
}
