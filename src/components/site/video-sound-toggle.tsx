"use client";

import { Volume2, VolumeX } from "lucide-react";

import { useVideoSoundOptional } from "@/lib/helios/video-sound-context";
import { cn } from "@/lib/utils";

type VideoSoundToggleProps = {
  className?: string;
};

export function VideoSoundToggle({ className }: VideoSoundToggleProps) {
  const videoSound = useVideoSoundOptional();
  if (!videoSound) return null;

  const { soundOn, toggleSound } = videoSound;

  return (
    <button
      type="button"
      onClick={toggleSound}
      className={cn("video-sound-toggle", className)}
      aria-pressed={soundOn}
      aria-label={soundOn ? "Mute intro video" : "Unmute intro video"}
    >
      {soundOn ? <Volume2 className="size-3.5" strokeWidth={1.5} /> : <VolumeX className="size-3.5" strokeWidth={1.5} />}
      <span>{soundOn ? "sound on" : "sound off"}</span>
    </button>
  );
}
