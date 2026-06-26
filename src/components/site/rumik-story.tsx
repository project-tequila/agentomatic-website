"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";

import { usePrefersReducedMotion } from "@/lib/story/use-prefers-reduced-motion";

import { CtaFeatureTitle } from "@/components/site/cta-feature-title";
import { DashboardFeatureTitle } from "@/components/site/dashboard-feature-title";
import { ConcurrentFeatureTitle } from "@/components/site/concurrent-feature-title";
import { GruntFeatureTitle } from "@/components/site/grunt-feature-title";
import { HandoffFeatureTitle } from "@/components/site/handoff-feature-title";
import { MultilingualFeatureTitle } from "@/components/site/multilingual-feature-title";
import { RemindersFeatureTitle } from "@/components/site/reminders-feature-title";
import { IntegrationsFeatureTitle } from "@/components/site/integrations-feature-title";
import { StoryBodyTyping } from "@/components/site/story-body-typing";
import { useStoryScroll } from "@/lib/helios/use-story-scroll";
import { useHeliosVoice } from "@/lib/helios/helios-provider";
import { useVideoFrame } from "@/lib/helios/use-video-frame";
import { act1BeatProgress } from "@/lib/story/act1-band-progress";
import { staticTitleBodyTypingReveal } from "@/lib/story/body-typing-reveal";
import { featureBandProgress } from "@/lib/story/feature-band-progress";
import { concurrentBodyTypingReveal } from "@/lib/story/concurrent-reveal";
import { integrationsBodyReveal } from "@/lib/story/integrations-reveal";
import { handoffBodyReveal } from "@/lib/story/handoff-reveal";
import { ctaBodyReveal, ctaChapterProgress, ctaDemoPanelReveal } from "@/lib/story/cta-reveal";
import { dashboardBodyReveal } from "@/lib/story/dashboard-reveal";
import { remindersBodyReveal } from "@/lib/story/reminders-reveal";
import { multilingualBodyReveal } from "@/lib/story/multilingual-reveal";
import { gruntBodyTypingReveal } from "@/lib/story/grunt-reveal";
import {
  ACT1_END,
  CTA_REVEAL_START,
  FEATURES_END,
  activeAct1Beat,
  activeFeatureChapter,
  activeStoryChapter,
  isAct1,
} from "@/lib/story/chapters";
import { DemoCallScrollReveal } from "@/components/site/site-demo-call-root";
import { cn } from "@/lib/utils";

