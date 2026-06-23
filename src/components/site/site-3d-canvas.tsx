"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";

import { useHeliosVoice } from "@/lib/helios/helios-provider";
import { useVideoFrame } from "@/lib/helios/use-video-frame";
import type { VoiceHeliosState } from "@/lib/helios/types";

import { ReceptionistScene3DContent } from "./receptionist-scene-3d";

const statusLabels: Record<VoiceHeliosState, string> = {
  idle: "At desk",
  listening: "Listening",
  speaking: "Speaking",
};

function sceneStatus(scene: number, voice: VoiceHeliosState) {
  if (scene < 0.18) return "Empty lobby";
  if (scene < 0.52) return "Walking in";
  if (scene < 0.78) return "Taking seat";
  return statusLabels[voice];
}

function ScenePointerTracker({ targetRef }: { targetRef: React.RefObject<HTMLDivElement | null> }) {
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

export function Site3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { helios } = useHeliosVoice();
  const { inputProps } = useVideoFrame(helios);
  const label = sceneStatus(inputProps.sceneProgress ?? 0, inputProps.voiceState);

  return (
    <div ref={containerRef} className="site-3d__canvas" aria-hidden>
      <ScenePointerTracker targetRef={containerRef} />
      <Canvas
        camera={{ position: [0, 2.1, 8.5], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <ReceptionistScene3DContent />
        </Suspense>
      </Canvas>
      <div className="site-3d__vignette" />
      <div className="site-3d__horizon" />
      <div className="site-3d__scan" />
      {label ? (
        <p className="site-3d__status">
          <span className="site-3d__status-dot" />
          {label}
        </p>
      ) : null}
    </div>
  );
}
