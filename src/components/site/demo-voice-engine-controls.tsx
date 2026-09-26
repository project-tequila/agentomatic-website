"use client";

import { useDemoWebVoice } from "@/lib/voice/demo-web-voice-context";
import { canChangeDemoWebVoiceLanguage } from "@/lib/voice/demo-web-voice-language";
import { cn } from "@/lib/utils";

type DemoVoiceEngineControlsProps = {
  variant: "strip" | "focus";
};

/**
 * Speech LLM opens the speech language speaker.
 * Cascaded LLM opens a separate language speaker for the cascade catalog.
 */
export function DemoVoiceEngineControls({ variant }: DemoVoiceEngineControlsProps) {
  const { engine, setEngine, language, setLanguage, languageOptions, status } = useDemoWebVoice();
  const editable = canChangeDemoWebVoiceLanguage(status);
  const speech = engine === "speech_llm";
  const prefix = variant === "focus" ? "voice-focus" : "demo-web-voice";
  const languageId = speech
    ? `${prefix}-language`
    : `${prefix}-cascade-language`;
  const languageLabel = speech ? "Speech language" : "Cascaded language";

  return (
    <div className={`${prefix}__pickers`}>
      <div
        className={`${prefix}__engine`}
        role="radiogroup"
        aria-label="Voice model"
        data-testid={variant === "strip" ? "demo-voice-engine" : "voice-focus-engine"}
      >
        <button
          type="button"
          role="radio"
          aria-checked={speech}
          disabled={!editable}
          className={cn(`${prefix}__engine-option`, speech && `${prefix}__engine-option--active`)}
          data-testid={variant === "strip" ? "demo-voice-engine-speech" : "voice-focus-engine-speech"}
          onClick={() => setEngine("speech_llm")}
        >
          Speech LLM
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={!speech}
          disabled={!editable}
          className={cn(`${prefix}__engine-option`, !speech && `${prefix}__engine-option--active`)}
          data-testid={variant === "strip" ? "demo-voice-engine-cascade" : "voice-focus-engine-cascade"}
          onClick={() => setEngine("cascade")}
        >
          Cascaded LLM
        </button>
      </div>

      <label className={`${prefix}__language`} htmlFor={languageId}>
        <span className="sr-only">{languageLabel}</span>
        <select
          id={languageId}
          name="language"
          data-testid={languageId}
          value={language}
          disabled={!editable}
          onChange={(event) => setLanguage(event.target.value)}
          className={`${prefix}__language-select`}
          aria-label={languageLabel}
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
