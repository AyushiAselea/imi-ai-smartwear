/**
 * Global button click tracker for Google Analytics + backend.
 * Uses event delegation — no UI modifications.
 * Tracks all <button> and <a> clicks site-wide, including dynamically added elements.
 */

import { trackEvent } from "@/lib/api";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Grab or create the analytics session id (same logic as analytics.ts) */
function getSessionId(): string {
  let sid = sessionStorage.getItem("imi_session_id");
  if (!sid) {
    sid = `s_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    sessionStorage.setItem("imi_session_id", sid);
  }
  return sid;
}

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android.*mobile|blackberry|opera mini|iemobile/i.test(ua)) return "mobile";
  return "desktop";
}

function getBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  return "Other";
}

function getOS(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac OS")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  return "Other";
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

      const pagePath = window.location.pathname;

      // 1️⃣ Send to Google Analytics
      if (typeof window.gtag === "function") {
        window.gtag("event", "button_click", {
          button_text: text,
          page_path: pagePath,
          page_url: window.location.href,
          element_tag: button.tagName.toLowerCase(),
        });
      }

      // 2️⃣ Send to backend (shows in admin analytics panel)
      trackEvent({
        sessionId: getSessionId(),
        page: pagePath,
        eventType: "click",
        deviceType: getDeviceType(),
        browser: getBrowser(),
        os: getOS(),
        metadata: {
          buttonText: text,
          elementTag: button.tagName.toLowerCase(),
          pageUrl: window.location.href,
        },
      });
    },
    { capture: true, passive: true }
  );
}
