"use client";

import { useEffect, useState } from "react";

import { storySpatialLayoutForWidth, type StorySpatialLayout } from "./story-layout";

const DEFAULT_WIDTH = 1200;

export function useStorySpatialLayout(): StorySpatialLayout {
  // Match SSR (DEFAULT_WIDTH) on first client render to avoid preserveAspectRatio hydration mismatch.
  const [layout, setLayout] = useState(() => storySpatialLayoutForWidth(DEFAULT_WIDTH));

  useEffect(() => {
    const sync = () => setLayout(storySpatialLayoutForWidth(window.innerWidth));
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  return layout;
}
