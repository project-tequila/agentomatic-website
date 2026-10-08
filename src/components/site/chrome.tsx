"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { HomeLogoLink } from "@/components/site/home-logo-link";
import { BOOKER_ROUTE, BOOKER_SIGNUP_ROUTE } from "@/lib/booker/booker-session";
import { useBeginVoiceDemo } from "@/lib/demo-call/use-begin-voice-demo";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/about", label: "about" },
  { href: "/solutions", label: "solutions" },
  { href: "/pricing", label: "pricing" },
  { href: "/blog", label: "blog" },
] as const;

const CONTACT_HREF = "/contact";
const CONTACT_LABEL = "contact us";

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
  return (
    <li>
      <Link
        className={cn("site-chrome-nav-link", active && "site-chrome-nav-link--active")}
        href={href}
        onClick={onClick}
        prefetch={false}
      >
        {label}
      </Link>
    </li>
  );
}

type MotionChromeButtonProps = {
  className?: string;
  onClick: () => void;
  children: ReactNode;
  "data-testid"?: string;
};

function MotionChromeCta({ className, onClick, children, "data-testid": testId }: MotionChromeButtonProps) {
  return (
    <button type="button" className={className} onClick={onClick} data-testid={testId} aria-label="Talk to Agent">
      {children}
    </button>
  );
}

function MotionChromeLink({
  href,
  className,
  onClick,
  children,
  "data-testid": testId,
  "aria-current": ariaCurrent,
}: {
  href: string;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
  "data-testid"?: string;
  "aria-current"?: "page" | undefined;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={onClick}
      data-testid={testId}
      aria-current={ariaCurrent}
      prefetch={false}
    >
      {children}
    </Link>
  );
}

export function SiteChrome() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const beginVoiceDemo = useBeginVoiceDemo();

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

  const ctaLabel = "Talk to Agent";
  const contactActive = navActive(pathname, CONTACT_HREF);
  function onTalkToAgent() {
    beginVoiceDemo();
    setMenuOpen(false);
  }

  return (
    <>
      <div aria-hidden className="site-chrome__spacer shrink-0" />

      <header className={cn("site-chrome", menuOpen && "site-chrome--menu-open")}>
        <div className="site-chrome__inner">
          <div className="site-chrome__brand">
            <HomeLogoLink className="site-chrome-logo">
              <span className="site-chrome-logo__mark" aria-hidden>
                <span className="site-chrome-logo__dot" />
              </span>
              <span className="whitespace-nowrap">agentomatic</span>
            </HomeLogoLink>
          </div>

          <div className="site-chrome__rail">
            <div className="site-chrome__mobile-contact">
              <MotionChromeLink
                href={CONTACT_HREF}
                className="site-chrome-action-btn site-chrome-cta site-chrome-contact"
                data-testid="chrome-contact-us-mobile"
                aria-current={contactActive ? "page" : undefined}
              >
                {CONTACT_LABEL}
              </MotionChromeLink>
            </div>

            <button
              type="button"
              className="site-chrome-menu-btn"
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
              <MotionChromeLink
                href={CONTACT_HREF}
                className="site-chrome-action-btn site-chrome-cta site-chrome-contact"
                data-testid="chrome-contact-us"
                aria-current={contactActive ? "page" : undefined}
              >
                {CONTACT_LABEL}
              </MotionChromeLink>
              <MotionChromeCta
                className="site-chrome-action-btn site-chrome-cta"
                data-testid="chrome-talk-to-agent"
                onClick={onTalkToAgent}
              >
                {ctaLabel}
              </MotionChromeCta>
            </div>
          </div>
        </div>
      </header>

      <div
        className={cn("site-nav-drawer-layer", menuOpen && "site-nav-drawer-layer--open", !menuOpen && "pointer-events-none")}
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
                <li key={item.href} style={{ transitionDelay: menuOpen ? `${0.06 + index * 0.05}s` : "0s" }}>
                  <Link
                    className={cn("site-nav-drawer-link", active && "site-nav-drawer-link--active")}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    prefetch={false}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="site-nav-drawer__actions">
            <MotionChromeLink
              href={CONTACT_HREF}
              className="site-chrome-action-btn site-chrome-action-btn--full site-chrome-cta site-chrome-contact"
              data-testid="chrome-contact-us-drawer"
              aria-current={contactActive ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {CONTACT_LABEL}
            </MotionChromeLink>
            <MotionChromeCta
              className="site-chrome-action-btn site-chrome-action-btn--full site-chrome-cta"
              data-testid="chrome-talk-to-agent-mobile"
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
          </div>
        </nav>
      </div>
    </>
  );
}
