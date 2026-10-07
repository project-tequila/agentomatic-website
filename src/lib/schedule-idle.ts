/**
 * Run work after the first paint. `requestIdleCallback` yields to LCP;
 * the timeout keeps the homepage story from waiting forever on a busy phone.
 */
export function scheduleIdle(task: () => void, timeout = 1500): () => void {
  if (typeof window === "undefined") return () => {};

  const idleWindow = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };

  if (idleWindow.requestIdleCallback) {
    const id = idleWindow.requestIdleCallback(task, { timeout });
    return () => idleWindow.cancelIdleCallback?.(id);
  }

  const id = window.setTimeout(task, Math.min(timeout, 400));
  return () => window.clearTimeout(id);
}
