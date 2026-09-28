"use client";

import { Loader2, Mic, Square } from "lucide-react";

import { DemoVoiceEngineControls } from "@/components/site/demo-voice-engine-controls";
import { DemoVoiceTranscript } from "@/components/site/demo-voice-transcript";
import { useDemoCall } from "@/lib/demo-call/demo-call-context";
import { useDemoWebVoice } from "@/lib/voice/demo-web-voice-context";
import { cn } from "@/lib/utils";

function statusLine(status: string, isAgentSpeaking: boolean): string {
  if (status === "requesting-mic") return "Allow microphone when prompted";
  if (status === "connecting") return "Connecting";
  if (status === "error") return "Talk unavailable";
  if (isAgentSpeaking) return "Live";
  if (status === "listening") return "Listening";
  return "Choose a model and language, then Start Talk";
}

type DemoWebVoiceTalkProps = {
  className?: string;
};

/**
 * Primary in-browser Talk control for the demo strip. Call me stays as fallback.
 * Speech LLM and cascaded LLM each have their own language speaker.
 */
export function DemoWebVoiceTalk({ className }: DemoWebVoiceTalkProps) {
  const { status, error, isAgentSpeaking, transcripts, start, stop } = useDemoWebVoice();
  const { openDemoCall } = useDemoCall();
  const live =
    status === "requesting-mic" || status === "connecting" || status === "listening";

  function onStartTalk() {
    if (live) {
      stop();
      return;
    }
    void start();
    openDemoCall();
  }

  return (
    <div className={cn("demo-web-voice", className)}>
      <div className="demo-web-voice__controls">
        <DemoVoiceEngineControls variant="strip" />

        <button
          type="button"
          data-testid="demo-talk-control"
          className={cn("demo-web-voice__talk", live && "demo-web-voice__talk--live")}
          onClick={onStartTalk}
          aria-pressed={live}
          aria-label={live ? "End talk" : "Start Talk"}
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
                  : "Start Talk"}
          </span>
        </button>
      </div>

      <p className="demo-web-voice__status" aria-live="polite">
        {error ? error : statusLine(status, isAgentSpeaking)}
      </p>

      <DemoVoiceTranscript entries={transcripts} variant="strip" />
    </div>
  );
}
