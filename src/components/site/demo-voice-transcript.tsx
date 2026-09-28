"use client";

import { useEffect, useRef } from "react";

import type { VoiceTranscriptEntry } from "@/lib/voice/useRealtimeVoice";
import { cn } from "@/lib/utils";

type DemoVoiceTranscriptProps = {
  entries: readonly VoiceTranscriptEntry[];
  variant: "focus" | "strip";
};

/**
 * Live conversation lines. Partial speech updates in place; the list follows the latest line.
 */
export function DemoVoiceTranscript({ entries, variant }: DemoVoiceTranscriptProps) {
  const prefix = variant === "focus" ? "voice-focus" : "demo-web-voice";
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTop = list.scrollHeight;
  }, [entries]);

  return (
    <section
      className={`${prefix}__transcript-panel`}
      aria-label="Conversation transcript"
      data-testid={variant === "focus" ? "voice-focus-transcript" : "demo-web-voice-transcript"}
    >
      <p className={`${prefix}__transcript-label`}>Transcript</p>
      <ol
        ref={listRef}
        className={`${prefix}__transcript`}
        aria-live="polite"
        aria-relevant="additions text"
      >
        {entries.length === 0 ? (
          <li className={`${prefix}__line ${prefix}__line--empty`}>Transcript appears as you talk.</li>
        ) : (
          entries.map((entry) => (
            <li
              key={entry.id}
              className={cn(
                `${prefix}__line`,
                entry.role === "assistant" && `${prefix}__line--agent`,
                !entry.final && `${prefix}__line--partial`,
              )}
            >
              <span className={`${prefix}__who`}>{entry.role === "assistant" ? "Agent" : "You"}</span>
              {entry.text}
            </li>
          ))
        )}
      </ol>
    </section>
  );
}
