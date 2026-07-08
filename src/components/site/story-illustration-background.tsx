"use client";

import { useEffect, useRef, type CSSProperties } from "react";

import { useHeliosVoice } from "@/lib/helios/helios-provider";
import { useVideoFrame } from "@/lib/helios/use-video-frame";
import { act1BeatOpacity } from "@/lib/story/act1-band-progress";
import { featureBandOpacity } from "@/lib/story/feature-band-progress";
import { hoursDayNightMix } from "@/lib/story/hours-day-night";
import { illustrationAtmosphere, visibleIllustrationScenes } from "@/lib/story/illustration-scenes";
import { storyToSceneProgress } from "@/lib/story/chapters";
import { persistentOrbMode } from "@/lib/story/persistent-orb";
import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";
import { useStoryVisualScale } from "@/lib/story/use-story-visual-scale";
import { cn } from "@/lib/utils";

import { ConcurrentScene } from "./concurrent-scene";
import { GruntScene } from "./grunt-scene";
import { HandoffScene } from "./handoff-scene";
import { HoursSkyAtmosphere } from "./hours-sky-atmosphere";
import { IntegrationsScene } from "./integrations-scene";
import { MultilingualScene } from "./multilingual-scene";
import { PersistentFrontdeskOrb } from "./persistent-frontdesk-orb";
import { RemindersScene } from "./reminders-scene";
import { StoryIllustration } from "./story-illustrations";

const PARALLAX_LERP = 0.12;
const GRID_PARALLAX_PX = 22;
const WASH_PARALLAX_PX = 14;
const STAGE_PARALLAX_PX = 10;
const ORB_PARALLAX_PX = 8;

