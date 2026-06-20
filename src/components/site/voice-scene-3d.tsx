"use client";

import { interpolate, spring } from "@helios-project/core";
import { Grid, Float, MeshDistortMaterial, Sparkles, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type ReactNode } from "react";
import type { Group, Mesh, PerspectiveCamera, Points } from "three";

import { useHeliosVoice } from "@/lib/helios/helios-provider";
import type { VoiceHeliosState } from "@/lib/helios/types";

const stateEnergy: Record<VoiceHeliosState, number> = {
  idle: 0.18,
  listening: 0.62,
  speaking: 1,
};

const stateCameraZ: Record<VoiceHeliosState, number> = {
  idle: 5.4,
  listening: 4.7,
  speaking: 4.1,
};

function createParticlePositions(count: number) {
  const data = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const seed = (i * 9301 + 49297) % 233280;
    const rand = (offset: number) => ((seed + offset * 7919) % 233280) / 233280;
    const radius = 2.8 + rand(1) * 3.2;
    const theta = rand(2) * Math.PI * 2;
    const phi = Math.acos(2 * rand(3) - 1);
    data[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    data[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    data[i * 3 + 2] = radius * Math.cos(phi);
  }
  return data;
}

const particlePositions = createParticlePositions(680);

function VoiceCameraRig() {
  const { helios } = useHeliosVoice();

  useFrame(({ camera }) => {
    const cam = camera as PerspectiveCamera;
    const { inputProps, currentFrame } = helios.getState();
    const energy = Math.max(inputProps.energy, stateEnergy[inputProps.voiceState]);
    const scroll = inputProps.scrollProgress ?? 0;
    const targetZ = stateCameraZ[inputProps.voiceState] - energy * 0.35 + scroll * 1.4;
    const breathe = Math.sin(currentFrame * 0.04) * 0.08 * energy;
    const targetY = inputProps.pointerY * 0.45 + breathe - scroll * 0.95;
    const targetX = inputProps.pointerX * 0.85 + Math.sin(scroll * Math.PI) * 0.35;

    cam.position.x += (targetX - cam.position.x) * 0.035;
    cam.position.y += (targetY - cam.position.y) * 0.035;
    cam.position.z += (targetZ - cam.position.z) * 0.04;
    cam.lookAt(0, scroll * -0.25, 0);
  });

  return null;
}

function VoiceOrbitalSatellites() {
  const groupRef = useRef<Group>(null);
  const satellites = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const seed = (i * 4177 + 8911) % 10000;
        const angle = (i / 14) * Math.PI * 2;
        const radius = 2.4 + (seed % 100) / 100;
        const y = ((seed % 200) / 100 - 1) * 0.85;
        return { angle, radius, y, speed: 0.8 + (seed % 50) / 100 };
      }),
    [],
  );
  const { helios } = useHeliosVoice();

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    const { currentFrame, inputProps } = helios.getState();
    const energy = Math.max(inputProps.energy, stateEnergy[inputProps.voiceState]);
    const scroll = inputProps.scrollProgress ?? 0;

    group.rotation.y = currentFrame * 0.0022 + scroll * Math.PI * 0.5;

    group.children.forEach((child, index) => {
      const mesh = child as Mesh;
      const sat = satellites[index];
      const t = currentFrame * 0.01 * sat.speed + sat.angle;
      const r = sat.radius + energy * 0.35;
      mesh.position.x = Math.cos(t) * r;
      mesh.position.z = Math.sin(t) * r;
      mesh.position.y = sat.y + Math.sin(t * 2) * 0.15;
      mesh.scale.setScalar(0.08 + energy * 0.05);
    });
  });

  return (
    <group ref={groupRef}>
      {satellites.map((sat, index) => (
        <mesh key={index}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? "#8cffd2" : "#9cc7ff"}
            emissive={index % 2 === 0 ? "#8cffd2" : "#9cc7ff"}
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

function SceneWorld({ children }: { children: ReactNode }) {
  const worldRef = useRef<Group>(null);
  const { helios } = useHeliosVoice();

  useFrame(() => {
    const world = worldRef.current;
    if (!world) return;
    const { currentFrame, inputProps } = helios.getState();
    const scroll = inputProps.scrollProgress ?? 0;
    world.rotation.y = currentFrame * 0.0012;
    world.rotation.x = scroll * 0.22 - 0.02;
  });

  return <group ref={worldRef}>{children}</group>;
}

function VoiceCoreOrb() {
  const meshRef = useRef<Mesh>(null);
  const innerRef = useRef<Mesh>(null);
  const { helios } = useHeliosVoice();

  useFrame(() => {
    const mesh = meshRef.current;
    const inner = innerRef.current;
    if (!mesh || !inner) return;

    const { currentFrame, fps, inputProps } = helios.getState();
    const targetEnergy = Math.max(inputProps.energy, stateEnergy[inputProps.voiceState]);
    const pulse = spring({
      frame: currentFrame,
      fps,
      from: 0.88,
      to: 1 + targetEnergy * 0.42,
      config: { stiffness: 140, damping: 12 },
    });
    const wobble = interpolate(currentFrame % (fps * 2), [0, fps, fps * 2], [0.16, 0.42, 0.16]);

    mesh.scale.setScalar(pulse);
    inner.scale.setScalar(0.42 + targetEnergy * 0.12);
    mesh.rotation.x = currentFrame * 0.005 + inputProps.pointerY * 0.4;
    mesh.rotation.y = currentFrame * 0.007 + inputProps.pointerX * 0.5;
    inner.rotation.x = -mesh.rotation.x * 1.4;
    inner.rotation.y = -mesh.rotation.y * 1.2;

    const material = mesh.material as { distort?: number; speed?: number };
    if (material.distort !== undefined) material.distort = 0.22 + wobble * targetEnergy * 1.2;
    if (material.speed !== undefined) material.speed = 1.4 + targetEnergy * 3.2;
  });

  return (
    <Float speed={1.8} rotationIntensity={0.45} floatIntensity={0.65}>
      <group>
        <mesh ref={innerRef}>
          <sphereGeometry args={[1.05, 32, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.55} />
        </mesh>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.72, 6]} />
          <MeshDistortMaterial
            color="#8cffd2"
            emissive="#8cffd2"
            emissiveIntensity={0.75 + stateEnergy.speaking * 0.2}
            roughness={0.08}
            metalness={0.82}
            transparent
            opacity={0.94}
          />
        </mesh>
      </group>
    </Float>
  );
}

function VoiceWireShell() {
  const shellRef = useRef<Mesh>(null);
  const { helios } = useHeliosVoice();

  useFrame(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const { currentFrame, inputProps } = helios.getState();
    const energy = Math.max(inputProps.energy, stateEnergy[inputProps.voiceState]);
    shell.rotation.x = currentFrame * 0.002 + inputProps.pointerY * 0.15;
    shell.rotation.y = currentFrame * 0.0035;
    shell.rotation.z = currentFrame * 0.0015;
    const material = shell.material as { opacity?: number };
    if (material.opacity !== undefined) material.opacity = 0.08 + energy * 0.18;
  });

  return (
    <mesh ref={shellRef}>
      <icosahedronGeometry args={[2.65, 1]} />
      <meshBasicMaterial color="#9cc7ff" wireframe transparent opacity={0.12} />
    </mesh>
  );
}

function VoicePortalRings() {
  const groupRef = useRef<Group>(null);
  const { helios } = useHeliosVoice();

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    const { currentFrame, fps, inputProps } = helios.getState();
    const energy = Math.max(inputProps.energy, stateEnergy[inputProps.voiceState]);

    group.children.forEach((ring, index) => {
      const mesh = ring as Mesh;
      const phase = currentFrame + index * 24;
      const scale = spring({
        frame: phase,
        fps,
        from: 0.82 + index * 0.18,
        to: 1.08 + index * 0.26 + energy * 0.28,
        config: { stiffness: 65 + index * 10, damping: 11 },
      });
      mesh.scale.set(scale, scale, scale);
      mesh.rotation.x = Math.PI / 2 + (index - 1) * 0.35 + inputProps.pointerY * 0.15;
      mesh.rotation.z = phase * 0.004 * (index % 2 === 0 ? 1 : -1);
      mesh.rotation.y = phase * 0.0025;
    });
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2, 3].map((index) => (
        <mesh key={index}>
          <torusGeometry args={[1.85 + index * 0.48, 0.014 + index * 0.005, 32, 220]} />
          <meshBasicMaterial
            color={index % 2 === 0 ? "#8cffd2" : "#9cc7ff"}
            transparent
            opacity={0.28 - index * 0.04}
          />
        </mesh>
      ))}
    </group>
  );
}

