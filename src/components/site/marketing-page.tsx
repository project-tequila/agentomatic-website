import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SitePageHeaderProps = {
  kicker: string;
  title: string;
  lead?: string;
  className?: string;
};

export function SitePageHeader({ kicker, title, lead, className }: SitePageHeaderProps) {
  return (
    <header className={cn("site-page-header", className)}>
      <p className="site-kicker">{kicker}</p>
      <h1 className="site-display">{title}</h1>
      {lead ? <p className="site-lead">{lead}</p> : null}
    </header>
  );
}

type SiteCardProps = {
  children: ReactNode;
  className?: string;
  as?: "article" | "div";
};

export function SiteCard({ children, className, as: Tag = "article" }: SiteCardProps) {
  return <Tag className={cn("site-card", className)}>{children}</Tag>;
}

type SiteMainProps = {
  children: ReactNode;
  className?: string;
};

export function SiteMain({ children, className }: SiteMainProps) {
  return (
    <main id="main-content" className={cn("site-main", className)} tabIndex={-1}>
      <div className="site-container">{children}</div>
    </main>
  );
}
