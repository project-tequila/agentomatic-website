"use client";

export function SkipLink() {
  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const target = document.getElementById("main-content");
    if (!target) return;
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <a href="#main-content" className="site-skip-link" onClick={onClick}>
      Skip to main content
    </a>
  );
}
