"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { requestStoryScrollReset } from "@/lib/story/reset-story-scroll";

type HomeLogoLinkProps = {
  className?: string;
  children: ReactNode;
};

/** Logo / home link — on the homepage, jumps to the first story card instead of staying mid-scroll. */
export function HomeLogoLink({ className, children }: HomeLogoLinkProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!isHome) return;
    event.preventDefault();
    requestStoryScrollReset();
  }

  return (
    <Link href="/" className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
