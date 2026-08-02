/**
 * Selectable demo/call languages (mirrors appointment-booker ai_service indic_config).
 *
 * English plus Indic STT/TTS matrix. Legacy `or` normalizes to canonical `od`.
 */
export const VOICE_LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
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

const VOICE_LANGUAGE_CODES = new Set<string>(VOICE_LANGUAGE_OPTIONS.map((option) => option.value));

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
