/**
 * Opens the immersive voice focus UI and starts the browser demo session.
 * Dispatch from orb, chrome CTA, or story CTAs — one entry point.
 */
export const BEGIN_VOICE_DEMO_EVENT = "agentomatic:begin-voice-demo";

export function beginVoiceDemo() {
  window.dispatchEvent(new CustomEvent(BEGIN_VOICE_DEMO_EVENT));
}

/** @deprecated use beginVoiceDemo — kept for scroll-reveal strip compatibility */
export const DEMO_CALL_OPEN_EVENT = "agentomatic:open-demo-call";

export function openDemoCall() {
  window.dispatchEvent(new CustomEvent(DEMO_CALL_OPEN_EVENT));
}
