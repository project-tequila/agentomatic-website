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
  ctaLabel: string;
  ctaHref: string;
};

const tiers: PricingTier[] = [
  {
    name: "starter",
    price: "$299",
    period: "/ month",
    summary: "for teams testing voice on a single line.",
    features: ["1 phone number", "500 inbound minutes", "appointment booking", "call summaries"],
    ctaLabel: "get started",
    ctaHref: "/contact",
  },
  {
    name: "growth",
    price: "$799",
    period: "/ month",
    summary: "for busy front desks and sales teams.",
    features: ["3 phone numbers", "2,500 inbound minutes", "lead qualification", "crm handoff", "priority support"],
    highlighted: true,
    ctaLabel: "get started",
    ctaHref: "/contact",
  },
  {
    name: "enterprise",
    price: "custom",
    period: "",
    summary: "for multi-location ops and custom integrations.",
    features: ["unlimited lines", "custom minute pools", "sso & audit logs", "dedicated success manager"],
    ctaLabel: "contact sales",
    ctaHref: "/contact",
  },
];

export default function PricingPage() {
  return (
    <SitePageShell>
      <SiteMain>
        <SitePageHeader
          kicker="pricing"
          title="plans that scale with your call volume."
          lead="every plan includes live demo onboarding and script setup."
        />

        <div className="site-grid site-grid--3 mt-10">
          {tiers.map((tier) => (
            <SiteCard
              key={tier.name}
              className={tier.highlighted ? "site-card--highlighted border-[var(--rumik-border)] bg-[var(--rumik-surface-strong)]" : undefined}
            >
              <p className="site-kicker">{tier.name}</p>
              <p className="mt-3 site-display text-[clamp(2rem,4vw,2.75rem)] !leading-none !tracking-[-0.04em]">
                {tier.price}
                {tier.period ? (
                  <span className="text-[0.95rem] font-normal tracking-normal text-[var(--rumik-muted)]">{tier.period}</span>
                ) : null}
              </p>
              <p className="site-card__body mt-4">{tier.summary}</p>
              <ul className="mt-6 space-y-2">
                {tier.features.map((feature) => (
                  <li key={feature} className="site-card__body !text-[0.88rem]">
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={tier.ctaHref}
                className={tier.highlighted ? "site-btn site-btn--full mt-6" : "site-btn site-btn--outline site-btn--full mt-6"}
              >
                {tier.ctaLabel}
              </Link>
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
