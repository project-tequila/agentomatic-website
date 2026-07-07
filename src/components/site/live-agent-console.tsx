"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Check, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { InfinityOrbAvatar } from "@/components/site/infinity-orb-avatar";
import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

export type LiveAgentConsoleStep = {
  title: string;
  think: string;
  detail: string;
  icon: LucideIcon;
};

export type LiveAgentConsoleScenario = {
  id: string;
  label: string;
  goal?: ReactNode;
  /** Plain text after the prefix — enables word-by-word reveal on harvey variant. */
  goalText?: string;
  /** Label before goal text, e.g. "command:" — defaults to "command:" when goalText is set. */
  goalPrefix?: string;
  steps: LiveAgentConsoleStep[];
  summary: string;
};

type LiveAgentConsoleBaseProps = {
  agentLabel: string;
  statusLabel: string;
  active?: boolean;
  variant?: "harvey" | "rumik";
  className?: string;
  id?: string;
  style?: CSSProperties;
  avatarIcon?: LucideIcon;
  /** Command-center style glowing infinity orb instead of a lucide icon. */
  avatarVariant?: "icon" | "infinity-orb";
  scenarios?: LiveAgentConsoleScenario[];
  /** When set, drives which scenario plays and disables auto-cycling. */
  scenarioIndex?: number;
  /** Optional badge in the bar, e.g. "1 / 4 · calendar". */
  scenarioBadge?: string;
  onScenarioChange?: (index: number) => void;
};

type LiveAgentConsoleSingleProps = LiveAgentConsoleBaseProps & {
  scenarios?: undefined;
  scenarioIndex?: never;
  goal?: ReactNode;
  goalText?: string;
  goalPrefix?: string;
  steps: LiveAgentConsoleStep[];
  summary: string;
};

type LiveAgentConsoleMultiProps = LiveAgentConsoleBaseProps & {
  scenarios: LiveAgentConsoleScenario[];
  goal?: never;
  steps?: never;
  summary?: never;
};

export type LiveAgentConsoleProps = LiveAgentConsoleSingleProps | LiveAgentConsoleMultiProps;

type Phase = "thinking" | "done";

const THINK_MS = 1400;
const DONE_MS = 1100;

/** Split goal text into words while preserving trailing spaces on each token. */
function tokenizeGoalWords(text: string): string[] {
  return text.match(/\S+\s*/g) ?? [];
}

/** Variable per-word delay with occasional human pauses. */
function goalWordDelay(word: string, reduce: boolean): number {
  if (reduce) return 0;
  const base = 42 + Math.random() * 68;
  if (/[.…,;:]$/.test(word.trim())) return base + 90 + Math.random() * 110;
  if (Math.random() < 0.12) return base + 60 + Math.random() * 80;
  return base;
}

type ConsoleClasses = {
  root: string;
  bar: string;
  barMeta: string;
  id: string;
  avatar: string;
  status: string;
  statusDot: string;
  scenario: string;
  body: string;
  goal: string;
  steps: string;
  step: string;
  stepActive: string;
  stepDone: string;
  stepIcon: string;
  stepMain: string;
  stepTitle: string;
  stepDetail: string;
  stepThink: string;
  spinner: string;
  caret: string;
  output: string;
  outputLabel: string;
  outputText: string;
};

const HARVEY_CLASSES: ConsoleClasses = {
  root: "harvey-console",
  bar: "harvey-console__bar",
  barMeta: "harvey-console__bar-meta",
  id: "harvey-console__id",
  avatar: "harvey-console__avatar",
  status: "harvey-status",
  statusDot: "harvey-status__dot",
  scenario: "harvey-console__scenario",
  body: "harvey-console__body",
  goal: "harvey-console__goal",
  steps: "harvey-steps",
  step: "harvey-step",
  stepActive: "harvey-step--active",
  stepDone: "harvey-step--done",
  stepIcon: "harvey-step__icon",
  stepMain: "harvey-step__main",
  stepTitle: "harvey-step__title",
  stepDetail: "harvey-step__detail",
  stepThink: "harvey-step__think",
  spinner: "harvey-spinner",
  caret: "harvey-caret",
  output: "harvey-console__output",
  outputLabel: "harvey-console__output-label",
  outputText: "harvey-console__output-text",
};

const RUMIK_CLASSES: ConsoleClasses = {
  root: "live-console",
  bar: "live-console__bar",
  barMeta: "live-console__bar-meta",
  id: "live-console__id",
  avatar: "live-console__avatar",
  status: "live-console__status",
  statusDot: "live-console__status-dot",
  scenario: "live-console__scenario",
  body: "live-console__body",
  goal: "live-console__goal",
  steps: "live-console__steps",
  step: "live-console__step",
  stepActive: "live-console__step--active",
  stepDone: "live-console__step--done",
  stepIcon: "live-console__step-icon",
  stepMain: "live-console__step-main",
  stepTitle: "live-console__step-title",
  stepDetail: "live-console__step-detail",
  stepThink: "live-console__step-think",
  spinner: "live-console__spinner",
  caret: "live-console__caret",
  output: "live-console__output",
  outputLabel: "live-console__output-label",
  outputText: "live-console__output-text",
};

