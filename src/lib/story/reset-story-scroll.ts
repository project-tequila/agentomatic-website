export const STORY_SCROLL_RESET_EVENT = "agentomatic:story-scroll-reset";
export const STORY_SLIDE_GOTO_EVENT = "agentomatic:story-slide-goto";

export type StorySlideGotoDetail = {
  index?: number;
  id?: string;
};

/** Scrolls the homepage story scroller back to the first beat (hero). */
export function requestStoryScrollReset() {
  window.dispatchEvent(new CustomEvent(STORY_SCROLL_RESET_EVENT));
}

/** Jump the homepage pager to a discrete beat and replay its in-page animation. */
export function requestStorySlide(detail: StorySlideGotoDetail) {
  window.dispatchEvent(new CustomEvent<StorySlideGotoDetail>(STORY_SLIDE_GOTO_EVENT, { detail }));
}
