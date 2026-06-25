import { MULTILINGUAL_AVAILABILITY_PHRASE_EN, MULTILINGUAL_PROVIDER_HEADLINE } from "./multilingual-languages";

/** Act 1 ends here — editorial story + background motion. Act 2 holds stable “ready” state. */
export const ACT1_END = 0.35;

/** Feature chapters end; inline demo call panel begins revealing. */
export const FEATURES_END = 0.92;

/** Scroll progress where demo call panel starts animating in. */
export const CTA_REVEAL_START = 0.86;

export type StoryChapter = {
  id: string;
  start: number;
  end: number;
  kicker: string;
  title: [string, string];
  body?: string;
};

/** Act 1 editorial beats (0 – ACT1_END). */
export const act1Beats: StoryChapter[] = [
  {
    id: "hook",
    start: 0,
    end: 0.12,
    kicker: "agentomatic frontdesk",
    title: ["your ai", "front desk."],
    body: "for your team — not instead of them.",
  },
  {
    id: "grunt",
    start: 0.12,
    end: ACT1_END,
    kicker: "chapter 01",
    title: ["the grunt", "work."],
    body: "reschedule calls, typing, routing, repeat questions — off your plate.",
  },
];

/** Full scroll timeline 0–1. */
export const storyChapters: StoryChapter[] = [
  ...act1Beats,
  {
    id: "features",
    start: ACT1_END,
    end: FEATURES_END,
    kicker: "built for your team",
    title: ["routine handled.", "edge cases, yours."],
  },
  {
    id: "cta",
    start: FEATURES_END,
    end: 1,
    kicker: "try it now",
    title: ["try it", "live."],
    body: "call yourself. hear it answer in seconds.",
  },
];

export type FeatureChapter = {
  id: string;
  start: number;
  end: number;
  codename: string;
  title: [string, string];
  body: string;
};

/** Frontdesk capabilities — escalation order during Act 2. */
export const featureChapters: FeatureChapter[] = [
  {
    id: "hours",
    start: ACT1_END,
    end: 0.431,
    codename: "nightshift",
    title: ["available", "24/7."],
    body: "nights, weekends, rush hour — someone's still picking up.",
  },
  {
    id: "concurrent",
    start: 0.431,
    end: 0.513,
    codename: "switchboard",
    title: ["no busy tone.", "ever."],
    body: "three lines ringing? nobody hears a busy tone.",
  },
  {
    id: "integrations",
    start: 0.513,
    end: 0.594,
    codename: "bridge",
    title: ["phone · whatsapp", "· email · calendar."],
    body: "phone, whatsapp, email — one thread knows the whole story.",
  },
  {
    id: "multilingual",
    start: 0.594,
    end: 0.676,
    codename: "polyglot",
    title: [MULTILINGUAL_PROVIDER_HEADLINE, `${MULTILINGUAL_AVAILABILITY_PHRASE_EN.toLowerCase()}.`],
    body: "they call in their language. your desk answers like it belongs.",
  },
  {
    id: "handoff",
    start: 0.676,
    end: 0.757,
    codename: "warmline",
    title: ["human support,", "right when it's needed."],
    body: "hands off to your team with context — no repeat-yourself moment.",
  },
  {
    id: "reminders",
    start: 0.757,
    end: 0.839,
    codename: "nudge",
    title: ["smart", "reminders."],
    body: "nudge before they forget — fewer empty chairs.",
  },
  {
    id: "dashboard",
    start: 0.839,
    end: FEATURES_END,
    codename: "houston",
    title: ["your ops", "command center."],
    body: "one chat thread. your whole front desk.",
  },
];

export function activeAct1Beat(progress: number): StoryChapter {
  return act1Beats.find((beat) => progress >= beat.start && progress < beat.end) ?? act1Beats.at(-1)!;
}

export function activeStoryChapter(progress: number): StoryChapter {
  if (progress < ACT1_END) return activeAct1Beat(progress);
  return storyChapters.find((chapter) => progress >= chapter.start && progress < chapter.end) ?? storyChapters.at(-1)!;
}

export function activeFeatureChapter(progress: number): FeatureChapter | null {
  if (progress < ACT1_END || progress >= FEATURES_END) return null;
  return featureChapters.find((chapter) => progress >= chapter.start && progress < chapter.end) ?? featureChapters.at(-1)!;
}

/** Maps story scroll to background motion timeline (0–1). Caps at 1 once Act 1 completes. */
export function storyToSceneProgress(storyProgress: number) {
  if (storyProgress <= 0) return 0;
  if (storyProgress >= ACT1_END) return 1;
  return storyProgress / ACT1_END;
}

export function isAct1(storyProgress: number) {
  return storyProgress < ACT1_END;
}

export function isAct2(storyProgress: number) {
  return storyProgress >= ACT1_END;
}
