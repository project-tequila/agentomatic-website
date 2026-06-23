import type { ReactNode } from "react";

import { SiteChrome } from "@/components/site/chrome";
import { ContactSection } from "@/components/site/contact-section";
import { SiteFooter } from "@/components/site/site-footer";

type SitePageShellProps = {
  children: ReactNode;
  showSiteChrome?: boolean;
  showContactAndFooter?: boolean;
  immersive3d?: boolean;
};

/** Shared wrapper: optional chrome, page body, optional contact block + footer. */
export function SitePageShell({
  children,
  showSiteChrome = true,
  showContactAndFooter = true,
  immersive3d = false,
}: SitePageShellProps) {
  return (
    <div
      className={
        immersive3d
          ? "site-shell voice-page voice-page--immersive voice-page--rumik min-h-dvh"
          : "site-shell voice-page voice-page--rumik min-h-dvh"
      }
    >
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
