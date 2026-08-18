"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { HomeLogoLink } from "@/components/site/home-logo-link";
import { BOOKER_ROUTE, BOOKER_SIGNUP_ROUTE } from "@/lib/booker/booker-session";
import { openDemoCall } from "@/lib/demo-call/open-demo-call";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/about", label: "about" },
  { href: "/solutions", label: "solutions" },
  { href: "/agents", label: "agents" },
  { href: "/vision", label: "vision" },
  { href: "/pricing", label: "pricing" },
  { href: "/blog", label: "blog" },
  { href: "/contact", label: "contact" },
] as const;

const RUMIK_EASE = [0.22, 0.7, 0.18, 1] as const;

const MotionLink = motion.create(Link);

function navActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

type ChromeNavLinkProps = {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
};

function ChromeNavLink({ href, label, active, onClick }: ChromeNavLinkProps) {
  const reduceMotion = useReducedMotion();

  return (
    <li>
      <motion.div whileHover={reduceMotion ? undefined : { y: -1 }} transition={{ duration: 0.22, ease: RUMIK_EASE }}>
        <Link
          className={cn("site-chrome-nav-link", active && "site-chrome-nav-link--active")}
          href={href}
          onClick={onClick}
        >
          {label}
        </Link>
      </motion.div>
    </li>
  );
}

type MotionChromeButtonProps = {
  className?: string;
  onClick: () => void;
  children: ReactNode;
};

function MotionChromeCta({ className, onClick, children }: MotionChromeButtonProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      className={className}
      onClick={onClick}
      whileHover={reduceMotion ? undefined : { y: -1 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.22, ease: RUMIK_EASE }}
    >
      {children}
    </motion.button>
  );
}

function MotionChromeLink({
  href,
  className,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <MotionLink
      href={href}
      className={className}
      onClick={onClick}
      whileHover={reduceMotion ? undefined : { y: -1 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.22, ease: RUMIK_EASE }}
    >
      {children}
    </MotionLink>
  );
}

export function SiteChrome() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

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

  const ctaLabel = "try it live";

  function onTalkToAgent() {
    openDemoCall();
    setMenuOpen(false);
  }

  return (
    <>
      <div aria-hidden className="site-chrome__spacer shrink-0" />

      <motion.header
        className={cn("site-chrome", menuOpen && "site-chrome--menu-open")}
        initial={false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: RUMIK_EASE }}
      >
        <div className="site-chrome__inner">
          <motion.div
            className="site-chrome__brand"
            whileHover={reduceMotion ? undefined : { scale: 1.015 }}
            transition={{ duration: 0.28, ease: RUMIK_EASE }}
          >
            <HomeLogoLink className="site-chrome-logo">
              <span className="site-chrome-logo__mark" aria-hidden>
                <span className="site-chrome-logo__dot" />
              </span>
              <span className="whitespace-nowrap">agentomatic</span>
            </HomeLogoLink>
          </motion.div>

          <motion.button
            type="button"
            className="site-chrome-menu-btn"
            aria-expanded={menuOpen}
            aria-controls="site-nav-drawer"
            onClick={() => setMenuOpen((o) => !o)}
            whileTap={reduceMotion ? undefined : { scale: 0.96 }}
            transition={{ duration: 0.18, ease: RUMIK_EASE }}
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
          </motion.button>

          <nav aria-label="Main" className="site-chrome__nav">
            <ul className="site-chrome__nav-list">
              {navItems.map((item) => (
                <ChromeNavLink key={item.href} href={item.href} label={item.label} active={navActive(pathname, item.href)} />
              ))}
            </ul>
          </nav>

          <div className="site-chrome__actions">
            <MotionChromeLink href={BOOKER_ROUTE} className="site-chrome-action-btn site-chrome-sign-up">
              log in
            </MotionChromeLink>
            <MotionChromeLink href={BOOKER_SIGNUP_ROUTE} className="site-chrome-action-btn site-chrome-sign-up">
              sign up
            </MotionChromeLink>
            <MotionChromeCta className="site-chrome-action-btn site-chrome-cta" onClick={onTalkToAgent}>
              {ctaLabel}
            </MotionChromeCta>
          </div>
        </div>
      </motion.header>

      <div
        className={cn("site-nav-drawer-layer", !menuOpen && "pointer-events-none")}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className={cn("site-nav-drawer-backdrop", menuOpen ? "opacity-100" : "opacity-0")}
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
        />
        <nav
          id="site-nav-drawer"
          className={cn(menuOpen ? "translate-x-0" : "translate-x-full")}
          aria-label="Mobile main"
          onClick={(e) => e.stopPropagation()}
        >
          <ul className="site-nav-drawer__links">
            {navItems.map((item, index) => {
              const active = navActive(pathname, item.href);
              return (
                <motion.li
                  key={item.href}
                  initial={reduceMotion ? false : { opacity: 0, x: 14 }}
                  animate={
                    menuOpen
                      ? { opacity: 1, x: 0 }
                      : reduceMotion
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: 14 }
                  }
                  transition={{
                    duration: 0.28,
                    ease: RUMIK_EASE,
                    delay: menuOpen && !reduceMotion ? 0.06 + index * 0.05 : 0,
                  }}
                >
                  <Link
                    className={cn("site-nav-drawer-link", active && "site-nav-drawer-link--active")}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              );
            })}
          </ul>
          <motion.div
            className="site-nav-drawer__actions"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={menuOpen ? { opacity: 1, y: 0 } : reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{
              duration: 0.3,
              ease: RUMIK_EASE,
              delay: menuOpen && !reduceMotion ? 0.28 : 0,
            }}
          >
            <MotionChromeCta
              className="site-chrome-action-btn site-chrome-action-btn--full site-chrome-cta"
              onClick={onTalkToAgent}
            >
              {ctaLabel}
            </MotionChromeCta>
            <MotionChromeLink
              href={BOOKER_SIGNUP_ROUTE}
              className="site-chrome-action-btn site-chrome-action-btn--full site-chrome-sign-up"
              onClick={() => setMenuOpen(false)}
            >
              sign up
            </MotionChromeLink>
            <MotionChromeLink
              href={BOOKER_ROUTE}
              className="site-chrome-action-btn site-chrome-action-btn--full site-chrome-sign-up"
              onClick={() => setMenuOpen(false)}
            >
              log in
            </MotionChromeLink>
          </motion.div>
        </nav>
      </div>
    </>
  );
}
