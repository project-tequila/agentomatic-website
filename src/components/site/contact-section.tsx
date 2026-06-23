"use client";

import { useState } from "react";

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
    <section id="contact" className="scroll-mt-24 py-[clamp(2.5rem,6vw,4rem)] md:scroll-mt-28">
      <div className="site-container">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="site-kicker">contact</p>
            <h2 className="site-display text-[clamp(1.75rem,calc(3.5vw + 0.5rem),3rem)]">let your visitors speak first.</h2>
            <p className="site-lead">
              tell us where calls, leads, or visitor questions get stuck. we&apos;ll shape a voice-agent flow around that
              moment.
            </p>
            <ul className="mt-8 space-y-3">
              <li className="site-lead !mt-0 !text-[0.82rem]">+91 98765 43210</li>
              <li className="site-lead !mt-0 !text-[0.82rem]">hello@agentomaticlabs.ai</li>
              <li className="site-lead !mt-0 !text-[0.82rem]">kolkata, west bengal, india</li>
            </ul>
          </div>

          <div className="site-panel p-[clamp(1rem,3vw,1.5rem)]">
            {!sent ? (
              <form onSubmit={onSubmit} className="space-y-0" suppressHydrationWarning>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="site-field">
                    <label htmlFor="contact-fname" className="site-label">
                      first name *
                    </label>
                    <input
                      id="contact-fname"
                      name="fname"
                      type="text"
                      autoComplete="given-name"
                      placeholder="pranay"
                      className="site-input"
                      suppressHydrationWarning
                    />
                  </div>
                  <div className="site-field">
                    <label htmlFor="contact-lname" className="site-label">
                      last name *
                    </label>
                    <input
                      id="contact-lname"
                      name="lname"
                      type="text"
                      autoComplete="family-name"
                      placeholder="sharma"
                      className="site-input"
                      suppressHydrationWarning
                    />
                  </div>
                </div>
                <div className="site-field mt-3">
                  <label htmlFor="contact-company" className="site-label">
                    company *
                  </label>
                  <input
                    id="contact-company"
                    name="organization"
                    type="text"
                    autoComplete="organization"
                    placeholder="your company"
                    className="site-input"
                    suppressHydrationWarning
                  />
                </div>
                <div className="site-field mt-3">
                  <label htmlFor="contact-sector" className="site-label">
                    sector *
                  </label>
                  <select id="contact-sector" name="sector" defaultValue="" className="site-select" suppressHydrationWarning>
                    <option value="">select sector</option>
                    <option>sales / growth</option>
                    <option>healthcare / clinic</option>
                    <option>legal / professional services</option>
                    <option>other</option>
                  </select>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="site-field">
                    <label htmlFor="contact-email" className="site-label">
                      email *
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="you@firm.com"
                      className="site-input"
                      suppressHydrationWarning
                    />
                  </div>
                  <div className="site-field">
                    <label htmlFor="contact-phone" className="site-label">
                      phone *
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+91 98765 43210"
                      className="site-input"
                      suppressHydrationWarning
                    />
                  </div>
                </div>
                <div className="site-field mt-3">
                  <label htmlFor="contact-query" className="site-label">
                    your query
                  </label>
                  <textarea
                    id="contact-query"
                    name="query"
                    rows={4}
                    placeholder="what should the voice agent handle?"
                    className="site-textarea min-h-[5.5rem] resize-y"
                    suppressHydrationWarning
                  />
                </div>
                <button type="submit" disabled={busy} className="site-btn site-btn--full mt-4" suppressHydrationWarning>
                  {busy ? "sending…" : "request voice demo"}
                </button>
              </form>
            ) : (
              <p className="site-toast site-toast--success py-4 text-center">
                request received. we&apos;ll follow up with a voice-agent walkthrough.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
