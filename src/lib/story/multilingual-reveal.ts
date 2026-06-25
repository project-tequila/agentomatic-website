import { interpolate } from "@helios-project/core";

import { gatedBodyTypingReveal } from "./body-typing-reveal";
export {
  ALL_STT_LANGUAGES,
  ALL_TTS_LANGUAGES,
  DEEPGRAM_STT_LANGUAGES,
  DEEPGRAM_TTS_LANGUAGES,
  MULTILINGUAL_AVAILABILITY_PHRASE_EN,
  MULTILINGUAL_AVAILABILITY_SCRIPTS,
  MULTILINGUAL_DUPLEX_LANGUAGE_CODES,
  MULTILINGUAL_LANGUAGE_COUNT,
  MULTILINGUAL_LANGUAGES,
  MULTILINGUAL_PROVIDER_BADGE,
  MULTILINGUAL_PROVIDER_BADGE_WIDTH,
  MULTILINGUAL_PROVIDER_HEADLINE,
  multilingualAvailabilityScript,
  SARVAM_STT_LANGUAGES,
  SARVAM_TTS_LANGUAGES,
  type MultilingualLanguage,
} from "./multilingual-languages";
import { MULTILINGUAL_LANGUAGES } from "./multilingual-languages";
import { PERSISTENT_ORB } from "./persistent-orb";

export const MULTILINGUAL_STAGE = {
  width: PERSISTENT_ORB.width,
  height: PERSISTENT_ORB.height,
  orbX: PERSISTENT_ORB.cx,
  orbY: PERSISTENT_ORB.cy,
} as const;

/** Compact glass panel — no chip grid. */
export const MULTILINGUAL_CARD = {
  x: 458,
  y: 148,
  width: 228,
  height: 188,
} as const;

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

export function multilingualCardReveal(progress: number) {
  return interpolate(progress, [0.08, 0.26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

export function multilingualLinkReveal(progress: number) {
  return interpolate(progress, [0.16, 0.38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

/** Continuous 0…N language cycle across the scroll band. */
export function multilingualLanguageCycle(progress: number, reduceMotion = false) {
  if (reduceMotion) return 0;
  return interpolate(progress, [0.22, 0.94], [0, MULTILINGUAL_LANGUAGES.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function multilingualActiveIndex(progress: number, reduceMotion = false) {
  const cycle = multilingualLanguageCycle(progress, reduceMotion);
  return Math.min(MULTILINGUAL_LANGUAGES.length - 1, Math.floor(cycle));
}

/** Per-language scroll segment — drives typing + crossfade. */
export function multilingualLanguageSegment(progress: number, reduceMotion = false) {
  const cycle = multilingualLanguageCycle(progress, reduceMotion);
  const index = ((Math.floor(cycle) % MULTILINGUAL_LANGUAGES.length) + MULTILINGUAL_LANGUAGES.length) % MULTILINGUAL_LANGUAGES.length;
  const frac = cycle - Math.floor(cycle);
  const lang = MULTILINGUAL_LANGUAGES[index]!;
  const next = MULTILINGUAL_LANGUAGES[(index + 1) % MULTILINGUAL_LANGUAGES.length]!;

  const typingReveal = reduceMotion ? 1 : smoothstep(interpolate(frac, [0.04, 0.72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const fadeOut = reduceMotion ? 0 : smoothstep(interpolate(frac, [0.78, 0.96], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  return { lang, next, index, frac, typingReveal, fadeOut };
}

export function multilingualSubheadTypingReveal(progress: number, reduceMotion = false) {
  const { typingReveal } = multilingualLanguageSegment(progress, reduceMotion);
  return interpolate(typingReveal, [0.35, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

/** Horizontal ticker offset for language names strip. */
export function multilingualTickerOffset(progress: number) {
  return interpolate(progress, [0.2, 0.95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

export function multilingualHeroLanguage(progress: number, reduceMotion = false) {
  const { lang, typingReveal, fadeOut } = multilingualLanguageSegment(progress, reduceMotion);
  const card = multilingualCardReveal(progress);

  return {
    ...lang,
    opacity: card * (1 - fadeOut * 0.35),
    pulse: 0.88 + typingReveal * 0.12,
    typingReveal,
  };
}

export function multilingualOrbPath(card: { x: number; y: number; width: number; height: number } = MULTILINGUAL_CARD) {
  const sx = MULTILINGUAL_STAGE.orbX + 34;
  const sy = MULTILINGUAL_STAGE.orbY - 6;
  const ex = card.x - 6;
  const ey = card.y + 64;
  const cx = (sx + ex) / 2;
  const cy = sy - 22;
  return `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`;
}

/** 0–1 — card visible and hero script on line 2 has finished its first typed pass. */
export function multilingualTitleCompleteReveal(progress: number, reduceMotion = false) {
  const card = multilingualCardReveal(progress);
  const { typingReveal } = multilingualLanguageSegment(progress, reduceMotion);
  return Math.min(card, typingReveal);
}

export function multilingualBodyReveal(progress: number, reduceMotion = false) {
  const titleComplete = multilingualTitleCompleteReveal(progress, reduceMotion);
  return gatedBodyTypingReveal(progress, titleComplete, 0.58, 0.88, reduceMotion);
}

export function multilingualBadgeReveal(progress: number) {
  return interpolate(progress, [0.48, 0.68], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

/** Dot indicator for position in full language set. */
export function multilingualCycleDots(progress: number, reduceMotion = false) {
  const cycle = multilingualLanguageCycle(progress, reduceMotion);
  return MULTILINGUAL_LANGUAGES.map((lang, i) => {
    const dist = Math.abs(((cycle - i + MULTILINGUAL_LANGUAGES.length) % MULTILINGUAL_LANGUAGES.length));
    const near = dist < 0.65 || dist > MULTILINGUAL_LANGUAGES.length - 0.65;
    return { id: lang.id, active: near, opacity: near ? 1 : 0.22 };
  });
}