export function StoryIllustrationBackground() {
  const { helios, setVoiceInput } = useHeliosVoice();
  const { inputProps } = useVideoFrame(helios);
  const reduceMotion = usePrefersReducedMotion();
  const story = inputProps.storyProgress ?? 0;
  const scene = storyToSceneProgress(story);
  const atmosphere = illustrationAtmosphere(story);
  const scenes = visibleIllustrationScenes(story);
  const hoursScene = scenes.find((s) => s.id === "hours");
  const hoursOpacity = hoursScene?.opacity ?? 0;
  const hoursMix = hoursOpacity > 0.02 ? hoursDayNightMix(story) : null;
  const integrationsOpacity = featureBandOpacity(story, "integrations");
  const multilingualOpacity = featureBandOpacity(story, "multilingual");
  const handoffOpacity = featureBandOpacity(story, "handoff");
  const remindersOpacity = featureBandOpacity(story, "reminders");
  const dashboardOpacity = featureBandOpacity(story, "dashboard");
  const concurrentOpacity = featureBandOpacity(story, "concurrent");
  const gruntOpacity = act1BeatOpacity(story, "grunt");
  const showDashboardScene = dashboardOpacity > 0.02;
  const orbMode = persistentOrbMode(story);

  const rootRef = useRef<HTMLDivElement>(null);
  const stageAnchorRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);

  useStoryVisualScale(stageAnchorRef, rootRef);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const applyParallax = (x: number, y: number) => {
      const vars: Record<string, string> = {
        "--bg-parallax-x": x.toFixed(4),
        "--bg-parallax-y": y.toFixed(4),
        "--bg-parallax-grid-x": `${(x * GRID_PARALLAX_PX).toFixed(2)}px`,
        "--bg-parallax-grid-y": `${(-y * GRID_PARALLAX_PX).toFixed(2)}px`,
        "--bg-parallax-wash-x": `${(x * WASH_PARALLAX_PX).toFixed(2)}px`,
        "--bg-parallax-wash-y": `${(-y * WASH_PARALLAX_PX).toFixed(2)}px`,
        "--bg-parallax-stage-x": `${(x * STAGE_PARALLAX_PX).toFixed(2)}px`,
        "--bg-parallax-stage-y": `${(-y * STAGE_PARALLAX_PX).toFixed(2)}px`,
        "--bg-parallax-orb-x": `${(x * ORB_PARALLAX_PX).toFixed(2)}px`,
        "--bg-parallax-orb-y": `${(-y * ORB_PARALLAX_PX).toFixed(2)}px`,
      };

      for (const [key, value] of Object.entries(vars)) {
        root.style.setProperty(key, value);
        document.documentElement.style.setProperty(key, value);
      }
    };

    if (reduceMotion) {
      applyParallax(0, 0);
      return undefined;
    }

    const tick = () => {
      const target = targetRef.current;
      const current = currentRef.current;
      current.x += (target.x - current.x) * PARALLAX_LERP;
      current.y += (target.y - current.y) * PARALLAX_LERP;
      applyParallax(current.x, current.y);

      if (Math.abs(target.x - current.x) > 0.001 || Math.abs(target.y - current.y) > 0.001) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = 0;
      }
    };

    const schedule = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = -((event.clientY / window.innerHeight) * 2 - 1);
      targetRef.current = { x: nx, y: ny };
      setVoiceInput({ pointerX: nx, pointerY: ny });
      schedule();
    };

    const onLeave = () => {
      targetRef.current = { x: 0, y: 0 };
      setVoiceInput({ pointerX: 0, pointerY: 0 });
      schedule();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") onLeave();
    });

    applyParallax(0, 0);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const keys = [
        "--bg-parallax-x",
        "--bg-parallax-y",
        "--bg-parallax-grid-x",
        "--bg-parallax-grid-y",
        "--bg-parallax-wash-x",
        "--bg-parallax-wash-y",
        "--bg-parallax-stage-x",
        "--bg-parallax-stage-y",
        "--bg-parallax-orb-x",
        "--bg-parallax-orb-y",
      ];
      for (const key of keys) {
        root.style.removeProperty(key);
        document.documentElement.style.removeProperty(key);
      }
    };
  }, [reduceMotion, setVoiceInput]);

  const hoursCssVars = hoursMix
    ? ({
        "--hours-day-mix": hoursMix.dayMix.toFixed(4),
        "--hours-night-mix": (1 - hoursMix.dayMix).toFixed(4),
        "--hours-star-opacity": hoursMix.starOpacity.toFixed(4),
        "--hours-day-glow": hoursMix.dayGlow.toFixed(4),
      } as CSSProperties)
    : undefined;

  return (
    <div
      ref={rootRef}
      className={cn(
        "story-illustration-bg editorial-bg",
        concurrentOpacity > 0.02 && "story-illustration-bg--concurrent",
        integrationsOpacity > 0.02 && "story-illustration-bg--integrations",
        multilingualOpacity > 0.02 && "story-illustration-bg--multilingual",
        handoffOpacity > 0.02 && "story-illustration-bg--handoff",
        remindersOpacity > 0.02 && "story-illustration-bg--reminders",
        showDashboardScene && "story-illustration-bg--dashboard",
        gruntOpacity > 0.02 && "story-illustration-bg--grunt",
        hoursOpacity > 0.02 && "story-illustration-bg--hours",
        `story-illustration-bg--orb-${orbMode}`,
      )}
      style={hoursCssVars}
      aria-hidden
    >
      <div className="editorial-bg__grid" style={{ opacity: atmosphere.grid }} />
      <div
        className="story-illustration-bg__wash"
        data-tone={atmosphere.wash}
        style={{
          opacity:
            hoursOpacity > 0.02
              ? (0.18 + scene * 0.08) * (1 - hoursOpacity * 0.9)
              : 0.18 + scene * 0.08,
        }}
      />

      {hoursOpacity > 0.02 ? <HoursSkyAtmosphere story={story} sceneOpacity={hoursOpacity} /> : null}

      <div
        ref={stageAnchorRef}
        className={cn(
          "story-illustration-bg__stage-anchor",
          gruntOpacity > 0.02 && "story-illustration-bg__stage-anchor--grunt",
        )}
      >
        <div className="story-illustration-bg__stage">
          {scenes.map(({ id, opacity }) => (
            <div key={id} className="story-illustration-bg__scene" style={{ opacity }}>
              {id !== "hours" &&
              id !== "integrations" &&
              id !== "multilingual" &&
              id !== "concurrent" &&
              id !== "grunt" &&
              id !== "hook" &&
              id !== "handoff" &&
              id !== "reminders" &&
              id !== "dashboard" &&
              id !== "cta" ? (
                <StoryIllustration id={id} className="story-illustration-bg__art" />
              ) : null}
            </div>
          ))}

          {gruntOpacity > 0.02 ? (
            <div
              className="story-illustration-bg__scene story-illustration-bg__scene--grunt"
              style={{ opacity: gruntOpacity }}
            >
              <GruntScene story={story} opacity={gruntOpacity} />
            </div>
          ) : null}

          {concurrentOpacity > 0.02 ? (
            <div
              className="story-illustration-bg__scene story-illustration-bg__scene--concurrent"
              style={{ opacity: concurrentOpacity }}
            >
              <ConcurrentScene story={story} opacity={concurrentOpacity} />
            </div>
          ) : null}

          {integrationsOpacity > 0.02 ? (
            <div
              className="story-illustration-bg__scene story-illustration-bg__scene--integrations"
              style={{ opacity: integrationsOpacity }}
            >
              <IntegrationsScene story={story} opacity={integrationsOpacity} />
            </div>
          ) : null}

          {multilingualOpacity > 0.02 ? (
            <div
              className="story-illustration-bg__scene story-illustration-bg__scene--multilingual"
              style={{ opacity: multilingualOpacity }}
            >
              <MultilingualScene story={story} opacity={multilingualOpacity} />
            </div>
          ) : null}

          {handoffOpacity > 0.02 ? (
            <div
              className="story-illustration-bg__scene story-illustration-bg__scene--handoff"
              style={{ opacity: handoffOpacity }}
            >
              <HandoffScene story={story} opacity={handoffOpacity} />
            </div>
          ) : null}

          {remindersOpacity > 0.02 ? (
            <div
              className="story-illustration-bg__scene story-illustration-bg__scene--reminders"
              style={{ opacity: remindersOpacity }}
            >
              <RemindersScene story={story} opacity={remindersOpacity} />
            </div>
          ) : null}
        </div>
      </div>

      <PersistentFrontdeskOrb story={story} hoursSceneOpacity={hoursScene?.opacity ?? 0} />

      <div className="story-illustration-bg__fade-edges" aria-hidden />
      <div className="story-illustration-bg__fade-bottom" aria-hidden />
    </div>
  );
}

