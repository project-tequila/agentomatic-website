/**
 * Cascaded demo/call languages (Deepgram duplex, then Sarvam Indic).
 *
 * The in-browser speech LLM uses `SPEECH_LLM_LANGUAGE_OPTIONS` instead.
 * Legacy `or` normalizes to canonical `od` on this list.
 */
export const VOICE_LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "nl", label: "Dutch" },
  { value: "it", label: "Italian" },
  { value: "ja", label: "Japanese" },
  { value: "hi", label: "Hindi" },
  { value: "bn", label: "Bengali" },
  { value: "ta", label: "Tamil" },
  { value: "te", label: "Telugu" },
  { value: "kn", label: "Kannada" },
  { value: "ml", label: "Malayalam" },
  { value: "mr", label: "Marathi" },
  { value: "gu", label: "Gujarati" },
  { value: "pa", label: "Punjabi" },
  { value: "od", label: "Odia" },
  { value: "as", label: "Assamese" },
  { value: "ur", label: "Urdu" },
  { value: "ne", label: "Nepali" },
  { value: "kok", label: "Konkani" },
  { value: "ks", label: "Kashmiri" },
  { value: "sd", label: "Sindhi" },
  { value: "sa", label: "Sanskrit" },
  { value: "sat", label: "Santali" },
  { value: "mni", label: "Manipuri" },
  { value: "brx", label: "Bodo" },
  { value: "mai", label: "Maithili" },
  { value: "doi", label: "Dogri" },
] as const;

export type VoiceLanguageCode = (typeof VOICE_LANGUAGE_OPTIONS)[number]["value"];

/** Cascaded LLM language speaker. Same catalog the phone demo already uses. */
export const CASCADE_VOICE_LANGUAGE_OPTIONS = VOICE_LANGUAGE_OPTIONS;

/**
 * Gemini Live languages the speech LLM can speak on the marketing demo.
 * Odia is `or` here. The cascaded picker keeps Sarvam's `od`.
 */
export const SPEECH_LLM_LANGUAGE_OPTIONS = [
  { value: "af", label: "Afrikaans" },
  { value: "ak", label: "Akan" },
  { value: "sq", label: "Albanian" },
  { value: "am", label: "Amharic" },
  { value: "ar", label: "Arabic" },
  { value: "hy", label: "Armenian" },
  { value: "as", label: "Assamese" },
  { value: "az", label: "Azerbaijani" },
  { value: "eu", label: "Basque" },
  { value: "be", label: "Belarusian" },
  { value: "bn", label: "Bengali" },
  { value: "bs", label: "Bosnian" },
  { value: "bg", label: "Bulgarian" },
  { value: "my", label: "Burmese" },
  { value: "ca", label: "Catalan" },
  { value: "ceb", label: "Cebuano" },
  { value: "zh-Hans", label: "Chinese (Simplified)" },
  { value: "zh-Hant", label: "Chinese (Traditional)" },
  { value: "hr", label: "Croatian" },
  { value: "cs", label: "Czech" },
  { value: "da", label: "Danish" },
  { value: "nl", label: "Dutch" },
  { value: "en", label: "English" },
  { value: "et", label: "Estonian" },
  { value: "fo", label: "Faroese" },
  { value: "fil", label: "Filipino" },
  { value: "fi", label: "Finnish" },
  { value: "fr", label: "French" },
  { value: "gl", label: "Galician" },
  { value: "ka", label: "Georgian" },
  { value: "de", label: "German" },
  { value: "el", label: "Greek" },
  { value: "gu", label: "Gujarati" },
  { value: "ha", label: "Hausa" },
  { value: "he", label: "Hebrew" },
  { value: "hi", label: "Hindi" },
  { value: "hu", label: "Hungarian" },
  { value: "is", label: "Icelandic" },
  { value: "id", label: "Indonesian" },
  { value: "ga", label: "Irish" },
  { value: "it", label: "Italian" },
  { value: "ja", label: "Japanese" },
  { value: "kn", label: "Kannada" },
  { value: "kk", label: "Kazakh" },
  { value: "km", label: "Khmer" },
  { value: "rw", label: "Kinyarwanda" },
  { value: "ko", label: "Korean" },
  { value: "ku", label: "Kurdish" },
  { value: "ky", label: "Kyrgyz" },
  { value: "lo", label: "Lao" },
  { value: "lv", label: "Latvian" },
  { value: "lt", label: "Lithuanian" },
  { value: "mk", label: "Macedonian" },
  { value: "ms", label: "Malay" },
  { value: "ml", label: "Malayalam" },
  { value: "mt", label: "Maltese" },
  { value: "mi", label: "Maori" },
  { value: "mr", label: "Marathi" },
  { value: "mn", label: "Mongolian" },
  { value: "ne", label: "Nepali" },
  { value: "no", label: "Norwegian" },
  { value: "nb", label: "Norwegian Bokmål" },
  { value: "or", label: "Odia" },
  { value: "om", label: "Oromo" },
  { value: "ps", label: "Pashto" },
  { value: "fa", label: "Persian" },
  { value: "pl", label: "Polish" },
  { value: "pt-BR", label: "Portuguese (Brazil)" },
  { value: "pt-PT", label: "Portuguese (Portugal)" },
  { value: "pa", label: "Punjabi" },
  { value: "qu", label: "Quechua" },
  { value: "ro", label: "Romanian" },
  { value: "rm", label: "Romansh" },
  { value: "ru", label: "Russian" },
  { value: "sr", label: "Serbian" },
  { value: "sd", label: "Sindhi" },
  { value: "si", label: "Sinhala" },
  { value: "sk", label: "Slovak" },
  { value: "sl", label: "Slovenian" },
  { value: "so", label: "Somali" },
  { value: "st", label: "Southern Sotho" },
  { value: "es", label: "Spanish" },
  { value: "sw", label: "Swahili" },
  { value: "sv", label: "Swedish" },
  { value: "tg", label: "Tajik" },
  { value: "ta", label: "Tamil" },
  { value: "te", label: "Telugu" },
  { value: "th", label: "Thai" },
  { value: "tn", label: "Tswana" },
  { value: "tr", label: "Turkish" },
  { value: "tk", label: "Turkmen" },
  { value: "uk", label: "Ukrainian" },
  { value: "ur", label: "Urdu" },
  { value: "uz", label: "Uzbek" },
  { value: "vi", label: "Vietnamese" },
  { value: "cy", label: "Welsh" },
  { value: "fy", label: "Western Frisian" },
  { value: "wo", label: "Wolof" },
  { value: "yo", label: "Yoruba" },
  { value: "zu", label: "Zulu" },
] as const;

