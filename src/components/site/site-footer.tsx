import Link from "next/link";

import { HomeLogoLink } from "@/components/site/home-logo-link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer border-t border-white/[0.08] px-[clamp(1rem,4vw,3rem)] py-10">
      <div className="mx-auto flex max-w-[75rem] flex-col flex-wrap items-start gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <HomeLogoLink className="flex items-center gap-2 text-[0.95rem] font-medium lowercase tracking-[-0.03em] text-white">
          <span className="grid size-5 place-items-center rounded-full border border-white/20 bg-white/5">
            <span className="size-1.5 rounded-full bg-white/80" aria-hidden />
          </span>
          agentomatic
        </HomeLogoLink>

        <nav className="flex flex-wrap items-center gap-x-8 gap-y-3" aria-label="Footer">
          <Link className="site-link min-h-10 inline-flex items-center no-underline" href="/about">
            about
          </Link>
          <Link className="site-link min-h-10 inline-flex items-center no-underline" href="/pricing">
            pricing
          </Link>
          <Link className="site-link min-h-10 inline-flex items-center no-underline" href="/blog">
            blog
          </Link>
          <Link className="site-link min-h-10 inline-flex items-center no-underline" href="/contact">
            contact
          </Link>
        </nav>

        <p className="text-[0.72rem] lowercase text-white/30 sm:text-right">
          © {year} agentomatic labs
        </p>
      </div>
    </footer>
  );
}
