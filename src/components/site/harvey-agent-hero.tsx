"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MULTILINGUAL_LANGUAGE_COUNT } from "@/lib/story/multilingual-reveal";
import {
  CalendarCheck,
  ClipboardList,
  PhoneCall,
  Sparkles,
} from "lucide-react";

import { LiveAgentConsole } from "@/components/site/live-agent-console";
import { cn } from "@/lib/utils";

const HARVEY_NAV_LINKS = [
  { href: "/about", label: "about" },
  { href: "/pricing", label: "pricing" },
  { href: "/blog", label: "blog" },
  { href: "/contact", label: "contact us" },
] as const;

const FRONTDESK_STEPS = [
  {
    title: "incoming call",
    think: "answering on the first ring…",
    detail: "+1 (415) 555-0148 · routed to agentomatic",
    icon: PhoneCall,
  },
  {
    title: "understand intent",
    think: "listening and parsing the request…",
    detail: "caller wants to book a deep clean for friday",
    icon: Sparkles,
  },
  {
    title: "check availability",
    think: "scanning the connected calendar…",
    detail: "friday 2:30pm is open with the right crew",
    icon: CalendarCheck,
  },
  {
    title: "confirm & book",
    think: "writing the appointment and sending a text…",
    detail: "booked · confirmation sent to the caller",
    icon: ClipboardList,
  },
] as const;

const FRONTDESK_SUMMARY =
  "Booked a Friday 2:30pm deep clean, confirmed the address, and texted a confirmation. Handed a clean summary to your team.";

export function HarveyAgentHero({ hideNav = false }: { hideNav?: boolean }) {
  return (
    <div className="harvey">
      {!hideNav ? <HarveyNav /> : null}

      <main className="harvey-container">
        <section className="harvey-hero">
          <div>
            <span className="harvey-eyebrow">
              <span className="harvey-eyebrow__dot" aria-hidden />
              agentomatic agents
            </span>

            <h1 className="harvey-title">
              Agents that handle the call, <em>end to end.</em>
            </h1>

            <p className="harvey-lead">
              From the first hello to the booked appointment, agentomatic agents
              listen, decide, and act — so your team stays focused on the work
              only people can do.
            </p>

            <div className="harvey-cta-row">
              <Link href="#demo" className="harvey-btn harvey-btn--primary">
                Request a demo
              </Link>
              <Link href="#how" className="harvey-btn harvey-btn--ghost">
                See it work
              </Link>
            </div>

            <div className="harvey-trust">
              <p className="harvey-trust__label">trusted by modern front desks</p>
              <div className="harvey-trust__row">
                <span className="harvey-trust__name">Northwind</span>
                <span className="harvey-trust__name">Brightwork</span>
                <span className="harvey-trust__name">Marlowe&nbsp;&amp;&nbsp;Co</span>
                <span className="harvey-trust__name">Verant</span>
              </div>
            </div>
          </div>

          <LiveAgentConsole
            id="how"
            variant="harvey"
            agentLabel="frontdesk agent"
            statusLabel="live call"
            goalPrefix="goal:"
            goalText="answer the call, book the request, and hand off a summary."
            steps={[...FRONTDESK_STEPS]}
            summary={FRONTDESK_SUMMARY}
          />
        </section>

        <section className="harvey-stats" aria-label="results">
          {[
            ["100%", "of calls answered, day or night"],
            ["0.4s", "average time to first response"],
            [`${MULTILINGUAL_LANGUAGE_COUNT}+`, "languages with full voice in and out"],
            ["99.99%", "uptime across the network"],
          ].map(([num, label]) => (
            <div key={label} className="harvey-stat">
              <div className="harvey-stat__num">{num}</div>
              <div className="harvey-stat__label">{label}</div>
            </div>
          ))}
        </section>

        <section id="demo" className="harvey-cta-band">
          <h2 className="harvey-cta-band__title">
            Put an agent on the phones <em>tonight.</em>
          </h2>
          <div className="harvey-cta-band__row">
            <Link href="/" className="harvey-btn harvey-btn--primary">
              Request a demo
            </Link>
            <Link href="/solutions" className="harvey-btn harvey-btn--ghost">
              Explore solutions
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function HarveyNav() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "harvey-nav",
          solid && "harvey-nav--solid",
          menuOpen && "harvey-nav--menu-open",
        )}
      >
        <div className="harvey-container harvey-nav__inner">
          <Link href="/" className="harvey-brand">
            <span className="harvey-brand__mark" aria-hidden />
            agentomatic
          </Link>

          <button
            type="button"
            className="harvey-nav__menu-btn"
            aria-expanded={menuOpen}
            aria-controls="harvey-nav-drawer"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <svg
              className={cn("harvey-nav__menu-icon", menuOpen && "hidden")}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              className={cn("harvey-nav__menu-icon", !menuOpen && "hidden")}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>

          <nav className="harvey-nav__links" aria-label="primary">
            {HARVEY_NAV_LINKS.map((item) => (
              <Link key={item.href} href={item.href} className="harvey-nav__link">
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="#demo"
            className="harvey-btn harvey-btn--primary harvey-btn--sm harvey-nav__cta"
          >
            Request a demo
          </Link>
        </div>
      </header>

      <div
        className={cn("harvey-nav-drawer-layer", !menuOpen && "pointer-events-none")}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className={cn(
            "harvey-nav-drawer-backdrop",
            menuOpen && "harvey-nav-drawer-backdrop--open",
          )}
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
        />
        <nav
          id="harvey-nav-drawer"
          className={cn("harvey-nav-drawer", menuOpen && "harvey-nav-drawer--open")}
          aria-label="Mobile primary"
          onClick={(event) => event.stopPropagation()}
        >
          <ul className="harvey-nav-drawer__links">
            {HARVEY_NAV_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="harvey-nav-drawer__link"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="#demo"
            className="harvey-btn harvey-btn--primary harvey-nav-drawer__cta"
            onClick={() => setMenuOpen(false)}
          >
            Request a demo
          </Link>
        </nav>
      </div>
    </>
  );
}
