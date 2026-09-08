"use client";

import { useEffect, useRef, useState } from "react";

import { FrontdeskVoiceOrb } from "@/components/site/frontdesk-voice-orb";
import {
  orbAudioEnergy,
  orbIntensityFromEnergy,
  type VoiceEnergyOrbState,
} from "@/lib/voice/voice-orb-state";

type AudioReactiveFrontdeskOrbProps = {
  agentState: VoiceEnergyOrbState;
  getInputVolume: () => number;
  getOutputVolume: () => number;
  reduceMotion: boolean;
};

/**
 * Same SVG glass orb as the live site, driven by mic/TTS meters.
 */
export function AudioReactiveFrontdeskOrb({
  agentState,
  getInputVolume,
  getOutputVolume,
  reduceMotion,
}: AudioReactiveFrontdeskOrbProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(agentState);
  const inputRef = useRef(getInputVolume);
  const outputRef = useRef(getOutputVolume);
  const [intensity, setIntensity] = useState(0.7);

  stateRef.current = agentState;
  inputRef.current = getInputVolume;
  outputRef.current = getOutputVolume;

  useEffect(() => {
    const node = wrapRef.current;
    if (reduceMotion) {
      setIntensity(0.7);
      node?.style.setProperty("--voice-orb-energy", "0");
      return;
    }

    let frame = 0;
    let lastQuant = -1;

    const tick = () => {
      const energy = orbAudioEnergy(stateRef.current, inputRef.current(), outputRef.current());
      wrapRef.current?.style.setProperty("--voice-orb-energy", energy.toFixed(3));
      const quant = Math.round(energy * 14) / 14;
      if (quant !== lastQuant) {
        lastQuant = quant;
        setIntensity(orbIntensityFromEnergy(quant));
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduceMotion]);

  return (
    <div ref={wrapRef} className="voice-focus__orb-reactive">
      <svg
        viewBox="260 120 200 200"
        className="voice-focus__orb-svg"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <FrontdeskVoiceOrb
          cx={360}
          cy={220}
          intensity={intensity}
          mode="cta"
          idSuffix="focus"
          reduceMotion={reduceMotion}
        />
      </svg>
    </div>
  );
}
