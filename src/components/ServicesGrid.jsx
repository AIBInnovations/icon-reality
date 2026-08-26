import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import { useEnquiry } from '../enquiry/enquiryContext';
import ServiceCarousel from './ServiceCarousel';
import './ServicesGrid.css';

// The two things Icon Realty actually does, as stated in company.js STORY:
// it designs and markets residential plotted communities. Development features
// (layouts, amenities, location, investment) are NOT services and live in
// InsideSection instead. Every claim below is drawn from published company
// material — nothing estimated (CLAUDE.md §5).
const services = [
  {
    title: 'DESIGNING',
    // Client-supplied artwork (Aug 2026), replacing the reused Oscar Palace
    // layout render that stood in until it arrived.
    image: '/images/services/designing.jpg',
    body: 'Master planning for residential plotted communities: the layout, the road hierarchy, the orientation of every plot and the amenity programme, all settled before a single boundary is marked.',
    body2: 'Twenty years of planning the same city has produced a house style: wide avenues, east and west facing plots, Vastu-compliant orientations, and corner frontages reserved rather than sold off first. Where a project calls for a specialist we bring one in, Oscar Palace is designed by Ravi Gupta Ji of Jaipur, but the planning discipline underneath is ours and does not change from project to project.',
    highlights: [
      'Master layouts, road hierarchy & plot orientation',
      'East & west facing, Vastu-compliant plotting',
      'Amenity programme planned to the project, not the brochure',
      'Architecture partners such as Ravi Gupta Ji of Jaipur',
    ],
    stats: [
      { k: 'Designing since', v: '2004' },
      { k: 'Projects', v: '15+ landmarks' },
      { k: 'Plot range', v: '600 – 20,000 sq ft' },
    ],
    gallery: [
      '/images/oscar/layout/layout-1.jpg',
      '/images/oscar/layout/layout-2.jpg',
      '/images/siddhayatan/layout-1.jpg',
      '/images/oscar/layout/layout-3.jpg',
      '/images/iit-greens/render-2.jpg',
    ],
  },
  {
    title: 'MARKETING',
    image: '/images/oscar/entrance/entrance-1.jpg',
    body: 'Positioning, campaigns, the channel partner network and the site team that answers the phone: the whole path from a first enquiry to a registered plot.',
    body2: 'On some projects Icon Realty is the developer. On others, Oscar Palace among them, we are the marketing and sales partner to the developer. Which role we hold on which project is stated on the project page itself rather than blurred, and the same team that sells you the plot handles registration, loan coordination and the paperwork after it.',
    highlights: [
      'Positioning & campaigns for plotted communities',
      'Channel partner network across Indore',
      'Developer or marketing partner, stated per project',
      'Registration, loan and post-sale paperwork support',
    ],
    stats: [
      { k: 'Marketing since', v: '2004' },
      { k: 'Delivered', v: '10 communities' },
      { k: 'Bank loans', v: 'Available' },
    ],
    gallery: [
      '/images/oscar/entrance/entrance-1.jpg',
      '/images/projects/oscar-palace-gate.jpg',
      '/images/eden-garden/eden-3.jpg',
      '/images/singapore-corridor/hero.jpg',
      '/images/saatvik-vihar/saatvik-3.jpg',
    ],
  },
];

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
              one city, for twenty years. Two disciplines, one address book.
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
