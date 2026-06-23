"use client";

import { interpolate } from "@helios-project/core";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

import { useHeliosVoice } from "@/lib/helios/helios-provider";
import { scenePhase, sitProgress, walkProgress } from "@/lib/helios/scene-timeline";
import type { VoiceHeliosState } from "@/lib/helios/types";

const stateEnergy: Record<VoiceHeliosState, number> = {
  idle: 0.18,
  listening: 0.62,
  speaking: 1,
};

/** Entrance → desk approach → chair */
const WALK_START = { x: 3.6, z: 2.4 };
const WALK_END = { x: 0.15, z: -0.15 };
const DESK_SEAT = { x: 0.05, z: -0.52 };

const skin = "#c4a88a";
const hair = "#2a2018";
const blazer = "#243044";
const blouse = "#eef1f4";
const pants = "#1a2230";

export function ProfessionalReceptionist() {
  const rootRef = useRef<Group>(null);
  const bodyRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  const leftLegRef = useRef<Group>(null);
  const rightLegRef = useRef<Group>(null);
  const leftArmRef = useRef<Group>(null);
  const rightArmRef = useRef<Group>(null);
  const { helios } = useHeliosVoice();

  useFrame(({ clock }) => {
    const root = rootRef.current;
    const body = bodyRef.current;
    const head = headRef.current;
    const leftLeg = leftLegRef.current;
    const rightLeg = rightLegRef.current;
    const leftArm = leftArmRef.current;
    const rightArm = rightArmRef.current;
    if (!root || !body || !head || !leftLeg || !rightLeg || !leftArm || !rightArm) return;

    const { currentFrame, inputProps } = helios.getState();
    const scene = inputProps.sceneProgress ?? 0;
    const walk = walkProgress(scene);
    const sit = sitProgress(scene);
    const phases = scenePhase(scene);
    const energy = Math.max(inputProps.energy, stateEnergy[inputProps.voiceState]);

    const enter = interpolate(scene, [0.14, 0.22], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    root.visible = enter > 0.01;

    const wx = WALK_START.x + (WALK_END.x - WALK_START.x) * walk;
    const wz = WALK_START.z + (WALK_END.z - WALK_START.z) * walk;
    const sx = WALK_END.x + (DESK_SEAT.x - WALK_END.x) * sit;
    const sz = WALK_END.z + (DESK_SEAT.z - WALK_END.z) * sit;

    root.position.x = wx + (sx - wx) * sit;
    root.position.z = wz + (sz - wz) * sit;
    root.rotation.y = interpolate(walk, [0, 1], [Math.PI * 0.72, Math.PI * 0.02], {
      extrapolateRight: "clamp",
    });

    const walkBob = walk > 0.02 && sit < 0.4 ? Math.abs(Math.sin(currentFrame * 0.2)) * 0.035 : 0;
    const standY = 0;
    const seatY = -0.38;
    root.position.y = standY + (seatY - standY) * sit + walkBob;

    const stride = Math.sin(currentFrame * 0.22) * 0.65 * walk * (1 - sit);
    leftLeg.rotation.x = stride + sit * 1.25;
    rightLeg.rotation.x = -stride + sit * 1.15;
    leftLeg.position.y = -sit * 0.08;
    rightLeg.position.y = -sit * 0.08;

    body.position.y = Math.sin(clock.elapsedTime * 1.1) * 0.008 * phases.seated;
    body.rotation.x = sit * 0.06;

    head.rotation.y = inputProps.pointerX * 0.28 * phases.seated;
    head.rotation.x =
      -inputProps.pointerY * 0.12 * phases.seated +
      (inputProps.voiceState === "listening" ? 0.06 * phases.seated : 0);

    const wave =
      inputProps.voiceState === "speaking" && phases.seated > 0.5
        ? Math.sin(currentFrame * 0.16) * 0.25
        : 0;
    const deskPose = sit * 0.9 + phases.seated * 0.1;

    rightArm.rotation.x = interpolate(deskPose, [0, 1], [-0.4 - wave * energy, -1.15]);
    rightArm.rotation.z = interpolate(deskPose, [0, 1], [0.2, 0.05]);
    leftArm.rotation.x = interpolate(deskPose, [0, 1], [-0.5, -0.92]);
    leftArm.rotation.z = interpolate(deskPose, [0, 1], [-0.15, -0.04]);
  });

  return (
    <group ref={rootRef} visible={false}>
      <group ref={bodyRef}>
        {/* Torso / blazer */}
        <mesh position={[0, 0.92, 0]} castShadow>
          <capsuleGeometry args={[0.26, 0.52, 8, 16]} />
          <meshStandardMaterial color={blazer} roughness={0.72} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.98, 0.12]}>
          <boxGeometry args={[0.18, 0.32, 0.06]} />
          <meshStandardMaterial color={blouse} roughness={0.85} />
        </mesh>

        {/* Head + hair */}
        <group ref={headRef} position={[0, 1.38, 0.02]}>
          <mesh castShadow>
            <sphereGeometry args={[0.22, 24, 24]} />
            <meshStandardMaterial color={skin} roughness={0.68} />
          </mesh>
          <mesh position={[0, 0.1, -0.02]} castShadow>
            <sphereGeometry args={[0.225, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={hair} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.14, -0.08]} castShadow>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshStandardMaterial color={hair} roughness={0.9} />
          </mesh>
          <mesh position={[-0.07, 0.02, 0.18]}>
            <sphereGeometry args={[0.028, 8, 8]} />
            <meshStandardMaterial color="#2a2018" roughness={0.3} />
          </mesh>
          <mesh position={[0.07, 0.02, 0.18]}>
            <sphereGeometry args={[0.028, 8, 8]} />
            <meshStandardMaterial color="#2a2018" roughness={0.3} />
          </mesh>
        </group>

        {/* Arms */}
        <group ref={leftArmRef} position={[-0.32, 1.08, 0.02]}>
          <mesh position={[0, -0.2, 0]} rotation={[0, 0, 0.12]}>
            <capsuleGeometry args={[0.065, 0.32, 6, 10]} />
            <meshStandardMaterial color={blazer} roughness={0.72} />
          </mesh>
          <mesh position={[0.02, -0.42, 0.04]}>
            <sphereGeometry args={[0.06, 10, 10]} />
            <meshStandardMaterial color={skin} roughness={0.68} />
          </mesh>
        </group>
        <group ref={rightArmRef} position={[0.32, 1.08, 0.02]}>
          <mesh position={[0, -0.2, 0]} rotation={[0, 0, -0.12]}>
            <capsuleGeometry args={[0.065, 0.32, 6, 10]} />
            <meshStandardMaterial color={blazer} roughness={0.72} />
          </mesh>
          <mesh position={[-0.02, -0.42, 0.04]}>
            <sphereGeometry args={[0.06, 10, 10]} />
            <meshStandardMaterial color={skin} roughness={0.68} />
          </mesh>
        </group>

        {/* Legs */}
        <group ref={leftLegRef} position={[-0.12, 0.52, 0]}>
          <mesh position={[0, -0.24, 0]}>
            <capsuleGeometry args={[0.09, 0.42, 6, 10]} />
            <meshStandardMaterial color={pants} roughness={0.78} />
          </mesh>
        </group>
        <group ref={rightLegRef} position={[0.12, 0.52, 0]}>
          <mesh position={[0, -0.24, 0]}>
            <capsuleGeometry args={[0.09, 0.42, 6, 10]} />
            <meshStandardMaterial color={pants} roughness={0.78} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
