import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

const META_PIXEL_ID = "1268905655168324";

/**
 * Loads Meta Pixel on ALL pages and fires PageView on every route change.
 * Initializes the SDK once, then tracks subsequent navigations.
 */
export function useMetaPixel(): void {
  const location = useLocation();
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const noscriptRef = useRef<HTMLElement | null>(null);
  const initializedRef = useRef(false);

  // Initialize the pixel SDK once
  useEffect(() => {
    if (initializedRef.current || window.fbq) {
      return;
    }
    initializedRef.current = true;

      // Initialize fbq
      const n: any = (window.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      });
      if (!window._fbq) window._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];

      // Inject the SDK script
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(script);
      scriptRef.current = script;

      // Inject noscript fallback
      const noscript = document.createElement("noscript");
      const img = document.createElement("img");
      img.height = 1;
      img.width = 1;
      img.style.display = "none";
      img.src = `https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`;
      noscript.appendChild(img);
      document.body.appendChild(noscript);
      noscriptRef.current = noscript;

    window.fbq("init", META_PIXEL_ID);
    window.fbq("track", "PageView");

    // Cleanup only on unmount (app-level)
    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove();
        scriptRef.current = null;
      }
      if (noscriptRef.current) {
        noscriptRef.current.remove();
        noscriptRef.current = null;
      }
    };
  }, []);

  // Fire PageView on every route change
  useEffect(() => {
    if (window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [location.pathname]);
}
