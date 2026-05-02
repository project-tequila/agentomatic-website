import { SitePageShell } from "@/components/site/site-page-shell";

export default function BlogPage() {
  const notes = [
    "Why voice is the fastest way to qualify a visitor",
    "Designing scripts that feel human, not robotic",
    "How summaries turn calls into operational memory",
  ];

  return (
    <SitePageShell>
      <main className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl py-10">
          <p className="mb-4 text-xs uppercase tracking-[0.24em] text-[#8cffd2]/70">Field notes</p>
          <h1 className="text-balance text-5xl font-medium leading-[0.95] tracking-[-0.07em] text-white sm:text-7xl">
            Notes on building voices people trust.
          </h1>
          <div className="mt-12 divide-y divide-white/[0.08] rounded-[1.75rem] border border-white/[0.08] bg-white/[0.025]">
            {notes.map((note) => (
              <article key={note} className="group flex items-center justify-between gap-6 p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/[0.30]">Coming soon</p>
                  <h2 className="mt-2 text-xl font-medium tracking-[-0.035em] text-white group-hover:text-[#8cffd2]">
                    {note}
                  </h2>
                </div>
                <span className="hidden text-sm text-white/[0.35] sm:block">Listen</span>
              </article>
            ))}
          </div>
        </div>
      </main>
    </SitePageShell>
  );
}
