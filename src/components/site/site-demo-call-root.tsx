"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { DemoCallProvider, useDemoCall } from "@/lib/demo-call/demo-call-context";

import { DemoCallPanel } from "./demo-call-panel";
import { SiteOrbHitZone } from "./site-orb-hit-zone";

type SiteDemoCallRootProps = {
  children: React.ReactNode;
};

export function SiteDemoCallRoot({ children }: SiteDemoCallRootProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <DemoCallProvider>
      {children}
      <DemoCallPanel />
      <SiteOrbHitZone variant={isHome ? "immersive" : "floating"} />
    </DemoCallProvider>
  );
}

/** Syncs homepage scroll progress into the demo panel reveal on the last slide. */
export function DemoCallScrollReveal({ reveal }: { reveal: number }) {
  const { setScrollReveal } = useDemoCall();

  useEffect(() => {
    setScrollReveal(reveal);
    return () => setScrollReveal(0);
  }, [reveal, setScrollReveal]);

  return null;
}
