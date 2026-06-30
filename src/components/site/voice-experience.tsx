"use client";

import { interpolate } from "@helios-project/core";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Loader2, Mic, Pause, Phone, Volume2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { useCinemaScroll } from "@/lib/helios/use-cinema-scroll";
import { useHeliosVoice } from "@/lib/helios/helios-provider";
import { useVideoFrame } from "@/lib/helios/use-video-frame";
import { cn } from "@/lib/utils";

const voiceStates = {
  idle: { line: "Tap to greet" },
  listening: { line: "Listening" },
  speaking: { line: "Live" },
} as const;

const scrollBeats = [
  { until: 0.2, line: "Empty reception." },
  { until: 0.52, line: "She arrives." },
  { until: 0.78, line: "Takes her seat." },
  { until: 1, line: "Ready to help." },
] as const;

type VoiceState = keyof typeof voiceStates;
type OutboundUiState = "idle" | "loading" | "success" | "error";

const voiceEnergy: Record<VoiceState, number> = {
  idle: 0.18,
  listening: 0.62,
  speaking: 1,
};

function beatLine(scene: number) {
  return scrollBeats.find((b) => scene <= b.until)?.line ?? scrollBeats.at(-1)!.line;
}

export function VoiceExperience() {
  const cinemaRef = useRef<HTMLElement>(null);
  useCinemaScroll(cinemaRef);

  const [state, setState] = useState<VoiceState>("idle");
  const [phone, setPhone] = useState("");
  const [outboundState, setOutboundState] = useState<OutboundUiState>("idle");
  const [outboundMessage, setOutboundMessage] = useState("");
  const reduceMotion = useReducedMotion();
  const { helios, setVoiceInput } = useHeliosVoice();
  const { currentFrame, fps, inputProps } = useVideoFrame(helios);
  const scene = inputProps.sceneProgress ?? 0;
  const active = state !== "idle";
  const copy = voiceStates[state];
  const seated = scene >= 0.78;
  const beat = beatLine(scene);
  const titleOpacity = interpolate(scene, [0, 0.12, 0.28], [1, 1, 0], { extrapolateRight: "clamp" });
  const hudOpacity = interpolate(scene, [0.68, 0.82], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  useEffect(() => {
    setVoiceInput({ voiceState: state, energy: voiceEnergy[state] });
  }, [setVoiceInput, state]);

  const hudFloat = interpolate(currentFrame % (fps * 4), [0, fps * 2, fps * 4], [0, active ? -5 : 0, 0]);

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

  const nextAction = useMemo(() => {
    if (state === "idle") return { icon: Mic, label: "Start", next: "listening" as const };
    if (state === "listening") return { icon: Volume2, label: "Respond", next: "speaking" as const };
    return { icon: Pause, label: "Reset", next: "idle" as const };
  }, [state]);

  const Icon = nextAction.icon;

  return (
    <section ref={cinemaRef} className="site-3d__cinema" aria-label="Front desk story">
      <div className="site-3d__cinema-sticky">
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
          id="experience"
          className="site-3d__cinema-hud"
          style={{ opacity: reduceMotion ? (seated ? 1 : 0) : hudOpacity, pointerEvents: seated ? "auto" : "none" }}
        >
          <motion.div
            className="voice-hud site-3d__hud"
            style={{ transform: reduceMotion ? undefined : `translateY(${hudFloat}px)` }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={copy.line}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="voice-hud__status mb-5"
              >
                {copy.line}
              </motion.p>
            </AnimatePresence>

            <div className="relative">
              <div className={cn("voice-hud__orbit", active && "voice-hud__orbit--live")} aria-hidden />
              <div className={cn("voice-hud__orbit voice-hud__orbit--b", active && "voice-hud__orbit--live")} aria-hidden />
              <button
                type="button"
                onClick={() => setState(nextAction.next)}
                className={cn("voice-hud__mic", active && "voice-hud__mic--live")}
                aria-label={nextAction.label}
              >
                <span className="voice-hud__mic-glow" aria-hidden />
                <Icon className="relative z-10 size-9" strokeWidth={1.5} />
              </button>
            </div>

            <div className="voice-hud__wave mt-10" aria-hidden>
              {Array.from({ length: 32 }, (_, i) => (
                <span
                  key={i}
                  className={cn(active && "voice-hud__wave-bar--live")}
                  style={{
                    animationDelay: `${i * 55}ms`,
                    height: active ? `${28 + (i % 5) * 14}%` : "18%",
                  }}
                />
              ))}
            </div>
          </motion.div>

          <Link href="/vision" className="voice-hud__book">
            Book
          </Link>

          <form id="call-demo" onSubmit={onOutboundSubmit} className="voice-hud__call site-3d__call">
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
