import { useCallback, useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';
import './InfoCarousel.css';

/**
 * The carousel counterpart to InfoGrid: the same { k, v } items and the same
 * numbered typographic card, laid out as one swipeable row instead of a block
 * of rows.
 *
 * Scrolling is native (scroll-snap + overflow-x), not a transform track, so a
 * trackpad swipe, a touch drag, a shift-wheel and the keyboard all work without
 * being reimplemented. The arrows only nudge that same scroll container by one
 * card, and they disable at each end rather than wrapping, so the control state
 * always tells the truth about where you are.
 *
 * Deliberately NOT auto-playing: these are facts to be read, and a panel that
 * slides away mid-sentence is a worse experience than one that waits.
 */
export default function InfoCarousel({
  items = [],
  numbered = false,
  className = '',
  ariaLabel = 'Carousel',
}) {
  const viewportRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const max = vp.scrollWidth - vp.clientWidth;
    setAtStart(vp.scrollLeft <= 1);
    // 1px of slack: sub-pixel layout means scrollLeft rarely lands exactly on max
    setAtEnd(vp.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return undefined;
    sync();
    vp.addEventListener('scroll', sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(vp);
    return () => {
      vp.removeEventListener('scroll', sync);
      ro.disconnect();
    };
  }, [sync, items]);

  const nudge = (dir) => {
    const vp = viewportRef.current;
    if (!vp) return;
    const card = vp.querySelector('.info-carousel__card');
    const gap = parseFloat(getComputedStyle(vp).columnGap || '0') || 0;
    const step = card ? card.getBoundingClientRect().width + gap : vp.clientWidth * 0.8;
    vp.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  if (!items.length) return null;

  return (
    <div className={`info-carousel ${className}`}>
      {/* Lenis would otherwise swallow the horizontal gesture (CLAUDE.md §2) */}
      <div
        ref={viewportRef}
        className="info-carousel__viewport"
        data-lenis-prevent
        tabIndex={0}
        role="group"
        aria-label={ariaLabel}
      >
        {items.map((item, i) => {
          const k = item.k ?? item.title ?? item.name;
          const v = item.v ?? item.body ?? item.note;

          return (
            <Reveal key={k || i} className="info-carousel__card" delay={Math.min(i, 5) * 0.06}>
              {numbered && (
                <span className="info-carousel__num" aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
              )}
              {k && <h3 className="info-carousel__k">{k}</h3>}
              {v && <p className="info-carousel__v">{v}</p>}
            </Reveal>
          );
        })}
      </div>

      <div className="info-carousel__controls">
        <button
          type="button"
          className="info-carousel__nav"
          onClick={() => nudge(-1)}
          disabled={atStart}
          aria-label="Previous"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          className="info-carousel__nav"
          onClick={() => nudge(1)}
          disabled={atEnd}
          aria-label="Next"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
