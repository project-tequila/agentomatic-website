import type { ReactNode } from "react";

import { SiteChrome } from "@/components/site/chrome";
import { ContactSection } from "@/components/site/contact-section";
import { SiteFooter } from "@/components/site/site-footer";

type SitePageShellProps = {
  children: ReactNode;
  showSiteChrome?: boolean;
  showContactAndFooter?: boolean;
};

/** Shared wrapper: optional chrome, page body, optional contact block + footer. */
export function SitePageShell({
  children,
  showSiteChrome = true,
  showContactAndFooter = true,
}: SitePageShellProps) {
  return (
    <div className="voice-page min-h-dvh text-[#F7FBFF] antialiased [font-family:var(--font-sans),system-ui,sans-serif]">
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
