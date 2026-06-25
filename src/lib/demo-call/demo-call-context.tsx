"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { DEMO_CALL_OPEN_EVENT } from "./open-demo-call";

type DemoCallContextValue = {
  isOpen: boolean;
  scrollReveal: number;
  openDemoCall: () => void;
  closeDemoCall: () => void;
  setScrollReveal: (value: number) => void;
};

const DemoCallContext = createContext<DemoCallContextValue | null>(null);

export function DemoCallProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollReveal, setScrollReveal] = useState(0);

  const openDemoCall = useCallback(() => setIsOpen(true), []);
  const closeDemoCall = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const onOpen = () => openDemoCall();
    window.addEventListener(DEMO_CALL_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(DEMO_CALL_OPEN_EVENT, onOpen);
  }, [openDemoCall]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDemoCall();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, closeDemoCall]);

  useEffect(() => {
    document.body.classList.toggle("demo-call-strip-open", isOpen);
    return () => document.body.classList.remove("demo-call-strip-open");
  }, [isOpen]);

  const value = useMemo(
    () => ({ isOpen, scrollReveal, openDemoCall, closeDemoCall, setScrollReveal }),
    [isOpen, scrollReveal, openDemoCall, closeDemoCall],
  );

  return <DemoCallContext.Provider value={value}>{children}</DemoCallContext.Provider>;
}

export function useDemoCall() {
  const ctx = useContext(DemoCallContext);
  if (!ctx) {
    throw new Error("useDemoCall must be used within DemoCallProvider");
  }
  return ctx;
}
