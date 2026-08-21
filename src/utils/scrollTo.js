/**
 * In-page section scrolling, in one place.
 *
 * The NRI and Channel Partner sections used to be seven and four separate
 * routes; they are now one long page each, so "go to Taxation" is a scroll
 * rather than a navigation. Two callers need it and they must agree:
 *
 *   • <SectionRail>   — the on-page jump rail
 *   • <RouteTransition> — a /nri#taxation link arriving from the header
 *
 * Everything goes through Lenis when it is running (CLAUDE.md §2 — never a
 * competing window.scrollTo while it owns the scroll), and falls back to the
 * native smooth scroll when it is not.
 */

/**
 * How far down the viewport a section has to land so nothing fixed is sitting
 * on top of it.
 *
 * Normally that is the header: the bar sits at top:28px with a ~78px pill on
 * desktop, top:14px with a taller logo on phones. But on the NRI and Channel
 * Partner pages a <SectionRail> sticks underneath it (desktop only), and it —
 * not the header — is the real floor. Measured rather than hard-coded, so
 * changing the rail's height or its `top` cannot silently break the landing
 * position.
 */
export function headerOffset() {
  const rail = document.querySelector('.section-rail');
  if (rail) {
    const cs = getComputedStyle(rail);
    if (cs.position === 'sticky') {
      return (parseFloat(cs.top) || 0) + rail.offsetHeight + 8;
    }
  }
  return window.innerWidth <= 860 ? 128 : 122;
}

/**
 * @returns {boolean} false when the element isn't in the DOM yet — the caller
 * decides whether to retry (a cross-route hash link) or give up (a rail click).
 */
export function scrollToSection(id, { immediate = false } = {}) {
  if (!id) return false;
  const el = document.getElementById(id);
  if (!el) return false;

  const offset = -headerOffset();

  if (window.lenis) {
    window.lenis.scrollTo(el, { offset, immediate, duration: immediate ? 0 : 1 });
    return true;
  }

  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top, behavior: immediate || reduce ? 'auto' : 'smooth' });
  return true;
}
