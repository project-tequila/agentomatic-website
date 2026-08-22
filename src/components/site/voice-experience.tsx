"use client";

import { interpolate } from "@helios-project/core";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Loader2, Mic, Pause, Phone, Square } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useCinemaScroll } from "@/lib/helios/use-cinema-scroll";
import { useHeliosVoice } from "@/lib/helios/helios-provider";
import { useVideoFrame } from "@/lib/helios/use-video-frame";
import { useBeginVoiceDemo } from "@/lib/demo-call/use-begin-voice-demo";
import { heliosFromRealtimeVoice } from "@/lib/voice/demo-web-voice-errors";
import { useDemoWebVoice } from "@/lib/voice/demo-web-voice-context";
import { cn } from "@/lib/utils";

const voiceCopy = {
  idle: { line: "Tap to greet" },
  connecting: { line: "Connecting" },
  listening: { line: "Listening" },
  speaking: { line: "Live" },
  error: { line: "Allow mic, or Call me" },
} as const;

const scrollBeats = [
  { until: 0.2, line: "Empty reception." },
  { until: 0.52, line: "She arrives." },
  { until: 0.78, line: "Takes her seat." },
  { until: 1, line: "Ready to help." },
] as const;

type OutboundUiState = "idle" | "loading" | "success" | "error";

function beatLine(scene: number) {
  return scrollBeats.find((b) => scene <= b.until)?.line ?? scrollBeats.at(-1)!.line;
}

