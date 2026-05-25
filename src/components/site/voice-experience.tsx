"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2, Mic, Pause, Phone, Sparkles, Volume2 } from "lucide-react";

import { cn } from "@/lib/utils";

const bars = [34, 58, 42, 76, 50, 88, 44, 64, 38, 72, 46, 82, 54, 68, 36, 60];

const conversation = {
  idle: {
    label: "Ready",
    agent: "Tap the mic. Ask me how I can answer, qualify, schedule, and hand off callers.",
    visitor: "I want to experience the voice agent.",
  },
  listening: {
    label: "Listening",
    agent: "I am listening. Tell me the outcome you want from every call.",
    visitor: "Can you handle missed calls and book demos?",
  },
  speaking: {
    label: "Speaking",
    agent: "Yes. I greet the caller, understand intent, collect context, and route the next best action in seconds.",
    visitor: "That feels like a real front desk.",
  },
} as const;

type VoiceState = keyof typeof conversation;

type OutboundUiState = "idle" | "loading" | "success" | "error";

export function VoiceExperience() {
  const [state, setState] = useState<VoiceState>("idle");
  const [phone, setPhone] = useState("");
  const [outboundState, setOutboundState] = useState<OutboundUiState>("idle");
  const [outboundMessage, setOutboundMessage] = useState("");
  const reduceMotion = useReducedMotion();
  const active = state !== "idle";

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
      const data = (await res.json()) as { error?: string; message?: string; call_id?: string };
      if (!res.ok) {
        setOutboundState("error");
        setOutboundMessage(data.error || "Something went wrong.");
        return;
      }
      setOutboundState("success");
      setOutboundMessage(
        data.message || "Calling you now. Answer when your phone rings to connect to the voice agent.",
      );
    } catch {
      setOutboundState("error");
      setOutboundMessage("Network error. Try again in a moment.");
    }
  }

  const nextAction = useMemo(() => {
    if (state === "idle") return { icon: Mic, label: "Start voice experience", next: "listening" as const };
    if (state === "listening") return { icon: Volume2, label: "Hear agent response", next: "speaking" as const };
    return { icon: Pause, label: "Reset experience", next: "idle" as const };
  }, [state]);

  const Icon = nextAction.icon;

  return (
    <section className="relative isolate flex min-h-[calc(100dvh-3.5rem)] items-center overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="voice-ambient" aria-hidden />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div
          id="call-demo"
          className="scroll-mt-24 rounded-[1.5rem] border border-white/[0.10] bg-white/[0.04] p-5 backdrop-blur-sm sm:p-6 md:scroll-mt-28"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-lg">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-[#8cffd2]/75">Live demo</p>
              <h2 className="text-xl font-medium tracking-[-0.04em] text-white sm:text-2xl">Talk to the agent on your phone</h2>
              <p className="mt-2 text-sm leading-6 text-white/[0.55]">
                Enter your mobile number with country code, starting with + (e.g. +14155552671 or +919876543210). No
                sign-in required—we will place a short outbound demo call through our voice stack.
              </p>
            </div>
          </div>
          <form onSubmit={onOutboundSubmit} className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center">
            <label className="sr-only" htmlFor="outbound-phone">
              Phone number
            </label>
            <div className="relative flex-1">
              <Phone
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/[0.35]"
                strokeWidth={1.5}
                aria-hidden
              />
              <input
                id="outbound-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+1 415 555 2671"
                value={phone}
                onChange={(ev) => setPhone(ev.target.value)}
                className="h-12 w-full rounded-full border border-white/[0.12] bg-black/30 py-2 pl-11 pr-4 text-sm text-white outline-none ring-[#8cffd2]/40 placeholder:text-white/[0.35] focus:border-[#8cffd2]/35 focus:ring-2"
              />
            </div>
            <button
              type="submit"
              disabled={outboundState === "loading" || !phone.trim()}
              className="voice-button inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium text-black disabled:pointer-events-none disabled:opacity-50"
            >
              {outboundState === "loading" ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Calling…
                </>
              ) : (
                "Talk to the agent"
              )}
            </button>
          </form>
          {outboundState === "success" ? (
            <p className="mt-4 text-sm leading-6 text-[#8cffd2]/90" role="status">
              {outboundMessage}
            </p>
          ) : null}
          {outboundState === "error" ? (
            <p className="mt-4 text-sm leading-6 text-rose-300/95" role="alert">
              {outboundMessage}
            </p>
          ) : null}
        </div>

        <div className="grid w-full items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 0.7, 0.18, 1] }}
          className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left"
        >
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.035] px-3 py-1.5 text-xs uppercase tracking-[0.22em] text-white/[0.55]">
            <span className="size-1.5 rounded-full bg-[#8cffd2] shadow-[0_0_18px_rgba(140,255,210,.9)]" />
            Voice AI agents
          </p>
          <h1 className="text-balance text-[clamp(2.4rem,8vw,6.7rem)] font-semibold leading-[0.9] tracking-[-0.08em] text-white">
            Speak.
            <br />
            The agent listens.
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-pretty text-[clamp(1rem,2vw,1.2rem)] leading-8 text-white/[0.58] lg:mx-0">
            A minimal voice-first interface for businesses that want every visitor, lead, and caller answered
            instantly.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
            <a
              href="#experience"
              className="voice-button inline-flex min-h-12 items-center justify-center rounded-full px-5 text-sm font-medium text-black"
            >
              Try the voice flow
            </a>
            <a
              href="#contact"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/[0.10] px-5 text-sm text-white/[0.70] transition hover:border-white/[0.25] hover:text-white"
            >
              Book a live build
            </a>
          </div>
          </motion.div>

          <motion.div
          id="experience"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.97, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 0.7, 0.18, 1] }}
          className="voice-console mx-auto w-full max-w-[34rem] rounded-[2rem] p-5 sm:p-6"
        >
          <div className="flex items-center justify-between gap-4 text-xs text-white/[0.45]">
            <span>Agentomatic voice room</span>
            <span className={cn("rounded-full border px-2.5 py-1", active ? "border-[#8cffd2]/30 text-[#8cffd2]" : "border-white/[0.10]")}>
              {conversation[state].label}
            </span>
          </div>

          <div className="relative my-9 flex items-center justify-center">
            <div className={cn("voice-ring", active && "voice-ring--active")} aria-hidden />
            <button
              type="button"
              onClick={() => setState(nextAction.next)}
              className={cn(
                "relative z-10 grid size-32 place-items-center rounded-full border text-white transition duration-300",
                active
                  ? "border-[#8cffd2]/40 bg-[#8cffd2]/12 shadow-[0_0_70px_rgba(140,255,210,.22)]"
                  : "border-white/[0.12] bg-white/[0.04] hover:border-white/[0.25]",
              )}
              aria-label={nextAction.label}
            >
              <Icon className="size-9" strokeWidth={1.6} />
            </button>
          </div>

          <div className="voice-wave" aria-hidden>
            {bars.map((height, index) => (
              <span
                key={index}
                style={{
                  height: `${active ? height : Math.max(12, Math.round(height * 0.28))}%`,
                  animationDelay: `${index * 70}ms`,
                }}
                className={cn(active && "voice-wave__bar--active")}
              />
            ))}
          </div>

          <div className="mt-7 space-y-3">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
              <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-white/[0.35]">
                <Sparkles className="size-3.5" />
                Agent
              </div>
              <p className="text-sm leading-6 text-white/[0.76]">{conversation[state].agent}</p>
            </div>
            <div className="ml-auto max-w-[86%] rounded-2xl border border-[#8cffd2]/15 bg-[#8cffd2]/8 p-4">
              <div className="mb-2 text-xs uppercase tracking-[0.16em] text-[#8cffd2]/55">Visitor</div>
              <p className="text-sm leading-6 text-white/[0.68]">{conversation[state].visitor}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-white/[0.08] pt-4 text-xs text-white/[0.35]">
            <span>Sub-second response feel</span>
            <span>Human handoff ready</span>
          </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function VoiceSteps() {
  const steps = [
    ["01", "Listen", "Understands intent, tone, urgency, and the small details people usually miss."],
    ["02", "Respond", "Answers naturally with your scripts, your offers, and your operating rules."],
    ["03", "Act", "Books meetings, qualifies leads, sends summaries, and routes complex cases to your team."],
  ];

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[#8cffd2]/70">Experience design</p>
          <h2 className="text-balance text-3xl font-medium tracking-[-0.05em] text-white sm:text-5xl">
            The page should feel like the product.
          </h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {steps.map(([number, title, body]) => (
            <article key={title} className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.025] p-6">
              <div className="mb-8 text-sm text-white/[0.30]">{number}</div>
              <h3 className="text-xl font-medium tracking-[-0.03em] text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/[0.52]">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
