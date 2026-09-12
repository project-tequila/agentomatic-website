"use client";

/**
 * Waveform Ring canvas renderer adapted from VoiceOrbs (MIT, © 2026 Alexis Munoz).
 * https://voiceorbs.vercel.app/orbs/waveform-ring
 *
 * Live mic capture is not used here — amplitude comes from `levelRef` (or procedural
 * motion when the value is negative / omitted) so the site keeps its existing audio path.
 */

import { useCallback, useEffect, useRef, type CSSProperties, type RefObject } from "react";

import {
  ERROR_COLOR_FROM,
  ERROR_COLOR_TO,
  approach,
  createStateMix,
  hexToRgb,
  observeActivity,
  stateEnergy,
  type WaveformOrbState,
} from "./waveform-ring-math";

const TWO_PI = Math.PI * 2;
const SEGMENTS = 160;
const EMPTY = new Uint8Array(0);

type Rgb = [number, number, number];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const mixRgb = (a: Rgb, b: Rgb, t: number): Rgb => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

const rgba = (c: Rgb, a: number) =>
  `rgba(${Math.round(c[0])}, ${Math.round(c[1])}, ${Math.round(c[2])}, ${clamp01(a).toFixed(3)})`;

const jag = (u: number, t: number) =>
  Math.sign(Math.sin(TWO_PI * 19 * u + t * 1.9)) *
  (0.5 + 0.5 * Math.abs(Math.sin(TWO_PI * 7 * u - t * 2.4)));

type WaveformRingProps = {
  state?: WaveformOrbState;
  size?: number;
  speed?: number;
  colorFrom?: string;
  colorTo?: string;
  levelRef?: RefObject<number>;
  reduceMotion?: boolean;
};

