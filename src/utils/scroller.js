/**
 * Where the page scrolls, in one place.
 *
 * On touch devices the document itself never scrolls: #root does. Mobile
 * browsers only collapse and expand their address and tab bars when the
 * document scrolls, so scrolling an inner element keeps those bars exactly
 * where they are and the site sits between them instead of sliding under them.
 * index.html decides once, before first paint, by putting .scroll-lock on
 * <html> for touch-first devices; index.css makes #root the scroller. On
 * desktop nothing changes: the window scrolls, as it always has.
 *
 * So anything that reads or sets the scroll position, listens for scrolling,
 * or freezes the page behind an overlay goes through here, never straight to
 * window or document.body, or it silently does nothing on phones. Lenis
 * (hooks/useLenis.js) and every ScrollTrigger are pointed at the same element.
 */

export const isScrollLocked = () =>
  typeof document !== 'undefined' && document.documentElement.classList.contains('scroll-lock');

const rootEl = () => document.getElementById('root');

/** The thing that scrolls: #root on touch devices, otherwise the window. */
export function scrollContainer() {
  return (isScrollLocked() && rootEl()) || window;
}

/** Current vertical scroll position of the page. */
export function scrollTop() {
  const c = scrollContainer();
  return c === window ? window.scrollY : c.scrollTop;
}

/** Jump to the top of the page (route changes, page mounts). */
export function scrollToTop() {
  scrollContainer().scrollTo(0, 0);
}

/** Scroll the page to `top` px. */
export function scrollToY(top, behavior = 'auto') {
  scrollContainer().scrollTo({ top, behavior });
}

/** Listen for page scrolling; returns the unsubscribe. */
export function onPageScroll(handler) {
  const c = scrollContainer();
  c.addEventListener('scroll', handler, { passive: true });
  return () => c.removeEventListener('scroll', handler);
}

/**
 * Freeze the page behind an overlay; returns the undo, which puts back exactly
 * what it found, so overlays can stack.
 */
export function lockPageScroll() {
  const host = isScrollLocked() ? rootEl() : document.body;
  if (!host) return () => {};
  const prev = host.style.overflow;
  host.style.overflow = 'hidden';
  return () => { host.style.overflow = prev; };
}

/** Route changes clear any freeze an overlay failed to release. */
export function clearPageScrollLock() {
  document.body.style.overflow = '';
  const root = rootEl();
  if (root) root.style.overflow = '';
}
