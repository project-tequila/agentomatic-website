"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";

import { useHeliosVoice } from "@/lib/helios/helios-provider";
import { cn } from "@/lib/utils";

import { VoiceScene3DContent } from "./voice-scene-3d";

function VoicePointerTracker({ targetRef }: { targetRef: React.RefObject<HTMLDivElement | null> }) {
  const { setVoiceInput } = useHeliosVoice();

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const onMove = (event: PointerEvent) => {
      const rect = target.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      setVoiceInput({ pointerX: nx, pointerY: ny });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [setVoiceInput, targetRef]);

  return null;
}

type VoiceSceneHeroProps = {
  className?: string;
  label?: string;
};

export function VoiceSceneHero({ className, label = "Ready" }: VoiceSceneHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className={cn("voice-scene-hero", className)}>
      <VoicePointerTracker targetRef={containerRef} />
      <Canvas
        camera={{ position: [0, 0.2, 5.4], fov: 52 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <VoiceScene3DContent />
        </Suspense>
      </Canvas>
      <div className="voice-scene-hero__vignette" aria-hidden />
      <div className="voice-scene-hero__horizon" aria-hidden />
      <p className="voice-scene-hero__label">
        <span className="voice-scene-hero__dot" aria-hidden />
        {label}
      </p>
    </div>
  );
}
