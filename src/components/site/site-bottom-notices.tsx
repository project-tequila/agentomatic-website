"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useBeginVoiceDemo } from "@/lib/demo-call/use-begin-voice-demo";
import {
  COOKIE_CONSENT_KEY,
  GA_MEASUREMENT_ID,
  parseCookieConsent,
  type CookieConsent,
} from "@/lib/cookie-consent";

export function SiteBottomNotices() {
  const pathname = usePathname();
  const beginVoiceDemo = useBeginVoiceDemo();
  const [consent, setConsent] = useState<CookieConsent | null>(null);

  useEffect(() => {
    setConsent(parseCookieConsent(window.localStorage.getItem(COOKIE_CONSENT_KEY)));
  }, []);

  const isStudio = pathname.startsWith("/studio");

  function choose(next: CookieConsent) {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, next);
    setConsent(next);
  }

  return (
    <>
      {consent === "accepted" ? <GoogleAnalytics gaId={GA_MEASUREMENT_ID} /> : null}

      {isStudio ? null : (
        <div className="site-bottom-stack">
          <div className="site-sticky-mobile-cta">
            <button type="button" className="site-btn site-btn--cream" onClick={() => beginVoiceDemo()}>
              talk to agent
            </button>
            <Link href="/contact" className="site-btn site-btn--outline" prefetch={false}>
              contact
            </Link>
          </div>

          {consent === null ? (
            <div className="site-cookie-banner" role="dialog" aria-label="cookie preference">
              <p className="site-cookie-banner__copy">
                analytics (google) only if you accept.{" "}
                <Link className="site-link" href="/privacy" prefetch={false}>
                  privacy
                </Link>
                {" · "}
                <Link className="site-link" href="/terms" prefetch={false}>
                  terms
                </Link>
              </p>
              <div className="site-cookie-banner__actions">
                <button type="button" className="site-btn site-btn--cream site-btn--compact" onClick={() => choose("accepted")}>
                  accept
                </button>
                <button type="button" className="site-btn site-btn--outline site-btn--compact" onClick={() => choose("declined")}>
                  decline
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}
