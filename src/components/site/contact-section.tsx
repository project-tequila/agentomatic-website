"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import {
  CONTACT_EMAIL,
  CONTACT_PHONE_E164,
  contactPhoneTelHref,
  formatContactPhoneDisplay,
} from "@/lib/site-contact";

type FieldErrors = Record<string, string>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(name: string, value: string): string {
  switch (name) {
    case "fname":
    case "lname":
    case "company":
    case "sector":
      return value.trim() ? "" : "This field is required.";
    case "email":
      if (!value.trim()) return "Enter your email address.";
      if (!emailPattern.test(value.trim())) return "Enter a valid email address.";
      return "";
    case "phone": {
      const digits = value.replace(/\D/g, "");
      if (!digits) return "Enter your phone number.";
      if (digits.length < 10) return "Enter a valid phone number with at least 10 digits.";
      return "";
    }
    default:
      return "";
  }
}

type ContactSectionProps = {
  /** Document heading on the dedicated `/contact` page. */
  headingLevel?: "h1" | "h2";
};

/** Dedicated contact form. Submit posts to `/api/leads/hubspot` — do not change that path. */
export function ContactSection({ headingLevel = "h1" }: ContactSectionProps) {
  const HeadingTag = headingLevel;
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const contactPhoneDisplay = formatContactPhoneDisplay(CONTACT_PHONE_E164);

  function validateForm(fd: FormData): FieldErrors {
    const next: FieldErrors = {};
    for (const name of ["fname", "lname", "company", "sector", "email", "phone"] as const) {
      const msg = validateField(name, String(fd.get(name === "company" ? "organization" : name) ?? ""));
      if (msg) next[name] = msg;
    }
    return next;
  }

  function onBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const name = e.target.name === "organization" ? "company" : e.target.name;
    const msg = validateField(name, e.target.value);
    setErrors((prev) => {
      const next = { ...prev };
      if (msg) next[name] = msg;
      else delete next[name];
      return next;
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const nextErrors = validateForm(fd);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstId = Object.keys(nextErrors)[0];
      const idMap: Record<string, string> = {
        fname: "contact-fname",
        lname: "contact-lname",
        company: "contact-company",
        sector: "contact-sector",
        email: "contact-email",
        phone: "contact-phone",
      };
      document.getElementById(idMap[firstId] ?? "")?.focus();
      return;
    }

    setBusy(true);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.form;
      return next;
    });

    try {
      const res = await fetch("/api/leads/hubspot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: String(fd.get("fname") ?? ""),
          lastName: String(fd.get("lname") ?? ""),
          company: String(fd.get("organization") ?? ""),
          sector: String(fd.get("sector") ?? ""),
          email: String(fd.get("email") ?? ""),
          phone: String(fd.get("phone") ?? ""),
          query: String(fd.get("query") ?? ""),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setErrors((prev) => ({
          ...prev,
          form: data.error || "Could not send your request. Please try again.",
        }));
        return;
      }
      setSent(true);
      form.reset();
    } catch {
      setErrors((prev) => ({
        ...prev,
        form: "Could not send your request. Please try again.",
      }));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="contact" className="site-contact-section site-contact-section--page">
      <div className="site-container">
        <div className="site-contact-section__grid">
          <div className="site-contact-section__copy">
            <p className="site-kicker">contact</p>
            <HeadingTag className="site-display site-contact-section__title">
              we&apos;ll pick up from here.
            </HeadingTag>
            <p className="site-lead">
              tell us where calls, leads, or visitor questions get stuck. we&apos;ll shape a voice-agent
              flow around that moment.
            </p>
            <ul className="site-contact-section__details">
              {CONTACT_PHONE_E164 ? (
                <li>
                  <a className="site-link" href={contactPhoneTelHref(CONTACT_PHONE_E164)}>
                    {contactPhoneDisplay}
                  </a>
                </li>
              ) : null}
              <li>
                <a className="site-link" href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>

          <div className="site-panel site-contact-section__form">
            {!sent ? (
              <form onSubmit={onSubmit} className="space-y-0" noValidate suppressHydrationWarning>
                <div className="site-form-grid-2">
                  <div className="site-field">
                    <label htmlFor="contact-fname" className="site-label">
                      first name *
                    </label>
                    <input
                      id="contact-fname"
                      name="fname"
                      type="text"
                      autoComplete="given-name"
                      placeholder="john"
                      className="site-input"
                      aria-invalid={!!errors.fname}
                      aria-describedby={errors.fname ? "contact-fname-error" : undefined}
                      onBlur={onBlur}
                      suppressHydrationWarning
                    />
                    {errors.fname ? (
                      <p id="contact-fname-error" className="site-field-error" role="alert">
                        {errors.fname}
                      </p>
                    ) : null}
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
                      placeholder="doe"
                      className="site-input"
                      aria-invalid={!!errors.lname}
                      aria-describedby={errors.lname ? "contact-lname-error" : undefined}
                      onBlur={onBlur}
                      suppressHydrationWarning
                    />
                    {errors.lname ? (
                      <p id="contact-lname-error" className="site-field-error" role="alert">
                        {errors.lname}
                      </p>
                    ) : null}
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
                    placeholder="acme inc."
                    className="site-input"
                    aria-invalid={!!errors.company}
                    aria-describedby={errors.company ? "contact-company-error" : undefined}
                    onBlur={onBlur}
                    suppressHydrationWarning
                  />
                  {errors.company ? (
                    <p id="contact-company-error" className="site-field-error" role="alert">
                      {errors.company}
                    </p>
                  ) : null}
                </div>
                <div className="site-field mt-3">
                  <label htmlFor="contact-sector" className="site-label">
                    sector *
                  </label>
                  <select
                    id="contact-sector"
                    name="sector"
                    defaultValue=""
                    className="site-select"
                    aria-invalid={!!errors.sector}
                    aria-describedby={errors.sector ? "contact-sector-error" : undefined}
                    onBlur={onBlur}
                    suppressHydrationWarning
                  >
                    <option value="">select sector</option>
                    <option>healthcare / clinic</option>
                    <option>legal / professional services</option>
                    <option>home services</option>
                    <option>hospitality</option>
                    <option>salon / beauty</option>
                    <option>education</option>
                    <option>sales / growth</option>
                    <option>other</option>
                  </select>
                  {errors.sector ? (
                    <p id="contact-sector-error" className="site-field-error" role="alert">
                      {errors.sector}
                    </p>
                  ) : null}
                </div>
                <div className="site-form-grid-2 mt-3">
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
                      placeholder="you@company.com"
                      className="site-input"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "contact-email-error" : undefined}
                      onBlur={onBlur}
                      suppressHydrationWarning
                    />
                    {errors.email ? (
                      <p id="contact-email-error" className="site-field-error" role="alert">
                        {errors.email}
                      </p>
                    ) : null}
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
                      placeholder="+1 555 010 0000"
                      className="site-input"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "contact-phone-error" : undefined}
                      onBlur={onBlur}
                      suppressHydrationWarning
                    />
                    {errors.phone ? (
                      <p id="contact-phone-error" className="site-field-error" role="alert">
                        {errors.phone}
                      </p>
                    ) : null}
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
                {errors.form ? (
                  <p className="site-field-error mt-3" role="alert">
                    {errors.form}
                  </p>
                ) : null}
                <button type="submit" disabled={busy} className="site-btn site-btn--full mt-4" suppressHydrationWarning>
                  {busy ? (
                    <>
                      <Loader2 className="mr-2 inline size-4 animate-spin" aria-hidden />
                      sending…
                    </>
                  ) : (
                    "request voice demo"
                  )}
                </button>
              </form>
            ) : (
              <div className="site-toast site-toast--success py-6 text-center" role="status">
                <p className="font-medium">request received.</p>
                <p className="mt-1 text-sm opacity-80">we&apos;ll follow up with a voice-agent walkthrough.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
