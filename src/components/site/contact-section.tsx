"use client";

import { useState } from "react";

/** Matches `.contact-icon` in `agentomatic_labs_website.html`. */
function ContactIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[rgba(0,212,255,0.1)] text-[0.9rem]">
      {children}
    </div>
  );
}

/** Shared block — fonts/palette match `agentomatic_labs_website.html` (Syne + DM Sans from root layout). */
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
      className="scroll-mt-24 bg-[#080C18] py-[clamp(2.5rem,6vw,5rem)] md:scroll-mt-28"
    >
      <div className="mx-auto max-w-[75rem] w-full px-[clamp(1rem,4vw,3rem)]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="form-info">
            <p className="mb-2 text-[clamp(0.72rem,1.5vw,0.78rem)] font-medium uppercase tracking-[0.12em] text-[#00D4FF]">
              Contact us
            </p>
            <h2 className="text-[clamp(1.5rem,calc(3.2vw + 0.125rem),2.6rem)] font-bold leading-[1.15] tracking-[-0.02em] text-white [font-family:var(--font-marketing-syne),system-ui,sans-serif]">
              Ready to accelerate
              <br />
              your business?
            </h2>
            <p className="mt-5 max-w-xl text-[1rem] font-normal leading-[1.75] text-[rgba(232,237,248,0.65)]">
              Tell us about your firm and we&apos;ll set up a personalized demo with your team. Our specialists
              will walk you through exactly how Agentomatic Labs fits your workflow.
            </p>
            <ul className="mt-8 space-y-4">
              <li className="flex items-center gap-3 text-[0.9rem] text-[rgba(232,237,248,0.7)]">
                <ContactIcon>📞</ContactIcon>
                +91 98765 43210
              </li>
              <li className="flex items-center gap-3 text-[0.9rem] text-[rgba(232,237,248,0.7)]">
                <ContactIcon>✉️</ContactIcon>
                hello@agentomaticlabs.ai
              </li>
              <li className="flex items-center gap-3 text-[0.9rem] text-[rgba(232,237,248,0.7)]">
                <ContactIcon>📍</ContactIcon>
                Kolkata, West Bengal, India
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-[clamp(1.25rem,4vw,2.5rem)]">
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
                    placeholder="Your law firm or clinic"
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
                    <option>Legal — Law Firm</option>
                    <option>Healthcare — Clinic / Hospital</option>
                    <option>Finance — Chartered Accountant</option>
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
                    placeholder="Describe what you're looking to solve…"
                    className="min-h-[100px] w-full resize-y rounded-lg border border-white/[0.12] bg-white/[0.05] px-3 py-2.5 text-[0.9rem] text-[#E8EDF8] outline-none placeholder:text-white/35 focus:border-[rgba(0,212,255,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(0,212,255,0.25)]"
                    suppressHydrationWarning
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="min-h-12 w-full rounded-lg bg-[#00D4FF] px-4 py-3 text-[0.95rem] font-medium text-[#080C18] transition-opacity hover:opacity-90 disabled:opacity-50"
                  suppressHydrationWarning
                >
                  {busy ? "Sending…" : "Send Message →"}
                </button>
              </form>
            ) : (
              <div className="rounded-lg border border-[rgba(0,229,160,0.3)] bg-[rgba(0,229,160,0.1)] px-4 py-6 text-center text-[0.9rem] text-[#00E5A0]">
                Message sent! We&apos;ll get back to you within 24 hours.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
