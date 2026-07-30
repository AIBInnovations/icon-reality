import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from './track';

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

  // One delegated listener turns every contact/download link on the site into a
  // GA event — no need to wire each of the many tel:/mailto:/WhatsApp/brochure
  // links scattered across the header, footer, dock, contact & project pages,
  // and any added later is tracked automatically. Capture phase so it still
  // fires if a handler calls stopPropagation.
  useEffect(() => {
    if (!GA_ID) return;
    const onClick = (e) => {
      const a = e.target.closest?.('a[href]');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      const text = (a.textContent || '').trim().slice(0, 100);

      if (href.startsWith('tel:')) {
        trackEvent('call_click', { link_url: href, link_text: text });
      } else if (href.startsWith('mailto:')) {
        trackEvent('email_click', { link_url: href, link_text: text });
      } else if (/wa\.me|whatsapp\.com/i.test(href)) {
        trackEvent('whatsapp_click', { link_url: href, link_text: text });
      } else if (/maps\.google|google\.[a-z.]+\/maps/i.test(href)) {
        trackEvent('directions_click', { link_url: href, link_text: text });
      } else if (/\.pdf($|\?)/i.test(href) || a.hasAttribute('download')) {
        // GA4 recommended event name
        trackEvent('file_download', {
          file_name: href.split('/').pop()?.split('?')[0] || href,
          link_url: href,
          link_text: text,
        });
      }
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
