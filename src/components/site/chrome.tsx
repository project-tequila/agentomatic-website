"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/solutions", label: "Solutions" },
  { href: "/vision", label: "Vision" },
  { href: "/blog", label: "Blog" },
] as const;

const NAV_ROW_H = "3.5rem";

function navActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

const ctaButtonClass =
  "voice-button shrink-0 rounded-full px-[1.2rem] py-2 text-[clamp(0.82rem,2vw,0.88rem)] font-medium text-black";

const ctaMobileClass =
  "voice-button mt-4 flex min-h-12 items-center justify-center rounded-full px-4 py-3 text-[0.95rem] font-medium text-black";

export function SiteChrome() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const isHome = pathname === "/";

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
        className="fixed inset-x-0 top-0 z-20 border-b border-white/[0.07] bg-black/45 backdrop-blur-2xl"
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
            className="flex min-h-11 shrink-0 items-center gap-2 text-[clamp(0.92rem,3vw,1.12rem)] font-semibold leading-none tracking-[-0.04em] text-white"
          >
            <span className="grid size-6 place-items-center rounded-full border border-[#8cffd2]/25 bg-[#8cffd2]/10">
              <span className="size-2 rounded-full bg-[#8cffd2] shadow-[0_0_18px_rgba(140,255,210,.9)]" aria-hidden />
            </span>
            <span className="whitespace-nowrap">Agentomatic</span>
            <span
              className="inline-block size-[0.22em] min-h-[5px] min-w-[5px] max-h-[8px] max-w-[8px] shrink-0 rounded-full bg-white/40"
              aria-hidden
            />
            <span className="whitespace-nowrap text-white/65">Voice</span>
          </Link>

          <button
            type="button"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/[0.14] bg-white/[0.04] text-white md:hidden"
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
                          active ? "text-white" : "text-white/55 hover:text-white",
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
              <Link href="#experience" className={ctaButtonClass}>
                Talk to agent
              </Link>
            ) : (
              <Link href="#contact" className={ctaButtonClass}>
                Talk to agent
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
              "absolute right-0 top-0 flex h-dvh w-[min(22rem,calc(100vw-1rem))] flex-col border-l border-white/[0.10] bg-black/90 px-4 pb-8 pt-[4.5rem] shadow-xl backdrop-blur-md transition-transform duration-300 ease-[cubic-bezier(0.22,0.7,0.18,1)]",
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
                        active ? "text-[#8cffd2]" : "text-white/75",
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
              <Link
                href="#experience"
                className={ctaMobileClass}
                onClick={() => {
                  setMenuOpen(false);
                }}
              >
                Talk to agent
              </Link>
            ) : (
              <Link
                href="#contact"
                className={ctaMobileClass}
                onClick={() => setMenuOpen(false)}
              >
                Talk to agent
              </Link>
            )}
          </nav>
        </div>
      </motion.header>
    </>
  );
}
