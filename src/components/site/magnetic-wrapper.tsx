"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

import type { MagneticConfig } from "@/lib/motion/magnetic";
import { useMagneticEffect } from "@/lib/motion/use-magnetic-effect";
import { cn } from "@/lib/utils";

type MagneticWrapperProps = HTMLAttributes<HTMLDivElement> &
  MagneticConfig & {
    surface?: "inner" | "surface" | "orb-pin";
    hoverLiftY?: number;
    disabled?: boolean;
    children?: ReactNode;
  };

/** Explicit magnetic wrapper when auto-enhancement is not enough (e.g. custom components). */
export const MagneticWrapper = forwardRef<HTMLDivElement, MagneticWrapperProps>(function MagneticWrapper(
  {
    className,
    surface = "inner",
    hoverLiftY,
    disabled,
    strength,
    maxDisplacement,
    radiusFactor,
    children,
    ...rest
  },
  forwardedRef,
) {
  const { ref: magneticRef, style } = useMagneticEffect<HTMLDivElement>({
    surface,
    hoverLiftY,
    disabled,
    strength,
    maxDisplacement,
    radiusFactor,
  });

  function setRef(node: HTMLDivElement | null) {
    magneticRef(node);
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  }

  return (
    <div ref={setRef} className={cn(className)} style={style} {...rest}>
      {children}
    </div>
  );
});
