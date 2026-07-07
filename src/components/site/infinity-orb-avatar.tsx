"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

type InfinityOrbAvatarProps = {
  className?: string;
};

/** Compact infinity (∞) glyph for harvey console header avatars. */
export function InfinityOrbAvatar({ className }: InfinityOrbAvatarProps) {
  const gradientId = useId();

  return (
    <svg
      className={cn("infinity-orb-avatar", className)}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#8cffd2" />
          <stop offset="45%" stopColor="#fafaf9" />
          <stop offset="100%" stopColor="#74c0fc" />
        </linearGradient>
      </defs>
      <path
        d="M 11.8 8 C 11.8 10.6 9.6 11.6 8 8 C 6.4 4.4 4.2 5.4 4.2 8 C 4.2 10.6 6.4 11.6 8 8 C 9.6 4.4 11.8 5.4 11.8 8 Z"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.35"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
