import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.07] px-[clamp(1rem,4vw,3rem)] py-10">
      <div className="mx-auto flex max-w-[75rem] flex-col flex-wrap items-start gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-[1.05rem] font-semibold tracking-[-0.04em] text-white"
        >
          Agentomatic
          <span className="inline-block size-2 shrink-0 rounded-full bg-[#8cffd2]" aria-hidden />
          Voice
        </Link>

        <nav
          className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[0.85rem] text-[rgba(232,237,248,0.45)]"
          aria-label="Footer"
        >
          <Link className="min-h-10 inline-flex items-center no-underline hover:text-[rgba(232,237,248,0.8)]" href="/solutions">
            Solutions
          </Link>
          <Link className="min-h-10 inline-flex items-center no-underline hover:text-[rgba(232,237,248,0.8)]" href="/vision">
            Vision
          </Link>
          <Link className="min-h-10 inline-flex items-center no-underline hover:text-[rgba(232,237,248,0.8)]" href="/blog">
            Blog
          </Link>
          <Link className="min-h-10 inline-flex items-center no-underline hover:text-[rgba(232,237,248,0.8)]" href="#contact">
            Voice Demo
          </Link>
        </nav>

        <p className="text-[0.8rem] text-[rgba(232,237,248,0.3)] sm:text-right">
          © {year} Agentomatic Labs. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
