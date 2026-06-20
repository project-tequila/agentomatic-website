"use client";

import { SiteCard, SiteMain, SitePageHeader } from "@/components/site/marketing-page";
import { MotionSection } from "@/components/site/motion-section";

export function VisionPageContent() {
  const beliefs = [
    ["the interface should disappear", "visitors should feel like they are talking, not operating software."],
    ["the agent should earn trust fast", "short answers, clear handoff, and no theatrical ai behavior."],
    ["every call should become memory", "a business should never lose the reason someone reached out."],
  ];

  return (
    <SiteMain>
      <SitePageHeader
        kicker="vision"
        title="a website that lets visitors hear the future."
        lead="we are building voice agents for the moments that matter — before a form is filled, before a lead is lost, before a human is available."
      />

      <div className="site-grid mt-2">
        {beliefs.map(([title, body], index) => (
          <MotionSection key={title} delay={index * 0.06}>
            <SiteCard>
              <h2 className="site-card__title">{title}</h2>
              <p className="site-card__body">{body}</p>
            </SiteCard>
          </MotionSection>
        ))}
      </div>
    </SiteMain>
  );
}
