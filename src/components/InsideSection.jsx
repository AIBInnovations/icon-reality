import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import { useEnquiry } from '../enquiry/enquiryContext';
import ServiceCarousel from './ServiceCarousel';
import { FOCUSABLE } from '../utils/focus';
import './ServicesGrid.css';
import './InsideSection.css';

/**
 * What is inside an Icon Realty development, as distinct from what the company
 * *does* (ServicesGrid: designing and marketing).
 *
 * These four used to sit in "What we offer" as if they were services. They are
 * not: they describe the product. They keep their full content and their
 * click-to-open behaviour, but in a compact drawer that slides in from the
 * right rather than the wide ServicesGrid panel.
 *
 * Figures are published company data or the true min/max across projects.js;
 * nothing is estimated (CLAUDE.md §5).
 */
const pillars = [
{
    n: '01',
    title: 'Plot layouts',
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
    n: '02',
    title: 'Amenities',
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
    n: '03',
    title: 'Location',
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
    n: '04',
    title: 'Investment',
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

export default function InsideSection() {
  const [openIdx, setOpenIdx] = useState(-1);
  // keeps panel content mounted through the slide-out transition
  const [displayed, setDisplayed] = useState(null);
  const panelRef = useRef(null);
  const openerRef = useRef(null);
  const closeTimer = useRef(null);
  const { openEnquiry } = useEnquiry();

  const isOpen = openIdx >= 0;
  const open = displayed;

  const openAt = (i, e) => {
    clearTimeout(closeTimer.current);
    openerRef.current = e.currentTarget;
    setOpenIdx(i);
    // One frame later, exactly as the services modal does via its effect: the
    // panel begins its slide empty, so mounting the carousel and its images
    // never competes with the first frames of the transition.
    requestAnimationFrame(() => setDisplayed(pillars[i]));
  };

  // Keep the content mounted until the slide-out has finished.
  const close = () => {
    setOpenIdx(-1);
    clearTimeout(closeTimer.current);
    // matches the .service-modal__panel transition (.58s)
    closeTimer.current = setTimeout(() => setDisplayed(null), 650);
  };

  // Panel content is set by the handlers, not by an effect watching openIdx:
  // setting state inside an effect just to mirror other state causes a second
  // render pass for no reason (react-hooks/set-state-in-effect).
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Lock the page behind the drawer and hide the fixed header, as the services
  // modal does, so the two overlays behave identically.
  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('has-modal');
    return () => {
      document.body.style.overflow = prev;
      document.body.classList.remove('has-modal');
    };
  }, [isOpen]);

  // Escape to close, and Tab trapped inside the panel (CLAUDE.md §9).
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      const nodes = panelRef.current?.querySelectorAll(FOCUSABLE);
      if (!nodes?.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  // Move focus in on open, hand it back to the card that opened it on close.
  useEffect(() => {
    if (isOpen) {
      // preventScroll is not optional here: the panel is still translated off
      // the right edge while it animates in, so a default focus() makes the
      // browser scroll the page to chase it, which reads as the whole overlay
      // lurching. Same on the way out for the card we hand focus back to.
      const t = setTimeout(() => {
        panelRef.current?.querySelector(FOCUSABLE)?.focus({ preventScroll: true });
      }, 620);
      return () => clearTimeout(t);
    }
    openerRef.current?.focus({ preventScroll: true });
    return undefined;
  }, [isOpen]);

  return (
    <section className="inside">
      <div className="container">
        <div className="inside__head">
          <Reveal as="h2" className="display inside__title">
            What&rsquo;s<br />inside.
          </Reveal>
          <Reveal as="p" className="inside__lede" delay={0.05}>
            Every Icon Realty address is planned on the same four things, whether it is a
            600 sq ft first plot or a 20,000 sq ft estate parcel.
          </Reveal>
        </div>

        <div className="inside__grid">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06} y={24}>
              <button
                type="button"
                className="inside__card"
                onClick={(e) => openAt(i, e)}
                aria-haspopup="dialog"
                aria-label={`Open details for ${p.title}`}
              >
                <span className="inside__media">
                  <img src={p.image} alt="" loading="lazy" decoding="async" />
                  <span className="inside__n" aria-hidden>{p.n}</span>
                </span>

                <span className="inside__body">
                  <span className="inside__card-title">{p.title}</span>
                  <span className="inside__plus" aria-hidden>
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Same overlay as "What we offer": identical markup, identical
          service-modal styles, identical ServiceCarousel. Only the panel width
          differs, via the --compact modifier. Reusing the component rather than
          writing a second drawer is what keeps the two opening the same way. */}
      <div
        className={`service-modal service-modal--compact ${isOpen ? 'is-open' : ''}`}
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        aria-hidden={!isOpen}
      >
        <div
          ref={panelRef}
          className="service-modal__panel"
          role="dialog"
          aria-modal="true"
          aria-label={open?.title}
        >
          <button className="service-modal__close" onClick={close} aria-label="Close">
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
                  {open.highlights.slice(0, 3).map((h) => (
                    <li key={h}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                        <path d="M2 7L5.5 10.5L12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="service-modal__stat-row">
                  {open.stats.map((s) => (
                    <div key={s.k} className="service-modal__stat">
                      <span className="service-modal__stat-k">{s.k}</span>
                      <span className="service-modal__stat-v">{s.v}</span>
                    </div>
                  ))}
                </div>

                <div className="service-modal__actions">
                  <Link to="/projects" className="cta service-modal__cta" onClick={close}>
                    See all projects
                  </Link>
                  <button
                    type="button"
                    className="cta cta--ghost service-modal__cta"
                    onClick={() => { close(); openEnquiry({ source: `Inside: ${open.title || ''}`.trim() }); }}
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
