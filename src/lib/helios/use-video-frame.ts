"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";

import type { Helios } from "@helios-project/core";

import type { VoiceHeliosInputProps } from "./types";
import { defaultVoiceHeliosInput } from "./types";

export type VideoFrameState = {
  currentFrame: number;
  duration: number;
  fps: number;
  inputProps: VoiceHeliosInputProps;
};

const serverSnapshot: VideoFrameState = {
  currentFrame: 0,
  duration: 16,
  fps: 60,
  inputProps: defaultVoiceHeliosInput,
};

function toVideoFrameState(snapshot: ReturnType<Helios<VoiceHeliosInputProps>["getState"]>): VideoFrameState {
  return {
    currentFrame: snapshot.currentFrame,
    duration: snapshot.duration,
    fps: snapshot.fps,
    inputProps: snapshot.inputProps,
  };
}

function snapshotsEqual(a: VideoFrameState, b: VideoFrameState): boolean {
  return (
    a.currentFrame === b.currentFrame &&
    a.duration === b.duration &&
    a.fps === b.fps &&
    a.inputProps === b.inputProps
  );
}

function scheduleStoreChange(onStoreChange: () => void) {
  queueMicrotask(onStoreChange);
}

export function useVideoFrame(helios: Helios<VoiceHeliosInputProps> | null): VideoFrameState {
  const cacheRef = useRef<VideoFrameState>(serverSnapshot);

  const getSnapshot = useCallback(() => {
    if (!helios) return serverSnapshot;

    const frameState = toVideoFrameState(helios.getState());
    if (snapshotsEqual(cacheRef.current, frameState)) {
      return cacheRef.current;
    }

    cacheRef.current = frameState;
    return frameState;
  }, [helios]);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!helios) return () => {};

      return helios.subscribe((next) => {
        const frameState = toVideoFrameState(next);
        if (snapshotsEqual(cacheRef.current, frameState)) return;
        cacheRef.current = frameState;
        scheduleStoreChange(onStoreChange);
      });
    },
    [helios],
  );

  const getServerSnapshot = useCallback(() => serverSnapshot, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
