import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Route-change side effects. No cover, no loader — navigating from the nav bar
 * used to drop a full-screen PageLoader for 550ms and then wipe it away, which
 * made every link feel like a page reload. The new page now cross-fades in
 * (see .page-fade in index.css) and this component just handles the mechanics:
 *
 *  - clears any leftover body scroll lock (e.g. an open modal)
 *  - scrolls to top instantly (no Lenis fight)
 *  - refreshes ScrollTrigger once the new page has committed its effects
 */
export default function RouteTransition() {
  const { pathname } = useLocation();

  useEffect(() => {
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

    // Short enough to land inside the fade-in, so the final clamp correction
    // isn't visible as a jump.
    const t = setTimeout(() => {
      ScrollTrigger.refresh();
      toTop();
    }, 150);

    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, [pathname]);

  return null;
}
