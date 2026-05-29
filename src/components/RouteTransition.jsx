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
    window.scrollTo(0, 0);

    const t = setTimeout(() => {
      ScrollTrigger.refresh();
      setActive(false);
    }, MIN_LOADER_MS);

    return () => clearTimeout(t);
  }, [pathname]);

  return active ? <PageLoader /> : null;
}
