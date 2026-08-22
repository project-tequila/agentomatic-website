"use client";

import { Loader2, Mic, Square } from "lucide-react";

import { beginVoiceDemo } from "@/lib/demo-call/open-demo-call";
import { useDemoWebVoice } from "@/lib/voice/demo-web-voice-context";
import { cn } from "@/lib/utils";

function statusLine(status: string, isAgentSpeaking: boolean): string {
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
 */
export function DemoWebVoiceTalk({ className }: DemoWebVoiceTalkProps) {
  const { status, error, isAgentSpeaking, transcripts, start, stop } = useDemoWebVoice();
  const live = status === "connecting" || status === "listening";
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
      <div className="demo-web-voice__row">
        <button
          type="button"
          data-testid="demo-talk-control"
          className={cn("demo-web-voice__talk", live && "demo-web-voice__talk--live")}
          onClick={() => void onTalk()}
          aria-pressed={live}
          aria-label={live ? "End talk" : "Talk now"}
        >
          {status === "connecting" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : live ? (
            <Square className="size-3.5" strokeWidth={2} aria-hidden />
          ) : (
            <Mic className="size-4" strokeWidth={1.75} aria-hidden />
          )}
          <span>{status === "connecting" ? "Connecting" : live ? "End" : "Talk now"}</span>
        </button>
        <p className="demo-web-voice__status" aria-live="polite">
          {error ? error : statusLine(status, isAgentSpeaking)}
        </p>
      </div>

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
