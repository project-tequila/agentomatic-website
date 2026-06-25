import Link from "next/link";

import { HomeLogoLink } from "@/components/site/home-logo-link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <HomeLogoLink className="site-footer__brand">
          <span className="grid size-5 place-items-center rounded-full border border-white/20 bg-white/5">
            <span className="size-1.5 rounded-full bg-white/80" aria-hidden />
          </span>
          agentomatic
        </HomeLogoLink>

        <nav className="site-footer__nav" aria-label="Footer">
          <Link className="site-footer__link" href="/about">
            about
          </Link>
          <Link className="site-footer__link" href="/pricing">
            pricing
          </Link>
          <Link className="site-footer__link" href="/blog">
            blog
          </Link>
          <Link className="site-footer__link" href="/contact">
            contact
          </Link>
        </nav>

        <p className="site-footer__copy">© {year} agentomatic labs</p>
      </div>
    </footer>
  );
}
