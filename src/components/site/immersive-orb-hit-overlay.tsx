"use client";

import { usePersistentOrbHitZone } from "@/lib/story/use-persistent-orb-hit-zone";

import { SiteOrbHitZone } from "./site-orb-hit-zone";

/** Fixed hit target above the scroll layer so orb taps open the demo call strip. */
export function ImmersiveOrbHitOverlay() {
  const hitZone = usePersistentOrbHitZone();

  if (!hitZone.visible) return null;

  return (
    <div className="immersive-orb-hit-overlay" style={hitZone.style}>
      <SiteOrbHitZone variant="immersive" />
    </div>
  );
}
