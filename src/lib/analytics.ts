import { trackEvent, trackEventsBatch } from "@/lib/api";

// ─── Session Management ─────────────────────────────────────

let sessionId = "";
let entryPage = "";
let currentPage = "";
let pageStartTime = 0;
let sessionStartTime = 0;
let pageViewCount = 0;
let pendingEvents: unknown[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function getSessionId(): string {
  if (sessionId) return sessionId;
  const stored = sessionStorage.getItem("imi_session_id");
  if (stored) {
    sessionId = stored;
  } else {
    sessionId = `s_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    sessionStorage.setItem("imi_session_id", sessionId);
  }
  return sessionId;
}

// ─── Device Detection ────────────────────────────────────────

function getDeviceType(): "desktop" | "tablet" | "mobile" {
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

function getScreenResolution(): string {
  return `${window.screen.width}x${window.screen.height}`;
}

// ─── Event Batching ──────────────────────────────────────────

function queueEvent(event: unknown) {
  pendingEvents.push(event);

  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(flushEvents, 5000); // Flush every 5 seconds

  // Immediate flush if batch is large
  if (pendingEvents.length >= 10) {
    flushEvents();
  }
}

function flushEvents() {
  if (pendingEvents.length === 0) return;
  const batch = [...pendingEvents];
  pendingEvents = [];
  trackEventsBatch(batch);
}

// ─── Core Tracking Functions ─────────────────────────────────

function getUserId(): string | undefined {
  // Try to get user ID from localStorage (if user is logged in via backend)
  try {
    const stored = localStorage.getItem("imi_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed._id || parsed.id;
    }
  } catch { /* noop */ }
  return undefined;
}

export function trackPageView(page: string) {
  const sid = getSessionId();
  const now = Date.now();

  // Track time spent on previous page
  if (currentPage && pageStartTime > 0) {
    const timeSpent = now - pageStartTime;
    queueEvent({
      sessionId: sid,
      userId: getUserId(),
      page: currentPage,
      timeSpent,
      eventType: "pageview",
      deviceType: getDeviceType(),
      browser: getBrowser(),
      os: getOS(),
      screenResolution: getScreenResolution(),
      metadata: { timeSpentUpdate: true },
    });
  }

  // Set entry page for the session
  if (!entryPage) {
    entryPage = page;
    sessionStartTime = now;
  }

  currentPage = page;
  pageStartTime = now;
  pageViewCount++;

  // Track the pageview
  const event = {
    sessionId: sid,
    userId: getUserId(),
    page,
    referrer: document.referrer || "",
    entryPage,
    deviceType: getDeviceType(),
    browser: getBrowser(),
    os: getOS(),
    screenResolution: getScreenResolution(),
    eventType: "pageview" as const,
  };

  queueEvent(event);
}

export function trackSessionEnd() {
  const sid = getSessionId();
  const now = Date.now();

  const sessionDuration = sessionStartTime > 0 ? now - sessionStartTime : 0;
  const timeSpent = pageStartTime > 0 ? now - pageStartTime : 0;

  const event = {
    sessionId: sid,
    userId: getUserId(),
    page: currentPage,
    exitPage: currentPage,
    entryPage,
    timeSpent,
    sessionDuration,
    isBounce: pageViewCount <= 1,
    eventType: "session_end" as const,
    deviceType: getDeviceType(),
    browser: getBrowser(),
    os: getOS(),
    screenResolution: getScreenResolution(),
  };

  // Use beacon API for reliable delivery on page close
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  try {
    const blob = new Blob([JSON.stringify(event)], { type: "application/json" });
    navigator.sendBeacon(`${API_URL}/analytics/track`, blob);
  } catch {
    trackEvent(event);
  }
}

// ─── Initialize Tracker ─────────────────────────────────────

export function initAnalytics() {
  // Track session end on page unload
  window.addEventListener("beforeunload", () => {
    flushEvents();
    trackSessionEnd();
  });

  // Track visibility change (tab switching)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushEvents();
    }
  });
}
