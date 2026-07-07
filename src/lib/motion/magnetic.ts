export type MagneticConfig = {
  /** Pull strength toward the cursor (0–1). */
  strength?: number;
  /** Maximum displacement in pixels. */
  maxDisplacement?: number;
  /** Activation radius as a fraction of the element diagonal. */
  radiusFactor?: number;
};

export const DEFAULT_MAGNETIC_CONFIG: Required<MagneticConfig> = {
  strength: 0.38,
  maxDisplacement: 12,
  radiusFactor: 0.92,
};

export const ORB_MAGNETIC_CONFIG: Required<MagneticConfig> = {
  strength: 0.42,
  maxDisplacement: 16,
  radiusFactor: 1.05,
};

export type MagneticOffset = {
  x: number;
  y: number;
};

export function resolveMagneticConfig(config?: MagneticConfig): Required<MagneticConfig> {
  return {
    strength: config?.strength ?? DEFAULT_MAGNETIC_CONFIG.strength,
    maxDisplacement: config?.maxDisplacement ?? DEFAULT_MAGNETIC_CONFIG.maxDisplacement,
    radiusFactor: config?.radiusFactor ?? DEFAULT_MAGNETIC_CONFIG.radiusFactor,
  };
}

/** Compute capped translate offset toward the pointer. */
export function computeMagneticOffset(
  rect: DOMRect,
  pointerX: number,
  pointerY: number,
  config?: MagneticConfig,
): MagneticOffset {
  const { strength, maxDisplacement, radiusFactor } = resolveMagneticConfig(config);

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dx = pointerX - centerX;
  const dy = pointerY - centerY;
  const distance = Math.hypot(dx, dy);
  const radius = Math.hypot(rect.width, rect.height) * radiusFactor;

  if (radius <= 0 || distance > radius) {
    return { x: 0, y: 0 };
  }

  const pull = 1 - distance / radius;
  const factor = pull * pull * strength;
  const x = clamp(dx * factor, -maxDisplacement, maxDisplacement);
  const y = clamp(dy * factor, -maxDisplacement, maxDisplacement);

  return { x, y };
}

export function lerpMagnetic(current: number, target: number, amount = 0.18): number {
  const next = current + (target - current) * amount;
  if (Math.abs(target) < 0.01 && Math.abs(next) < 0.04) return 0;
  return next;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
