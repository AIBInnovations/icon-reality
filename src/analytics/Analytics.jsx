import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Google Analytics 4 for the SPA.
 *
 * Loads gtag.js only when VITE_GA_ID is set (so local dev and preview builds
 * stay out of the property unless you opt in), and — because React Router never
 * does a full page reload — sends one page_view manually on every route change,
 * including the first render. Automatic page_view is disabled in config to
 * avoid double-counting the initial load.
 *
 * Set VITE_GA_ID=G-XXXXXXXXXX in .env.local (dev) and in the Vercel dashboard
 * (production). Without it this component renders nothing and injects no script.
 */
const GA_ID = import.meta.env.VITE_GA_ID;

let initialised = false;
function initGa() {
  if (initialised || !GA_ID || typeof window === 'undefined') return;
  initialised = true;

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  // gtag must push `arguments` verbatim — do not refactor to (...args)
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  // send_page_view:false — route changes are tracked manually below
  gtag('config', GA_ID, { send_page_view: false });
}

export default function Analytics() {
  const { pathname, search } = useLocation();
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (!GA_ID) return;
    if (!bootstrapped.current) {
      initGa();
      bootstrapped.current = true;
    }
    window.gtag?.('event', 'page_view', {
      page_path: pathname + search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, search]);

  return null;
}
