/**
 * Motion helpers adapted from VoiceOrbs (MIT, © 2026 Alexis Munoz).
 * https://github.com/amunozdev/voiceorbs
 */

export type WaveformOrbState =
  | "idle"
  | "connecting"
  | "listening"
  | "thinking"
  | "speaking"
  | "error"
  | "disabled";

export const ERROR_COLOR_FROM = "#fb7185";
export const ERROR_COLOR_TO = "#f43f5e";

export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const n = Number.parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function approach(current: number, target: number, rate: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-rate * dt));
}

export function stateEnergy(state: WaveformOrbState, t: number): number {
  switch (state) {
    case "listening":
      return 0.4 + 0.32 * Math.abs(Math.sin(t * 8.5)) + 0.18 * Math.abs(Math.sin(t * 4.1 + 1.5));
    case "speaking":
      return 0.3 + 0.24 * Math.abs(Math.sin(t * 6.2)) + 0.16 * Math.abs(Math.sin(t * 3 + 0.6));
    case "thinking":
      return 0.24 + 0.2 * Math.abs(Math.sin(t * 2.4));
    case "connecting":
      return 0.12 + 0.1 * Math.abs(Math.sin(t * 1.6));
    case "error":
      return 0.2;
    default:
      return 0;
  }
}

type StateWeights = Record<WaveformOrbState, number>;

export function createStateMix(initial: WaveformOrbState = "idle") {
  const weights: StateWeights = {
    idle: 0,
    connecting: 0,
    listening: 0,
    thinking: 0,
    speaking: 0,
    error: 0,
    disabled: 0,
  };
  weights[initial] = 1;
  const keys = Object.keys(weights) as WaveformOrbState[];

  return {
    weights,
    update(state: WaveformOrbState, dt: number, rate = 6): StateWeights {
      let total = 0;
      for (const key of keys) {
        const target = key === state ? 1 : 0;
        const next = approach(weights[key], target, rate, dt);
        weights[key] = target === 0 && next < 0.001 ? 0 : next;
        total += weights[key];
      }
      if (total > 0) {
        for (const key of keys) weights[key] /= total;
      }
      return weights;
    },
  };
}

export function observeActivity(el: Element, onChange: (active: boolean) => void): () => void {
  let inView = true;
  let pageVisible = document.visibilityState === "visible";
  let active = inView && pageVisible;

  const sync = () => {
    const next = inView && pageVisible;
    if (next === active) return;
    active = next;
    onChange(next);
  };

  const observer = new IntersectionObserver((entries) => {
    const entry = entries[entries.length - 1];
    const rect = el.getBoundingClientRect();
    const onScreen =
      rect.width > 1 &&
      rect.height > 1 &&
      rect.bottom > 0 &&
      rect.right > 0 &&
      rect.top < (window.innerHeight || 1) &&
      rect.left < (window.innerWidth || 1);
    // foreignObject hosts often report isIntersecting=false even when painted.
    inView = (entry?.isIntersecting ?? false) || onScreen;
    sync();
  });
  observer.observe(el);

  const onVisibility = () => {
    pageVisible = document.visibilityState === "visible";
    sync();
  };
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    observer.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
