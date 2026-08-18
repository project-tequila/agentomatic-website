"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { HeliosVoiceProvider, useHeliosVoice } from "@/lib/helios/helios-provider";
import { ScrollContainerProvider } from "@/lib/helios/scroll-container-context";
import { heliosFromRealtimeVoice } from "@/lib/voice/demo-web-voice-errors";
import { useDemoWebVoice } from "@/lib/voice/demo-web-voice-context";

import { ImmersiveOrbHitOverlay } from "./immersive-orb-hit-overlay";
import { StoryChapterNav } from "./story-chapter-nav";
import { StoryScrollResetListener } from "./story-scroll-reset-listener";
import { StoryIllustrationBackground } from "./story-illustration-background";

type Immersive3DSiteProps = {
  children: ReactNode;
};

/**
 * Drives Helios orb energy from the real demo voice hook, not a fake cycle.
 */
function HeliosDemoVoiceBridge() {
  const { setVoiceInput } = useHeliosVoice();
  const { status, isAgentSpeaking } = useDemoWebVoice();
  const mapped = heliosFromRealtimeVoice({ status, isAgentSpeaking });

  useEffect(() => {
    setVoiceInput({ voiceState: mapped.voiceState, energy: mapped.energy });
  }, [setVoiceInput, mapped.voiceState, mapped.energy]);

  return null;
}

function Immersive3DScroll({ children }: Immersive3DSiteProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="site-3d">
      <ScrollContainerProvider scrollRef={scrollRef}>
        <HeliosDemoVoiceBridge />
        <StoryIllustrationBackground />
        <ImmersiveOrbHitOverlay />
        <StoryChapterNav />
        <StoryScrollResetListener />
        <div
          ref={scrollRef}
          id="main-content"
          className="site-3d__scroll"
          role="region"
          aria-label="Frontdesk story"
          tabIndex={-1}
        >
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
