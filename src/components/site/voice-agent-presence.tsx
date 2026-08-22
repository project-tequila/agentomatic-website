"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { useDemoCall } from "@/lib/demo-call/demo-call-context";
import { heliosFromRealtimeVoice } from "@/lib/voice/demo-web-voice-errors";
import { useDemoWebVoice } from "@/lib/voice/demo-web-voice-context";

import { VoiceAgenticOrb, type VoiceAgenticOrbState } from "./voice-agentic-orb";

function mapVoiceState(status: string, isAgentSpeaking: boolean): VoiceAgenticOrbState {
  if (isAgentSpeaking) return "speaking";
  if (status === "connecting") return "connecting";
  if (status === "listening") return "listening";
  return "idle";
}

/**
 * Fixed, always-on orb while a live browser voice session is active.
 * Sits behind chrome and the demo strip so the agent feels present for the whole talk.
 */
export function VoiceAgentPresence() {
  const reduceMotion = useReducedMotion();
  const { isOpen } = useDemoCall();
  const { status, isAgentSpeaking } = useDemoWebVoice();

  const voiceActive =
    status === "connecting" || status === "listening" || isAgentSpeaking;
  const visible = voiceActive || (isOpen && status !== "error");

  const mapped = heliosFromRealtimeVoice({ status, isAgentSpeaking });
  const voiceState = mapVoiceState(status, isAgentSpeaking);
  const energy = visible ? Math.max(mapped.energy, isOpen && !voiceActive ? 0.32 : 0) : 0.18;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="voice-agent-presence"
          className="voice-agent-presence"
          data-voice-state={voiceState}
          data-voice-active={voiceActive ? "true" : "false"}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.45, ease: [0.22, 0.7, 0.18, 1] }}
        >
          <VoiceAgenticOrb
            voiceState={voiceState}
            energy={energy}
            reduceMotion={!!reduceMotion}
            size="min(22rem, 58vmin)"
            priority
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
