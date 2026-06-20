import { interpolate } from "@helios-project/core";

import { gatedBodyTypingReveal } from "./body-typing-reveal";
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

export type MultilingualLanguage = {
  id: string;
  label: string;
  script: string;
  color: string;
};

/** Scroll cycle order: English → Indian langs with foreign langs interleaved. */
export const MULTILINGUAL_LANGUAGES: MultilingualLanguage[] = [
  { id: "en", label: "English", script: "Hello", color: "#8cffd2" },
  { id: "hi", label: "हिन्दी", script: "नमस्ते", color: "#ffe066" },
  { id: "es", label: "Español", script: "Hola", color: "#ffc857" },
  { id: "bn", label: "বাংলা", script: "নমস্কার", color: "#69db7c" },
  { id: "fr", label: "Français", script: "Bonjour", color: "#b197fc" },
  { id: "ur", label: "اردو", script: "السلام", color: "#ffa94d" },
  { id: "de", label: "Deutsch", script: "Guten Tag", color: "#74c0fc" },
  { id: "ta", label: "தமிழ்", script: "வணக்கம்", color: "#ff8787" },
  { id: "pt", label: "Português", script: "Olá", color: "#63e6be" },
  { id: "te", label: "తెలుగు", script: "నమస్కారం", color: "#66d9e8" },
  { id: "it", label: "Italiano", script: "Ciao", color: "#ffa8a8" },
  { id: "mr", label: "मराठी", script: "नमस्कार", color: "#da77f2" },
  { id: "nl", label: "Nederlands", script: "Hallo", color: "#91a7ff" },
  { id: "gu", label: "ગુજરાતી", script: "નમસ્તે", color: "#8ce99a" },
  { id: "pl", label: "Polski", script: "Cześć", color: "#da77f2" },
  { id: "kn", label: "ಕನ್ನಡ", script: "ನಮಸ್ಕಾರ", color: "#ffc857" },
  { id: "ru", label: "Русский", script: "Привет", color: "#74c0fc" },
  { id: "ml", label: "മലയാളം", script: "നമസ്കാരം", color: "#63e6be" },
  { id: "zh", label: "中文", script: "你好", color: "#ff8787" },
  { id: "pa", label: "ਪੰਜਾਬੀ", script: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", color: "#ffe066" },
  { id: "ja", label: "日本語", script: "こんにちは", color: "#b197fc" },
  { id: "ko", label: "한국어", script: "안녕하세요", color: "#66d9e8" },
  { id: "ar", label: "العربية", script: "مرحبا", color: "#f783ac" },
  { id: "tr", label: "Türkçe", script: "Merhaba", color: "#ff8787" },
  { id: "vi", label: "Tiếng Việt", script: "Xin chào", color: "#8ce99a" },
  { id: "id", label: "Bahasa", script: "Halo", color: "#74c0fc" },
  { id: "sw", label: "Kiswahili", script: "Habari", color: "#ffc857" },
  { id: "he", label: "עברית", script: "שלום", color: "#91a7ff" },
  { id: "th", label: "ไทย", script: "สวัสดี", color: "#66d9e8" },
];

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

export function multilingualOrbPath() {
  const sx = MULTILINGUAL_STAGE.orbX + 34;
  const sy = MULTILINGUAL_STAGE.orbY - 6;
  const ex = MULTILINGUAL_CARD.x - 6;
  const ey = MULTILINGUAL_CARD.y + 64;
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
