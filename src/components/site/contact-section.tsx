"use client";

import { useState } from "react";

function ContactIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#8cffd2]/10 text-[0.72rem] text-[#8cffd2]">
      {children}
    </div>
  );
}

export function ContactSection() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const fname = String(fd.get("fname") ?? "").trim();
    const lname = String(fd.get("lname") ?? "").trim();
    const company = String(fd.get("organization") ?? "").trim();
    const sector = String(fd.get("sector") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    if (!fname || !lname || !company || !sector || !email || !phone) {
      alert("Please fill in all required fields.");
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setSent(true);
    }, 900);
  }

  return (
    <section
      id="contact"
      className="scroll-mt-24 py-[clamp(2.5rem,6vw,5rem)] md:scroll-mt-28"
    >
      <div className="mx-auto max-w-[75rem] w-full px-[clamp(1rem,4vw,3rem)]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="form-info">
            <p className="mb-2 text-[clamp(0.72rem,1.5vw,0.78rem)] font-medium uppercase tracking-[0.18em] text-[#8cffd2]/70">
              Voice demo
            </p>
            <h2 className="text-[clamp(1.8rem,calc(4vw + 0.125rem),3.4rem)] font-medium leading-[1] tracking-[-0.06em] text-white">
              Let your visitors speak first.
            </h2>
            <p className="mt-5 max-w-xl text-[1rem] font-normal leading-[1.75] text-[rgba(232,237,248,0.65)]">
              Tell us where calls, leads, or visitor questions get stuck. We&apos;ll shape a voice-agent flow around
              that moment.
            </p>
            <ul className="mt-8 space-y-4">
              <li className="flex items-center gap-3 text-[0.9rem] text-[rgba(232,237,248,0.7)]">
                <ContactIcon>tel</ContactIcon>
                +91 98765 43210
              </li>
              <li className="flex items-center gap-3 text-[0.9rem] text-[rgba(232,237,248,0.7)]">
                <ContactIcon>@</ContactIcon>
                hello@agentomaticlabs.ai
              </li>
              <li className="flex items-center gap-3 text-[0.9rem] text-[rgba(232,237,248,0.7)]">
                <ContactIcon>in</ContactIcon>
                Kolkata, West Bengal, India
              </li>
            </ul>
          </div>

          <div className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.025] p-[clamp(1.25rem,4vw,2.5rem)]">
            {!sent ? (
              <form
                onSubmit={onSubmit}
                className="space-y-0"
                // Browser extensions (form fillers) may inject attrs like `fdprocessedid` before hydration.
                suppressHydrationWarning
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="mb-4 flex flex-col gap-1.5 sm:mb-4">
                    <label htmlFor="contact-fname" className="text-[0.8rem] font-medium tracking-[0.02em] text-[rgba(232,237,248,0.6)]">
                      First name *
                    </label>
                    <input
                      id="contact-fname"
                      name="fname"
                      type="text"
                      autoComplete="given-name"
                      placeholder="Pranay"
                      className="w-full rounded-lg border border-white/[0.12] bg-white/[0.05] px-3 py-2.5 text-[0.9rem] text-[#E8EDF8] outline-none placeholder:text-white/35 focus:border-[rgba(0,212,255,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(0,212,255,0.25)]"
                      suppressHydrationWarning
                    />
                  </div>
                  <div className="mb-4 flex flex-col gap-1.5 sm:mb-4">
                    <label htmlFor="contact-lname" className="text-[0.8rem] font-medium tracking-[0.02em] text-[rgba(232,237,248,0.6)]">
                      Last name *
                    </label>
                    <input
                      id="contact-lname"
                      name="lname"
                      type="text"
                      autoComplete="family-name"
                      placeholder="Sharma"
                      className="w-full rounded-lg border border-white/[0.12] bg-white/[0.05] px-3 py-2.5 text-[0.9rem] text-[#E8EDF8] outline-none placeholder:text-white/35 focus:border-[rgba(0,212,255,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(0,212,255,0.25)]"
                      suppressHydrationWarning
                    />
                  </div>
                </div>
                <div className="mb-4 flex flex-col gap-1.5">
                  <label htmlFor="contact-company" className="text-[0.8rem] font-medium tracking-[0.02em] text-[rgba(232,237,248,0.6)]">
                    Company / Firm name *
                  </label>
                  <input
                    id="contact-company"
                    name="organization"
                    type="text"
                    autoComplete="organization"
                    placeholder="Your company"
                    className="w-full rounded-lg border border-white/[0.12] bg-white/[0.05] px-3 py-2.5 text-[0.9rem] text-[#E8EDF8] outline-none placeholder:text-white/35 focus:border-[rgba(0,212,255,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(0,212,255,0.25)]"
                    suppressHydrationWarning
                  />
                </div>
                <div className="mb-4 flex flex-col gap-1.5">
                  <label htmlFor="contact-sector" className="text-[0.8rem] font-medium tracking-[0.02em] text-[rgba(232,237,248,0.6)]">
                    Sector *
                  </label>
                  <select
                    id="contact-sector"
                    name="sector"
                    defaultValue=""
                    className="w-full rounded-lg border border-white/[0.12] bg-white/[0.05] px-3 py-2.5 text-[0.9rem] text-[#E8EDF8] outline-none focus:border-[rgba(0,212,255,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(0,212,255,0.25)]"
                    suppressHydrationWarning
                  >
                    <option value="">Select your sector</option>
                    <option>Sales / Growth</option>
                    <option>Healthcare / Clinic</option>
                    <option>Legal / Professional services</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="mb-4 flex flex-col gap-1.5 sm:mb-4">
                    <label htmlFor="contact-email" className="text-[0.8rem] font-medium tracking-[0.02em] text-[rgba(232,237,248,0.6)]">
                      Email *
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="you@firm.com"
                      className="w-full rounded-lg border border-white/[0.12] bg-white/[0.05] px-3 py-2.5 text-[0.9rem] text-[#E8EDF8] outline-none placeholder:text-white/35 focus:border-[rgba(0,212,255,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(0,212,255,0.25)]"
                      suppressHydrationWarning
                    />
                  </div>
                  <div className="mb-4 flex flex-col gap-1.5 sm:mb-4">
                    <label htmlFor="contact-phone" className="text-[0.8rem] font-medium tracking-[0.02em] text-[rgba(232,237,248,0.6)]">
                      Phone *
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+91 98765 43210"
                      className="w-full rounded-lg border border-white/[0.12] bg-white/[0.05] px-3 py-2.5 text-[0.9rem] text-[#E8EDF8] outline-none placeholder:text-white/35 focus:border-[rgba(0,212,255,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(0,212,255,0.25)]"
                      suppressHydrationWarning
                    />
                  </div>
                </div>
                <div className="mb-5 flex flex-col gap-1.5">
                  <label htmlFor="contact-query" className="text-[0.8rem] font-medium tracking-[0.02em] text-[rgba(232,237,248,0.6)]">
                    Tell us your query
                  </label>
                  <textarea
                    id="contact-query"
                    name="query"
                    rows={4}
                    placeholder="What should the voice agent handle?"
                    className="min-h-[100px] w-full resize-y rounded-lg border border-white/[0.12] bg-white/[0.05] px-3 py-2.5 text-[0.9rem] text-[#E8EDF8] outline-none placeholder:text-white/35 focus:border-[rgba(0,212,255,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(0,212,255,0.25)]"
                    suppressHydrationWarning
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="voice-button min-h-12 w-full rounded-full px-4 py-3 text-[0.95rem] font-medium text-black disabled:opacity-50"
                  suppressHydrationWarning
                >
                  {busy ? "Sending..." : "Request voice demo"}
                </button>
              </form>
            ) : (
              <div className="rounded-2xl border border-[#8cffd2]/30 bg-[#8cffd2]/10 px-4 py-6 text-center text-[0.9rem] text-[#8cffd2]">
                Request received. We&apos;ll follow up with a voice-agent walkthrough.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
