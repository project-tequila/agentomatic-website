import { SitePageShell } from "@/components/site/site-page-shell";
import { VoiceExperience, VoiceSteps } from "@/components/site/voice-experience";

export default function Home() {
  return (
    <SitePageShell>
      <VoiceExperience />
      <VoiceSteps />
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-6 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[#8cffd2]/70">Use cases</p>
              <h2 className="text-balance text-3xl font-medium tracking-[-0.05em] text-white sm:text-5xl">
                One calm voice for every first touch.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Answer missed calls",
                "Qualify inbound leads",
                "Book demos and appointments",
                "Summarize every conversation",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white/[0.65]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SitePageShell>
  );
}
