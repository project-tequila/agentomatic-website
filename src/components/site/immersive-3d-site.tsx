"use client";

import { useRef, type ReactNode } from "react";

import { HeliosVoiceProvider } from "@/lib/helios/helios-provider";
import { ScrollContainerProvider } from "@/lib/helios/scroll-container-context";

import { StoryScrollResetListener } from "./story-scroll-reset-listener";
import { StoryIllustrationBackground } from "./story-illustration-background";

type Immersive3DSiteProps = {
  children: ReactNode;
};

function Immersive3DScroll({ children }: Immersive3DSiteProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="site-3d">
      <StoryIllustrationBackground />
      <ScrollContainerProvider scrollRef={scrollRef}>
        <StoryScrollResetListener />
        <div ref={scrollRef} className="site-3d__scroll">
          {children}
        </div>
      </ScrollContainerProvider>
    </div>
  );
}

export function Immersive3DSite({ children }: Immersive3DSiteProps) {
  return (
    <HeliosVoiceProvider>
      <Immersive3DScroll>{children}</Immersive3DScroll>
    </HeliosVoiceProvider>
  );
}