export function WaveformRing({
  state = "idle",
  size = 208,
  speed = 1,
  colorFrom = "#8cffd2",
  colorTo = "#74c0fc",
  levelRef,
  reduceMotion = false,
}: WaveformRingProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(state);
  const speedRef = useRef(speed);
  const colorRef = useRef({ from: colorFrom, to: colorTo });
  const reduceRef = useRef(reduceMotion);
  const levelValueRef = useRef(levelRef);
  const smoothedRef = useRef(0);
  const clockRef = useRef(0);

  stateRef.current = state;
  speedRef.current = speed;
  colorRef.current = { from: colorFrom, to: colorTo };
  reduceRef.current = reduceMotion;
  levelValueRef.current = levelRef;

  const setHostRef = useCallback((node: HTMLDivElement | null) => {
    hostRef.current = node;
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = size / 2;
    const R = size * 0.355;
    const errFrom = hexToRgb(ERROR_COLOR_FROM);
    const errTo = hexToRgb(ERROR_COLOR_TO);
    const errMid = mixRgb(errFrom, errTo, 0.5);

    let paletteKey = "";
    let from: Rgb = [255, 255, 255];
    let to: Rgb = [255, 255, 255];
    let mid: Rgb = [255, 255, 255];
    let coreG: CanvasGradient | null = null;
    let errCoreG: CanvasGradient | null = null;

    const makeCore = (col: Rgb) => {
      const g = ctx.createRadialGradient(cx, cx, 0, cx, cx, R);
      g.addColorStop(0, rgba(col, 0.3));
      g.addColorStop(0.68, rgba(col, 0.1));
      g.addColorStop(1, rgba(col, 0));
      return g;
    };

    const ensurePalette = () => {
      const key = `${colorRef.current.from}|${colorRef.current.to}`;
      if (key === paletteKey) return;
      paletteKey = key;
      from = hexToRgb(colorRef.current.from);
      to = hexToRgb(colorRef.current.to);
      mid = mixRgb(from, to, 0.5);
      coreG = makeCore(mid);
      errCoreG = makeCore(errMid);
    };

    const stateMix = createStateMix(stateRef.current);
    const xs = new Float32Array(SEGMENTS + 1);
    const ys = new Float32Array(SEGMENTS + 1);
    const alphas = new Float32Array(SEGMENTS + 1);

    let t = 0;
    let raf = 0;
    let last: number | null = null;
    let rot = 0;
    let levelS = 0;
    let running = false;
    let inView = true;

    const writeLevel = (dt: number, st: WaveformOrbState) => {
      clockRef.current += dt;
      const live = levelValueRef.current?.current;
      const hasLive = typeof live === "number" && live >= 0;
      const target = hasLive ? live : stateEnergy(st, clockRef.current);
      smoothedRef.current = approach(smoothedRef.current, target, 7.7, dt);
      host.style.setProperty("--orb-level", clamp01(smoothedRef.current).toFixed(3));
    };

    const render = (dt: number, isStatic = false) => {
      ensurePalette();
      const st = stateRef.current;
      const spd = speedRef.current;
      const easeDt = isStatic ? 60 : dt;
      writeLevel(easeDt, st);
      const w = stateMix.update(st, easeDt);
      const rawLevel = clamp01(Number.parseFloat(getComputedStyle(host).getPropertyValue("--orb-level")) || 0);
      const target = isStatic ? stateEnergy(st, 1.7) : rawLevel;
      levelS = approach(levelS, target, 8, easeDt);
      const level = clamp01(levelS);
      rot += dt * 2.8 * spd;

      const data = EMPTY;
      const hasWave = false;
      const overrideW = clamp01(w.error + w.disabled);

      const amp =
        w.idle * 0.03 +
        w.connecting * 0.045 +
        w.listening * (0.1 + level * 0.1) +
        w.thinking * 0.05 +
        w.speaking * (0.13 + level * 0.13) +
        w.error * 0.11 +
        w.disabled * 0.008;
      const breathe = 1 + w.idle * 0.02 * Math.sin(t * 1.1 * spd) + level * 0.02;
      const contract = 1 - w.thinking * (0.05 + 0.05 * Math.sin(t * 2.6 * spd));
      const baseR = R * breathe * contract;

      for (let i = 0; i <= SEGMENTS; i += 1) {
        const u = i / SEGMENTS;
        const theta = u * TWO_PI - Math.PI / 2;
        const proc =
          w.idle * Math.sin(TWO_PI * 2 * u + t * 0.9 * spd) +
          w.connecting * Math.sin(TWO_PI * 3 * u - t * 2.2 * spd) +
          w.listening *
            (0.62 * Math.sin(TWO_PI * 6 * u + t * 7.2 * spd) +
              0.38 * Math.sin(TWO_PI * 11 * u - t * 9.6 * spd)) +
          w.thinking * Math.sin(TWO_PI * 3 * u + t * 2.1 * spd) +
          w.speaking *
            (0.5 * Math.sin(TWO_PI * 4 * u + t * 5.3 * spd) +
              0.32 * Math.sin(TWO_PI * 9 * u + t * 8.9 * spd) +
              0.26 * Math.sin(TWO_PI * 15 * u - t * 6.4 * spd)) +
          w.error * jag(u, t);
        const shape = hasWave ? proc * overrideW : proc;
        const r = baseR + shape * amp * R;
        xs[i] = cx + Math.cos(theta) * r;
        ys[i] = cx + Math.sin(theta) * r;
        const dash = 0.5 + 0.5 * Math.tanh(Math.sin(theta * 7 - rot) * 5);
        alphas[i] = 1 - w.connecting * (1 - dash);
      }

      ctx.clearRect(0, 0, size, size);

      const alphaMul = 1 - 0.45 * w.disabled;
      const coreA = (0.5 + level * 0.5) * alphaMul;
      if (coreG && w.error < 0.996) {
        ctx.globalAlpha = coreA * (1 - w.error);
        ctx.fillStyle = coreG;
        ctx.fillRect(0, 0, size, size);
      }
      if (errCoreG && w.error > 0.004) {
        ctx.globalAlpha = coreA * w.error;
        ctx.fillStyle = errCoreG;
        ctx.fillRect(0, 0, size, size);
      }
      ctx.globalAlpha = 1;

      if (w.thinking > 0.004) {
        const echoCol = mixRgb(mid, errMid, w.error);
        for (let k = 0; k < 2; k += 1) {
          const phase = isStatic ? 0.3 + k * 0.45 : (((t * 0.45 * spd + k * 0.5) % 1) + 1) % 1;
          const er = R * (1.02 - phase * 0.72);
          const ea = w.thinking * phase * (1 - phase) * 1.6 * alphaMul;
          if (ea <= 0.004) continue;
          ctx.strokeStyle = rgba(echoCol, ea);
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(cx, cx, er, 0, TWO_PI);
          ctx.stroke();
        }
      }

      const colAt = (u: number): Rgb => {
        const g = u < 0.5 ? u * 2 : (1 - u) * 2;
        const base = mixRgb(from, to, g);
        return w.error > 0.004 ? mixRgb(base, mixRgb(errFrom, errTo, g), w.error) : base;
      };

      ctx.lineCap = "round";
      const passes: Array<[number, number, GlobalCompositeOperation]> = [
        [5.5 + level * 6, 0.16, "lighter"],
        [Math.max(0.7, 1.7 + level * 1.5 - w.disabled * 0.8), 0.92, "source-over"],
      ];
      for (const [lw, pa, comp] of passes) {
        ctx.globalCompositeOperation = comp;
        ctx.lineWidth = lw;
        for (let i = 0; i < SEGMENTS; i += 1) {
          const a = pa * alphas[i] * alphaMul;
          if (a <= 0.004) continue;
          ctx.strokeStyle = rgba(colAt((i + 0.5) / SEGMENTS), a);
          ctx.beginPath();
          ctx.moveTo(xs[i], ys[i]);
          ctx.lineTo(xs[i + 1], ys[i + 1]);
          ctx.stroke();
        }
      }
      ctx.globalCompositeOperation = "source-over";
      void data;
    };

    const frame = (now: number) => {
      if (last === null) last = now;
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      t += dt;
      render(dt);
      raf = requestAnimationFrame(frame);
    };

    const renderStatic = () => {
      if (t === 0) t = 4.2;
      render(0, true);
    };

    const startLoop = () => {
      if (running) return;
      running = true;
      last = null;
      raf = requestAnimationFrame(frame);
    };

    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (mq.matches || reduceRef.current) {
        stopLoop();
        renderStatic();
      } else if (inView) {
        startLoop();
      } else {
        stopLoop();
      }
    };
    const unobserve = observeActivity(host, (next) => {
      inView = next;
      sync();
    });
    mq.addEventListener("change", sync);
    renderStatic();
    sync();

    return () => {
      stopLoop();
      mq.removeEventListener("change", sync);
      unobserve();
    };
  }, [size]);

  const style: CSSProperties = {
    width: size,
    height: size,
    display: "grid",
    placeItems: "center",
    pointerEvents: "none",
  };

  return (
    <div ref={setHostRef} className="waveform-ring" style={style} aria-hidden>
      <canvas ref={canvasRef} width={size} height={size} style={{ width: size, height: size, display: "block" }} />
    </div>
  );
}
