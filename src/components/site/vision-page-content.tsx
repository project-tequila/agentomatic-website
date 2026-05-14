"use client";

import { MotionSection } from "@/components/site/motion-section";

export function VisionPageContent() {
  const beliefs = [
    ["The interface should disappear", "Visitors should feel like they are talking, not operating software."],
    ["The agent should earn trust fast", "Short answers, clear handoff, and no theatrical AI behavior."],
    ["Every call should become memory", "A business should never lose the reason someone reached out."],
  ];

  return (
    <main className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-4xl py-10">
          <p className="mb-4 text-xs uppercase tracking-[0.24em] text-[#8cffd2]/70">Vision</p>
          <h1 className="text-balance text-5xl font-medium leading-[0.95] tracking-[-0.07em] text-white sm:text-7xl">
            A website that lets visitors hear the future.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/[0.56]">
            We are building voice agents for the moments that matter before a form is filled, before a lead is
            lost, before a human is available.
          </p>
        </header>

        <div className="grid gap-3">
          {beliefs.map(([title, body], index) => (
            <MotionSection key={title} delay={index * 0.06}>
              <article className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
                <h2 className="text-2xl font-medium tracking-[-0.04em] text-white">{title}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/[0.54]">{body}</p>
              </article>
            </MotionSection>
          ))}
        </div>
      </div>
    </main>
  );
}
