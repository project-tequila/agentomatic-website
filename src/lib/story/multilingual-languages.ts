/**
 * A language counts when STT exists on any provider and TTS exists on any provider.
 * @see https://developers.deepgram.com/docs/models-languages-overview
 * @see https://developers.deepgram.com/docs/tts-models
 * @see https://docs.sarvam.ai/api-reference-docs/getting-started/models/saaras
 * @see https://docs.sarvam.ai/api-reference-docs/getting-started/models/bulbul
 */

export const DEEPGRAM_STT_LANGUAGES = [
  "ar",
  "bg",
  "bn",
  "ca",
  "cs",
  "da",
  "de",
  "el",
  "en",
  "es",
  "et",
  "fi",
  "fr",
  "gu",
  "he",
  "hi",
  "hu",
  "id",
  "it",
  "ja",
  "kn",
  "ko",
  "lt",
  "lv",
  "ml",
  "mr",
  "ms",
  "nl",
  "no",
  "pa",
  "pl",
  "pt",
  "ro",
  "ru",
  "sk",
  "sv",
  "sw",
  "ta",
  "te",
  "th",
  "tr",
  "uk",
  "ur",
  "vi",
  "zh",
] as const;

/** Deepgram Aura TTS. */
export const DEEPGRAM_TTS_LANGUAGES = ["de", "en", "es", "fr", "it", "ja", "nl"] as const;

export const SARVAM_STT_LANGUAGES = [
  "as",
  "bn",
  "brx",
  "doi",
  "en",
  "gu",
  "hi",
  "kn",
  "kok",
  "ks",
  "mai",
  "ml",
  "mni",
  "mr",
  "ne",
  "od",
  "pa",
  "sa",
  "sat",
  "sd",
  "ta",
  "te",
  "ur",
] as const;

/** Sarvam Bulbul v3 TTS (BCP-47 base codes). */
export const SARVAM_TTS_LANGUAGES = ["bn", "en", "gu", "hi", "kn", "ml", "mr", "od", "pa", "ta", "te"] as const;

function unionCodes<T extends string>(...lists: readonly (readonly T[])[]) {
  return [...new Set(lists.flat())] as T[];
}

function intersectCodes<T extends string>(a: readonly T[], b: readonly T[]) {
  const bSet = new Set(b);
  return a.filter((code) => bSet.has(code));
}

export const ALL_STT_LANGUAGES = unionCodes(DEEPGRAM_STT_LANGUAGES, SARVAM_STT_LANGUAGES);
export const ALL_TTS_LANGUAGES = unionCodes(DEEPGRAM_TTS_LANGUAGES, SARVAM_TTS_LANGUAGES);

/** STT on any provider ∩ TTS on any provider. */
export const MULTILINGUAL_DUPLEX_LANGUAGE_CODES = intersectCodes(ALL_STT_LANGUAGES, ALL_TTS_LANGUAGES);

export const MULTILINGUAL_LANGUAGE_COUNT = MULTILINGUAL_DUPLEX_LANGUAGE_CODES.length;

export const MULTILINGUAL_AVAILABILITY_PHRASE_EN = "Now available in your language";

export type MultilingualLanguage = {
  id: string;
  label: string;
  /** Localized translation of MULTILINGUAL_AVAILABILITY_PHRASE_EN. */
  script: string;
  color: string;
};

/** Localized "Now available in your language" — single source of truth for story copy + polyglot card. */
export const MULTILINGUAL_AVAILABILITY_SCRIPTS: Record<string, string> = {
  en: "Now available in your language",
  es: "Ahora disponible en tu idioma",
  de: "Jetzt in Ihrer Sprache verfügbar",
  fr: "Maintenant disponible dans votre langue",
  nl: "Nu beschikbaar in uw taal",
  it: "Ora disponibile nella tua lingua",
  ja: "今すぐ、あなたの言語で利用できます",
  hi: "अब आपकी भाषा में उपलब्ध",
  bn: "এখন আপনার ভাষায় উপলব্ধ",
  ta: "இப்போது உங்கள் மொழியில் கிடைக்கிறது",
  te: "ఇప్పుడు మీ భాషలో అందుబాటులో ఉంది",
  mr: "आता तुमच्या भाषेत उपलब्ध",
  gu: "હવે તમારી ભાષામાં ઉપલબ્ધ",
  kn: "ಈಗ ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಲಭ್ಯವಿದೆ",
  ml: "ഇപ്പോൾ നിങ്ങളുടെ ഭാഷയിൽ ലഭ്യമാണ്",
  pa: "ਹੁਣ ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ ਉਪਲਬਧ",
  od: "ଏବେ ଆପଣଙ୍କ ଭାଷାରେ ଉପଲବ୍ଧ",
};

