import {
  DEFAULT_DEMO_VOICE_ENGINE,
  DEFAULT_DEMO_VOICE_LANGUAGE,
  type DemoVoiceEngine,
} from "../voice-languages.ts";

type DemoVoiceChoice = {
  engine: DemoVoiceEngine | null;
  speechLanguage: string | null;
  cascadeLanguage: string | null;
};

function freshChoice(): DemoVoiceChoice {
  return {
    engine: DEFAULT_DEMO_VOICE_ENGINE,
    speechLanguage: DEFAULT_DEMO_VOICE_LANGUAGE,
    cascadeLanguage: DEFAULT_DEMO_VOICE_LANGUAGE,
  };
}

let choice: DemoVoiceChoice = freshChoice();
const listeners = new Set<() => void>();

function emitChoice() {
  for (const listener of listeners) listener();
}

function languageFor(snapshot: DemoVoiceChoice, engine: DemoVoiceEngine): string | null {
  return engine === "speech_llm" ? snapshot.speechLanguage : snapshot.cascadeLanguage;
}

export function subscribeDemoVoiceChoice(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getDemoVoiceChoice(): DemoVoiceChoice {
  return choice;
}

/**
 * True when `engine` is the selected engine and that catalog has a language.
 * A snapshot is judged on its own. Omitted, the shared store is judged.
 */
export function isDemoVoiceChoiceReady(
  engine: DemoVoiceEngine,
  snapshot: DemoVoiceChoice = choice,
): boolean {
  if (snapshot.engine !== engine) return false;
  const language = languageFor(snapshot, engine);
  return typeof language === "string" && language.trim().length > 0;
}

/** Restores the shared choice to the defaults the voice UI shows on first load. */
export function resetDemoVoiceChoice() {
  choice = freshChoice();
  emitChoice();
}

/**
 * Clears one catalog language so that engine is incomplete.
 * Tests use this for the empty-language case the UI cannot show.
 */
export function clearDemoVoiceLanguage(engine: DemoVoiceEngine) {
  choice =
    engine === "speech_llm"
      ? { ...choice, speechLanguage: null }
      : { ...choice, cascadeLanguage: null };
  emitChoice();
}

/**
 * Records an engine pick. It does not clear either catalog's language.
 * Clicking the engine that is already selected does nothing.
 */
export function chooseDemoVoiceEngine(next: DemoVoiceEngine) {
  if (choice.engine === next) return;
  choice = { ...choice, engine: next };
  emitChoice();
}

/**
 * Records a language pick for one catalog.
 * A repeat click of a language already stored keeps that pick.
 */
export function chooseDemoVoiceLanguage(engine: DemoVoiceEngine, language: string) {
  const current = languageFor(choice, engine);
  if (current !== null && current === language) return;
  choice =
    engine === "speech_llm"
      ? { ...choice, speechLanguage: language }
      : { ...choice, cascadeLanguage: language };
  emitChoice();
}
