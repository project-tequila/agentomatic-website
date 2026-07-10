"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";

import {
  computeMagneticOffset,
  lerpMagnetic,
  resolveMagneticConfig,
  type MagneticConfig,
} from "./magnetic";

const COARSE_POINTER_QUERY = "(pointer: coarse)";

type Offset = { x: number; y: number };

type GroupState = {
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
};

const ZERO: Offset = { x: 0, y: 0 };

/** Convert a screen-space delta into the local user space of an SVG graphics element. */
function screenDeltaToLocal(el: SVGGraphicsElement, dx: number, dy: number): Offset {
  const ctm = el.getScreenCTM();
  if (!ctm) return { x: dx, y: dy };
  try {
    const inv = ctm.inverse();
    return {
      x: inv.a * dx + inv.c * dy,
      y: inv.b * dx + inv.d * dy,
    };
  } catch {
    return { x: dx, y: dy };
  }
}

/**
 * Pointer-attracted translate offsets for SVG hub icons.
 * Screen-space magnetic math (same as SiteMagneticEnhancer), mapped into the
 * measured element's local user space so nested translates stay layout-stable.
 */
export function useSvgGroupMagnetic(
  ids: readonly string[],
  options: MagneticConfig & { disabled?: boolean } = {},
) {
  const reduceMotion = usePrefersReducedMotion();
  const { disabled = false, strength, maxDisplacement, radiusFactor } = options;
  const configRef = useRef(resolveMagneticConfig({ strength, maxDisplacement, radiusFactor }));

  const idsRef = useRef(ids);

  const groupRefs = useRef(new Map<string, SVGGElement | null>());
  const statesRef = useRef(new Map<string, GroupState>());
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const rafRef = useRef(0);
  const coarseRef = useRef(false);
  const disabledRef = useRef(disabled);
  const reduceMotionRef = useRef(!!reduceMotion);

  const [offsets, setOffsets] = useState<Record<string, Offset>>(() =>
    Object.fromEntries(ids.map((id) => [id, ZERO])),
  );

  const setGroupRef = useCallback((id: string, node: SVGGElement | null) => {
    groupRefs.current.set(id, node);
    if (!statesRef.current.has(id)) {
      statesRef.current.set(id, { currentX: 0, currentY: 0, targetX: 0, targetY: 0 });
    }
  }, []);

  const stopLoop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, []);

  const tickRef = useRef<() => void>(() => {});

  const tick = useCallback(() => {
    const next: Record<string, Offset> = {};
    let settling = false;
    const inactive = disabledRef.current || reduceMotionRef.current || coarseRef.current;
    const config = configRef.current;

    for (const id of idsRef.current) {
      const el = groupRefs.current.get(id);
      let state = statesRef.current.get(id);
      if (!state) {
        state = { currentX: 0, currentY: 0, targetX: 0, targetY: 0 };
        statesRef.current.set(id, state);
      }

      if (!inactive && pointerRef.current.active && el) {
        const offset = computeMagneticOffset(
          el.getBoundingClientRect(),
          pointerRef.current.x,
          pointerRef.current.y,
          config,
        );
        const local = screenDeltaToLocal(el, offset.x, offset.y);
        state.targetX = local.x;
        state.targetY = local.y;
      } else {
        state.targetX = 0;
        state.targetY = 0;
      }

      state.currentX = lerpMagnetic(state.currentX, state.targetX);
      state.currentY = lerpMagnetic(state.currentY, state.targetY);
      next[id] = { x: state.currentX, y: state.currentY };

      if (
        Math.abs(state.currentX) > 0.01 ||
        Math.abs(state.currentY) > 0.01 ||
        Math.abs(state.targetX) > 0.01 ||
        Math.abs(state.targetY) > 0.01
      ) {
        settling = true;
      }
    }

    setOffsets(next);

    if (pointerRef.current.active || settling) {
      rafRef.current = requestAnimationFrame(() => tickRef.current());
    } else {
      rafRef.current = 0;
    }
  }, []);

  const startLoop = useCallback(() => {
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => tickRef.current());
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia(COARSE_POINTER_QUERY);
    coarseRef.current = media.matches;
    const onChange = () => {
      coarseRef.current = media.matches;
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    configRef.current = resolveMagneticConfig({ strength, maxDisplacement, radiusFactor });
  }, [strength, maxDisplacement, radiusFactor]);

  useEffect(() => {
    idsRef.current = ids;
  }, [ids]);

  useEffect(() => {
    disabledRef.current = disabled;
    reduceMotionRef.current = !!reduceMotion;
  }, [disabled, reduceMotion]);

  useEffect(() => {
    if (disabled || reduceMotion) return;

    const onPointerMove = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY, active: true };
      startLoop();
    };
    const onPointerLeave = () => {
      pointerRef.current.active = false;
      startLoop();
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      stopLoop();
    };
  }, [disabled, reduceMotion, startLoop, stopLoop]);

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  return { offsets, setGroupRef };
}
