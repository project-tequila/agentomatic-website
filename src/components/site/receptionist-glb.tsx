"use client";

import { interpolate } from "@helios-project/core";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { SkeletonUtils } from "three-stdlib";
import type { AnimationAction, Group } from "three";

import { useHeliosVoice } from "@/lib/helios/helios-provider";
import { scenePhase, sitProgress, walkProgress } from "@/lib/helios/scene-timeline";
import type { VoiceHeliosState } from "@/lib/helios/types";

/** Swap this file in public/models/ — keep Idle + Walk clips for scroll animation. */
export const RECEPTIONIST_GLB = "/models/receptionist.glb";

const stateEnergy: Record<VoiceHeliosState, number> = {
  idle: 0.18,
  listening: 0.62,
  speaking: 1,
};

const WALK_START = { x: 3.4, z: -1.4 };
const WALK_END = { x: 0.05, z: -0.55 };
const DESK_SEAT = { x: 0, z: -0.35 };

function fadeTo(actions: Record<string, AnimationAction | null>, name: string, duration = 0.35) {
  const next = actions[name];
  if (!next) return;
  Object.values(actions).forEach((action) => {
    if (action && action !== next) action.fadeOut(duration);
  });
  next.reset().fadeIn(duration).play();
}

export function ReceptionistGlbCharacter() {
  const rootRef = useRef<Group>(null);
  const modelRef = useRef<Group>(null);
  const { scene, animations } = useGLTF(RECEPTIONIST_GLB);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions } = useAnimations(animations, modelRef);
  const { helios } = useHeliosVoice();
  const modeRef = useRef<"hidden" | "walk" | "idle">("hidden");

  useEffect(() => {
    useGLTF.preload(RECEPTIONIST_GLB);
  }, []);

  useFrame(({ clock }) => {
    const root = rootRef.current;
    const model = modelRef.current;
    if (!root || !model) return;

    const { inputProps } = helios.getState();
    const sceneProgress = inputProps.sceneProgress ?? 0;
    const walk = walkProgress(sceneProgress);
    const sit = sitProgress(sceneProgress);
    const phases = scenePhase(sceneProgress);
    const energy = Math.max(inputProps.energy, stateEnergy[inputProps.voiceState]);

    const enter = interpolate(sceneProgress, [0.14, 0.22], [0, 1], {
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
    root.rotation.y = interpolate(walk, [0, 1], [-Math.PI * 0.42, -Math.PI * 0.08], {
      extrapolateRight: "clamp",
    });

    const standY = 0;
    const seatY = -0.42;
    root.position.y = standY + (seatY - standY) * sit;

    const walkAction = actions.Walk;
    const idleAction = actions.Idle;

    if (phases.seated > 0.55 && modeRef.current !== "idle") {
      fadeTo(actions, "Idle", 0.45);
      modeRef.current = "idle";
    } else if (walk > 0.02 && walk < 0.995 && sit < 0.35 && modeRef.current !== "walk") {
      fadeTo(actions, "Walk", 0.2);
      modeRef.current = "walk";
    } else if (enter <= 0.01) {
      modeRef.current = "hidden";
    }

    if (walkAction && modeRef.current === "walk") {
      const clip = walkAction.getClip();
      if (!walkAction.isRunning()) walkAction.play();
      walkAction.paused = true;
      walkAction.time = walk * clip.duration;
    }

    if (idleAction && modeRef.current === "idle") {
      idleAction.timeScale = 0.85 + energy * 0.35;
      if (!idleAction.isRunning()) idleAction.play();
    }

    if (phases.seated > 0.5) {
      model.rotation.x = sit * 0.08;
      model.rotation.y = inputProps.pointerX * 0.25 * phases.seated;
    } else {
      model.rotation.x = 0;
      model.rotation.y = 0;
    }

    model.position.y = Math.sin(clock.elapsedTime * 1.2) * 0.01 * phases.seated;
  });

  return (
    <group ref={rootRef} visible={false}>
      <group ref={modelRef} scale={1.05}>
        <primitive object={clone} />
      </group>
    </group>
  );
}

useGLTF.preload(RECEPTIONIST_GLB);
