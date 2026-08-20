import type { ReactNode } from "react";

import { SiteChrome } from "@/components/site/chrome";
import { SiteFooter } from "@/components/site/site-footer";
import { SkipLink } from "@/components/site/skip-link";
import { cn } from "@/lib/utils";

type SitePageShellProps = {
  children: ReactNode;
  showSiteChrome?: boolean;
  /** Site footer only. The contact form lives on `/contact`, not every page. */
  showFooter?: boolean;
  immersive3d?: boolean;
  theme?: "dark" | "light";
  /** @deprecated Light theme removed — dark rumik is the default sitewide. */
};

/** Shared wrapper: optional chrome, page body, optional footer. */
export function SitePageShell({
  children,
  showSiteChrome = true,
  showFooter = true,
  immersive3d = false,
  theme = "dark",
}: SitePageShellProps) {
  return (
    <div
      className={cn(
        immersive3d
          ? "site-shell voice-page voice-page--immersive voice-page--rumik min-h-dvh"
          : "site-shell voice-page voice-page--rumik min-h-dvh",
        theme === "light" && "site-shell--light",
      )}
    >
      <SkipLink />
      {showSiteChrome ? <SiteChrome /> : null}
      {children}
      {showFooter ? <SiteFooter /> : null}
    </div>
  );
}
