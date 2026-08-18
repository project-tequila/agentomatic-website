import type { Metadata } from "next";

import { ContactSection } from "@/components/site/contact-section";
import { SitePageShell } from "@/components/site/site-page-shell";
import { SiteFooter } from "@/components/site/site-footer";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "contact — agentomatic",
  description:
    "get in touch with agentomatic — request a voice demo, ask about pricing, or tell us where your front desk gets stuck.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <SitePageShell showContactAndFooter={false}>
      <ContactSection headingLevel="h1" />
      <SiteFooter />
    </SitePageShell>
  );
}
