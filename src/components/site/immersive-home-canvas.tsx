"use client";

import { ContactSection } from "@/components/site/contact-section";
import { Immersive3DSite } from "@/components/site/immersive-3d-site";
import { RumikStory } from "@/components/site/rumik-story";
import { SiteFooter } from "@/components/site/site-footer";

/**
 * Helios + story WebGL homepage shell. Loaded only via `next/dynamic` so it
 * stays off the critical JS path.
 */
export function ImmersiveHomeCanvas() {
  return (
    <Immersive3DSite>
      <RumikStory />
      <ContactSection />
      <SiteFooter />
    </Immersive3DSite>
  );
}
