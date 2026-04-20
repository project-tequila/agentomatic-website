"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { MARKETING_IFRAME_ID } from "@/components/site/marketing-iframe";
import { cn } from "@/lib/utils";

/** Match marketing nav (`agentomatic_labs_website.html`): Solutions, Vision, Blog + Get Started. Home = logo only. */
const navItems = [
  { href: "/solutions", label: "Solutions" },
  { href: "/vision", label: "Vision" },
  { href: "/blog", label: "Blog" },
] as const;

const NAV_ROW_H = "3.5rem";

function navActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function scrollMarketingIframeToContact() {
  const iframe = document.getElementById(MARKETING_IFRAME_ID) as HTMLIFrameElement | null;
  try {
    const doc = iframe?.contentDocument ?? iframe?.contentWindow?.document;
    doc?.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch {
    /* cross-origin */
  }
}

const ctaButtonClass =
  "shrink-0 rounded-lg bg-[#00D4FF] px-[1.2rem] py-2 text-[clamp(0.875rem,2.2vw,0.9rem)] font-medium text-[#080C18] transition-opacity hover:opacity-90";

const ctaMobileClass =
  "mt-4 flex min-h-12 items-center justify-center rounded-lg bg-[#00D4FF] px-4 py-3 text-[0.95rem] font-medium text-[#080C18]";

export function SiteChrome() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const isHome = pathname === "/";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
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
      <div aria-hidden className="shrink-0" style={{ height: NAV_ROW_H }} />

      <motion.header
        className="fixed inset-x-0 top-0 z-20 border-b border-white/[0.08] bg-[rgba(8,12,24,0.95)] shadow-[0_1px_0_0_rgba(0,212,255,0.12)] backdrop-blur-[12px]"
        initial={reduceMotion ? false : { y: -8, opacity: 0.96 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 0.7, 0.18, 1] }}
      >
        <div
          className="mx-auto flex h-14 max-w-[75rem] items-center justify-between gap-4 px-[clamp(1rem,4vw,3rem)] py-3 sm:h-[3.5rem]"
          style={{ fontFamily: "var(--font-marketing-dm), system-ui, sans-serif" }}
        >
          <Link
            href="/"
            className="flex min-h-11 shrink-0 items-center gap-0 text-[clamp(0.9rem,3vw,1.3rem)] font-extrabold leading-none tracking-[-0.03em] text-white [font-family:var(--font-marketing-syne),system-ui,sans-serif]"
          >
            <span className="whitespace-nowrap">Agentomatic</span>
            <span
              className="mx-[0.12em] inline-block size-[0.28em] min-h-[7px] min-w-[7px] max-h-[10px] max-w-[10px] shrink-0 rounded-[2px] bg-[#00D4FF]"
              aria-hidden
            />
            <span className="whitespace-nowrap">Labs</span>
          </Link>

          <button
            type="button"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] border border-white/[0.18] bg-white/[0.06] text-[#E8EDF8] md:hidden"
            aria-expanded={menuOpen}
            aria-controls="site-nav-drawer"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <svg
              className={cn("size-[22px]", menuOpen && "hidden")}
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
              className={cn("size-[22px]", !menuOpen && "hidden")}
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

          <nav aria-label="Main" className="hidden items-center gap-[clamp(1rem,3vw,2.5rem)] md:flex">
            <ul className="flex flex-wrap items-center justify-end gap-x-[clamp(1rem,3vw,2.5rem)] gap-y-2">
              {navItems.map((item) => {
                const active = navActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <motion.div whileHover={reduceMotion ? undefined : { y: -1 }}>
                      <Link
                        className={cn(
                          "flex min-h-11 items-center text-[clamp(0.875rem,2.2vw,0.9rem)] font-normal transition-colors",
                          active
                            ? "text-white"
                            : "text-[rgba(232,237,248,0.7)] hover:text-white",
                        )}
                        href={item.href}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  </li>
                );
              })}
            </ul>
            {isHome ? (
              <button type="button" className={ctaButtonClass} onClick={() => scrollMarketingIframeToContact()}>
                Get Started
              </button>
            ) : (
              <Link href="#contact" className={ctaButtonClass}>
                Get Started
              </Link>
            )}
          </nav>
        </div>

        <div
          className={cn("fixed inset-0 z-40 md:hidden", !menuOpen && "pointer-events-none")}
          aria-hidden={!menuOpen}
        >
          <button
            type="button"
            className={cn(
              "absolute inset-0 bg-black/55 transition-opacity duration-200",
              menuOpen ? "opacity-100" : "opacity-0",
            )}
            aria-label="Close menu"
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
          />
          <nav
            id="site-nav-drawer"
            className={cn(
              "absolute right-0 top-0 flex h-dvh w-[min(22rem,calc(100vw-1rem))] flex-col border-l border-white/[0.12] bg-[rgba(10,14,26,0.98)] px-4 pb-8 pt-[4.5rem] shadow-xl backdrop-blur-md transition-transform duration-300 ease-[cubic-bezier(0.22,0.7,0.18,1)]",
              menuOpen ? "translate-x-0" : "translate-x-full",
            )}
            aria-label="Mobile main"
            style={{ fontFamily: "var(--font-marketing-dm), system-ui, sans-serif" }}
          >
            <ul className="flex flex-col gap-0">
              {navItems.map((item) => {
                const active = navActive(pathname, item.href);
                return (
                  <li key={item.href} className="border-b border-white/[0.08]">
                    <Link
                      className={cn(
                        "flex min-h-12 items-center py-4 text-[1rem] transition-colors",
                        active ? "text-[#00D4FF]" : "text-[rgba(232,237,248,0.85)]",
                      )}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            {isHome ? (
              <button
                type="button"
                className={ctaMobileClass}
                onClick={() => {
                  setMenuOpen(false);
                  scrollMarketingIframeToContact();
                }}
              >
                Get Started
              </button>
            ) : (
              <Link
                href="#contact"
                className={ctaMobileClass}
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </Link>
            )}
          </nav>
        </div>
      </motion.header>
    </>
  );
}
