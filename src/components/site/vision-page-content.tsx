"use client";

import { MotionSection } from "@/components/site/motion-section";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[max(0.72rem,11px)] font-medium uppercase tracking-[0.12em] text-[#00D4FF]">
      {children}
    </p>
  );
}

/** Matches marketing `.sector-card` / hero feel from `agentomatic_labs_website.html`. */
function VisionCard({ children }: { children: React.ReactNode }) {
  return (
    <article className="rounded-[14px] border border-white/[0.08] bg-white/[0.03] p-6 transition-[border-color,transform] duration-300 sm:p-8 md:p-10 md:hover:border-white/[0.14]">
      {children}
    </article>
  );
}

export function VisionPageContent() {
  return (
    <main className="relative z-0">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,212,255,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(0,229,160,0.08) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="mx-auto max-w-[75rem] px-4 pb-24 pt-8 sm:px-6 sm:pt-10 md:px-8 md:pb-28 md:pt-12">
        <header className="mb-14 text-center md:mb-24">
          <SectionLabel>Vision</SectionLabel>
          <h1
            className="mx-auto max-w-3xl text-[clamp(1.75rem,calc(3.5vw + 0.25rem),2.75rem)] font-bold leading-[1.15] tracking-[-0.03em] text-white [font-family:var(--font-marketing-syne),system-ui,sans-serif]"
          >
            Insights{" "}
            <span className="bg-gradient-to-br from-[#00D4FF] to-[#00E5A0] bg-clip-text text-transparent">
              never lost
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[clamp(0.95rem,2vw,1.05rem)] font-light leading-relaxed text-[rgba(232,237,248,0.6)]">
            Our mission, how we started, and the leadership behind Agentomatic.
          </p>
        </header>

        <div className="flex flex-col gap-8 md:gap-12">
          <MotionSection>
            <VisionCard>
              <SectionLabel>Our mission</SectionLabel>
              <h2
                className="mb-4 text-[clamp(1.25rem,2.4vw,1.65rem)] font-bold leading-snug tracking-[-0.02em] text-white [font-family:var(--font-marketing-syne),system-ui,sans-serif]"
              >
                What drives us
              </h2>
              <p className="max-w-3xl text-[clamp(0.95rem,1.8vw,1.05rem)] font-light leading-[1.75] text-[rgba(232,237,248,0.65)]">
                We believe every conversation holds critical insights. Our mission is to ensure those insights
                are never lost—by building AI systems that listen, understand, and deliver clarity through
                powerful dashboards.
              </p>
            </VisionCard>
          </MotionSection>

          <MotionSection delay={0.06}>
            <VisionCard>
              <SectionLabel>Our story</SectionLabel>
              <h2
                className="mb-4 text-[clamp(1.25rem,2.4vw,1.65rem)] font-bold leading-snug tracking-[-0.02em] text-white [font-family:var(--font-marketing-syne),system-ui,sans-serif]"
              >
                Why Agentomatic.ai exists
              </h2>
              <div className="max-w-3xl space-y-5 text-[clamp(0.95rem,1.8vw,1.05rem)] font-light leading-[1.75] text-[rgba(232,237,248,0.65)]">
                <p>
                  It started with a simple observation—critical details from conversations were constantly being
                  missed. Professionals across finance, healthcare, and legal fields rely heavily on
                  discussions, yet much of that information is never captured or used effectively.
                </p>
                <p>
                  We built Agentomatic.ai to change that—creating AI voice agents that listen, understand, and
                  transform conversations into structured insights, delivered through powerful,
                  industry-specific dashboards.
                </p>
              </div>
            </VisionCard>
          </MotionSection>

          <MotionSection delay={0.12}>
            <VisionCard>
              <SectionLabel>Experienced leadership</SectionLabel>
              <h2
                className="mb-4 text-[clamp(1.25rem,2.4vw,1.65rem)] font-bold leading-snug tracking-[-0.02em] text-white [font-family:var(--font-marketing-syne),system-ui,sans-serif]"
              >
                Structure for professional workflows
              </h2>
              <p className="max-w-3xl text-[clamp(0.95rem,1.8vw,1.05rem)] font-light leading-[1.75] text-[rgba(232,237,248,0.65)]">
                Driven by a deep understanding of how critical information gets lost in everyday conversations,
                we are building AI systems that bring structure, clarity, and intelligence to professional
                workflows.
              </p>
            </VisionCard>
          </MotionSection>

        </div>
      </div>
    </main>
  );
}
