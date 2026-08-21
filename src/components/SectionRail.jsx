import { useEffect, useRef, useState } from 'react';
import { headerOffset, scrollToSection } from '../utils/scrollTo';
import './SectionRail.css';

/**
 * The jump rail for the long single-page sections (NRI Corner, Channel
 * Partners).
 *
 * Those two areas used to be seven and four routes; collapsing them into one
 * page each means the reader needs a visible table of contents that also tells
 * them where they currently are. That is this.
 *
 * Behaviour differs by width on purpose:
 *   ≥1025px  it sticks under the fixed header for the whole page
 *   below    it is a static, horizontally scrollable chip row. A second sticky
 *            bar under an already-tall mobile header eats a third of a phone
 *            screen and can end up sitting on top of the content it indexes.
 *
 * Links are real anchors (`href="#id"`) so they can be copied and opened in a
 * new tab, but the click is handled here and routed through Lenis rather than
 * through the router — updating the URL would hand the scroll to
 * RouteTransition and the two would fight over the same target.
 */
export default function SectionRail({ items = [], label = 'On this page', tone = 'light' }) {
  const [active, setActive] = useState(items[0]?.id ?? null);
  const listRef = useRef(null);
  // A stable primitive so the observer is rebuilt when the sections change,
  // not on every render (the `items` array literal is new each time).
  const key = items.map((i) => i.id).join('|');

  useEffect(() => {
    const ids = key ? key.split('|') : [];
    if (!ids.length) return undefined;

    // "Which section am I in" = the last one whose top has crossed the reading
    // line. The line is the same offset scrollToSection lands on, so clicking a
    // chip always highlights the chip you clicked — an IntersectionObserver
    // band could not guarantee that, because the section you are leaving still
    // occupies most of it at the moment the next one arrives.
    const pick = () => {
      const line = headerOffset() + 16;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - line <= 0) current = id;
      }
      setActive(current);
    };

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = 0; pick(); });
    };

    pick();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [key]);

  // Keep the active chip in view on phones, where the rail scrolls sideways.
  useEffect(() => {
    const list = listRef.current;
    if (!list || !active) return;
    const chip = list.querySelector(`[data-rail-id="${CSS.escape(active)}"]`);
    if (!chip) return;
    const left = chip.offsetLeft - list.clientWidth / 2 + chip.clientWidth / 2;
    list.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }, [active]);

  if (!items.length) return null;

  const go = (e, id) => {
    e.preventDefault();
    setActive(id);
    scrollToSection(id);
  };

  return (
    <nav className={`section-rail section-rail--${tone}`} aria-label={label}>
      <div className="section-rail__inner">
        <span className="section-rail__label">{label}</span>
        {/* data-lenis-prevent: the chip row scrolls sideways on phones and
            Lenis would otherwise swallow the gesture (CLAUDE.md §2). */}
        <ul className="section-rail__list" ref={listRef} data-lenis-prevent>
          {items.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                data-rail-id={item.id}
                className={`section-rail__link ${active === item.id ? 'is-active' : ''}`}
                aria-current={active === item.id ? 'true' : undefined}
                onClick={(e) => go(e, item.id)}
              >
                <span className="section-rail__num" aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="section-rail__text">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
