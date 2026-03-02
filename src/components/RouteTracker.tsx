import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";
import { useMetaPixel } from "@/hooks/useMetaPixel";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Invisible component that tracks route changes for analytics.
 * Also sends GA page_view on SPA navigation and loads Meta Pixel on Mark 1 page.
 * Does NOT render any UI elements.
 */
const RouteTracker = () => {
  const location = useLocation();

  // Internal analytics
  useEffect(() => {
    trackPageView(location.pathname + location.search);

    // Send page_view to Google Analytics on SPA route change
    if (typeof window.gtag === "function") {
      window.gtag("config", "G-2L86LZED1E", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  // Scroll to hash when present (supports SPA navigation to anchors)
  useEffect(() => {
    const hash = location.hash;
    // small delay to allow page content to render
    if (hash) {
      const id = hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id) || document.querySelector(`[name="${id}"]`);
        if (el) {
          const rect = el.getBoundingClientRect();
          const absoluteY = rect.top + window.pageYOffset;
          const OFFSET = 120; // adjust so element is not hidden under fixed header
          window.scrollTo({ top: Math.max(0, absoluteY - OFFSET), behavior: "smooth" });
        }
      }, 60);
    }
  }, [location.pathname, location.hash]);

  // Meta Pixel — only active on /product/mark-1
  useMetaPixel();

  return null;
};

export default RouteTracker;
