"use client";

import { useEffect, useState } from "react";

import { storySpatialLayoutForWidth, type StorySpatialLayout } from "./story-layout";

const DEFAULT_WIDTH = 1200;

export function useStorySpatialLayout(): StorySpatialLayout {
  const [layout, setLayout] = useState(() =>
    storySpatialLayoutForWidth(typeof window !== "undefined" ? window.innerWidth : DEFAULT_WIDTH),
  );

  useEffect(() => {
    const sync = () => setLayout(storySpatialLayoutForWidth(window.innerWidth));
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  return layout;
}
