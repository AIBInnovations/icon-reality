import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToSection } from '../utils/scrollTo';

/**
 * Route-change side effects. No cover, no loader — navigating from the nav bar
 * used to drop a full-screen PageLoader for 550ms and then wipe it away, which
 * made every link feel like a page reload. The new page now cross-fades in
 * (see .page-fade in index.css) and this component just handles the mechanics:
 *
 *  - clears any leftover body scroll lock (e.g. an open modal)
 *  - scrolls to top instantly (no Lenis fight)
 *  - or, when the URL carries a hash, to that section instead
 *  - refreshes ScrollTrigger once the new page has committed its effects
 *
 * The hash branch exists because the NRI Corner and the Channel Partner
 * programme are single pages built out of sections: the header's dropdowns
 * point at /nri#taxation and /channel-partners#register, and those links have
 * to work from any other route as well as from the page itself.
 */
export default function RouteTransition() {
  const { pathname, hash } = useLocation();
  const lastPath = useRef(pathname);

  useEffect(() => {
    document.body.style.overflow = '';

    const samePage = lastPath.current === pathname;
    lastPath.current = pathname;

    const timers = [];
    let cancelled = false;
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));

    /* ---------- hash: scroll to the section, not to the top ---------- */
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));

      // The visitor outranks us: the moment they touch the page, stop moving
      // it underneath them, however wrong we think the position is.
      let userMoved = false;
      const yieldToUser = () => { userMoved = true; };
      const USER_EVENTS = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
      USER_EVENTS.forEach((e) =>
        window.addEventListener(e, yieldToUser, { passive: true, once: true })
      );

      const correct = () => {
        if (cancelled || userMoved) return;
        ScrollTrigger.refresh();
        scrollToSection(id, { immediate: true });
      };

      // Arriving from another route, the target lives in a lazily-loaded chunk
      // that has not rendered yet — so poll for it briefly instead of giving
      // up on the first frame. ~1.5s covers a slow chunk on a slow connection.
      let tries = 0;
      const attempt = () => {
        if (cancelled) return;
        // Measure against the laid-out page, not the one we navigated from.
        ScrollTrigger.refresh();
        if (scrollToSection(id, { immediate: !samePage })) {
          // One pass after the reveal animations have settled, in case images
          // above the target resolved their height in the meantime.
          later(correct, 320);

          // On a cold load that is not enough. Two things reflow a long
          // document after first paint and both land far below a 320ms
          // correction: the web font swapping in (index.html loads it
          // non-render-blocking) and the last of the images resolving. On a
          // 13,000px article that was the difference between landing on the
          // heading and landing 4,000px away from it. Correct again for each,
          // but only while the visitor has not taken over.
          if (document.readyState !== 'complete') {
            window.addEventListener('load', correct, { once: true });
          }
          if (document.fonts && document.fonts.status !== 'loaded') {
            document.fonts.ready.then(correct);
          }
          later(correct, 1000);
          return;
        }
        if (++tries > 24) return;
        later(attempt, 60);
      };
      later(attempt, 0);

      return () => {
        cancelled = true;
        timers.forEach(clearTimeout);
        USER_EVENTS.forEach((e) => window.removeEventListener(e, yieldToUser));
        window.removeEventListener('load', correct);
      };
    }

    /* ---------- no hash: the existing top-of-page reset ---------- */

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
    later(() => { ScrollTrigger.refresh(); toTop(); }, 150);

    return () => { cancelled = true; timers.forEach(clearTimeout); cancelAnimationFrame(raf); };
  }, [pathname, hash]);

  return null;
}
