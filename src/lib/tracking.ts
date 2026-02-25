import { fetchTrackingSettings, type TrackingSettings } from "@/lib/api";

let initialized = false;

/**
 * Dynamically loads third-party tracking scripts based on admin configuration.
 * Called once on app startup. Does NOT modify any visible UI.
 */
export async function loadTrackingScripts(): Promise<void> {
  if (initialized) return;
  initialized = true;

  try {
    const settings: TrackingSettings = await fetchTrackingSettings();

    // Facebook Pixel
    if (settings.facebookPixelId) {
      loadFacebookPixel(settings.facebookPixelId);
    }

    // Google Analytics
    if (settings.googleAnalyticsId) {
      loadGoogleAnalytics(settings.googleAnalyticsId);
    }

    // Meta Insights (if different from FB Pixel)
    if (settings.metaInsightsId && settings.metaInsightsId !== settings.facebookPixelId) {
      loadMetaInsights(settings.metaInsightsId);
    }

    // Custom scripts
    if (settings.customScripts && settings.customScripts.length > 0) {
      settings.customScripts.forEach((script) => {
        if (script.isActive && script.script) {
          injectCustomScript(script.script, script.placement);
        }
      });
    }
  } catch {
    // Silently fail — tracking should never break the app
  }
}

function loadFacebookPixel(pixelId: string) {
  const w = window as any;
  if (w.fbq) return;
  const n: any = (w.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  });
  if (!w._fbq) w._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  w.fbq("init", pixelId);
  w.fbq("track", "PageView");
}

function loadGoogleAnalytics(gaId: string) {
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);

  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  function gtag(...args: unknown[]) {
    w.dataLayer.push(args);
  }
  w.gtag = gtag;
  gtag("js", new Date());
  gtag("config", gaId);
}

function loadMetaInsights(metaId: string) {
  // Meta Insights uses the same pixel as FB, just with a different ID
  if ((window as any).fbq) {
    (window as any).fbq("init", metaId);
  }
}

function injectCustomScript(scriptContent: string, placement: string) {
  try {
    const scriptEl = document.createElement("script");
    scriptEl.textContent = scriptContent;

    switch (placement) {
      case "head":
        document.head.appendChild(scriptEl);
        break;
      case "body_start":
        document.body.insertBefore(scriptEl, document.body.firstChild);
        break;
      case "body_end":
      default:
        document.body.appendChild(scriptEl);
        break;
    }
  } catch {
    // Silently fail
  }
}
