import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ImageViewer from './ImageViewer';
import './ProjectBannerCarousel.css';

/**
 * The banner at the top of a project page.
 *
 * It used to be a single hero photograph. One frame cannot carry a plotted
 * development — the gate, the layout, the landscape and the amenity block are
 * four different arguments — so this rotates through the project's own images.
 *
 * Behaviour, in the order it matters:
 *  - The FIRST slide is the hero image and is the only one fetched eagerly. The
 *    rest load lazily as they come up, so the banner costs the same on first
 *    paint as the single image it replaces (CLAUDE.md §11 / read.md §56).
 *  - Auto-advance is paused on hover, on focus within, while the tab is hidden,
 *    and permanently once the visitor takes manual control.
 *  - Swipe on touch, arrow keys when focused, dots for direct access.
 *  - `prefers-reduced-motion` disables the auto-advance entirely.
 *  - Clicking the frame opens the shared fullscreen ImageViewer.
 */
const AUTOPLAY_MS = 5200;

export default function ProjectBannerCarousel({ images = [], projectName = 'Project' }) {
  const slides = useMemo(
    () => images
      .map((img) => (typeof img === 'string' ? { src: img } : img))
      .filter((img) => img?.src && !/^https?:\/\//i.test(img.src))
      // the same photo doing duty as hero and first gallery frame would
      // otherwise show twice in a row
      .filter((img, i, all) => all.findIndex((o) => o.src === img.src) === i),
    [images],
  );

  const [index, setIndex] = useState(0);
  const [viewerAt, setViewerAt] = useState(null);
  const [taken, setTaken] = useState(false);   // visitor took manual control
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState({});
  const touchRef = useRef(null);

  const count = slides.length;

  // `next` is already absolute, so the updater ignores the previous value —
  // it exists only to keep the wrap arithmetic in one place.
  const go = useCallback((next) => {
    setIndex(((next % count) + count) % count);
  }, [count]);

  const take = (next) => { setTaken(true); go(next); };

  // Auto-advance. Stops for reduced motion, for a hidden tab, and for good once
  // the visitor has driven it themselves.
  useEffect(() => {
    if (count < 2 || taken || paused) return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setInterval(() => {
      if (!document.hidden) go(index + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [count, taken, paused, index, go]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); take(index - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); take(index + 1); }
  };

  const onTouchStart = (e) => { touchRef.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    const start = touchRef.current;
    touchRef.current = null;
    if (start == null) return;
    const dx = e.changedTouches[0].clientX - start;
    if (Math.abs(dx) > 44) take(index + (dx < 0 ? 1 : -1));
  };

  if (!count) return null;

  // A project with a single usable image keeps the old still frame — a carousel
  // with one slide is chrome around nothing.
  if (count === 1) {
    return (
      <section className="project-banner">
        <div className="project-banner__shell">
          <img
            src={slides[0].src}
            alt={slides[0].alt || `${projectName}: hero`}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="project-banner">
      <div
        className="project-banner__shell project-banner__shell--carousel"
        role="group"
        aria-roledescription="carousel"
        aria-label={`${projectName} photographs`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="project-banner__track">
          {slides.map((img, i) => (
            <figure
              key={img.src}
              className={`project-banner__slide${i === index ? ' is-active' : ''}`}
              aria-hidden={i !== index}
            >
              <img
                src={img.src}
                alt={img.alt || `${projectName}: image ${i + 1} of ${count}`}
                /* only the first frame competes with the page's first paint */
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : 'low'}
                decoding="async"
                onError={() => setFailed((f) => ({ ...f, [img.src]: true }))}
              />
              {img.category && !failed[img.src] && (
                <figcaption className="project-banner__tag">{img.category}</figcaption>
              )}
            </figure>
          ))}
        </div>

        <button
          type="button"
          className="project-banner__expand"
          onClick={() => setViewerAt(index)}
          aria-label={`Open image ${index + 1} full screen`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M6 1H1v5M10 15h5v-5M1 10v5h5M15 6V1h-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>View full screen</span>
        </button>

        <button
          type="button"
          className="project-banner__nav project-banner__nav--prev"
          onClick={() => take(index - 1)}
          aria-label="Previous image"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path d="M11 3L5 9l6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          type="button"
          className="project-banner__nav project-banner__nav--next"
          onClick={() => take(index + 1)}
          aria-label="Next image"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path d="M7 3l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="project-banner__dots">
          {slides.map((img, i) => (
            <button
              key={img.src}
              type="button"
              className={`project-banner__dot${i === index ? ' is-active' : ''}`}
              onClick={() => take(i)}
              aria-label={`Show image ${i + 1} of ${count}`}
              aria-current={i === index}
            />
          ))}
        </div>

        <span className="project-banner__counter" aria-live="polite">
          {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>
      </div>

      {viewerAt !== null && (
        <ImageViewer
          images={slides.map((img, i) => ({
            src: img.src,
            alt: img.alt || `${projectName}: image ${i + 1}`,
            label: img.category,
          }))}
          index={viewerAt}
          onIndexChange={(i) => { setViewerAt(i); setIndex(i); setTaken(true); }}
          onClose={() => setViewerAt(null)}
          title={`${projectName}: photographs`}
        />
      )}
    </section>
  );
}
