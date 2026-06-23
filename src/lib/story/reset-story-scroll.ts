export const STORY_SCROLL_RESET_EVENT = "agentomatic:story-scroll-reset";

/** Scrolls the homepage story scroller back to the first beat (hero). */
export function requestStoryScrollReset() {
  window.dispatchEvent(new CustomEvent(STORY_SCROLL_RESET_EVENT));
}
