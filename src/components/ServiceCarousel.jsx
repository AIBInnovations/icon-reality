import { useEffect, useRef, useState } from 'react';
import './ServiceCarousel.css';

/* Draggable, auto-playing, seamless-looping image carousel for the modal.
   - Auto-scrolls slowly, pausing while the user hovers or interacts.
   - Mouse: click-drag to scroll. Touch: native swipe.
   - Prev / next arrows nudge by one slide.
   - Slides are tripled and the scroll position wraps inside the middle copy,
     so it loops forever with no visible jump. */
export default function ServiceCarousel({ images, title, active = true }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const pausedRef = useRef(false);   // true while hovering / touching
  const dragRef = useRef(null);      // { startX, startScroll } during a mouse drag
  const resumeRef = useRef(null);    // timer that re-enables auto-scroll after an arrow tap
  const [grabbing, setGrabbing] = useState(false);
  // Autoplay is gated so a caller can hold it off while its panel is still
  // animating in: a rAF writing scrollLeft every frame during a transform
  // transition is exactly the kind of work that makes an entrance stutter.
  const activeRef = useRef(active);
  useEffect(() => { activeRef.current = active; }, [active]);

  const slides = [...images, ...images, ...images];

  // Start in the middle copy so there's room to loop in either direction.
  useEffect(() => {
    const vp = viewportRef.current;
    if (vp) vp.scrollLeft = vp.scrollWidth / 3;
  }, [images]);

  // Auto-advance + seamless wrap.
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let raf;
    const step = () => {
      const third = vp.scrollWidth / 3;
      if (activeRef.current && !reduce && !pausedRef.current && !dragRef.current) {
        vp.scrollLeft += 0.5;
      }
      // wrap while staying inside the identical middle copy → invisible jump
      if (vp.scrollLeft >= third * 2) vp.scrollLeft -= third;
      else if (vp.scrollLeft <= 0) vp.scrollLeft += third;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [images]);

  const slideAmount = () => {
    const track = trackRef.current;
    const first = track?.children[0];
    if (!first) return 240;
    const gap = parseFloat(getComputedStyle(track).columnGap || '10') || 10;
    return first.getBoundingClientRect().width + gap;
  };

  const nudge = (dir) => {
    const vp = viewportRef.current;
    if (!vp) return;
    // Pause auto-scroll so it doesn't overwrite scrollLeft and cancel the arrow's
    // smooth scroll; resume shortly after the scroll settles.
    pausedRef.current = true;
    vp.scrollBy({ left: dir * slideAmount(), behavior: 'smooth' });
    clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => { pausedRef.current = false; }, 1500);
  };

  // Mouse drag-to-scroll (touch relies on native horizontal scrolling).
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse') return;
    const vp = viewportRef.current;
    dragRef.current = { startX: e.clientX, startScroll: vp.scrollLeft };
    setGrabbing(true);
    vp.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    viewportRef.current.scrollLeft =
      dragRef.current.startScroll - (e.clientX - dragRef.current.startX);
  };
  const endDrag = () => { dragRef.current = null; setGrabbing(false); };

  const pause = () => { pausedRef.current = true; };
  const resume = () => { pausedRef.current = false; };

  return (
    <div className="service-modal__carousel-wrap">
      <div className="service-modal__carousel-stage">
        <div
          ref={viewportRef}
          className={`service-modal__carousel${grabbing ? ' is-grabbing' : ''}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={(e) => { endDrag(e); resume(); }}
          onMouseEnter={pause}
          onTouchStart={pause}
          onTouchEnd={resume}
        >
          <div className="service-modal__track" ref={trackRef}>
            {slides.map((src, i) => (
              <div key={i} className="service-modal__slide">
                <img src={src} alt={`${title} ${(i % images.length) + 1}`} draggable="false" loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="service-modal__nav service-modal__nav--prev"
          onClick={() => nudge(-1)}
          aria-label="Previous image"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          type="button"
          className="service-modal__nav service-modal__nav--next"
          onClick={() => nudge(1)}
          aria-label="Next image"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
