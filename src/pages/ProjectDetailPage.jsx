import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import Reveal from '../components/Reveal';
import { projectsBySlug } from '../data/projects';
import './ProjectDetailPage.css';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const project = projectsBySlug[slug];
  const lineRefs = useRef([]);
  const flankLeftRef = useRef(null);
  const flankRightRef = useRef(null);
  const [openModal, setOpenModal] = useState(null); // 'amenities' | 'connectivity' | null
  const [displayedModal, setDisplayedModal] = useState(null);

  useEffect(() => {
    if (window.lenis) window.lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [slug]);

  // Keep modal content mounted during the slide-out animation
  useEffect(() => {
    if (openModal) {
      setDisplayedModal(openModal);
    } else {
      const t = setTimeout(() => setDisplayedModal(null), 650);
      return () => clearTimeout(t);
    }
  }, [openModal]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (openModal) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [openModal]);

  // ESC to close
  useEffect(() => {
    if (!openModal) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpenModal(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openModal]);

  useEffect(() => {
    const lines = lineRefs.current.filter(Boolean);
    if (!lines.length) return;
    gsap.set(lines, { yPercent: 110 });
    const tween = gsap.to(lines, {
      yPercent: 0,
      duration: 1.1,
      ease: 'power3.out',
      stagger: 0.14,
      delay: 0.1,
    });
    return () => tween.kill();
  }, [slug]);

  // Scroll parallax for the Oscar Palace flank cutouts — the two images drift
  // at different speeds/directions as the hero scrolls past.
  useEffect(() => {
    if (slug !== 'oscar-palace') return;
    const left = flankLeftRef.current;
    const right = flankRightRef.current;
    if (!left && !right) return;

    const ctx = gsap.context(() => {
      const heroSection = (left || right).closest('.project-hero');
      const make = (el, from, to, fadeDelay) => {
        if (!el) return;
        const img = el.querySelector('img');
        // entrance fade (opacity on the wrapper, so it won't fight the parallax y)
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power3.out', delay: fadeDelay });
        // scrubbed parallax (y on the inner img); scrub: 1 adds smoothing lag
        gsap.fromTo(img, { yPercent: from }, {
          yPercent: to,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
      };
      make(left, -15, 25, 0.1);
      make(right, 15, -30, 0.2);
    });
    return () => ctx.revert();
  }, [slug]);

  if (!project) {
    return (
      <section className="project-notfound">
        <div className="container project-notfound__inner">
          <span className="eyebrow project-notfound__eyebrow">404</span>
          <h1 className="display project-notfound__title">Project not found.</h1>
          <p className="project-notfound__lede">
            We couldn't find a project with the slug <code>{slug}</code>. Browse the full list instead.
          </p>
          <Link to="/projects" className="cta">All projects</Link>
        </div>
      </section>
    );
  }

  const {
    name, tagline, location, total_area, plot_sizes, status,
    description, amenities = [], connectivity = [], highlights = [],
    gallery = [], hero_image, brochure_url,
  } = project;

  const statusLabel = status === 'trending' ? 'Trending now' : 'Completed';

  return (
    <>
      {/* ====== HERO ====== */}
      <section className={`project-hero ${slug === 'oscar-palace' ? 'project-hero--flanked' : ''}`}>
        <div className="container project-hero__inner">
          {slug === 'oscar-palace' && (
            <>
              <div className="project-hero__flank project-hero__flank--left" ref={flankLeftRef}>
                <img src="/images/oscar/3.png" alt="" aria-hidden="true" loading="lazy" />
              </div>
              <div className="project-hero__flank project-hero__flank--right" ref={flankRightRef}>
                <img src="/images/oscar/4.png" alt="" aria-hidden="true" loading="lazy" />
              </div>
            </>
          )}
          <Reveal as="span" className="eyebrow project-hero__eyebrow">
            {statusLabel} · {location}
          </Reveal>
          <h1 className="display project-hero__title">
            <span className="project-hero__line">
              <span className="project-hero__line-inner" ref={(el) => (lineRefs.current[0] = el)}>
                {name.split(' ').slice(0, Math.ceil(name.split(' ').length / 2)).join(' ')}
              </span>
            </span>
            {name.split(' ').length > 1 && (
              <span className="project-hero__line">
                <span className="project-hero__line-inner" ref={(el) => (lineRefs.current[1] = el)}>
                  {name.split(' ').slice(Math.ceil(name.split(' ').length / 2)).join(' ')}
                </span>
              </span>
            )}
          </h1>
          {(tagline || slug === 'oscar-palace') && (
            <Reveal as="p" className="project-hero__lede" delay={0.6}>
              {slug === 'oscar-palace'
                ? 'A premium residential project on the Indore–Nagpur Highway.'
                : tagline}
            </Reveal>
          )}
        </div>
      </section>

      {/* ====== HERO IMAGE ====== */}
      {hero_image && (
        <section className="project-banner">
          <div className="project-banner__shell">
            <img src={hero_image} alt={`${name} — hero`} />
          </div>
        </section>
      )}

      {/* ====== OVERVIEW ====== */}
      <section className="project-overview">
        <div className="container project-overview__grid">
          <div className="project-overview__copy">
            <Reveal as="span" className="eyebrow project-overview__eyebrow">Overview</Reveal>
            <Reveal as="h2" className="display project-overview__heading" delay={0.05}>
              {tagline || `About ${name}`}
            </Reveal>
            <Reveal as="p" className="project-overview__desc" delay={0.1}>
              {description}
            </Reveal>
          </div>

          <Reveal className="project-overview__stats" delay={0.1}>
            {total_area && (
              <div className="project-overview__stat">
                <span className="project-overview__stat-k">Total area</span>
                <span className="project-overview__stat-v">{total_area}</span>
              </div>
            )}
            {plot_sizes && (
              <div className="project-overview__stat">
                <span className="project-overview__stat-k">Plot sizes</span>
                <span className="project-overview__stat-v">{plot_sizes}</span>
              </div>
            )}
            <div className="project-overview__stat">
              <span className="project-overview__stat-k">Status</span>
              <span className="project-overview__stat-v">{statusLabel}</span>
            </div>
            <div className="project-overview__stat">
              <span className="project-overview__stat-k">Location</span>
              <span className="project-overview__stat-v">{location}</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====== FEATURES (amenities + connectivity) ====== */}
      {(amenities.length > 0 || connectivity.length > 0) && (
        <section className="project-features">
          <div className="container">
            <Reveal as="span" className="eyebrow project-features__eyebrow">Inside & around</Reveal>
            <Reveal as="h2" className="display project-features__heading" delay={0.05}>
              The lived experience.
            </Reveal>

            <div className="project-features__grid">
              {amenities.length > 0 && (
                <Reveal>
                  <button
                    type="button"
                    onClick={() => setOpenModal('amenities')}
                    className="project-features__card"
                    aria-label="View all amenities"
                  >
                    <div className="project-features__card-head">
                      <span className="project-features__card-eyebrow">Inside the project</span>
                      <h3 className="project-features__card-title">Amenities</h3>
                    </div>
                    <span className="project-features__card-count">
                      {amenities.length} {amenities.length === 1 ? 'amenity' : 'amenities'}
                    </span>
                    <p className="project-features__card-preview">
                      {amenities.slice(0, 3).join(' · ')}{amenities.length > 3 ? '…' : ''}
                    </p>
                    <span className="project-features__card-cta">
                      View all
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                        <path d="M3 7H11M7 3L11 7L7 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>
                </Reveal>
              )}

              {connectivity.length > 0 && (
                <Reveal delay={0.08}>
                  <button
                    type="button"
                    onClick={() => setOpenModal('connectivity')}
                    className="project-features__card project-features__card--peach"
                    aria-label="View all connectivity points"
                  >
                    <div className="project-features__card-head">
                      <span className="project-features__card-eyebrow">Around it</span>
                      <h3 className="project-features__card-title">Connectivity</h3>
                    </div>
                    <span className="project-features__card-count">
                      {connectivity.length} {connectivity.length === 1 ? 'landmark' : 'landmarks'}
                    </span>
                    <p className="project-features__card-preview">
                      {connectivity.slice(0, 3).join(' · ')}{connectivity.length > 3 ? '…' : ''}
                    </p>
                    <span className="project-features__card-cta">
                      View all
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                        <path d="M3 7H11M7 3L11 7L7 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>
                </Reveal>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ====== MODAL ====== */}
      <div
        className={`project-features-modal ${openModal ? 'is-open' : ''}`}
        onClick={(e) => { if (e.target === e.currentTarget) setOpenModal(null); }}
        aria-hidden={!openModal}
      >
        <div className="project-features-modal__panel" role="dialog" aria-modal="true">
          <button
            className="project-features-modal__close"
            onClick={() => setOpenModal(null)}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 3L15 15M15 3L3 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>

          {displayedModal && (
            <div className="project-features-modal__body">
              <span className="project-features-modal__eyebrow">
                {displayedModal === 'amenities' ? 'Inside the project' : 'Around it'}
              </span>
              <h3 className="project-features-modal__title display">
                {displayedModal === 'amenities' ? 'Amenities' : 'Connectivity'}
              </h3>
              <p className="project-features-modal__sub">
                {displayedModal === 'amenities'
                  ? 'What life looks like once you live here.'
                  : 'Everything within easy reach.'}
              </p>

              <ul className="project-features-modal__list">
                {(displayedModal === 'amenities' ? amenities : connectivity).map((item, i) => (
                  <li key={item + i} className="project-features-modal__item">
                    {displayedModal === 'amenities' ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <span className="project-features-modal__dot" aria-hidden />
                    )}
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ====== LOCATION / MAP ====== */}
      <section className={`project-map ${slug === 'oscar-palace' ? 'project-map--landbg' : ''}`}>
        {slug === 'oscar-palace' && (
          <div className="project-map__bg" aria-hidden="true" />
        )}
        <div className="container project-map__inner">
          <div className="project-map__head">
            <Reveal as="span" className="eyebrow project-map__eyebrow">Find it</Reveal>
            <Reveal as="h2" className="display project-map__heading" delay={0.05}>
              On the map.
            </Reveal>
            <Reveal as="p" className="project-map__address" delay={0.1}>
              {location}
            </Reveal>
            <Reveal delay={0.15}>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${location}`)}`}
                target="_blank"
                rel="noreferrer"
                className="cta cta--ghost project-map__cta"
              >
                Open in Google Maps
              </a>
            </Reveal>
          </div>
          <div className="project-map__frame">
            <iframe
              title={`${name} location map`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(`${name}, ${location}`)}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* ====== HIGHLIGHTS ====== */}
      {highlights.length > 0 && (
        <section className="project-highlights">
          <div className="container">
            <Reveal as="span" className="eyebrow project-highlights__eyebrow">What stands out</Reveal>
            <Reveal as="h2" className="display project-highlights__heading" delay={0.05}>
              Highlights.
            </Reveal>
            <div className="project-highlights__grid">
              {highlights.map((h, i) => (
                <Reveal key={h} className="project-highlights__card" delay={i * 0.06}>
                  <span className="project-highlights__num">0{i + 1}</span>
                  <p>{h}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ====== GALLERY ====== */}
      {gallery.length > 0 && (
        <section className="project-gallery">
          <div className="container">
            <Reveal as="span" className="eyebrow project-gallery__eyebrow">Gallery</Reveal>
            <Reveal as="h2" className="display project-gallery__heading" delay={0.05}>
              See the place.
            </Reveal>
            <div className="project-gallery__grid">
              {gallery.map((src, i) => (
                <Reveal key={src + i} className="project-gallery__item" delay={i * 0.04}>
                  <img src={src} alt={`${name} gallery image ${i + 1}`} loading="lazy" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ====== COMBINED PROJECT CTA + FINAL CTA (dark) ====== */}
      <section className="project-finalcta">
        <div className="project-finalcta__shell">
          <div className="container project-finalcta__inner">

            {/* Project-specific block (brochure / talk to us) */}
            <div className="project-finalcta__block">
              <Reveal as="span" className="eyebrow project-finalcta__eyebrow">
                {brochure_url ? 'Brochure' : 'Get in touch'}
              </Reveal>
              <Reveal as="h2" className="display project-finalcta__title" delay={0.05}>
                {brochure_url ? `Take ${name} home.` : `Want a closer look at ${name}?`}
              </Reveal>
              <Reveal as="p" className="project-finalcta__lede" delay={0.1}>
                {brochure_url
                  ? 'Full plot sizes, master plan, and the long view — packaged in a single download.'
                  : "Get in touch — we'll walk you through the plot, the planning, and what life here looks like."}
              </Reveal>
              <Reveal className="project-finalcta__actions" delay={0.15}>
                {brochure_url ? (
                  <a href={brochure_url} target="_blank" rel="noreferrer" className="cta project-finalcta__primary">
                    Download the brochure
                  </a>
                ) : (
                  <a
                    href={`mailto:iconrealty2@icloud.com?subject=Enquiry%20about%20${encodeURIComponent(name)}`}
                    className="cta project-finalcta__primary"
                  >
                    Talk to us
                  </a>
                )}
                <Link to="/projects" className="cta cta--ghost project-finalcta__ghost">
                  All projects
                </Link>
              </Reveal>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
