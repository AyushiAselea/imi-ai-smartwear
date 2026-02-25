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

  // Meta Pixel — only active on /product/mark-1
  useMetaPixel();

  return null;
};

export default RouteTracker;
