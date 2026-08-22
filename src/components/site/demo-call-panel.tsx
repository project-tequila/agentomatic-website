"use client";

import { interpolate } from "@helios-project/core";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { useDemoCall } from "@/lib/demo-call/demo-call-context";
import { cn } from "@/lib/utils";

import { DemoCallForm } from "./demo-call-form";
import { DemoWebVoiceTalk } from "./demo-web-voice-talk";

const popMotion = {
  hidden: {
    opacity: 0,
    y: -36,
    scale: 0.82,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 620,
      damping: 17,
      mass: 0.68,
    },
  },
  exit: {
    opacity: 0,
    y: -14,
    scale: 0.94,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export function DemoCallPanel() {
  const reduceMotion = useReducedMotion();
  const { isOpen, scrollReveal } = useDemoCall();

  const scrollVisible = scrollReveal > 0.08;
  const show = !isOpen && scrollVisible;
  const interactive = !isOpen && scrollReveal > 0.35;

  const scrollOpacity = reduceMotion
    ? scrollVisible ? 1 : 0
    : interpolate(scrollReveal, [0.08, 0.45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const panelOpacity = scrollOpacity;
  const pointerEvents = interactive ? "auto" : "none";
  const stripLive = !reduceMotion && scrollReveal > 0.35;

  return (
    <AnimatePresence>
      {show ? (
        <div
          className="demo-call-strip-bar-wrap"
          style={{ opacity: panelOpacity, pointerEvents }}
        >
          <motion.aside
            id="experience"
            aria-label="Talk to the front desk"
            role="region"
            aria-labelledby="demo-call-title"
            aria-describedby="demo-call-desc"
            className={cn(
              "demo-call-panel demo-call-strip-bar call-panel-surface",
              stripLive && "demo-call-strip-bar--live",
            )}
            variants={reduceMotion ? undefined : popMotion}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="demo-call-strip-bar__inner">
              <p id="demo-call-title" className="demo-call-strip-bar__title">
                Talk to Agent
              </p>
              <p id="demo-call-desc" className="demo-call-strip-bar__hint">
                Talk in the browser, or enter a number and we&apos;ll call you.
              </p>

              <DemoWebVoiceTalk />

              <DemoCallForm
                layout="bar"
                autoFocus={false}
                showPulse={scrollReveal > 0.75}
                animateIn={false}
                className="demo-call-strip-bar__form"
              />
            </div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
