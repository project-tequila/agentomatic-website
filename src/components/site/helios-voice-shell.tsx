"use client";

import type { ReactNode } from "react";

import { HeliosVoiceProvider } from "@/lib/helios/helios-provider";

type HeliosVoiceShellProps = {
  children: ReactNode;
};

export function HeliosVoiceShell({ children }: HeliosVoiceShellProps) {
  return (
    <HeliosVoiceProvider>
      <div className="voice-scene-content">{children}</div>
    </HeliosVoiceProvider>
  );
}
