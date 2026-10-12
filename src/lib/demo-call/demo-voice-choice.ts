import type { DemoVoiceEngine } from "../voice-languages.ts";

type DemoVoiceChoice = {
  engine: DemoVoiceEngine | null;
  speechLanguage: string | null;
  cascadeLanguage: string | null;
};

function freshChoice(): DemoVoiceChoice {
  return {
    engine: null,
    speechLanguage: null,
    cascadeLanguage: null,
  };
}

let choice: DemoVoiceChoice = freshChoice();
const listeners = new Set<() => void>();

function emitChoice() {
  for (const listener of listeners) listener();
}

export function subscribeDemoVoiceChoice(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getDemoVoiceChoice(): DemoVoiceChoice {
  return choice;
}

/** Clears the shared choice. Tests use this so cases do not leak into each other. */
export function resetDemoVoiceChoice() {
  choice = freshChoice();
  emitChoice();
}

/**
 * Marks an explicit engine pick. A highlighted model is only a visual default.
 * The first pick keeps a language already chosen for that catalog.
 * Switching from one explicit engine to the other clears the destination
 * catalog so that engine still waits for its own language click.
 * Clicking the engine that is already selected does not clear its language.
 */
export function chooseDemoVoiceEngine(next: DemoVoiceEngine) {
  if (choice.engine === next) return;
  const switchingEngines = choice.engine !== null;
  choice = {
    engine: next,
    speechLanguage: switchingEngines && next === "speech_llm" ? null : choice.speechLanguage,
    cascadeLanguage: switchingEngines && next === "cascade" ? null : choice.cascadeLanguage,
  };
  emitChoice();
}

/**
 * Marks an explicit language pick for the catalog whose list was open.
 * The control can already show this value. The click still counts while the
 * store has not recorded it. A repeat click of a language already stored
 * keeps that pick.
 */
export function chooseDemoVoiceLanguage(engine: DemoVoiceEngine, language: string) {
  const current = engine === "speech_llm" ? choice.speechLanguage : choice.cascadeLanguage;
  if (current !== null && current === language) return;
  choice =
    engine === "speech_llm"
      ? { ...choice, speechLanguage: language }
      : { ...choice, cascadeLanguage: language };
  emitChoice();
}

/** True only after this engine and its language were both clicked. Catalog defaults do not count. */
export function isDemoVoiceChoiceReady(
  engine: DemoVoiceEngine,
  snapshot: DemoVoiceChoice = choice,
): boolean {
  if (snapshot.engine !== engine) return false;
  const language = engine === "speech_llm" ? snapshot.speechLanguage : snapshot.cascadeLanguage;
  return language !== null;
}
