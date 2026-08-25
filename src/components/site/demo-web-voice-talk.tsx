"use client";

import { Loader2, Mic, Square } from "lucide-react";

import { useBeginVoiceDemo } from "@/lib/demo-call/use-begin-voice-demo";
import { useDemoWebVoice } from "@/lib/voice/demo-web-voice-context";
import { canChangeDemoWebVoiceLanguage } from "@/lib/voice/demo-web-voice-language";
import {
  VOICE_LANGUAGE_OPTIONS,
  type VoiceLanguageCode,
} from "@/lib/voice-languages";
import { cn } from "@/lib/utils";

function statusLine(status: string, isAgentSpeaking: boolean): string {
  if (status === "requesting-mic") return "Allow microphone when prompted";
  if (status === "connecting") return "Connecting";
  if (status === "error") return "Talk unavailable";
  if (isAgentSpeaking) return "Live";
  if (status === "listening") return "Listening";
  return "Ready to talk";
}

type DemoWebVoiceTalkProps = {
  className?: string;
};

/**
 * Primary in-browser Talk control for the demo strip. Call me stays as fallback.
 * Language is selected before starting a session (same list as phone outbound).
 */
export function DemoWebVoiceTalk({ className }: DemoWebVoiceTalkProps) {
  const { status, error, isAgentSpeaking, transcripts, language, setLanguage, stop } =
    useDemoWebVoice();
  const beginVoiceDemo = useBeginVoiceDemo();
  const live =
    status === "requesting-mic" || status === "connecting" || status === "listening";
  const languageEditable = canChangeDemoWebVoiceLanguage(status);
  const recent = transcripts.slice(-4);

  async function onTalk() {
    if (live) {
      stop();
      return;
    }
    beginVoiceDemo();
  }

  return (
    <div className={cn("demo-web-voice", className)}>
      <div className="demo-web-voice__controls">
        <label className="demo-web-voice__language" htmlFor="demo-web-voice-language">
          <span className="sr-only">Conversation language</span>
          <select
            id="demo-web-voice-language"
            name="language"
            data-testid="demo-web-voice-language"
            value={language}
            disabled={!languageEditable}
            onChange={(event) => setLanguage(event.target.value as VoiceLanguageCode)}
            className="demo-web-voice__language-select"
            aria-label="Conversation language"
          >
            {VOICE_LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          data-testid="demo-talk-control"
          className={cn("demo-web-voice__talk", live && "demo-web-voice__talk--live")}
          onClick={() => void onTalk()}
          aria-pressed={live}
          aria-label={live ? "End talk" : "Talk now"}
        >
          {status === "connecting" || status === "requesting-mic" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : live ? (
            <Square className="size-3.5" strokeWidth={2} aria-hidden />
          ) : (
            <Mic className="size-4" strokeWidth={1.75} aria-hidden />
          )}
          <span>
            {status === "connecting"
              ? "Connecting"
              : status === "requesting-mic"
                ? "Allow mic"
                : live
                  ? "End"
                  : "Talk now"}
          </span>
        </button>
      </div>

      <p className="demo-web-voice__status" aria-live="polite">
        {error ? error : statusLine(status, isAgentSpeaking)}
      </p>

      {recent.length > 0 ? (
        <ol className="demo-web-voice__transcript" aria-live="polite" aria-relevant="additions">
          {recent.map((line) => (
            <li
              key={line.id}
              className={cn(
                "demo-web-voice__line",
                line.role === "assistant" && "demo-web-voice__line--agent",
              )}
            >
              <span className="demo-web-voice__who">{line.role === "assistant" ? "Desk" : "You"}</span>
              {line.text}
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
