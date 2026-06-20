import type { Metadata } from "next";

import { SiteCard, SiteMain, SitePageHeader } from "@/components/site/marketing-page";
import { SitePageShell } from "@/components/site/site-page-shell";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "about — agentomatic",
  description:
    "agentomatic builds phone-ready ai front desk agents that answer instantly, qualify leads, and hand off with context.",
  path: "/about",
});

export default function AboutPage() {
  const values = [
    [
      "voice-first",
      "calls are the highest-intent channel. we design for real conversations, not chat widgets pasted onto a phone line.",
    ],
    [
      "human when it matters",
      "routine scheduling and routing get automated. edge cases and sensitive moments transfer to your team with full context.",
    ],
    [
      "operational memory",
      "every call becomes a clean summary — who called, what they need, and what happened next — so nothing gets lost in voicemail.",
    ],
    [
      "built for teams",
      "front desk, sales, and ops share one view. configure scripts, qualification flows, and handoff rules without writing code.",
    ],
  ] as const;

  return (
    <SitePageShell>
      <SiteMain>
        <SitePageHeader
          kicker="about"
          title="ai front desk for teams that still pick up the phone."
          lead="agentomatic helps clinics, firms, and growth teams answer every inbound call instantly — qualify intent, book appointments, and route warm leads without adding headcount."
        />

        <div className="site-grid site-grid--2 mt-10">
          {values.map(([title, body]) => (
            <SiteCard key={title}>
              <h2 className="site-card__title">{title}</h2>
              <p className="site-card__body">{body}</p>
            </SiteCard>
          ))}
        </div>

        <article className="site-card mt-10">
          <h2 className="site-card__title">why we built this</h2>
          <p className="site-card__body">
            most businesses lose leads in the gap between &ldquo;thanks for calling&rdquo; and &ldquo;we&apos;ll get back to
            you.&rdquo; agentomatic closes that gap with a voice agent that sounds natural, follows your playbook, and
            keeps humans in the loop when the conversation needs judgment.
          </p>
        </article>
      </SiteMain>
    </SitePageShell>
  );
}
