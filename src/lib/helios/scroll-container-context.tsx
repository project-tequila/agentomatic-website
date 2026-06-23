"use client";

import { createContext, useContext, type RefObject } from "react";

const ScrollContainerContext = createContext<RefObject<HTMLElement | null> | null>(null);

export function ScrollContainerProvider({
  scrollRef,
  children,
}: {
  scrollRef: RefObject<HTMLElement | null>;
  children: React.ReactNode;
}) {
  return <ScrollContainerContext.Provider value={scrollRef}>{children}</ScrollContainerContext.Provider>;
}

export function useScrollContainer() {
  const ctx = useContext(ScrollContainerContext);
  if (!ctx) {
    throw new Error("useScrollContainer must be used within ScrollContainerProvider");
  }
  return ctx;
}
