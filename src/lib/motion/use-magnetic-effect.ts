"use client";

import { useCallback, useEffect, useRef, type CSSProperties, type RefCallback } from "react";

import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";

import {
  computeMagneticOffset,
  lerpMagnetic,
  resolveMagneticConfig,
  type MagneticConfig,
} from "./magnetic";

type MagneticSurface = "inner" | "surface" | "orb-pin";

type UseMagneticEffectOptions = MagneticConfig & {
  disabled?: boolean;
  surface?: MagneticSurface;
  /** Extra Y lift when hovered (floating orb). */
  hoverLiftY?: number;
};

type MagneticState = {
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
};

const COARSE_POINTER_QUERY = "(pointer: coarse)";

function subscribeCoarsePointer(onChange: () => void) {
  const media = window.matchMedia(COARSE_POINTER_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getCoarsePointerSnapshot() {
  return window.matchMedia(COARSE_POINTER_QUERY).matches;
}

function applySurfaceTransform(
  el: HTMLElement,
  x: number,
  y: number,
  surface: MagneticSurface,
  hoverLiftY: number,
) {
  const lift = el.matches(":hover") ? hoverLiftY : 0;

  if (surface === "orb-pin") {
    el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    return;
  }

  if (surface === "surface") {
    el.style.transform = `translate(${x}px, ${y}px)`;
    return;
  }

  const inner = el.querySelector<HTMLElement>(":scope > .magnetic-inner");
  if (inner) {
    inner.style.transform = `translate(${x}px, ${y + lift}px)`;
  }
}

function ensureInnerWrapper(el: HTMLElement): HTMLElement {
  const existing = el.querySelector<HTMLElement>(":scope > .magnetic-inner");
  if (existing) return existing;

  const inner = document.createElement("span");
  inner.className = "magnetic-inner";
  inner.setAttribute("aria-hidden", "true");

  while (el.firstChild) {
    inner.appendChild(el.firstChild);
  }
  el.appendChild(inner);
  return inner;
}

/** Attach magnetic pointer attraction to a single interactive element. */
export function useMagneticEffect<T extends HTMLElement = HTMLElement>(
  options: UseMagneticEffectOptions = {},
) {
  const reduceMotion = usePrefersReducedMotion();
  const coarsePointer = useRef(false);
  const elRef = useRef<T | null>(null);
  const stateRef = useRef<MagneticState>({ currentX: 0, currentY: 0, targetX: 0, targetY: 0 });
  const rafRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const configRef = useRef(resolveMagneticConfig(options));

  const {
    disabled = false,
    surface = "inner",
    hoverLiftY = 0,
    strength,
    maxDisplacement,
    radiusFactor,
  } = options;
  useEffect(() => {
    configRef.current = resolveMagneticConfig({ strength, maxDisplacement, radiusFactor });
  }, [strength, maxDisplacement, radiusFactor]);

  useEffect(() => {
    coarsePointer.current = getCoarsePointerSnapshot();
    return subscribeCoarsePointer(() => {
      coarsePointer.current = getCoarsePointerSnapshot();
    });
  }, []);

  const stopLoop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, []);

  const tickRef = useRef<() => void>(() => {});

  const tick = useCallback(() => {
    const el = elRef.current;
    if (!el) {
      stopLoop();
      return;
    }

    const state = stateRef.current;
    const { x: targetX, y: targetY } =
      pointerRef.current.active && !disabled && !reduceMotion && !coarsePointer.current
        ? computeMagneticOffset(
            el.getBoundingClientRect(),
            pointerRef.current.x,
            pointerRef.current.y,
            configRef.current,
          )
        : { x: 0, y: 0 };

    state.targetX = targetX;
    state.targetY = targetY;
    state.currentX = lerpMagnetic(state.currentX, state.targetX);
    state.currentY = lerpMagnetic(state.currentY, state.targetY);

    applySurfaceTransform(el, state.currentX, state.currentY, surface, hoverLiftY);

    const settling =
      Math.abs(state.currentX) > 0.01 ||
      Math.abs(state.currentY) > 0.01 ||
      Math.abs(state.targetX) > 0.01 ||
      Math.abs(state.targetY) > 0.01;

    if (pointerRef.current.active || settling) {
      rafRef.current = requestAnimationFrame(() => tickRef.current());
    } else {
      rafRef.current = 0;
    }
  }, [disabled, hoverLiftY, reduceMotion, stopLoop, surface]);

  const startLoop = useCallback(() => {
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => tickRef.current());
    }
  }, [tick]);

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY, active: true };
      startLoop();
    },
    [startLoop],
  );

  const onPointerLeave = useCallback(() => {
    pointerRef.current.active = false;
    startLoop();
  }, [startLoop]);

  const ref: RefCallback<T> = useCallback(
    (node) => {
      const prev = elRef.current;
      if (prev) {
        document.removeEventListener("pointermove", onPointerMove);
        prev.removeEventListener("pointerleave", onPointerLeave);
        stopLoop();
      }

      elRef.current = node;

      if (!node || disabled || reduceMotion) return;

      if (surface === "inner") {
        ensureInnerWrapper(node);
      }

      document.addEventListener("pointermove", onPointerMove, { passive: true });
      node.addEventListener("pointerleave", onPointerLeave);
    },
    [disabled, onPointerLeave, onPointerMove, reduceMotion, stopLoop, surface],
  );

  useEffect(() => () => {
    document.removeEventListener("pointermove", onPointerMove);
    elRef.current?.removeEventListener("pointerleave", onPointerLeave);
    stopLoop();
  }, [onPointerLeave, onPointerMove, stopLoop]);

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  const style: CSSProperties | undefined =
    surface === "surface" || surface === "orb-pin" ? { willChange: "transform" } : undefined;

  return { ref, style };
}
