/**
 * Normalize visitor input to E.164 for telephony providers.
 * Requires a leading + and country code (10–15 digits after +).
 */
export function normalizeToE164(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("+")) return null;

  const digits = trimmed.slice(1).replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return null;

  const normalized = `+${digits}`;
  if (!/^\+\d{10,15}$/.test(normalized)) return null;
  return normalized;
}
