"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";

import { useHeliosVoice } from "@/lib/helios/helios-provider";

import { VoiceScene3DContent } from "./voice-scene-3d";

function VoicePointerTracker() {
  const { setVoiceInput } = useHeliosVoice();

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = -((event.clientY / window.innerHeight) * 2 - 1);
      setVoiceInput({ pointerX: nx, pointerY: ny });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [setVoiceInput]);

  return null;
}

export function VoiceSceneBackground() {
  return (
    <div className="voice-scene-layer" aria-hidden>
      <VoicePointerTracker />
      <Canvas
        camera={{ position: [0, 0.2, 5.8], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <VoiceScene3DContent />
        </Suspense>
      </Canvas>
      <div className="voice-scene-vignette" />
      <div className="voice-scene-grid" />
    </div>
  );
}
