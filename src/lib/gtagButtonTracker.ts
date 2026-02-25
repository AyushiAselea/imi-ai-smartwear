/**
 * Global button click tracker for Google Analytics.
 * Uses event delegation — no UI modifications.
 * Tracks all <button> and <a> clicks site-wide, including dynamically added elements.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;

export function initButtonClickTracking(): void {
  if (initialized) return;
  initialized = true;

  document.addEventListener(
    "click",
    (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Walk up the DOM to find the closest button or anchor
      const button = target.closest("button, a, [role='button']") as HTMLElement | null;
      if (!button) return;

      // Extract readable label
      const text =
        button.getAttribute("aria-label") ||
        button.textContent?.trim().substring(0, 80) ||
        button.getAttribute("title") ||
        "unknown";

      // Skip empty / icon-only buttons with no labels
      if (text === "unknown" && !button.getAttribute("aria-label")) return;

      if (typeof window.gtag === "function") {
        window.gtag("event", "button_click", {
          button_text: text,
          page_path: window.location.pathname,
          page_url: window.location.href,
          element_tag: button.tagName.toLowerCase(),
        });
      }
    },
    { capture: true, passive: true }
  );
}
