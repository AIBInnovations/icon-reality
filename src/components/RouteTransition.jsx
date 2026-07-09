import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageLoader from './PageLoader';

const MIN_LOADER_MS = 750; // never flash for less than this

/**
 * Combined transition controller:
 *  - on every route change (and on initial mount):
 *    - shows a full-screen PageLoader for at least MIN_LOADER_MS
 *    - clears any leftover body scroll lock
 *    - scrolls to top instantly (no Lenis fight)
 *    - refreshes ScrollTrigger AFTER the new page committed its effects
 *  - the loader sits above the footer/header (z-index 9999, position:fixed)
 *    so the page never visibly "boots" without it.
 */
export default function RouteTransition() {
  const { pathname } = useLocation();
  const [active, setActive] = useState(true); // start true so first paint covers everything

  useEffect(() => {
    setActive(true);
    document.body.style.overflow = '';

    // Force every new page to start at the hero (top). Resetting once up-front
    // isn't enough: the incoming page hasn't laid out yet, so if it's shorter
    // than the scroll position we came from (e.g. clicking a card near the page
    // bottom), the reset gets clamped to the new page's bottom = the footer.
    const toTop = () => {
      if (window.lenis) window.lenis.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    };
    toTop();
    // and again next frame, once the new route has rendered
    const raf = requestAnimationFrame(toTop);

    const t = setTimeout(() => {
      ScrollTrigger.refresh();
      toTop(); // final reset after layout + ScrollTrigger settle, before reveal
      setActive(false);
    }, MIN_LOADER_MS);

    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, [pathname]);

  return active ? <PageLoader /> : null;
}
