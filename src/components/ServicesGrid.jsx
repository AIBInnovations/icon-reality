import { useEffect, useState } from 'react';
import Reveal from './Reveal';
import './ServicesGrid.css';

const services = [
  {
    title: 'PLOT LAYOUTS',
    image: '/images/projects/oscar-palace-gate.jpg',
    downloadUrl: '/downloads/oscar-palace-plot-layout.pdf',
    downloadLabel: 'Download Plot Layout',
    body: 'A residential plotted project laid out on royal principles — wide avenues, east and west facing plots, and Vastu-compliant orientations across every block.',
    body2: 'Maximum roads run 100 ft and 60 ft wide, so every approach feels generous. Plots range from 3,000 to 20,000 sq ft, with reserved-frontage corners kept for landmark homes and orientations chosen so morning light reaches the right rooms.',
    highlights: [
      'Plot sizes from 3,000 to 20,000 sq ft',
      'East & west facing plots',
      'Maximum roads 100 ft & 60 ft wide',
      'Vastu-compliant residential plotting',
    ],
    stats: [
      { k: 'Plot range', v: '3,000 – 20,000 sq ft' },
      { k: 'Road width', v: '100 ft & 60 ft' },
      { k: 'Facing', v: 'East & West' },
    ],
    gallery: [
      '/images/projects/oscar-palace-gate.jpg',
      '/images/projects/oscar-palace-1.jpg',
      '/images/projects/oscar-palace-3.jpg',
    ],
  },
  {
    title: 'AMENITIES',
    image: '/images/projects/oscar-palace-4.jpg',
    body: 'A 26,000 sq ft grand clubhouse, a temple, baradaris, and 2,80,000 sq ft of garden and open spaces — designed for daily life, not the brochure.',
    body2: 'We design for the hours you actually live in. Morning walks through landscaped gardens, evenings at the clubhouse, children at the play zone, and quiet corners for yoga and meditation — all held inside a secure, heritage-styled estate.',
    highlights: [
      '2,80,000 sq ft of garden & open spaces',
      '26,000 sq ft grand clubhouse',
      'Swimming pool, gymnasium & yoga deck',
      'Temple, baradari & children\'s play zone',
    ],
    stats: [
      { k: 'Garden & open space', v: '2,80,000 sq ft' },
      { k: 'Clubhouse', v: '26,000 sq ft' },
      { k: 'Security', v: '24×7 multi-tier' },
    ],
    gallery: [
      '/images/projects/oscar-palace-4.jpg',
      '/images/projects/oscar-palace-3.jpg',
      '/images/projects/oscar-palace-2.jpg',
      '/images/projects/oscar-palace-5.jpg',
    ],
  },
  {
    title: 'LOCATION',
    image: '/images/projects/oscar-palace-1.jpg',
    downloadUrl: '/downloads/oscar-palace-location-plan.pdf',
    downloadLabel: 'Download Location Plan',
    body: 'On the new Indore–Nagpur Highway — a corridor set to reshape the infrastructure and road connectivity of Indore, with the city close and the calm intact.',
    body2: 'Top-rated schools sit within 4 km, hospitals and retail are two minutes away, and the expressway is a minute from the gate. The airport is a clear 27 km run. Close enough for the city to be useful, far enough for the calm to be real.',
    highlights: [
      'On the new Indore–Nagpur Highway',
      'Top-rated schools within 4 km',
      'Hospital & retail 2 minutes away',
      '1 minute to the expressway',
    ],
    stats: [
      { k: 'To expressway', v: '1 min' },
      { k: 'To airport', v: '27 km' },
      { k: 'Schools nearby', v: '4+ rated' },
    ],
    gallery: [
      '/images/projects/oscar-palace-1.jpg',
      '/images/projects/oscar-palace-gate.jpg',
      '/images/projects/oscar-fort.webp',
    ],
  },
  {
    title: 'INVESTMENT',
    image: '/images/projects/oscar-palace-3.jpg',
    body: 'Buy early, hold long-term, watch appreciation — land you own, on a highway corridor with structural reasons to grow. Bank loans are available on every plot.',
    body2: 'Plotted developments in growth corridors have historically outperformed apartments on both appreciation and liquidity. Oscar Palace, on the Indore–Nagpur Highway, is positioned to be one of them.',
    highlights: [
      'Land you own outright — no depreciation',
      'Bank loans available on every plot',
      'Title-clear, RERA-registered project',
      'Resale or self-build, your call',
    ],
    stats: [
      { k: 'Corridor', v: 'Indore–Nagpur Hwy' },
      { k: 'Bank loans', v: 'Available' },
      { k: 'Flexibility', v: 'Hold · build · resell' },
    ],
    gallery: [
      '/images/projects/oscar-palace-3.jpg',
      '/images/projects/oscar-palace-1.jpg',
      '/images/projects/oscar-palace-gate.jpg',
    ],
  },
];

export default function ServicesGrid() {
  const [openIdx, setOpenIdx] = useState(-1);
  // keeps the panel content mounted during slide-out animation
  const [displayed, setDisplayed] = useState(null);

  useEffect(() => {
    if (openIdx >= 0) {
      setDisplayed(services[openIdx]);
    } else {
      // wait for slide-out transition (~0.6s) before unmounting
      const t = setTimeout(() => setDisplayed(null), 650);
      return () => clearTimeout(t);
    }
  }, [openIdx]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (openIdx >= 0) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
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
              Give your investment more meaning — without compromising on quality, location, or the way the place actually feels.
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
                    <img src={s.image} alt="" />
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
              <div className="service-modal__carousel-wrap">
                <div className="service-modal__carousel">
                  <div className="service-modal__track">
                    {[...open.gallery, ...open.gallery, ...open.gallery].map((src, i) => (
                      <div key={i} className="service-modal__slide">
                        <img src={src} alt={`${open.title} ${i + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

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
                  {open.downloadUrl && (
                    <a
                      href={open.downloadUrl}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="cta service-modal__cta"
                    >
                      {open.downloadLabel || 'Download PDF'}
                    </a>
                  )}
                  <a
                    href="mailto:iconrealty2@icloud.com?subject=Book%20a%20Visit%20%E2%80%94%20Oscar%20Palace"
                    className={`cta service-modal__cta ${open.downloadUrl ? 'cta--ghost' : ''}`}
                  >
                    Book a Site Visit
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
