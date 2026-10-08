"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { DemoCallProvider, useDemoCall } from "@/lib/demo-call/demo-call-context";
import { DemoWebVoiceProvider } from "@/lib/voice/demo-web-voice-context";
import { scheduleWhenEngaged } from "@/lib/schedule-idle";

const DemoCallPanel = dynamic(() => import("./demo-call-panel").then((mod) => mod.DemoCallPanel), {
  ssr: false,
});
const VoiceFocusExperience = dynamic(
  () => import("./voice-focus-experience").then((mod) => mod.VoiceFocusExperience),
  { ssr: false },
);
const SiteMagneticEnhancer = dynamic(
  () => import("./site-magnetic-enhancer").then((mod) => mod.SiteMagneticEnhancer),
  { ssr: false },
);
const SiteOrbHitZone = dynamic(() => import("./site-orb-hit-zone").then((mod) => mod.SiteOrbHitZone), {
  ssr: false,
});

type SiteDemoCallRootProps = {
  children: React.ReactNode;
};

/**
 * Helios, Framer Motion, and the voice HUD are not needed for first paint.
 * Mount them on idle, or immediately if the visitor starts a demo first.
 */
function DeferredExperience() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { isOpen } = useDemoCall();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReady(true);
      return;
    }
    return scheduleWhenEngaged(() => setReady(true), 1600);
  }, [isOpen]);

  if (!ready) return null;

  return (
    <>
      <SiteMagneticEnhancer />
      <VoiceFocusExperience />
      <DemoCallPanel />
      {!isHome ? <SiteOrbHitZone variant="floating" /> : null}
    </>
  );
}

export function SiteDemoCallRoot({ children }: SiteDemoCallRootProps) {
  return (
    <DemoCallProvider>
      <DemoWebVoiceProvider>
        {children}
        <DeferredExperience />
      </DemoWebVoiceProvider>
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
