"use client";

import { useEffect } from "react";

import {
  computeMagneticOffset,
  lerpMagnetic,
  ORB_MAGNETIC_CONFIG,
  resolveMagneticConfig,
  type MagneticConfig,
} from "@/lib/motion/magnetic";
import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";

const MAGNETIC_SELECTOR = [
  'button:not([disabled]):not([data-magnetic="off"])',
  'a.site-btn:not([data-magnetic="off"])',
  'a.harvey-btn:not([data-magnetic="off"])',
  ".site-chrome-action-btn:not([data-magnetic='off'])",
  ".site-chrome-menu-btn:not([data-magnetic='off'])",
  ".site-orb-hit:not([data-magnetic='off'])",
  ".story-illustration-bg__persistent-orb-pin:not([data-magnetic='off'])",
  ".demo-call-panel__close:not([data-magnetic='off'])",
  ".call-panel-surface__phone-btn:not([data-magnetic='off'])",
  ".site-nav-drawer-link:not([data-magnetic='off'])",
  ".site-chrome-nav-link:not([data-magnetic='off'])",
].join(",");

type SurfaceMode = "inner" | "surface" | "orb-pin";

type Entry = {
  el: HTMLElement;
  mode: SurfaceMode;
  config: Required<MagneticConfig>;
  hoverLiftY: number;
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
};

const LERP = 0.18;
const COARSE_POINTER_QUERY = "(pointer: coarse)";
const ENHANCED_ATTR = "data-magnetic-enhanced";

function surfaceModeFor(el: HTMLElement): SurfaceMode {
  if (el.classList.contains("story-illustration-bg__persistent-orb-pin")) return "orb-pin";
  if (el.classList.contains("site-orb-hit")) return "surface";
  return "inner";
}

function configFor(el: HTMLElement): Required<MagneticConfig> {
  if (
    el.classList.contains("site-orb-hit") ||
    el.classList.contains("story-illustration-bg__persistent-orb-pin")
  ) {
    return resolveMagneticConfig(ORB_MAGNETIC_CONFIG);
  }
  return resolveMagneticConfig();
}

function hoverLiftFor(el: HTMLElement): number {
  if (el.classList.contains("site-orb-hit--floating")) return -2;
  return 0;
}

function ensureInnerWrapper(el: HTMLElement) {
  if (el.querySelector(":scope > .magnetic-inner")) return;
  const inner = document.createElement("span");
  inner.className = "magnetic-inner";
  while (el.firstChild) {
    inner.appendChild(el.firstChild);
  }
  el.appendChild(inner);
}

function applyTransform(entry: Entry) {
  const { el, mode, currentX, currentY, hoverLiftY } = entry;
  const lift = el.matches(":hover") ? hoverLiftY : 0;

  if (mode === "orb-pin") {
    el.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;
    return;
  }

  if (mode === "surface") {
    el.style.transform = `translate(${currentX}px, ${currentY + lift}px)`;
    return;
  }

  const inner = el.querySelector<HTMLElement>(":scope > .magnetic-inner");
  if (inner) {
    inner.style.transform = `translate(${currentX}px, ${currentY}px)`;
  }
}

function resetTransform(entry: Entry) {
  entry.currentX = 0;
  entry.currentY = 0;
  entry.targetX = 0;
  entry.targetY = 0;

  if (entry.mode === "orb-pin") {
    entry.el.style.transform = "translate(-50%, -50%)";
    return;
  }

  if (entry.mode === "surface") {
    entry.el.style.transform = "";
    return;
  }

  const inner = entry.el.querySelector<HTMLElement>(":scope > .magnetic-inner");
  if (inner) inner.style.transform = "";
}

/** Site-wide magnetic pointer attraction for buttons, nav links, and the orb. */
export function SiteMagneticEnhancer() {
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion) return undefined;

    const coarse = window.matchMedia(COARSE_POINTER_QUERY);
    if (coarse.matches) return undefined;

    const entries = new Map<HTMLElement, Entry>();
    let pointerX = 0;
    let pointerY = 0;
    let pointerActive = false;
    let rafId = 0;

    function enhanceElement(el: HTMLElement) {
      if (el.getAttribute(ENHANCED_ATTR) === "true") return;
      if (!el.matches(MAGNETIC_SELECTOR)) return;

      const mode = surfaceModeFor(el);
      if (mode === "inner") ensureInnerWrapper(el);

      el.setAttribute(ENHANCED_ATTR, "true");
      entries.set(el, {
        el,
        mode,
        config: configFor(el),
        hoverLiftY: hoverLiftFor(el),
        currentX: 0,
        currentY: 0,
        targetX: 0,
        targetY: 0,
      });
    }

    function scan(root: ParentNode = document) {
      root.querySelectorAll<HTMLElement>(MAGNETIC_SELECTOR).forEach(enhanceElement);
    }

    function removeEntry(el: HTMLElement) {
      const entry = entries.get(el);
      if (!entry) return;
      resetTransform(entry);
      entries.delete(el);
    }

    function tick() {
      let needsNext = false;

      for (const entry of entries.values()) {
        if (!entry.el.isConnected) {
          entries.delete(entry.el);
          continue;
        }

        if (pointerActive) {
          const offset = computeMagneticOffset(
            entry.el.getBoundingClientRect(),
            pointerX,
            pointerY,
            entry.config,
          );
          entry.targetX = offset.x;
          entry.targetY = offset.y;
        } else {
          entry.targetX = 0;
          entry.targetY = 0;
        }

        entry.currentX = lerpMagnetic(entry.currentX, entry.targetX, LERP);
        entry.currentY = lerpMagnetic(entry.currentY, entry.targetY, LERP);
        applyTransform(entry);

        if (
          pointerActive ||
          Math.abs(entry.currentX) > 0.01 ||
          Math.abs(entry.currentY) > 0.01 ||
          Math.abs(entry.targetX) > 0.01 ||
          Math.abs(entry.targetY) > 0.01
        ) {
          needsNext = true;
        }
      }

      rafId = needsNext ? requestAnimationFrame(tick) : 0;
    }

    function startLoop() {
      if (!rafId) rafId = requestAnimationFrame(tick);
    }

    function onPointerMove(event: PointerEvent) {
      pointerX = event.clientX;
      pointerY = event.clientY;
      pointerActive = true;
      startLoop();
    }

    function onPointerOut(event: PointerEvent) {
      if (event.relatedTarget === null) {
        pointerActive = false;
        startLoop();
      }
    }

    function onCoarseChange() {
      if (coarse.matches) {
        for (const entry of entries.values()) removeEntry(entry.el);
        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerout", onPointerOut);
        if (rafId) cancelAnimationFrame(rafId);
      }
    }

    scan();
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerout", onPointerOut);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            enhanceElement(node);
            scan(node);
          }
        });
        mutation.removedNodes.forEach((node) => {
          if (node instanceof HTMLElement) removeEntry(node);
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    coarse.addEventListener("change", onCoarseChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerOut);
      coarse.removeEventListener("change", onCoarseChange);
      if (rafId) cancelAnimationFrame(rafId);
      for (const entry of entries.values()) {
        entry.el.removeAttribute(ENHANCED_ATTR);
        resetTransform(entry);
      }
      entries.clear();
    };
  }, [reduceMotion]);

  return null;
}
