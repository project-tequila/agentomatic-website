import type { Metadata } from "next";
import Link from "next/link";

import { SiteMain } from "@/components/site/marketing-page";
import { SitePageShell } from "@/components/site/site-page-shell";
import { CONTACT_EMAIL } from "@/lib/site-contact";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy — agentomatic",
  description:
    "How Agentomatic Innovation Labs Pvt. Ltd. collects, uses, and protects personal information on agentomatic.in and related services.",
  path: "/privacy",
});

const LAST_UPDATED = "12 August 2026";

export default function PrivacyPage() {
  return (
    <SitePageShell>
      <SiteMain>
        <article className="site-blog-article w-full max-w-3xl">
          <header className="site-page-header w-full">
            <p className="site-kicker">legal</p>
            <h1 className="site-display">Privacy Policy</h1>
            <p className="site-lead">
              Last updated: {LAST_UPDATED}. This policy explains how Agentomatic Innovation Labs
              Pvt. Ltd. (“Agentomatic,” “we,” “us”) handles personal information.
            </p>
          </header>

          <div className="site-blog-prose mt-10 w-full">
            <h2 className="site-blog-prose__heading">1. Who we are</h2>
            <p className="site-blog-prose__paragraph">
              Agentomatic Innovation Labs Pvt. Ltd. operates{" "}
              <a className="site-link" href="https://www.agentomatic.in">
                https://www.agentomatic.in
              </a>{" "}
              and related product, marketing, and support services. We build AI front-desk tools
              (voice, chat, WhatsApp, email, and calendar workflows) for owner-operated and SMB
              teams.
            </p>
            <p className="site-blog-prose__paragraph">
              Privacy contact:{" "}
              <a className="site-link" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </p>

            <h2 className="site-blog-prose__heading">2. Scope</h2>
            <p className="site-blog-prose__paragraph">
              This policy covers personal information we process when you visit our website, request
              a demo, contact us, subscribe to updates, interact with our social or advertising
              channels, or use our products and integrations. If you are a customer’s end user
              (for example, a caller speaking to an Agentomatic-powered line), that customer is
              typically the primary controller of your data; we process it on their instructions as
              a service provider.
            </p>

            <h2 className="site-blog-prose__heading">3. Information we collect</h2>
            <p className="site-blog-prose__paragraph">We may collect:</p>
            <ul className="site-blog-prose__list site-blog-prose__list--bullet">
              <li>
                <strong>Contact and account details</strong> — name, work email, phone number,
                company name, role, and message content you submit via forms or email.
              </li>
              <li>
                <strong>Business and usage data</strong> — product configuration, call or message
                metadata, transcripts or summaries where enabled, calendar booking details, and
                support tickets needed to deliver the service.
              </li>
              <li>
                <strong>Technical and analytics data</strong> — IP address, browser/device type,
                pages viewed, referrer, approximate location derived from IP, and similar logs
                collected through hosting and analytics tools.
              </li>
              <li>
                <strong>Marketing and social signals</strong> — engagement with our pages, posts, or
                ads on platforms such as Meta (Facebook/Instagram), LinkedIn, X, and YouTube, when
                those platforms share permitted insights with us.
              </li>
            </ul>
            <p className="site-blog-prose__paragraph">
              We do not knowingly collect personal information from children. Our services are
              directed to businesses.
            </p>

            <h2 className="site-blog-prose__heading">4. How we use information</h2>
            <p className="site-blog-prose__paragraph">We use personal information to:</p>
            <ul className="site-blog-prose__list site-blog-prose__list--bullet">
              <li>Respond to inquiries, schedule demos, and provide customer support</li>
              <li>Provide, secure, and improve our products and website</li>
              <li>Operate AI agents and handoffs according to customer configuration</li>
              <li>Send operational or marketing communications where permitted</li>
              <li>Measure marketing performance and improve content relevance</li>
              <li>Comply with law, enforce terms, and protect our rights and users</li>
            </ul>

            <h2 className="site-blog-prose__heading">5. Cookies and similar technologies</h2>
            <p className="site-blog-prose__paragraph">
              Our site may use essential cookies and similar technologies required for security and
              basic functionality, plus privacy-respecting analytics (including Vercel Analytics) to
              understand aggregate traffic and performance. Third-party platforms you interact with
              (for example Meta or LinkedIn) may set their own cookies subject to their policies.
              You can control cookies through your browser settings; blocking some cookies may
              affect site features.
            </p>

            <h2 className="site-blog-prose__heading">6. Sharing and processors</h2>
            <p className="site-blog-prose__paragraph">
              We do not sell personal information. We share data with trusted processors who help us
              run the business, under appropriate contractual safeguards, including for example:
            </p>
            <ul className="site-blog-prose__list site-blog-prose__list--bullet">
              <li>
                <strong>Hosting and infrastructure</strong> — providers such as Vercel for website
                delivery and related logs
              </li>
              <li>
                <strong>CRM and inbound lead handling</strong> — HubSpot, when you submit contact or
                demo requests
              </li>
              <li>
                <strong>Communications and voice</strong> — telephony, WhatsApp, email, and messaging
                providers needed to deliver customer workflows
              </li>
              <li>
                <strong>Marketing platforms</strong> — Meta (Facebook/Instagram Graph and Ads),
                LinkedIn (including Community Management / marketing APIs when used to manage our
                own Company Page and related marketing activity), X, YouTube, and analytics tools
              </li>
              <li>
                <strong>Professional advisers and authorities</strong> — when required by law or to
                protect legitimate interests
              </li>
            </ul>
            <p className="site-blog-prose__paragraph">
              LinkedIn and Meta process data under their own terms when you use their products. When
              we connect Developer apps or Pages to manage Agentomatic’s own presence, we use those
              APIs to publish content, read engagement insights, and administer our official pages —
              not to scrape or resell third-party profile data.
            </p>

            <h2 className="site-blog-prose__heading">7. International transfers</h2>
            <p className="site-blog-prose__paragraph">
              We are based in India and may process information on servers or with vendors in other
              countries. Where required, we use appropriate safeguards for cross-border transfers.
            </p>

            <h2 className="site-blog-prose__heading">8. Retention</h2>
            <p className="site-blog-prose__paragraph">
              We retain personal information only as long as needed for the purposes above, customer
              contracts, legal obligations, and dispute resolution. Contact and CRM records are kept
              while an active sales or support relationship exists and for a reasonable period
              afterward. Product logs and call-related data follow customer agreements and
              operational needs.
            </p>

            <h2 className="site-blog-prose__heading">9. Security</h2>
            <p className="site-blog-prose__paragraph">
              We use reasonable technical and organizational measures to protect personal
              information against unauthorized access, loss, or misuse. No method of transmission or
              storage is fully secure; please use unique credentials and contact us promptly if you
              suspect an issue.
            </p>

            <h2 className="site-blog-prose__heading">10. Your choices and rights</h2>
            <p className="site-blog-prose__paragraph">
              Depending on applicable law, you may request access, correction, deletion, or
              restriction of your personal information, or object to certain processing. You may
              opt out of marketing emails using the unsubscribe link or by emailing us. To exercise
              rights, contact{" "}
              <a className="site-link" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
              . We may need to verify your identity before responding.
            </p>

            <h2 className="site-blog-prose__heading">11. Third-party sites</h2>
            <p className="site-blog-prose__paragraph">
              Our site and posts may link to third-party websites or embed third-party content. Their
              privacy practices are governed by their own policies.
            </p>

            <h2 className="site-blog-prose__heading">12. Changes</h2>
            <p className="site-blog-prose__paragraph">
              We may update this policy from time to time. The “Last updated” date at the top will
              change when we do. Continued use of the site or services after an update means you
              acknowledge the revised policy.
            </p>

            <h2 className="site-blog-prose__heading">13. Contact</h2>
            <p className="site-blog-prose__paragraph">
              Agentomatic Innovation Labs Pvt. Ltd.
              <br />
              Website:{" "}
              <a className="site-link" href="https://www.agentomatic.in">
                https://www.agentomatic.in
              </a>
              <br />
              Email:{" "}
              <a className="site-link" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </p>
            <p className="site-blog-prose__paragraph">
              Prefer a human conversation?{" "}
              <Link className="site-link" href="/contact">
                Request a demo
              </Link>
              .
            </p>
          </div>
        </article>
      </SiteMain>
    </SitePageShell>
  );
}