function VoiceSpectrumRing() {
  const groupRef = useRef<Group>(null);
  const bars = useMemo(() => Array.from({ length: 48 }, (_, i) => i), []);
  const { helios } = useHeliosVoice();

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    const { currentFrame, inputProps } = helios.getState();
    const energy = Math.max(inputProps.energy, stateEnergy[inputProps.voiceState]);
    group.rotation.y = currentFrame * 0.003;

    group.children.forEach((bar, index) => {
      const mesh = bar as Mesh;
      const wave =
        Math.sin(currentFrame * 0.11 + index * 0.38) * 0.5 +
        Math.cos(currentFrame * 0.06 + index * 0.14) * 0.4;
      const height = 0.1 + Math.abs(wave) * (0.45 + energy * 1.35);
      mesh.scale.y = height;
      mesh.position.y = height * 0.5;
    });
  });

  return (
    <group ref={groupRef} position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
      {bars.map((index) => {
        const angle = (index / bars.length) * Math.PI * 2;
        const radius = 2.35;
        return (
          <mesh key={index} position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}>
            <boxGeometry args={[0.045, 0.22, 0.045]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive={index % 3 === 0 ? "#9cc7ff" : "#8cffd2"}
              emissiveIntensity={0.45}
              metalness={0.55}
              roughness={0.25}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function VoiceParticleHalo() {
  const pointsRef = useRef<Points>(null);
  const { helios } = useHeliosVoice();

  useFrame(() => {
    const points = pointsRef.current;
    if (!points) return;

    const { currentFrame, inputProps } = helios.getState();
    const energy = Math.max(inputProps.energy, stateEnergy[inputProps.voiceState]);
    points.rotation.y = currentFrame * 0.002 + inputProps.pointerX * 0.25;
    points.rotation.x = inputProps.pointerY * 0.14;
    const material = points.material as { opacity?: number; size?: number };
    if (material.opacity !== undefined) material.opacity = 0.3 + energy * 0.55;
    if (material.size !== undefined) material.size = 0.022 + energy * 0.028;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#9cc7ff" size={0.024} transparent opacity={0.45} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function VoicePostFX() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={1.25} luminanceThreshold={0.1} luminanceSmoothing={0.9} mipmapBlur />
      <Vignette eskil={false} offset={0.1} darkness={0.72} />
    </EffectComposer>
  );
}

export function VoiceScene3DContent() {
  return (
    <>
      <color attach="background" args={["#020304"]} />
      <fog attach="fog" args={["#020304", 7, 22]} />
      <VoiceCameraRig />
      <ambientLight intensity={0.22} />
      <directionalLight position={[5, 8, 4]} intensity={1.35} color="#8cffd2" />
      <directionalLight position={[-6, -3, -5]} intensity={0.65} color="#9cc7ff" />
      <pointLight position={[0, 0, 3]} intensity={2.2} color="#8cffd2" distance={12} />
      <spotLight position={[0, 6, 2]} angle={0.45} penumbra={0.8} intensity={1.8} color="#ffffff" />
      <Stars radius={80} depth={40} count={3200} factor={4} saturation={0} fade speed={0.45} />
      <Sparkles count={180} scale={[12, 7, 12]} size={3} speed={0.5} opacity={0.48} color="#8cffd2" />
      <SceneWorld>
        <Grid
          position={[0, -2.8, 0]}
          args={[40, 40]}
          cellSize={0.55}
          cellThickness={0.45}
          sectionSize={3.3}
          sectionThickness={1}
          fadeDistance={22}
          fadeStrength={1.4}
          cellColor="#8cffd2"
          sectionColor="#9cc7ff"
          infiniteGrid
        />
        <VoiceParticleHalo />
        <VoiceWireShell />
        <VoicePortalRings />
        <VoiceSpectrumRing />
        <VoiceOrbitalSatellites />
        <VoiceCoreOrb />
      </SceneWorld>
      <VoicePostFX />
    </>
  );
}
