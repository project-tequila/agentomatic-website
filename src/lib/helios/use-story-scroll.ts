"use client";

import { useEffect, type RefObject } from "react";

import { useHeliosVoice } from "./helios-provider";
import { useScrollContainer } from "./scroll-container-context";
import { storyToSceneProgress } from "../story/chapters";
import {
  STORY_SCROLL_RESET_EVENT,
  STORY_SLIDE_GOTO_EVENT,
  type StorySlideGotoDetail,
} from "../story/reset-story-scroll";
import {
  STORY_SLIDE_LOCK_MS,
  STORY_SLIDE_PLAY_MS,
  STORY_SLIDE_DELAY_MS,
  clampStorySlideIndex,
  isLastStorySlide,
  storyProgressForSlide,
  storySlideIndexById,
  STORY_SLIDE_COUNT,
} from "../story/story-slides";

const PAGER_CLASS = "site-3d__scroll--story-paging";
const WHEEL_THRESHOLD = 42;
const SWIPE_THRESHOLD = 56;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export function useStoryScroll(storyRef: RefObject<HTMLElement | null>) {
  const scrollRef = useScrollContainer();
  const { setVoiceInput } = useHeliosVoice();

  useEffect(() => {
    const scrollEl = scrollRef.current;
    const storyEl = storyRef.current;
    if (!scrollEl || !storyEl) return;

    let slideIndex = 0;
    let playhead = 0;
    let pagerActive = true;
    let lockUntil = 0;
    let playRaf = 0;
    let playGen = 0;
    let playStart = 0;
    let wheelAccum = 0;
    let touchStartY = 0;
    let touchTracking = false;

    const viewport = () => scrollEl.clientHeight || window.innerHeight;

    const slideScrollTop = (index: number) => storyEl.offsetTop + clampStorySlideIndex(index) * viewport();

    const contactTop = () => storyEl.offsetTop + storyEl.offsetHeight;

    const publish = (nextPlayhead = playhead) => {
      playhead = nextPlayhead;
      const storyProgress = storyProgressForSlide(slideIndex, playhead);
      const pageMax = scrollEl.scrollHeight - scrollEl.clientHeight;
      const scrollProgress = pageMax > 0 ? Math.min(1, Math.max(0, scrollEl.scrollTop / pageMax)) : 0;
      setVoiceInput({
        storyProgress,
        sceneProgress: storyToSceneProgress(storyProgress),
        scrollProgress,
      });
    };

    const stopPlay = () => {
      playGen += 1;
      if (playRaf) cancelAnimationFrame(playRaf);
      playRaf = 0;
    };

    const playSlide = () => {
      stopPlay();
      const gen = playGen;
      if (prefersReducedMotion()) {
        publish(1);
        return;
      }

      playStart = performance.now();
      publish(0);

      const tick = (now: number) => {
        if (gen !== playGen) return;
        const elapsed = now - playStart;
        if (elapsed < STORY_SLIDE_DELAY_MS) {
          publish(0);
          playRaf = requestAnimationFrame(tick);
          return;
        }
        const t = Math.min(1, (elapsed - STORY_SLIDE_DELAY_MS) / STORY_SLIDE_PLAY_MS);
        publish(easeInOutCubic(t));
        if (t < 1) {
          playRaf = requestAnimationFrame(tick);
        } else {
          playRaf = 0;
        }
      };

      playRaf = requestAnimationFrame(tick);
    };

    const setPager = (active: boolean) => {
      pagerActive = active;
      scrollEl.classList.toggle(PAGER_CLASS, active);
    };

    const goToSlide = (nextIndex: number, { animate = true } = {}) => {
      const index = clampStorySlideIndex(nextIndex);
      slideIndex = index;
      setPager(true);
      lockUntil = performance.now() + STORY_SLIDE_LOCK_MS;
      wheelAccum = 0;
      scrollEl.scrollTop = slideScrollTop(index);
      if (animate) playSlide();
      else publish(prefersReducedMotion() ? 1 : playhead);
    };

    const goNext = () => {
      if (performance.now() < lockUntil) return;
      if (isLastStorySlide(slideIndex)) {
        setPager(false);
        lockUntil = performance.now() + STORY_SLIDE_LOCK_MS;
        publish(1);
        scrollEl.scrollTo({ top: contactTop(), behavior: prefersReducedMotion() ? "auto" : "smooth" });
        return;
      }
      goToSlide(slideIndex + 1);
    };

    const goPrev = () => {
      if (performance.now() < lockUntil) return;
      if (!pagerActive) {
        setPager(true);
        goToSlide(STORY_SLIDE_COUNT - 1);
        return;
      }
      if (slideIndex <= 0) return;
      goToSlide(slideIndex - 1);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;

      if (!pagerActive) {
        if (event.deltaY < 0 && scrollEl.scrollTop <= slideScrollTop(STORY_SLIDE_COUNT - 1) + 12) {
          event.preventDefault();
          goPrev();
        }
        return;
      }

      event.preventDefault();
      if (performance.now() < lockUntil) return;

      wheelAccum += event.deltaY;
      if (wheelAccum > WHEEL_THRESHOLD) {
        wheelAccum = 0;
        goNext();
      } else if (wheelAccum < -WHEEL_THRESHOLD) {
        wheelAccum = 0;
        goPrev();
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      touchTracking = true;
      touchStartY = event.touches[0]!.clientY;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!touchTracking || event.touches.length !== 1) return;
      if (!pagerActive) return;
      const dy = event.touches[0]!.clientY - touchStartY;
      if (Math.abs(dy) > 8) event.preventDefault();
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (!touchTracking) return;
      touchTracking = false;
      const endY = event.changedTouches[0]?.clientY ?? touchStartY;
      const dy = endY - touchStartY;
      if (Math.abs(dy) < SWIPE_THRESHOLD) return;
      if (dy < 0) goNext();
      else goPrev();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable)) {
        return;
      }

      const nextKeys = event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ";
      const prevKeys = event.key === "ArrowUp" || event.key === "PageUp";
      if (!nextKeys && !prevKeys) return;
      if (event.key === " " && target && (target.tagName === "BUTTON" || target.tagName === "A")) return;
      if (!pagerActive && !prevKeys) return;

      event.preventDefault();
      if (nextKeys) goNext();
      else goPrev();
    };

    const onReset = () => {
      goToSlide(0);
    };

    const onGoto = (event: Event) => {
      const detail = (event as CustomEvent<StorySlideGotoDetail>).detail ?? {};
      const index =
        typeof detail.index === "number"
          ? detail.index
          : typeof detail.id === "string"
            ? storySlideIndexById(detail.id)
            : 0;
      goToSlide(index);
    };

    const onScroll = () => {
      if (pagerActive) return;
      if (scrollEl.scrollTop <= slideScrollTop(STORY_SLIDE_COUNT - 1) + 8) {
        setPager(true);
        slideIndex = STORY_SLIDE_COUNT - 1;
        publish(1);
      } else {
        const pageMax = scrollEl.scrollHeight - scrollEl.clientHeight;
        const scrollProgress = pageMax > 0 ? Math.min(1, Math.max(0, scrollEl.scrollTop / pageMax)) : 0;
        setVoiceInput({ scrollProgress });
      }
    };

    const onResize = () => {
      if (!pagerActive) return;
      scrollEl.scrollTop = slideScrollTop(slideIndex);
    };

    setPager(true);
    storyEl.style.setProperty("--story-scroll-height", `calc(${STORY_SLIDE_COUNT} * 100dvh)`);
    goToSlide(0);

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true, capture: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true, capture: true });
    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    window.addEventListener(STORY_SCROLL_RESET_EVENT, onReset);
    window.addEventListener(STORY_SLIDE_GOTO_EVENT, onGoto);

    return () => {
      stopPlay();
      setPager(false);
      window.removeEventListener("wheel", onWheel, true);
      window.removeEventListener("touchstart", onTouchStart, true);
      window.removeEventListener("touchmove", onTouchMove, true);
      window.removeEventListener("touchend", onTouchEnd, true);
      window.removeEventListener("touchcancel", onTouchEnd, true);
      scrollEl.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      window.removeEventListener(STORY_SCROLL_RESET_EVENT, onReset);
      window.removeEventListener(STORY_SLIDE_GOTO_EVENT, onGoto);
    };
  }, [storyRef, scrollRef, setVoiceInput]);
}
