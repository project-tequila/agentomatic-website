"use client";

import { useEffect, useState, type ComponentType } from "react";

import { HomeHeroFallback } from "@/components/site/home-hero-fallback";
import { scheduleWhenEngaged } from "@/lib/schedule-idle";

/**
 * Client boundary for homepage 3D. The Helios/WebGL module stays off the
 * critical path so the fallback heading can paint as LCP. Phones wait for
 * a gesture; wider screens load it on idle. `ssr: false` dynamic() is not
 * allowed from a Server Component in this Next.js version, so the import lives here.
 */
export function HomeImmersiveExperience() {
  const [Canvas, setCanvas] = useState<ComponentType | null>(null);

  useEffect(() => {
    let cancelled = false;
    const cancelIdle = scheduleWhenEngaged(() => {
      void import("@/components/site/immersive-home-canvas").then((mod) => {
        if (!cancelled) setCanvas(() => mod.ImmersiveHomeCanvas);
      });
    }, 1200);

    return () => {
      cancelled = true;
      cancelIdle();
    };
  }, []);

  if (!Canvas) return <HomeHeroFallback />;
  return <Canvas />;
}
