"use client";

import dynamic from "next/dynamic";

import { HomeHeroFallback } from "@/components/site/home-hero-fallback";

const ImmersiveHomeCanvas = dynamic(
  () => import("@/components/site/immersive-home-canvas").then((mod) => mod.ImmersiveHomeCanvas),
  { ssr: false, loading: () => <HomeHeroFallback /> },
);

/**
 * Client boundary for homepage 3D. `ssr: false` is not allowed on Server
 * Components in this Next.js version, so the dynamic import lives here.
 */
export function HomeImmersiveExperience() {
  return <ImmersiveHomeCanvas />;
}
