import type { Metadata } from "next";
import Link from "next/link";

import { SiteMain } from "@/components/site/marketing-page";
import { SitePageShell } from "@/components/site/site-page-shell";
import { LEGAL_ENTITY } from "@/lib/site-contact";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use — agentomatic",
  description:
    "Terms for using agentomatic.in and related Agentomatic Innovation Labs services — demos, voice agents, and the marketing site.",
  path: "/terms",
});

const LAST_UPDATED = "11 September 2026";

export default function TermsPage() {
  return (
    <SitePageShell>
      <SiteMain>
        <article className="site-blog-article w-full max-w-3xl">
          <header className="site-page-header w-full">
            <p className="site-kicker">legal</p>
            <h1 className="site-display">Terms of Use</h1>
            <p className="site-lead">
              Last updated: {LAST_UPDATED}. These terms govern use of the Agentomatic website,
              demos, and related services operated by {LEGAL_ENTITY}.
            </p>
          </header>

          <div className="site-blog-prose mt-10 w-full">
            <h2 className="site-blog-prose__heading">1. Agreement</h2>
            <p className="site-blog-prose__paragraph">
              By visiting{" "}
              <a className="site-link" href="https://www.agentomatic.in">
                https://www.agentomatic.in
              </a>{" "}
              or using our demos and products, you agree to these terms and our{" "}
              <Link className="site-link" href="/privacy">
                Privacy Policy
              </Link>
              . If you are using the site for a company, you confirm you have authority to bind
              that company.
            </p>

            <h2 className="site-blog-prose__heading">2. What we provide</h2>
            <p className="site-blog-prose__paragraph">
              Agentomatic builds AI front-desk tools (voice, chat, WhatsApp, email, and calendar
              workflows) for owner-operated and SMB teams. The marketing site explains the product.
              Live demos, paid plans, and customer deployments may have additional written terms.
              If those conflict with this page, the written customer terms control for that work.
            </p>

            <h2 className="site-blog-prose__heading">3. Demos and voice sessions</h2>
            <p className="site-blog-prose__paragraph">
              In-browser voice demos and outbound demo calls are for evaluation. They may record or
              transcribe audio as described in the Privacy Policy. Do not share secrets, payment
              card data, or other people’s personal information in a demo. We may rate-limit,
              pause, or end a demo if it looks abusive or unsafe.
            </p>

            <h2 className="site-blog-prose__heading">4. Acceptable use</h2>
            <p className="site-blog-prose__paragraph">You may not:</p>
            <ul className="site-blog-prose__list site-blog-prose__list--bullet">
              <li>probe, scrape, or overload the site or APIs beyond ordinary browsing</li>
              <li>misrepresent who you are when requesting a demo or account</li>
              <li>use the service for unlawful, harassing, or deceptive calling</li>
              <li>reverse engineer product features except as allowed by law</li>
            </ul>

            <h2 className="site-blog-prose__heading">5. Accounts and third-party tools</h2>
            <p className="site-blog-prose__paragraph">
              Sign-in and booking may run on a separate appointment-booker app. Voice, telephony,
              WhatsApp, email, calendar, payments, and CRM partners process data under their own
              terms when you use those products. We are not responsible for third-party outages or
              policy changes.
            </p>

            <h2 className="site-blog-prose__heading">6. Intellectual property</h2>
            <p className="site-blog-prose__paragraph">
              The agentomatic name, site, copy, and product designs are owned by {LEGAL_ENTITY} or
              its licensors. You may not copy the brand or product for a competing service. Feedback
              you send may be used to improve the product without owing you a fee.
            </p>

            <h2 className="site-blog-prose__heading">7. Disclaimers</h2>
            <p className="site-blog-prose__paragraph">
              The site and demos are provided “as is.” Voice agents can be wrong, delayed, or
              interrupted. We do not warrant uninterrupted service or that a demo will match a
              production deployment. Nothing on the site is legal, medical, or financial advice.
            </p>

            <h2 className="site-blog-prose__heading">8. Liability</h2>
            <p className="site-blog-prose__paragraph">
              To the extent allowed by Indian law, {LEGAL_ENTITY} is not liable for indirect,
              incidental, or consequential damages, or for lost profits, arising from use of the
              site or demos. Our total liability for a claim about the public website is limited to
              one thousand Indian rupees (₹1,000). Paid customer contracts may set a different cap.
            </p>

            <h2 className="site-blog-prose__heading">9. Governing law</h2>
            <p className="site-blog-prose__paragraph">
              These terms are governed by the laws of India. Courts at Durgapur / Paschim Bardhaman,
              West Bengal have exclusive jurisdiction, except where applicable law requires
              otherwise.
            </p>

            <h2 className="site-blog-prose__heading">10. Changes</h2>
            <p className="site-blog-prose__paragraph">
              We may update these terms. The “Last updated” date will change when we do. Continued
              use after an update means you accept the revised terms.
            </p>

            <h2 className="site-blog-prose__heading">11. Contact</h2>
            <p className="site-blog-prose__paragraph">
              {LEGAL_ENTITY}
              <br />
              Website:{" "}
              <a className="site-link" href="https://www.agentomatic.in">
                https://www.agentomatic.in
              </a>
              <br />
              Write us through the{" "}
              <Link className="site-link" href="/contact">
                contact form
              </Link>
              .
            </p>
          </div>
        </article>
      </SiteMain>
    </SitePageShell>
  );
}