export function RumikStory() {
  const storyRef = useRef<HTMLElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const { helios } = useHeliosVoice();
  const { inputProps } = useVideoFrame(helios);
  useStoryScroll(storyRef);
  const story = inputProps.storyProgress ?? 0;
  const inAct1 = isAct1(story);
  const inCta = story >= FEATURES_END;
  const approachingCta = story >= CTA_REVEAL_START && story < FEATURES_END;
  const motionOff = !!reduceMotion;

  const feature = activeFeatureChapter(story);
  const chapter = inAct1 && !feature ? activeAct1Beat(story) : activeStoryChapter(story);

  const displayKicker = feature ? `${feature.codename} /` : chapter.kicker;
  const displayTitle: [string, string] = feature ? feature.title : chapter.title;
  const displayBody = feature?.body ?? chapter.body;

  const chapterKey = inAct1 ? activeAct1Beat(story).id : chapter.id + (feature?.id ?? "");
  const integrationsProgress = feature?.id === "integrations" ? featureBandProgress(story, "integrations") : null;
  const multilingualProgress = feature?.id === "multilingual" ? featureBandProgress(story, "multilingual") : null;
  const handoffProgress = feature?.id === "handoff" ? featureBandProgress(story, "handoff") : null;
  const remindersProgress = feature?.id === "reminders" ? featureBandProgress(story, "reminders") : null;
  const concurrentProgress = feature?.id === "concurrent" ? featureBandProgress(story, "concurrent") : null;
  const hoursProgress = feature?.id === "hours" ? featureBandProgress(story, "hours") : null;
  const dashboardProgress = feature?.id === "dashboard" ? featureBandProgress(story, "dashboard") : null;
  const gruntProgress = inAct1 && activeAct1Beat(story).id === "grunt" ? act1BeatProgress(story, "grunt") : null;
  const hookProgress = inAct1 && activeAct1Beat(story).id === "hook" ? act1BeatProgress(story, "hook") : null;
  const ctaProgress = inCta ? ctaChapterProgress(story) : null;
  const panelReveal = ctaProgress !== null ? ctaDemoPanelReveal(ctaProgress, motionOff) : 0;

  const bodyTyping = resolveBodyTyping({
    displayBody,
    motionOff,
    featureId: feature?.id ?? null,
    integrationsProgress,
    multilingualProgress,
    handoffProgress,
    remindersProgress,
    concurrentProgress,
    hoursProgress,
    dashboardProgress,
    gruntProgress,
    hookProgress,
    ctaProgress,
  });

  return (
    <section
      ref={storyRef}
      className={cn("rumik-story", inCta && "rumik-story--cta", feature?.id === "dashboard" && "rumik-story--dashboard")}
      aria-label="Frontdesk story"
    >
      <DemoCallScrollReveal reveal={panelReveal} />
      <div className="rumik-story__sticky">
        <div className="rumik-story__progress" aria-hidden>
          <span className="rumik-story__progress-bar" style={{ width: `${story * 100}%` }} />
          <span className="rumik-story__progress-act" style={{ left: `${ACT1_END * 100}%` }} title="Act 1 ends here" />
          <span className="rumik-story__progress-cta" style={{ left: `${FEATURES_END * 100}%` }} title="Demo call" />
        </div>

        <div className="rumik-story__writing">
          <div className="rumik-story__copy">
            <AnimatePresence mode="wait">
              <motion.div
                key={chapterKey}
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 0.7, 0.18, 1] }}
                className="rumik-story__chapter"
              >
                <div className="rumik-story__headline">
                  <p className="rumik-story__kicker">{displayKicker}</p>
                  {feature?.id === "concurrent" ? (
                    <ConcurrentFeatureTitle story={story} />
                  ) : feature?.id === "integrations" ? (
                    <IntegrationsFeatureTitle story={story} />
                  ) : feature?.id === "multilingual" ? (
                    <MultilingualFeatureTitle story={story} />
                  ) : feature?.id === "handoff" ? (
                    <HandoffFeatureTitle story={story} />
                  ) : feature?.id === "reminders" ? (
                    <RemindersFeatureTitle story={story} />
                  ) : feature?.id === "dashboard" ? (
                    <DashboardFeatureTitle story={story} />
                  ) : inAct1 && activeAct1Beat(story).id === "grunt" ? (
                    <GruntFeatureTitle story={story} />
                  ) : inCta ? (
                    <CtaFeatureTitle story={story} />
                  ) : (
                    <h1 className="rumik-story__title">
                      <span>{displayTitle[0]}</span>
                      <span>{displayTitle[1]}</span>
                    </h1>
                  )}
                </div>
                <p
                  className={cn(
                    "rumik-story__body",
                    !displayBody && "rumik-story__body--empty",
                    inAct1 && activeAct1Beat(story).id === "grunt" && "rumik-story__body--grunt",
                  )}
                >
                  {displayBody && bodyTyping ? (
                    <StoryBodyTyping
                      text={displayBody}
                      typingReveal={bodyTyping.reveal}
                      scrollSignal={bodyTyping.scrollSignal}
                      reduceMotion={motionOff}
                    />
                  ) : (
                    displayBody ?? "\u00a0"
                  )}
                </p>
              </motion.div>
            </AnimatePresence>

            <p className={`rumik-story__feature-index${feature ? "" : " rumik-story__feature-index--placeholder"}`} aria-hidden>
              {feature ? `${featureChaptersIndex(feature.id)} / ${featureChaptersTotal}` : "\u00a0"}
            </p>
          </div>

          <div className="rumik-story__footer">
            {story < 0.06 ? (
              <span className="rumik-story__scroll-hint">scroll to explore</span>
            ) : inAct1 ? (
              <span className="rumik-story__scroll-hint">keep scrolling</span>
            ) : approachingCta ? (
              <motion.span
                className="rumik-story__scroll-hint rumik-story__scroll-hint--cta"
                animate={reduceMotion ? undefined : { opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                tap the orb to try ↗
              </motion.span>
            ) : inCta ? (
              <span className="rumik-story__scroll-hint">tap the orb to hear it live</span>
            ) : (
              <span className="rumik-story__scroll-hint">explore features</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

type BodyTypingState = {
  reveal: number;
  scrollSignal: number;
};

function resolveBodyTyping({
  displayBody,
  motionOff,
  featureId,
  integrationsProgress,
  multilingualProgress,
  handoffProgress,
  remindersProgress,
  concurrentProgress,
  hoursProgress,
  dashboardProgress,
  gruntProgress,
  hookProgress,
  ctaProgress,
}: {
  displayBody?: string;
  motionOff: boolean;
  featureId: string | null;
  integrationsProgress: number | null;
  multilingualProgress: number | null;
  handoffProgress: number | null;
  remindersProgress: number | null;
  concurrentProgress: number | null;
  hoursProgress: number | null;
  dashboardProgress: number | null;
  gruntProgress: number | null;
  hookProgress: number | null;
  ctaProgress: number | null;
}): BodyTypingState | null {
  if (!displayBody) return null;

  if (featureId === "integrations" && integrationsProgress !== null) {
    return { reveal: integrationsBodyReveal(integrationsProgress, motionOff), scrollSignal: integrationsProgress };
  }
  if (featureId === "multilingual" && multilingualProgress !== null) {
    return { reveal: multilingualBodyReveal(multilingualProgress, motionOff), scrollSignal: multilingualProgress };
  }
  if (featureId === "handoff" && handoffProgress !== null) {
    return { reveal: handoffBodyReveal(handoffProgress, motionOff), scrollSignal: handoffProgress };
  }
  if (featureId === "reminders" && remindersProgress !== null) {
    return { reveal: remindersBodyReveal(remindersProgress, motionOff), scrollSignal: remindersProgress };
  }
  if (featureId === "concurrent" && concurrentProgress !== null) {
    return { reveal: concurrentBodyTypingReveal(concurrentProgress, motionOff), scrollSignal: concurrentProgress };
  }
  if (featureId === "hours" && hoursProgress !== null) {
    return { reveal: staticTitleBodyTypingReveal(hoursProgress, motionOff), scrollSignal: hoursProgress };
  }
  if (featureId === "dashboard" && dashboardProgress !== null) {
    return { reveal: dashboardBodyReveal(dashboardProgress, motionOff), scrollSignal: dashboardProgress };
  }
  if (gruntProgress !== null) {
    return { reveal: gruntBodyTypingReveal(gruntProgress, motionOff), scrollSignal: gruntProgress };
  }
  if (hookProgress !== null) {
    return { reveal: staticTitleBodyTypingReveal(hookProgress, motionOff), scrollSignal: hookProgress };
  }
  if (ctaProgress !== null) {
    return { reveal: ctaBodyReveal(ctaProgress, motionOff), scrollSignal: ctaProgress };
  }

  return null;
}

const featureOrder = ["hours", "concurrent", "integrations", "multilingual", "handoff", "reminders", "dashboard"] as const;
const featureChaptersTotal = featureOrder.length;

function featureChaptersIndex(id: string) {
  const index = featureOrder.indexOf(id as (typeof featureOrder)[number]);
  return index >= 0 ? index + 1 : 1;
}