const MULTILINGUAL_LANGUAGE_CATALOG: Record<string, Omit<MultilingualLanguage, "id">> = {
  en: { label: "English", script: MULTILINGUAL_AVAILABILITY_SCRIPTS.en!, color: "#8cffd2" },
  es: { label: "Español", script: MULTILINGUAL_AVAILABILITY_SCRIPTS.es!, color: "#ffc857" },
  de: { label: "Deutsch", script: MULTILINGUAL_AVAILABILITY_SCRIPTS.de!, color: "#74c0fc" },
  fr: { label: "Français", script: MULTILINGUAL_AVAILABILITY_SCRIPTS.fr!, color: "#b197fc" },
  nl: { label: "Nederlands", script: MULTILINGUAL_AVAILABILITY_SCRIPTS.nl!, color: "#91a7ff" },
  it: { label: "Italiano", script: MULTILINGUAL_AVAILABILITY_SCRIPTS.it!, color: "#ffa8a8" },
  ja: { label: "日本語", script: MULTILINGUAL_AVAILABILITY_SCRIPTS.ja!, color: "#b197fc" },
  hi: { label: "हिन्दी", script: MULTILINGUAL_AVAILABILITY_SCRIPTS.hi!, color: "#ffe066" },
  bn: { label: "বাংলা", script: MULTILINGUAL_AVAILABILITY_SCRIPTS.bn!, color: "#69db7c" },
  ta: { label: "தமிழ்", script: MULTILINGUAL_AVAILABILITY_SCRIPTS.ta!, color: "#ff8787" },
  te: { label: "తెలుగు", script: MULTILINGUAL_AVAILABILITY_SCRIPTS.te!, color: "#66d9e8" },
  mr: { label: "मराठी", script: MULTILINGUAL_AVAILABILITY_SCRIPTS.mr!, color: "#da77f2" },
  gu: { label: "ગુજરાતી", script: MULTILINGUAL_AVAILABILITY_SCRIPTS.gu!, color: "#8ce99a" },
  kn: { label: "ಕನ್ನಡ", script: MULTILINGUAL_AVAILABILITY_SCRIPTS.kn!, color: "#ffc857" },
  ml: { label: "മലയാളം", script: MULTILINGUAL_AVAILABILITY_SCRIPTS.ml!, color: "#63e6be" },
  pa: { label: "ਪੰਜਾਬੀ", script: MULTILINGUAL_AVAILABILITY_SCRIPTS.pa!, color: "#ffe066" },
  od: { label: "ଓଡ଼ିଆ", script: MULTILINGUAL_AVAILABILITY_SCRIPTS.od!, color: "#ffc857" },
};

/** Scroll cycle order — English first, then European, then Indian. */
const MULTILINGUAL_SCROLL_ORDER = [
  "en",
  "es",
  "de",
  "fr",
  "nl",
  "it",
  "ja",
  "hi",
  "bn",
  "ta",
  "te",
  "mr",
  "gu",
  "kn",
  "ml",
  "pa",
  "od",
] as const;

function buildMultilingualLanguages(): MultilingualLanguage[] {
  const duplexSet = new Set<string>(MULTILINGUAL_DUPLEX_LANGUAGE_CODES);
  const orderedIds: string[] = MULTILINGUAL_SCROLL_ORDER.filter((id) => duplexSet.has(id));

  for (const id of MULTILINGUAL_DUPLEX_LANGUAGE_CODES) {
    if (!orderedIds.includes(id)) orderedIds.push(id);
  }

  return orderedIds.map((id) => {
    const entry = MULTILINGUAL_LANGUAGE_CATALOG[id];
    const script = MULTILINGUAL_AVAILABILITY_SCRIPTS[id];
    if (!entry || !script) {
      throw new Error(`Missing multilingual catalog entry for "${id}"`);
    }
    if (entry.script !== script) {
      throw new Error(`Multilingual script drift for "${id}"`);
    }
    return { id, ...entry, script };
  });
}

/** Scroll cycle — one entry per duplex language with availability phrase translations. */
export const MULTILINGUAL_LANGUAGES = buildMultilingualLanguages();

/** Availability phrase for the active language — same string used in the polyglot card + title. */
export function multilingualAvailabilityScript(languageId: string): string {
  return MULTILINGUAL_AVAILABILITY_SCRIPTS[languageId] ?? MULTILINGUAL_AVAILABILITY_PHRASE_EN;
}

export const MULTILINGUAL_PROVIDER_HEADLINE = `${MULTILINGUAL_LANGUAGE_COUNT}+ languages.`;
export const MULTILINGUAL_PROVIDER_BADGE = `${MULTILINGUAL_LANGUAGE_COUNT}+ langs`;
export const MULTILINGUAL_PROVIDER_BADGE_WIDTH = 54;
