import type { ReactNode } from "react";

import { SiteChrome } from "@/components/site/chrome";
import { ContactSection } from "@/components/site/contact-section";
import { SiteFooter } from "@/components/site/site-footer";

type SitePageShellProps = {
  children: ReactNode;
  showSiteChrome?: boolean;
  /**
   * Set false on `/` when contact + footer already exist inside the marketing iframe
   * (`agentomatic_labs_website.html`).
   */
  showContactAndFooter?: boolean;
};

/** Shared wrapper: optional chrome, page body, optional contact block + footer. */
export function SitePageShell({
  children,
  showSiteChrome = true,
  showContactAndFooter = true,
}: SitePageShellProps) {
  return (
    <div className="min-h-dvh bg-[#080C18] text-[#E8EDF8] antialiased [font-family:var(--font-marketing-dm),system-ui,sans-serif]">
      {showSiteChrome ? <SiteChrome /> : null}
      {children}
      {showContactAndFooter ? (
        <>
          <ContactSection />
          <SiteFooter />
        </>
      ) : null}
    </div>
  );
}
