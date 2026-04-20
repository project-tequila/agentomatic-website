import { cn } from "@/lib/utils";

type MarketingSiteIframeProps = {
  /** Descriptive title for assistive tech (each route can customize). */
  title?: string;
  /**
   * Block iframe with viewport height so the parent page can scroll to shared contact + footer.
   */
  scrollable?: boolean;
  /**
   * When the shared `SiteChrome` header is shown above the iframe, match iframe height to the
   * remaining viewport (spacer matches nav row `3.5rem`).
   */
  underSiteChrome?: boolean;
};

/** Stable id so `SiteChrome` can scroll embedded `#contact` on the home route. */
export const MARKETING_IFRAME_ID = "marketing-site-iframe";

/** Embed of the static marketing page in `public/`. */
export function MarketingSiteIframe({
  title = "Agentomatic Labs — Voice agents for legal, healthcare, and finance",
  scrollable = false,
  underSiteChrome = false,
}: MarketingSiteIframeProps) {
  return (
    <iframe
      id={MARKETING_IFRAME_ID}
      title={title}
      src="/agentomatic_labs_website.html"
      className={cn(
        "box-border w-full max-w-full border-0 bg-transparent",
        scrollable && underSiteChrome && "block h-[calc(100dvh-3.5rem)] min-h-[calc(100dvh-3.5rem)]",
        scrollable && !underSiteChrome && "block h-dvh min-h-dvh",
        !scrollable && "fixed inset-0 h-full",
      )}
    />
  );
}
