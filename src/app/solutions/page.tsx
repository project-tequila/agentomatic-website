import type { Metadata } from "next";

import { SiteCard, SiteMain, SitePageHeader } from "@/components/site/marketing-page";
import { SitePageShell } from "@/components/site/site-page-shell";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "solutions — agentomatic",
  description:
    "voice agents that answer instantly, qualify leads, book appointments, and hand off with context — not a chatbot, a phone-ready front desk.",
  path: "/solutions",
});

export default function SolutionsPage() {
  const solutions = [
    ["inbound calls", "answer instantly, capture intent, and keep the caller moving."],
    ["lead qualification", "ask the right questions, score fit, and send warm context to sales."],
    ["appointments", "book, reschedule, remind, and confirm without a human queue."],
    ["conversation memory", "every call becomes a clean summary your team can use."],
  ];

  return (
    <SitePageShell>
      <SiteMain>
        <SitePageHeader
          kicker="solutions"
          title="voice agents that do the work after hello."
          lead="not a chatbot. a phone-ready agent that listens, answers, qualifies, schedules, and hands off with context."
        />

        <div className="site-grid site-grid--2">
          {solutions.map(([title, body]) => (
            <SiteCard key={title}>
              <h2 className="site-card__title">{title}</h2>
              <p className="site-card__body">{body}</p>
            </SiteCard>
          ))}
        </div>
      </SiteMain>
    </SitePageShell>
  );
}
