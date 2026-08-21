/** Public Twilio / business line in E.164 (e.g. +14155551234). Set in NEXT_PUBLIC_CONTACT_PHONE. */
export const CONTACT_PHONE_E164 = process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() ?? "";

/** Human-readable label for the contact phone (falls back to raw E.164). */
export function formatContactPhoneDisplay(e164: string): string {
  if (!e164) return "";

  if (e164.startsWith("+1") && e164.length === 12) {
    const d = e164.slice(2);
    return `+1 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  }

  if (e164.startsWith("+91") && e164.length === 13) {
    const d = e164.slice(3);
    return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
  }

  return e164;
}

/** `tel:` href for the public contact number. */
export function contactPhoneTelHref(e164: string): string {
  return `tel:${e164}`;
}
