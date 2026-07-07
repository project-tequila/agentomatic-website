"use client";

import { useEffect, useRef } from "react";

import { useHeliosVoice } from "@/lib/helios/helios-provider";
import { useVideoFrame } from "@/lib/helios/use-video-frame";
import { act1BeatOpacity } from "@/lib/story/act1-band-progress";
import { featureBandOpacity } from "@/lib/story/feature-band-progress";
import { illustrationAtmosphere, visibleIllustrationScenes } from "@/lib/story/illustration-scenes";
import { storyToSceneProgress } from "@/lib/story/chapters";
import { persistentOrbMode } from "@/lib/story/persistent-orb";
import { cn } from "@/lib/utils";

import { ConcurrentScene } from "./concurrent-scene";
import { GruntScene } from "./grunt-scene";
import { HandoffScene } from "./handoff-scene";
import { IntegrationsScene } from "./integrations-scene";
import { MultilingualScene } from "./multilingual-scene";
import { PersistentFrontdeskOrb } from "./persistent-frontdesk-orb";
import { RemindersScene } from "./reminders-scene";
import { StoryIllustration } from "./story-illustrations";

export function StoryIllustrationBackground() {
  const { helios, setVoiceInput } = useHeliosVoice();
  const { inputProps } = useVideoFrame(helios);
  const story = inputProps.storyProgress ?? 0;
  const scene = storyToSceneProgress(story);
  const atmosphere = illustrationAtmosphere(story);
  const scenes = visibleIllustrationScenes(story);
  const hoursScene = scenes.find((s) => s.id === "hours");
  const hoursOpacity = hoursScene?.opacity ?? 0;
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

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = -((event.clientY / window.innerHeight) * 2 - 1);
      setVoiceInput({ pointerX: nx, pointerY: ny });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [setVoiceInput]);

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
      aria-hidden
    >
      <div className="editorial-bg__grid" style={{ opacity: atmosphere.grid }} />
      <div
        className="story-illustration-bg__wash"
        data-tone={atmosphere.wash}
        style={{ opacity: 0.18 + scene * 0.08 }}
      />

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

      <PersistentFrontdeskOrb
        story={story}
        hoursSceneOpacity={hoursScene?.opacity ?? 0}
      />

      <div className="story-illustration-bg__fade-edges" aria-hidden />
      <div className="story-illustration-bg__fade-bottom" aria-hidden />
    </div>
  );
}
