const SESSION_KEY = "agentomatic:booker-session";

export type BookerSession = {
  email: string;
  signedInAt: string;
};

export function getBookerSession(): BookerSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BookerSession;
    if (!parsed.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setBookerSession(email: string) {
  const session: BookerSession = { email, signedInAt: new Date().toISOString() };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearBookerSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export const DEFAULT_APPOINTMENT_BOOKER_URL = "https://appointment-booker-nine.vercel.app";

export const APPOINTMENT_BOOKER_URL =
  process.env.NEXT_PUBLIC_APPOINTMENT_BOOKER_URL ?? DEFAULT_APPOINTMENT_BOOKER_URL;

/** Internal sign-in route; redirects to the appointment booker. */
export const BOOKER_ROUTE = "/signin";
