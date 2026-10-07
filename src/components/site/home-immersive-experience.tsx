"use client";

import { useEffect, useState, type ComponentType } from "react";

import { HomeHeroFallback } from "@/components/site/home-hero-fallback";
import { scheduleIdle } from "@/lib/schedule-idle";

/**
 * Client boundary for homepage 3D. The Helios/WebGL module stays off the
 * critical path until the browser is idle, so the fallback heading can paint
 * as LCP on mobile. `ssr: false` dynamic() is not allowed from a Server
 * Component in this Next.js version, so the import lives here.
 */
export function HomeImmersiveExperience() {
  const [Canvas, setCanvas] = useState<ComponentType | null>(null);

  useEffect(() => {
    let cancelled = false;
    const cancelIdle = scheduleIdle(() => {
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
