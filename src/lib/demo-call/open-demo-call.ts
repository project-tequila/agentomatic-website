export const DEMO_CALL_OPEN_EVENT = "agentomatic:open-demo-call";

/** Opens the global demo-call strip — does not scroll the story. */
export function openDemoCall() {
  window.dispatchEvent(new CustomEvent(DEMO_CALL_OPEN_EVENT));
}
