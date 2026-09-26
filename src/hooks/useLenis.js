import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isScrollLocked } from '../utils/scroller';

gsap.registerPlugin(ScrollTrigger);

// Mobile browsers fire window resize when their top/bottom bars collapse on
// scroll; a full ScrollTrigger refresh mid-scroll makes pinned/scrubbed
// sections visibly jump. Only genuine size changes (rotation, split-screen)
// should trigger a refresh.
ScrollTrigger.config({ ignoreMobileResize: true });

// Touch devices scroll #root, not the window (utils/scroller.js). Every
// ScrollTrigger, on every page, measures against it: set once, here, before
// any component has created one.
const SCROLL_ROOT = isScrollLocked() ? document.getElementById('root') : null;
if (SCROLL_ROOT) ScrollTrigger.defaults({ scroller: SCROLL_ROOT });

export function useLenis() {
  useEffect(() => {
    // Never let the browser restore a previous scroll position on navigation —
    // RouteTransition always starts each page at the top (hero).
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const lenis = new Lenis({
      // The same single instance either way (CLAUDE.md §2); on touch devices
      // it drives #root. `content` is only watched for growth, and <main> is
      // what grows as sections mount.
      ...(SCROLL_ROOT
        ? { wrapper: SCROLL_ROOT, content: SCROLL_ROOT.querySelector(':scope > main') || SCROLL_ROOT }
        : {}),
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    // Expose so route changes can reset Lenis's internal scroll target
    // (resetting only native scroll lets Lenis snap back to the old position).
    window.lenis = lenis;

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      if (window.lenis === lenis) delete window.lenis;
    };
  }, []);
}
