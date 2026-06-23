import type { Metadata } from "next";
import Link from "next/link";

import { SiteCard, SiteMain, SitePageHeader } from "@/components/site/marketing-page";
import { SitePageShell } from "@/components/site/site-page-shell";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "pricing — agentomatic",
  description:
    "simple pricing for ai front desk voice agents — starter, growth, and enterprise tiers for inbound calls, qualification, and booking.",
  path: "/pricing",
});

type PricingTier = {
  name: string;
  price: string;
  period: string;
  summary: string;
  features: string[];
  highlighted?: boolean;
};

const tiers: PricingTier[] = [
  {
    name: "starter",
    price: "$299",
    period: "/ month",
    summary: "for teams testing voice on a single line.",
    features: ["1 phone number", "500 inbound minutes", "appointment booking", "call summaries"],
  },
  {
    name: "growth",
    price: "$799",
    period: "/ month",
    summary: "for busy front desks and sales teams.",
    features: ["3 phone numbers", "2,500 inbound minutes", "lead qualification", "crm handoff", "priority support"],
    highlighted: true,
  },
  {
    name: "enterprise",
    price: "custom",
    period: "",
    summary: "for multi-location ops and custom integrations.",
    features: ["unlimited lines", "custom minute pools", "sso & audit logs", "dedicated success manager"],
  },
];

export default function PricingPage() {
  return (
    <SitePageShell>
      <SiteMain>
        <SitePageHeader
          kicker="pricing"
          title="plans that scale with your call volume."
          lead="placeholder tiers while we finalize packaging — every plan includes live demo onboarding and script setup."
        />

        <div className="site-grid site-grid--2 mt-10 lg:grid-cols-3">
          {tiers.map((tier) => (
            <SiteCard
              key={tier.name}
              className={tier.highlighted ? "border-white/20 bg-white/[0.06]" : undefined}
            >
              <p className="site-kicker">{tier.name}</p>
              <p className="mt-3 font-[family-name:var(--font-marketing-syne)] text-[clamp(2rem,4vw,2.75rem)] font-bold leading-none tracking-[-0.04em] text-white">
                {tier.price}
                {tier.period ? (
                  <span className="text-[0.95rem] font-normal tracking-normal text-white/45">{tier.period}</span>
                ) : null}
              </p>
              <p className="site-card__body mt-4">{tier.summary}</p>
              <ul className="mt-6 space-y-2">
                {tier.features.map((feature) => (
                  <li key={feature} className="site-card__body !text-[0.88rem] text-white/72">
                    {feature}
                  </li>
                ))}
              </ul>
            </SiteCard>
          ))}
        </div>

        <p className="site-lead mt-10 text-center">
          need a custom quote?{" "}
          <Link href="/contact" className="site-link site-link--active">
            talk to us
          </Link>{" "}
          or tap the orb to hear a live demo.
        </p>
      </SiteMain>
    </SitePageShell>
  );
}
