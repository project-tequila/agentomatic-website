"use client";

import { interpolate } from "@helios-project/core";

import { useHeliosVoice } from "@/lib/helios/helios-provider";
import { useVideoFrame } from "@/lib/helios/use-video-frame";
import { isAct2 } from "@/lib/story/chapters";

export function EditorialScrollBackground() {
  const { helios } = useHeliosVoice();
  const { inputProps } = useVideoFrame(helios);
  const scene = inputProps.sceneProgress ?? 0;
  const story = inputProps.storyProgress ?? 0;
  const inAct2 = isAct2(story);

  const gridOpacity = interpolate(scene, [0, 0.55, 1], [0.28, 0.42, inAct2 ? 0.48 : 0.42], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glowOpacity = interpolate(scene, [0.08, 0.55, 1], [0, 0.22, inAct2 ? 0.18 : 0.26], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glowScale = interpolate(scene, [0, 1], [0.88, 1.04], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const horizonOpacity = interpolate(scene, [0.25, 0.75, 1], [0, 0.32, inAct2 ? 0.38 : 0.28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const beamHeight = interpolate(scene, [0, 0.85], [0, 72], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div className="editorial-bg" aria-hidden>
      <div className="editorial-bg__grid" style={{ opacity: gridOpacity }} />
      <div
        className="editorial-bg__glow"
        style={{ opacity: glowOpacity, transform: `scale(${glowScale})` }}
      />
      <div className="editorial-bg__horizon" style={{ opacity: horizonOpacity }} />
      <div className="editorial-bg__beam" style={{ height: `${beamHeight}%` }} />
      {inAct2 ? (
        <p className="editorial-bg__status">
          <span className="editorial-bg__status-dot" />
          at desk
        </p>
      ) : null}
    </div>
  );
}
