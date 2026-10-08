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

const MOBILE_VIEWPORT = "(max-width: 767px)";

/**
 * Phone-sized viewports wait for a tap or key before running heavy work, with a
 * long fallback so the story still arrives if nobody interacts. A touch fires
 * before scroll, so the 3D scene still starts when someone moves through the
 * page. Wider screens keep the short idle timeout.
 */
export function scheduleWhenEngaged(task: () => void, desktopTimeout = 1500): () => void {
  if (typeof window === "undefined") return () => {};
  if (!window.matchMedia(MOBILE_VIEWPORT).matches) return scheduleIdle(task, desktopTimeout);

  let ran = false;
  const events = ["pointerdown", "keydown", "touchstart"] as const;

  const run = () => {
    if (ran) return;
    ran = true;
    cleanup();
    task();
  };

  for (const event of events) {
    window.addEventListener(event, run, { once: true, passive: true });
  }
  const timer = window.setTimeout(run, 12000);

  function cleanup() {
    for (const event of events) window.removeEventListener(event, run);
    window.clearTimeout(timer);
  }

  return cleanup;
}
