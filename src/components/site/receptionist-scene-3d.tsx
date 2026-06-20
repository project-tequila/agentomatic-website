"use client";

import { interpolate } from "@helios-project/core";
import { ContactShadows, Environment } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh, PerspectiveCamera } from "three";

import { useHeliosVoice } from "@/lib/helios/helios-provider";
import { scenePhase } from "@/lib/helios/scene-timeline";
import type { VoiceHeliosState } from "@/lib/helios/types";

import { OfficeReceptionEnvironment } from "./office-reception-environment";
import { ProfessionalReceptionist } from "./professional-receptionist";

const stateEnergy: Record<VoiceHeliosState, number> = {
  idle: 0.18,
  listening: 0.62,
  speaking: 1,
};

function ReceptionistCameraRig() {
  const { helios } = useHeliosVoice();

  useFrame(({ camera }) => {
    const cam = camera as PerspectiveCamera;
    const { inputProps, currentFrame } = helios.getState();
    const scene = inputProps.sceneProgress ?? 0;
    const energy = Math.max(inputProps.energy, stateEnergy[inputProps.voiceState]);
    const breathe = Math.sin(currentFrame * 0.035) * 0.02;

    const targetX = interpolate(scene, [0, 0.25, 0.55, 0.82, 1], [0, 2.4, 1.1, 0.2, 0.35], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) + inputProps.pointerX * 0.12;
    const targetY = interpolate(scene, [0, 0.25, 0.55, 0.82, 1], [2.1, 1.65, 1.45, 1.28, 1.25], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) + breathe;
    const targetZ = interpolate(scene, [0, 0.25, 0.55, 0.82, 1], [8.5, 5.8, 4.2, 3.55, 3.35], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) - energy * 0.1;

    const lookY = interpolate(scene, [0, 0.55, 0.82, 1], [0.85, 1.05, 1.18, 1.22], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const lookZ = interpolate(scene, [0, 0.82, 1], [0.5, -0.2, -0.35], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    cam.position.x += (targetX - cam.position.x) * 0.045;
    cam.position.y += (targetY - cam.position.y) * 0.045;
    cam.position.z += (targetZ - cam.position.z) * 0.045;
    cam.lookAt(0, lookY, lookZ);
  });

  return null;
}

function MonitorGlow() {
  const ref = useRef<Mesh>(null);
  const { helios } = useHeliosVoice();

  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const { currentFrame, inputProps } = helios.getState();
    const seated = scenePhase(inputProps.sceneProgress ?? 0).seated;
    const energy = Math.max(inputProps.energy, stateEnergy[inputProps.voiceState]);
    const material = mesh.material as { emissiveIntensity?: number };
    if (material.emissiveIntensity !== undefined) {
      material.emissiveIntensity =
        seated * (0.2 + energy * 0.5) + Math.sin(currentFrame * 0.1) * 0.08 * energy * seated;
    }
  });

  return (
    <mesh ref={ref} position={[0.35, 0.9, -0.12]}>
      <planeGeometry args={[0.56, 0.34]} />
      <meshStandardMaterial color="#0a1420" emissive="#8cffd2" emissiveIntensity={0} />
    </mesh>
  );
}

export function ReceptionistScene3DContent() {
  return (
    <>
      <color attach="background" args={["#121418"]} />
      <fog attach="fog" args={["#121418", 8, 22]} />
      <ReceptionistCameraRig />
      <Environment preset="apartment" />
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 4]} intensity={1.1} color="#fff4e8" castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 5, -2]} intensity={0.35} color="#c8d8f0" />
      <pointLight position={[0, 3.5, 1]} intensity={0.8} color="#ffe8c8" distance={12} />
      <spotLight position={[6, 4, 2]} angle={0.4} penumbra={0.9} intensity={0.6} color="#d0e0ff" />

      <OfficeReceptionEnvironment />
      <MonitorGlow />
      <ProfessionalReceptionist />

      <ContactShadows position={[0, 0.01, 0]} opacity={0.45} scale={12} blur={2.5} far={4} color="#000000" />

      <EffectComposer multisampling={0}>
        <Bloom intensity={0.35} luminanceThreshold={0.4} luminanceSmoothing={0.9} />
        <Vignette eskil={false} offset={0.14} darkness={0.55} />
      </EffectComposer>
    </>
  );
}