export type SpeechLlmLanguageCode = (typeof SPEECH_LLM_LANGUAGE_OPTIONS)[number]["value"];

export type DemoVoiceEngine = "speech_llm" | "cascade";

export const DEFAULT_DEMO_VOICE_ENGINE: DemoVoiceEngine = "speech_llm";

const VOICE_LANGUAGE_CODES = new Set<string>(VOICE_LANGUAGE_OPTIONS.map((option) => option.value));

const SPEECH_LLM_LANGUAGE_CODES = new Set<string>(
  SPEECH_LLM_LANGUAGE_OPTIONS.map((option) => option.value),
);

const SPEECH_LLM_LANGUAGE_BY_LOWER = new Map<string, SpeechLlmLanguageCode>(
  SPEECH_LLM_LANGUAGE_OPTIONS.map((option) => [option.value.toLowerCase(), option.value]),
);

const SPEECH_LLM_ALIASES: Record<string, SpeechLlmLanguageCode> = {
  od: "or",
  "or-in": "or",
  zh: "zh-Hans",
  "zh-cn": "zh-Hans",
  "zh-hans": "zh-Hans",
  "zh-tw": "zh-Hant",
  "zh-hant": "zh-Hant",
  "zh-hk": "zh-Hant",
  pt: "pt-BR",
  "pt-br": "pt-BR",
  "pt-pt": "pt-PT",
  tl: "fil",
  "tl-ph": "fil",
};

/** Default language when the visitor does not pick one. */
export const DEFAULT_DEMO_VOICE_LANGUAGE: VoiceLanguageCode = "en";

/**
 * Normalize a visitor language choice to a selectable voice code.
 */
export function normalizeVoiceLanguage(language: string | null | undefined): VoiceLanguageCode {
  const languageCode = (language ?? DEFAULT_DEMO_VOICE_LANGUAGE).split("-")[0]!.toLowerCase();
  const canonicalLanguageCode = languageCode === "or" ? "od" : languageCode;
  return VOICE_LANGUAGE_CODES.has(canonicalLanguageCode)
    ? (canonicalLanguageCode as VoiceLanguageCode)
    : DEFAULT_DEMO_VOICE_LANGUAGE;
}

/**
 * Normalize a speech-LLM language onto a Gemini Live code.
 */
export function normalizeSpeechLlmLanguage(
  language: string | null | undefined,
): SpeechLlmLanguageCode {
  const raw = (language ?? "en").trim().replace(/_/g, "-");
  if (!raw) return "en";
  const lower = raw.toLowerCase();
  const aliased = SPEECH_LLM_ALIASES[lower];
  if (aliased && SPEECH_LLM_LANGUAGE_CODES.has(aliased)) return aliased;
  const exact = SPEECH_LLM_LANGUAGE_BY_LOWER.get(lower);
  if (exact) return exact;
  const primary = lower.split("-")[0] ?? "";
  const primaryAlias = SPEECH_LLM_ALIASES[primary];
  if (primaryAlias && SPEECH_LLM_LANGUAGE_CODES.has(primaryAlias)) return primaryAlias;
  const primaryMatch = SPEECH_LLM_LANGUAGE_BY_LOWER.get(primary);
  return primaryMatch ?? "en";
}

/**
 * Accept only the two public demo voice engines.
 */
export function parseDemoVoiceEngine(value: string | null | undefined): DemoVoiceEngine | null {
  if (value === "speech_llm" || value === "cascade") return value;
  return null;
}
