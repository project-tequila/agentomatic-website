export const COOKIE_CONSENT_KEY = "agentomatic-cookie-consent";

export type CookieConsent = "accepted" | "declined";

export const GA_MEASUREMENT_ID = "G-DTVTGE7GB6";

export function parseCookieConsent(value: string | null): CookieConsent | null {
  if (value === "accepted" || value === "declined") return value;
  return null;
}
