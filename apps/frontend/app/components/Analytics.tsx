'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Analytics component for tracking page views
 * 
 * To use Plausible Analytics:
 * 1. Sign up at https://plausible.io (free for 10k pageviews/month)
 * 2. Add your domain
 * 3. Set NEXT_PUBLIC_PLAUSIBLE_DOMAIN in your .env.local
 * 
 * To use Vercel Analytics:
 * 1. Install: npm install @vercel/analytics
 * 2. Import and add <Analytics /> to your layout
 * 3. Works automatically if deployed on Vercel
 * 
 * To use Umami (self-hosted):
 * 1. Set NEXT_PUBLIC_UMAMI_WEBSITE_ID and NEXT_PUBLIC_UMAMI_SCRIPT_URL
 * 2. Or use the Umami Cloud service
 * 
 * To use Cloudflare Web Analytics:
 * 1. Set NEXT_PUBLIC_CF_BEACON_TOKEN in your .env.local
 * 2. Get token from Cloudflare dashboard
 */

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
    umami?: {
      track: (event: string, data?: Record<string, string>) => void;
    };
  }
}

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page view for SPA navigation
    // Note: Initial page loads are tracked automatically by the script tags
    // This handles client-side navigation in Next.js
    
    // Plausible Analytics - tracks SPA navigation automatically via script
    // Manual tracking is optional for custom paths
    if (window.plausible) {
      // Plausible handles SPA navigation automatically, but we can manually track if needed
      // Uncomment if you want custom tracking:
      // window.plausible('pageview', { props: { path: pathname } });
    }

    // Umami Analytics - manual tracking for SPA navigation
    if (window.umami) {
      window.umami.track('pageview', { path: pathname });
    }

    // Cloudflare Web Analytics - handled automatically via script tag
  }, [pathname, searchParams]);

  return null;
}

/**
 * Helper function to track custom events
 */
export function trackEvent(eventName: string, properties?: Record<string, string>) {
  // Plausible
  if (window.plausible) {
    window.plausible(eventName, { props: properties });
  }

  // Umami
  if (window.umami) {
    window.umami.track(eventName, properties);
  }
}

