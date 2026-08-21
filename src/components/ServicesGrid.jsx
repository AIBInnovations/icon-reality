import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import { useEnquiry } from '../enquiry/enquiryContext';
import './ServicesGrid.css';

// What Icon Realty offers ACROSS the portfolio — not what one project has.
// Every figure here is either published company data (company.js) or is the
// true min/max across projects.js; nothing is estimated (CLAUDE.md §5).
const services = [
  {
    title: 'PLOT LAYOUTS',
    image: '/images/services/plot-layouts.jpg',
    body: 'Residential plotted developments, planned on the same principles for twenty years: wide avenues, east and west facing plots, and Vastu-compliant orientations across every block.',
    body2: 'Plots run from 600 sq ft at Saatvik Vihar and Siddhayatan to 20,000 sq ft estate parcels at Oscar Palace, so there is a first plot and a landmark plot inside the same portfolio. Road widths are planned generously, up to 100 ft and 60 ft on the estate projects, and corner frontages are reserved rather than sold off first.',
    highlights: [
      'Plot sizes from 600 to 20,000 sq ft across the portfolio',
      'East & west facing, Vastu-compliant plotting',
      'Wide planned roads: up to 100 ft & 60 ft',
      'Three positioning bands: high end, lower high end, mid range',
    ],
    stats: [
      { k: 'Plot range', v: '600 – 20,000 sq ft' },
      { k: 'Projects', v: '15+ landmarks' },
      { k: 'Facing', v: 'East & West' },
    ],
    gallery: [
      '/images/oscar/layout/layout-1.jpg',
      '/images/oscar/layout/layout-2.jpg',
      '/images/siddhayatan/layout-1.jpg',
      '/images/oscar/layout/layout-3.jpg',
    ],
  },
  {
    title: 'AMENITIES',
    image: '/images/services/amenities.jpg',
    body: 'Gardens, temples, turfs, courts and clubhouses, all sized to the project and designed for the hours you actually live in rather than for the brochure.',
    body2: 'Oscar Palace carries 2,80,000 sq ft of garden and open space, a heritage temple and marble baradaris, tennis and pickleball courts and a multipurpose cricket and football turf. Eden Garden has its football garden and skating rink; IIT Greens its oxygen zone and acupressure track; Saatvik Vihar its yoga and senior-citizen gardens. The scale changes with the project, the intent does not.',
    highlights: [
      'Landscaped gardens & open space on every project',
      'Sport: turfs, tennis, pickleball, skating, open gyms',
      'Temples, baradaris & community halls',
      '24×7 security and planned utilities',
    ],
    stats: [
      { k: 'Largest green', v: '2,80,000 sq ft' },
      { k: 'Security', v: '24×7 multi-tier' },
      { k: 'Delivered', v: '10 communities' },
    ],
    gallery: [
      '/images/oscar/park/park-1.jpg',
      '/images/oscar/temple/temple-1.jpg',
      '/images/eden-garden/eden-3.jpg',
      '/images/oscar/amenities/amenity-1.jpg',
      '/images/iit-greens/render-3.jpg',
      '/images/saatvik-vihar/saatvik-3.jpg',
    ],
  },
  {
    title: 'LOCATION',
    image: '/images/services/location.jpg',
    body: 'Every project we have built stands in and around Indore: the Super Corridor, the Indore–Nagpur Highway, Bicholi, Manglia, Rau, Simrol and Pithampur.',
    body2: 'We are not visitors to this market. We know which corridors are being built and which ones are only being talked about, and the difference between the two is the whole of our job. Oscar Palace sits a minute from the expressway; IIT Greens is opposite the IIT Indore campus; Siddhayatan runs straight through to Ujjain; the Singapore townships line the corporate axis of the Super Corridor.',
    highlights: [
      'Every project in and around Indore',
      'Super Corridor, Indore–Nagpur Highway, Bicholi & Manglia',
      'Airport, expressway and campus adjacencies',
      'Twenty years of reading this one city',
    ],
    stats: [
      { k: 'City', v: 'Indore' },
      { k: 'Since', v: '2004' },
      { k: 'Corridors', v: '6+' },
    ],
    gallery: [
      '/images/oscar/entrance/entrance-1.jpg',
      '/images/singapore-corridor/hero.jpg',
      '/images/iit-greens/render-2.jpg',
      '/images/oscar-fort/hero.jpg',
    ],
  },
  {
    title: 'INVESTMENT',
    image: '/images/services/investment.jpg',
    body: 'Buy early, hold long-term, watch appreciation: land you own, on corridors with structural reasons to grow. Bank loans are available on our plots.',
    body2: 'Plotted developments in growth corridors have historically outperformed apartments on both appreciation and liquidity. Ten of our communities are already delivered and lived in, which means you can go and see what an Icon Realty address looks like a decade after handover before you buy into the next one.',
    highlights: [
      'Land you own outright: no depreciation',
      'Home-loan assistance on our plotted developments',
      'Ten delivered communities you can visit today',
      'Resale or self-build, your call',
    ],
    stats: [
      { k: 'Delivered', v: '10 communities' },
      { k: 'Bank loans', v: 'Available' },
      { k: 'Flexibility', v: 'Hold · build · resell' },
    ],
    gallery: [
      '/images/ruchi-lifescapes/hero.jpg',
      '/images/singapore-lifestyle-2/hero.jpg',
      '/images/dream-victoria/victoria-1.jpg',
      '/images/oscar-billionaire/hero.jpg',
    ],
  },
];

