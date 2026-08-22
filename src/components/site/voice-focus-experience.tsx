"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Loader2, Square, X } from "lucide-react";
import { useCallback, useEffect } from "react";

import { useDemoCall } from "@/lib/demo-call/demo-call-context";
import { heliosFromRealtimeVoice } from "@/lib/voice/demo-web-voice-errors";
import { useDemoWebVoice } from "@/lib/voice/demo-web-voice-context";
import { cn } from "@/lib/utils";

import { FrontdeskVoiceOrb } from "./frontdesk-voice-orb";

function orbIntensity(voiceActive: boolean, energy: number) {
  return Math.min(1, Math.max(0.45, energy * (voiceActive ? 0.85 : 0.65)));
}

function statusLine(
  status: string,
  isAgentSpeaking: boolean,
  error: string | null,
  focusOpen: boolean,
): string {
  if (error) return error;
  if (status === "connecting") return "Connecting…";
  if (isAgentSpeaking) return "Agent speaking — jump in anytime";
  if (status === "listening") return "Listening…";
  if (focusOpen && status === "idle") {
    return "Allow microphone when prompted, or tap Talk again";
  }
  return "Starting…";
}

/**
 * Full-screen voice focus: blurred backdrop, orb as hero, minimal controls.
 * Shown when the demo opens or a live session is active.
 */
export function VoiceFocusExperience() {
  const reduceMotion = useReducedMotion();
  const { isOpen, closeDemoCall } = useDemoCall();
  const { status, error, isAgentSpeaking, transcripts, stop } = useDemoWebVoice();

  const voiceActive =
    status === "connecting" || status === "listening" || isAgentSpeaking;
  const visible = isOpen || voiceActive;
  const recent = transcripts.slice(-4);

  const onEnd = useCallback(() => {
    stop();
    closeDemoCall();
  }, [stop, closeDemoCall]);

  useEffect(() => {
    document.body.classList.toggle("voice-focus-open", visible);
    return () => document.body.classList.remove("voice-focus-open");
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onEnd();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, onEnd]);

  const mapped = heliosFromRealtimeVoice({ status, isAgentSpeaking });
  const voiceState =
    isAgentSpeaking ? "speaking" : status === "connecting" ? "connecting" : status === "listening" ? "listening" : "idle";
  const line = statusLine(status, isAgentSpeaking, error, isOpen);
  const intensity = orbIntensity(voiceActive, mapped.energy);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="voice-focus"
          className="voice-focus"
          role="dialog"
          aria-modal="true"
          aria-label="Talk to the agent"
          data-voice-state={voiceState}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 0.7, 0.18, 1] }}
        >
          <div className="voice-focus__backdrop" aria-hidden />

          <button
            type="button"
            className="voice-focus__close"
            onClick={onEnd}
            aria-label="End talk and close"
          >
            <X className="size-4" strokeWidth={2} aria-hidden />
          </button>

          <div className="voice-focus__stage">
            <div className="voice-focus__orb" data-voice-state={voiceState} aria-hidden>
              <svg
                viewBox="260 120 200 200"
                className="voice-focus__orb-svg"
                fill="none"
                preserveAspectRatio="xMidYMid meet"
              >
                <FrontdeskVoiceOrb
                  cx={360}
                  cy={220}
                  intensity={intensity}
                  mode="cta"
                  idSuffix="focus"
                  reduceMotion={!!reduceMotion}
                />
              </svg>
            </div>

            <p className="voice-focus__status" aria-live="polite">
              {status === "connecting" ? (
                <Loader2 className="voice-focus__status-icon animate-spin" aria-hidden />
              ) : null}
              {line}
            </p>

            {recent.length > 0 ? (
              <ol className="voice-focus__transcript" aria-live="polite" aria-relevant="additions">
                {recent.map((entry) => (
                  <li
                    key={entry.id}
                    className={cn(
                      "voice-focus__line",
                      entry.role === "assistant" && "voice-focus__line--agent",
                    )}
                  >
                    <span className="voice-focus__who">{entry.role === "assistant" ? "Agent" : "You"}</span>
                    {entry.text}
                  </li>
                ))}
              </ol>
            ) : null}

            <button
              type="button"
              className={cn("voice-focus__end", voiceActive && "voice-focus__end--live")}
              onClick={onEnd}
              aria-label="End talk"
            >
              {status === "connecting" ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Square className="size-3.5" strokeWidth={2} aria-hidden />
              )}
              {voiceActive ? "End talk" : "Close"}
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