export function VoiceExperience() {
  const cinemaRef = useRef<HTMLElement>(null);
  useCinemaScroll(cinemaRef);

  const [phone, setPhone] = useState("");
  const [outboundState, setOutboundState] = useState<OutboundUiState>("idle");
  const [outboundMessage, setOutboundMessage] = useState("");
  const reduceMotion = useReducedMotion();
  const { helios, setVoiceInput } = useHeliosVoice();
  const { currentFrame, fps, inputProps } = useVideoFrame(helios);
  const scene = inputProps.sceneProgress ?? 0;
  const { status, error, isAgentSpeaking, transcripts, stop } = useDemoWebVoice();
  const beginVoiceDemo = useBeginVoiceDemo();
  const heliosVoice = heliosFromRealtimeVoice({ status, isAgentSpeaking });
  const live = status === "connecting" || status === "listening";
  const hudKey = isAgentSpeaking ? "speaking" : status;
  const copy = voiceCopy[hudKey];
  const seated = scene >= 0.78;
  const beat = beatLine(scene);
  const titleOpacity = interpolate(scene, [0, 0.12, 0.28], [1, 1, 0], { extrapolateRight: "clamp" });
  const hudOpacity = interpolate(scene, [0.68, 0.82], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const recent = transcripts.slice(-4);

  useEffect(() => {
    setVoiceInput({ voiceState: heliosVoice.voiceState, energy: heliosVoice.energy });
  }, [setVoiceInput, heliosVoice.voiceState, heliosVoice.energy]);

  const hudFloat = interpolate(currentFrame % (fps * 4), [0, fps * 2, fps * 4], [0, live ? -5 : 0, 0]);

  async function onOutboundSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOutboundState("loading");
    setOutboundMessage("");
    try {
      const res = await fetch("/api/demo/outbound-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) {
        setOutboundState("error");
        setOutboundMessage(data.error || "Call failed.");
        return;
      }
      setOutboundState("success");
      setOutboundMessage(data.message || "Calling now.");
    } catch {
      setOutboundState("error");
      setOutboundMessage("Network error.");
    }
  }

  function onMic() {
    if (live) {
      stop();
      return;
    }
    beginVoiceDemo();
  }

  const MicIcon = status === "connecting" ? Loader2 : live ? Square : status === "error" ? Pause : Mic;

  return (
    <section ref={cinemaRef} className="site-3d__cinema" aria-label="Front desk story">
      <div className="site-3d__cinema-sticky">
        <button
          type="button"
          className={cn("site-3d__talk-chip", live && "site-3d__talk-chip--live")}
          data-testid="cinema-talk-chip"
          onClick={() => void onMic()}
          aria-pressed={live}
          aria-label={live ? "End talk" : "Talk now"}
        >
          <Mic className="size-3.5" strokeWidth={1.75} aria-hidden />
          {live ? "End" : "Talk"}
        </button>

        <motion.div
          className="site-3d__hero-title"
          style={{ opacity: reduceMotion ? 1 : titleOpacity }}
        >
          <span className="site-3d__hero-kicker">AI Receptionist</span>
          <h1 className="site-3d__hero-headline">
            Meet your
            <span className="site-3d__hero-accent"> front desk.</span>
          </h1>
        </motion.div>

        <div className="site-3d__cinema-beat" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p
              key={beat}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.22, 0.7, 0.18, 1] }}
              className="site-3d__cinema-line"
            >
              {beat}
            </motion.p>
          </AnimatePresence>
        </div>

        <motion.div
          id="experience-hud"
          className="site-3d__cinema-hud"
          style={{ opacity: reduceMotion ? (seated ? 1 : 0) : hudOpacity, pointerEvents: seated ? "auto" : "none" }}
        >
          <motion.div
            className="voice-hud site-3d__hud"
            style={{ transform: reduceMotion ? undefined : `translateY(${hudFloat}px)` }}
          >
            <p className="voice-hud__status mb-5" aria-live="polite">
              {error ?? copy.line}
            </p>

            <div className="relative">
              <div className={cn("voice-hud__orbit", live && "voice-hud__orbit--live")} aria-hidden />
              <div className={cn("voice-hud__orbit voice-hud__orbit--b", live && "voice-hud__orbit--live")} aria-hidden />
              <button
                type="button"
                onClick={() => void onMic()}
                className={cn("voice-hud__mic", live && "voice-hud__mic--live")}
                aria-pressed={live}
                aria-label={live ? "End talk" : "Talk"}
              >
                <span className="voice-hud__mic-glow" aria-hidden />
                <MicIcon
                  className={cn("relative z-10 size-9", status === "connecting" && "animate-spin")}
                  strokeWidth={1.5}
                />
              </button>
            </div>

            <div className="voice-hud__wave mt-10" aria-hidden>
              {Array.from({ length: 32 }, (_, i) => (
                <span
                  key={i}
                  className={cn(live && "voice-hud__wave-bar--live")}
                  style={{
                    animationDelay: `${i * 55}ms`,
                    height: live ? `${28 + (i % 5) * 14}%` : "18%",
                  }}
                />
              ))}
            </div>

            {recent.length > 0 ? (
              <ol className="voice-hud__transcript" aria-live="polite">
                {recent.map((line) => (
                  <li key={line.id}>
                    <span>{line.role === "assistant" ? "Desk" : "You"}</span> {line.text}
                  </li>
                ))}
              </ol>
            ) : null}
          </motion.div>

          <Link href="/vision" className="voice-hud__book">
            Book
          </Link>

          <form id="call-demo-cinema" onSubmit={onOutboundSubmit} className="voice-hud__call site-3d__call">
            <label className="sr-only" htmlFor="outbound-phone">
              Phone
            </label>
            <Phone className="size-4 shrink-0 text-[#8cffd2]/50" strokeWidth={1.5} aria-hidden />
            <input
              id="outbound-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+1 555 010 0000"
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
            />
            <button
              type="submit"
              disabled={outboundState === "loading" || !phone.trim()}
              className="voice-button shrink-0 rounded-full px-5 py-2.5 text-xs font-medium text-black disabled:opacity-40 sm:text-sm"
            >
              {outboundState === "loading" ? <Loader2 className="size-4 animate-spin" /> : "Call me"}
            </button>
            {outboundState === "success" || outboundState === "error" ? (
              <p
                className={cn(
                  "voice-hud__toast",
                  outboundState === "success" ? "text-[#8cffd2]" : "text-rose-300",
                )}
                role={outboundState === "error" ? "alert" : "status"}
              >
                {outboundMessage}
              </p>
            ) : null}
          </form>
        </motion.div>

        <p className="site-3d__scroll-cue">{scene < 0.15 ? "Scroll" : scene < 0.78 ? "Keep scrolling" : "↓ features"}</p>
      </div>
    </section>
  );
}