export function LiveAgentConsole(props: LiveAgentConsoleProps) {
  const {
    agentLabel,
    statusLabel,
    active = true,
    variant = "rumik",
    className,
    id,
    style,
    avatarIcon: AvatarIcon = Sparkles,
    avatarVariant = "icon",
    scenarios,
    scenarioIndex: controlledScenarioIndex,
    scenarioBadge,
    onScenarioChange,
  } = props;

  const singleGoal = "goal" in props ? props.goal : undefined;
  const singleGoalText = "goalText" in props ? props.goalText : undefined;
  const singleGoalPrefix = "goalPrefix" in props ? props.goalPrefix : undefined;
  const singleSteps = "steps" in props ? props.steps : undefined;
  const singleSummary = "summary" in props ? props.summary : undefined;

  const classes = variant === "harvey" ? HARVEY_CLASSES : RUMIK_CLASSES;
  const reduceMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [scenarioEnter, setScenarioEnter] = useState(false);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("thinking");
  const [showSummary, setShowSummary] = useState(false);
  const [typed, setTyped] = useState("");
  const [typedGoal, setTypedGoal] = useState("");
  const [goalTyping, setGoalTyping] = useState(false);

  const cycling = scenarios != null && scenarios.length > 0;
  const controlled = cycling && controlledScenarioIndex !== undefined;
  const resolvedScenarioIndex = controlled
    ? Math.min(Math.max(0, controlledScenarioIndex), scenarios!.length - 1)
    : scenarioIndex;
  const activeScenario = cycling ? scenarios![resolvedScenarioIndex] : null;
  const goal = activeScenario?.goal ?? singleGoal;
  const goalText = activeScenario?.goalText ?? singleGoalText;
  const goalPrefix = activeScenario?.goalPrefix ?? singleGoalPrefix ?? "command:";
  const steps = activeScenario?.steps ?? singleSteps ?? [];
  const summary = activeScenario?.summary ?? singleSummary ?? "";
  const animateGoal = variant === "harvey" && Boolean(goalText);
  const resolvedGoalText = goalText ?? "";

  useEffect(() => {
    if (!active) return;

    const reduce = reduceMotion;

    const timers: ReturnType<typeof setTimeout>[] = [];
    let typeInterval: ReturnType<typeof setInterval> | undefined;
    const wait = (ms: number) => new Promise<void>((r) => timers.push(setTimeout(r, ms)));

    let cancelled = false;

    const typeSummary = (text: string) =>
      new Promise<void>((resolve) => {
        let i = 0;
        const tick = reduce ? text.length : 1;
        typeInterval = setInterval(() => {
          i = Math.min(text.length, i + tick);
          setTyped(text.slice(0, i));
          if (i >= text.length) {
            if (typeInterval) clearInterval(typeInterval);
            resolve();
          }
        }, 22);
      });

    const typeGoal = (text: string) =>
      new Promise<void>((resolve) => {
        const words = tokenizeGoalWords(text);
        if (words.length === 0) {
          setTypedGoal("");
          setGoalTyping(false);
          resolve();
          return;
        }

        if (reduce) {
          setTypedGoal(text);
          setGoalTyping(false);
          resolve();
          return;
        }

        setTypedGoal("");
        setGoalTyping(true);
        let i = 0;

        const revealNext = () => {
          if (cancelled || !active) {
            setGoalTyping(false);
            resolve();
            return;
          }

          i += 1;
          setTypedGoal(words.slice(0, i).join(""));

          if (i >= words.length) {
            setGoalTyping(false);
            resolve();
            return;
          }

          timers.push(setTimeout(revealNext, goalWordDelay(words[i - 1], reduce)));
        };

        timers.push(setTimeout(revealNext, 120 + Math.random() * 80));
      });

    const runScenario = async (scenarioSteps: LiveAgentConsoleStep[], scenarioSummary: string) => {
      setShowSummary(false);
      setTyped("");
      setTypedGoal("");
      setGoalTyping(false);
      setIndex(0);
      setPhase("thinking");

      if (animateGoal && resolvedGoalText) {
        await typeGoal(resolvedGoalText);
        if (cancelled || !active) return;
        await wait(reduce ? 120 : 280);
      }

      for (let i = 0; i < scenarioSteps.length; i += 1) {
        if (cancelled || !active) return;
        setIndex(i);
        setPhase("thinking");
        await wait(reduce ? 500 : THINK_MS);
        if (cancelled || !active) return;
        setPhase("done");
        await wait(reduce ? 350 : DONE_MS);
      }
      if (cancelled || !active) return;
      setShowSummary(true);
      await typeSummary(scenarioSummary);
      if (!controlled) {
        await wait(3200);
      }
    };

    const loop = async () => {
      if (controlled && scenarios) {
        const sIdx = Math.min(Math.max(0, controlledScenarioIndex!), scenarios.length - 1);
        setScenarioIndex(sIdx);
        onScenarioChange?.(sIdx);
        if (sIdx > 0) setScenarioEnter(true);
        await runScenario(scenarios[sIdx].steps, scenarios[sIdx].summary);
        return;
      }

      let sIdx = 0;
      while (!cancelled && active) {
        if (cycling && scenarios) {
          setScenarioIndex(sIdx);
          onScenarioChange?.(sIdx);
          if (sIdx > 0) setScenarioEnter(true);
          await runScenario(scenarios[sIdx].steps, scenarios[sIdx].summary);
          if (cancelled || !active) return;
          sIdx = (sIdx + 1) % scenarios.length;
        } else {
          await runScenario(steps, summary);
          if (cancelled || !active) return;
        }
      }
    };

    loop();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      if (typeInterval) clearInterval(typeInterval);
    };
  }, [
    active,
    animateGoal,
    cycling,
    controlled,
    controlledScenarioIndex,
    reduceMotion,
    resolvedGoalText,
    scenarios,
    steps,
    summary,
    onScenarioChange,
  ]);

  useEffect(() => {
    if (!scenarioEnter) return;
    const timer = setTimeout(() => setScenarioEnter(false), 350);
    return () => clearTimeout(timer);
  }, [scenarioEnter, resolvedScenarioIndex]);

  useEffect(() => {
    if (!active) return;
    const scrollRoot = rootRef.current?.closest(".rumik-story__command-console");
    if (!scrollRoot) return;
    if (scrollRoot.scrollHeight <= scrollRoot.clientHeight) return;

    const reduce = reduceMotion;

    const target = showSummary
      ? outputRef.current
      : rootRef.current?.querySelector(`.${classes.stepActive}`);

    target?.scrollIntoView({
      block: "nearest",
      behavior: reduce ? "auto" : "smooth",
    });
  }, [active, index, phase, reduceMotion, showSummary, classes.stepActive, typed]);

  return (
    <div
      ref={rootRef}
      className={cn(
        classes.root,
        scenarioEnter && `${classes.root}--scenario-enter`,
        className,
      )}
      id={id}
      style={style}
      aria-label="agent working"
    >
      <div className={classes.bar}>
        <div className={classes.id}>
          <span
            className={cn(
              classes.avatar,
              avatarVariant === "infinity-orb" && `${classes.avatar}--infinity-orb`,
            )}
            aria-hidden
          >
            {avatarVariant === "infinity-orb" ? (
              <InfinityOrbAvatar />
            ) : (
              <AvatarIcon size={14} strokeWidth={2} />
            )}
          </span>
          {agentLabel}
        </div>
        <div className={classes.barMeta}>
          {scenarioBadge ? (
            <span className={classes.scenario} aria-live="polite">
              {scenarioBadge}
            </span>
          ) : cycling && activeScenario ? (
            <span className={classes.scenario} aria-live="polite">
              {resolvedScenarioIndex + 1} / {scenarios!.length} · {activeScenario.label}
            </span>
          ) : null}
          <span className={classes.status}>
            <span className={classes.statusDot} aria-hidden />
            {statusLabel}
          </span>
        </div>
      </div>

      <div className={classes.body} key={activeScenario?.id ?? "single"}>
        <p className={classes.goal}>
          {animateGoal ? (
            <>
              <strong>{goalPrefix}</strong> {typedGoal}
              {goalTyping ? (
                <span className={classes.caret} aria-hidden>
                  .
                </span>
              ) : null}
            </>
          ) : (
            goal
          )}
        </p>

        <div className={classes.steps}>
          {steps.map((step, i) => {
            const state =
              i < index || (i === index && phase === "done")
                ? "done"
                : i === index
                  ? "active"
                  : "idle";
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className={cn(
                  classes.step,
                  state === "active" && classes.stepActive,
                  state === "done" && classes.stepDone,
                )}
              >
                <span className={classes.stepIcon} aria-hidden>
                  {state === "done" ? (
                    <Check size={13} strokeWidth={2.5} />
                  ) : state === "active" ? (
                    <span className={classes.spinner} />
                  ) : (
                    <Icon size={13} strokeWidth={2} />
                  )}
                </span>
                <div className={classes.stepMain}>
                  <div className={classes.stepTitle}>{step.title}</div>
                  <div className={classes.stepDetail}>
                    {state === "active" ? (
                      <span className={classes.stepThink}>
                        {step.think}
                        <span className={classes.caret} aria-hidden>
                          .
                        </span>
                      </span>
                    ) : state === "done" ? (
                      step.detail
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {showSummary ? (
          <div ref={outputRef} className={classes.output}>
            <div className={classes.outputLabel}>work product</div>
            <p className={classes.outputText}>
              {typed}
              {typed.length < summary.length ? (
                <span className={classes.caret} aria-hidden>
                  .
                </span>
              ) : null}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
