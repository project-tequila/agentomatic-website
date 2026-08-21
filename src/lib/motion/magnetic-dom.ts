/**
 * Resolve the node to magnetically translate without mutating React's tree.
 *
 * Never create or reparent a `.magnetic-inner` wrapper — that steals children
 * React still owns and crashes with removeChild on the next commit.
 */
export function magneticTransformTarget<T extends { querySelector(selectors: string): T | null }>(
  el: T,
): T {
  return el.querySelector(":scope > .magnetic-inner") ?? el;
}
