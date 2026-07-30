/**
 * Fire a GA4 event. No-ops until gtag has loaded (i.e. when VITE_GA_ID is
 * unset, or before Analytics has initialised), so callers never need to guard.
 * Empty/undefined params are dropped so the GA reports stay clean.
 */
export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined' || !window.gtag) return;
  const clean = {};
  for (const k in params) {
    const v = params[k];
    if (v !== undefined && v !== null && v !== '') clean[k] = v;
  }
  window.gtag('event', name, clean);
}