/* Draggable, auto-playing, seamless-looping image carousel for the modal.
   - Auto-scrolls slowly, pausing while the user hovers or interacts.
   - Mouse: click-drag to scroll. Touch: native swipe.
   - Prev / next arrows nudge by one slide.
   - Slides are tripled and the scroll position wraps inside the middle copy,
     so it loops forever with no visible jump. */
function ServiceCarousel({ images, title }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const pausedRef = useRef(false);   // true while hovering / touching
  const dragRef = useRef(null);      // { startX, startScroll } during a mouse drag
  const resumeRef = useRef(null);    // timer that re-enables auto-scroll after an arrow tap
  const [grabbing, setGrabbing] = useState(false);

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
      if (!reduce && !pausedRef.current && !dragRef.current) {
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

export default function ServicesGrid() {
  const [openIdx, setOpenIdx] = useState(-1);
  // keeps the panel content mounted during slide-out animation
  const [displayed, setDisplayed] = useState(null);
  const { openEnquiry } = useEnquiry();

  useEffect(() => {
    if (openIdx >= 0) {
      setDisplayed(services[openIdx]);
    } else {
      // wait for slide-out transition (~0.6s) before unmounting
      const t = setTimeout(() => setDisplayed(null), 650);
      return () => clearTimeout(t);
    }
  }, [openIdx]);

  // Lock body scroll while modal is open, and hide the fixed header behind it
  useEffect(() => {
    if (openIdx >= 0) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.body.classList.add('has-modal');
      return () => {
        document.body.style.overflow = prev;
        document.body.classList.remove('has-modal');
      };
    }
  }, [openIdx]);

  // ESC to close
  useEffect(() => {
    if (openIdx < 0) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpenIdx(-1); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIdx]);

  const isOpen = openIdx >= 0;
  const open = displayed;

  return (
    <section className="services">
      <div className="services__shell">
        <div className="container services__inner">
          <div className="services__head">
            <Reveal as="h2" className="display services__title">What we<br/>offer.</Reveal>
            <Reveal as="p" className="services__lede" delay={0.05}>
              Icon Realty designs and markets residential plotted developments, and has done, in this
              one city, for twenty years. This is what that covers.
            </Reveal>
          </div>

          <div className="services__list">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.05}>
                <button
                  className="services__row"
                  onClick={() => setOpenIdx(i)}
                  aria-label={`Open details for ${s.title}`}
                >
                  <div className="services__thumb">
                    <img src={s.image} alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="services__row-main">
                    <span className="services__row-title">{s.title}</span>
                    <span className="services__row-plus" aria-hidden>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                    </span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="services__bars" aria-hidden />
      </div>

      {/* MODAL */}
      <div
        className={`service-modal ${isOpen ? 'is-open' : ''}`}
        onClick={(e) => { if (e.target === e.currentTarget) setOpenIdx(-1); }}
        aria-hidden={!isOpen}
      >
        <div className="service-modal__panel" role="dialog" aria-modal="true" aria-label={open?.title}>
          <button className="service-modal__close" onClick={() => setOpenIdx(-1)} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 3L15 15M15 3L3 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>

          {open && (
            <>
              <ServiceCarousel key={open.title} images={open.gallery} title={open.title} />

              <div className="service-modal__body">
                <h3 className="service-modal__title display">{open.title}</h3>
                <p className="service-modal__copy">{open.body}</p>

                <ul className="service-modal__highlights">
                  {open.highlights.slice(0, 3).map((h, i) => (
                    <li key={i}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                        <path d="M2 7L5.5 10.5L12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="service-modal__stat-row">
                  {open.stats.map((s, i) => (
                    <div key={i} className="service-modal__stat">
                      <span className="service-modal__stat-k">{s.k}</span>
                      <span className="service-modal__stat-v">{s.v}</span>
                    </div>
                  ))}
                </div>

                <div className="service-modal__actions">
                  <Link to="/projects" className="cta service-modal__cta" onClick={() => setOpenIdx(-1)}>
                    See all projects
                  </Link>
                  <button
                    type="button"
                    className="cta cta--ghost service-modal__cta"
                    onClick={() => { setOpenIdx(-1); openEnquiry({ source: `Services: ${open.title || ''}`.trim() }); }}
                  >
                    Book a Site Visit
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
