"use client";

import { useCallback, useSyncExternalStore } from "react";

import { useDemoCall } from "@/lib/demo-call/demo-call-context";
import type { DemoVoiceEngine } from "@/lib/voice-languages";

type DemoVoiceChoice = {
  engine: DemoVoiceEngine | null;
  speechLanguage: string | null;
  cascadeLanguage: string | null;
};

const emptyChoice: DemoVoiceChoice = {
  engine: null,
  speechLanguage: null,
  cascadeLanguage: null,
};

let choice: DemoVoiceChoice = emptyChoice;
const listeners = new Set<() => void>();

function emitChoice() {
  for (const listener of listeners) listener();
}

function subscribeChoice(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getChoice(): DemoVoiceChoice {
  return choice;
}

/**
 * Marks an explicit engine pick. Defaults do not count.
 * Moving onto an engine clears that catalog's language so Start Talk waits for a new pick.
 */
export function chooseDemoVoiceEngine(next: DemoVoiceEngine) {
  if (choice.engine === next) return;
  choice = {
    engine: next,
    speechLanguage: next === "speech_llm" ? null : choice.speechLanguage,
    cascadeLanguage: next === "cascade" ? null : choice.cascadeLanguage,
  };
  emitChoice();
}

/** Marks an explicit language pick for the engine whose list was open. */
export function chooseDemoVoiceLanguage(engine: DemoVoiceEngine, language: string) {
  const current = engine === "speech_llm" ? choice.speechLanguage : choice.cascadeLanguage;
  if (current === language) return;
  choice =
    engine === "speech_llm"
      ? { ...choice, speechLanguage: language }
      : { ...choice, cascadeLanguage: language };
  emitChoice();
}

/** True only after this engine and its language were both clicked. Catalog defaults do not count. */
export function isDemoVoiceChoiceReady(engine: DemoVoiceEngine, snapshot: DemoVoiceChoice = choice): boolean {
  if (snapshot.engine !== engine) return false;
  const language = engine === "speech_llm" ? snapshot.speechLanguage : snapshot.cascadeLanguage;
  return language !== null;
}

export function useDemoVoiceChoiceReady(engine: DemoVoiceEngine): boolean {
  const snapshot = useSyncExternalStore(subscribeChoice, getChoice, getChoice);
  return isDemoVoiceChoiceReady(engine, snapshot);
}

/**
 * Opens the voice-focus chooser. The microphone starts only from Start Talk,
 * which keeps the getUserMedia user gesture on that click.
 */
export function useBeginVoiceDemo() {
  const { openDemoCall } = useDemoCall();

  return useCallback(() => {
    openDemoCall();
  }, [openDemoCall]);
}
