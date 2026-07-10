"use client";

import { useSvgGroupMagnetic } from "@/lib/motion/use-svg-group-magnetic";
import type { MagneticConfig } from "@/lib/motion/magnetic";

type StoryFlowMagneticOptions = MagneticConfig & { disabled?: boolean };

/**
 * Subtle cursor attraction for orb↔satellite flow groups (dashed links + particles).
 * This intentionally reuses the same measured-local-space mapping as hub icon magnetic.
 */
export function useStoryFlowMagnetic(ids: readonly string[], options: StoryFlowMagneticOptions = {}) {
  const { strength = 0.22, maxDisplacement = 8, radiusFactor = 1.1, disabled } = options;
  return useSvgGroupMagnetic(ids, { strength, maxDisplacement, radiusFactor, disabled });
}

