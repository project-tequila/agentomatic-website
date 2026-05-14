import { SitePageShell } from "@/components/site/site-page-shell";

export default function SolutionsPage() {
  const solutions = [
    ["Inbound calls", "Answer instantly, capture intent, and keep the caller moving."],
    ["Lead qualification", "Ask the right questions, score fit, and send warm context to sales."],
    ["Appointments", "Book, reschedule, remind, and confirm without a human queue."],
    ["Conversation memory", "Every call becomes a clean summary your team can use."],
  ];

  return (
    <SitePageShell>
      <main className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <header className="max-w-3xl py-10">
            <p className="mb-4 text-xs uppercase tracking-[0.24em] text-[#8cffd2]/70">Solutions</p>
            <h1 className="text-balance text-5xl font-medium leading-[0.95] tracking-[-0.07em] text-white sm:text-7xl">
              Voice agents that do the work after hello.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/[0.56]">
              Not a chatbot. A phone-ready agent that listens, answers, qualifies, schedules, and hands off
              with context.
            </p>
          </header>

          <div className="grid gap-3 md:grid-cols-2">
            {solutions.map(([title, body]) => (
              <article key={title} className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.025] p-6">
                <div className="mb-10 h-16">
                  <div className="voice-wave !h-12 !justify-start">
                    {[30, 70, 44, 82, 38, 60, 50].map((height, index) => (
                      <span key={index} style={{ height: `${height}%`, animationDelay: `${index * 80}ms` }} className="voice-wave__bar--active" />
                    ))}
                  </div>
                </div>
                <h2 className="text-2xl font-medium tracking-[-0.04em] text-white">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/[0.54]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </main>
    </SitePageShell>
  );
}
