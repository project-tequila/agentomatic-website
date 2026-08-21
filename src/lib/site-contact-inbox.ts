/**
 * Server-side inbox for inbound leads. Do not import this module from client
 * components or render the address in public HTML (contact, privacy, JSON-LD,
 * or API error bodies). Override with NEXT_PUBLIC_CONTACT_EMAIL.
 */
export const DEFAULT_CONTACT_EMAIL = "pranay@agentomatic.in";

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || DEFAULT_CONTACT_EMAIL;
