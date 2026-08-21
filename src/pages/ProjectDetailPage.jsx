import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';

import Reveal from '../components/Reveal';
import Breadcrumbs from '../components/Breadcrumbs';
import ProjectQuickFacts from '../components/ProjectQuickFacts';
import ProjectBannerCarousel from '../components/ProjectBannerCarousel';
import PlanViewer from '../components/PlanViewer';
import AmenitiesSection from '../components/AmenitiesSection';
import LocationSection from '../components/LocationSection';
import ProjectGallery from '../components/ProjectGallery';
import ConstructionUpdates from '../components/ConstructionUpdates';
import ProjectSpecifications from '../components/ProjectSpecifications';
import ProjectCompliance from '../components/ProjectCompliance';
import BankPartners from '../components/BankPartners';
import FAQSection from '../components/FAQSection';
import TrustModule from '../components/TrustModule';
import BrochureGate from '../components/BrochureGate';
import SiteVisitForm from '../components/SiteVisitForm';
import MediaFigure from '../components/MediaFigure';
import StickyMobileCTA from '../components/StickyMobileCTA';
import NotFoundPage from './NotFoundPage';

import Seo from '../seo/Seo';
import {
  breadcrumbSchema, projectSchema, videoObjectSchema,
  imageObjectSchema, faqSchema,
} from '../seo/schema';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useEnquiry } from '../enquiry/enquiryContext';
import { LEAD_INTENTS } from '../services/leads';
import { waMessage } from '../services/whatsapp';
import { PRIMARY_PHONE, telHref } from '../data/contact';
import { trackProjectView, trackVideoPlay } from '../analytics/events';
import { projectsBySlug, projectPlans, relatedProjects } from '../data/projects';
import { buildProjectFaqs } from '../data/projectFaqs';
import { categoriseGallery } from '../utils/gallery';
import './ProjectDetailPage.css';

/**
 * Showcase film.
 *
 * Desktop: autoplays muted when scrolled into view, pauses when it leaves. No
 * controls bar, 1.5× speed — the original behaviour, unchanged.
 *
 * Mobile: does NOT autoplay. The walkthrough files are 69–89 MB each (see
 * docs/asset-audit.md); starting one automatically because a phone scrolled
 * past it spends the visitor's mobile data on something they did not ask for,
 * which is exactly what read.md §56 rules out. The poster frame shows with a
 * play control, and the file is only fetched once they tap it.
 */
function ProjectVideo({ src, poster, projectName }) {
  const ref = useRef(null);
  const isMobile = useMediaQuery('(max-width: 860px)');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    el.muted = true;                 // required for autoplay to be allowed
    const setRate = () => { el.playbackRate = 1.5; };
    setRate();
    el.addEventListener('loadedmetadata', setRate);

    // On mobile nothing plays until the visitor asks for it.
    if (isMobile && !started) {
      return () => el.removeEventListener('loadedmetadata', setRate);
    }

    let counted = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRate();
          el.play().catch(() => {});
          if (!counted) { counted = true; trackVideoPlay(projectName, `${projectName} walkthrough`); }
        } else {
          el.pause();
        }
      },
      { threshold: 0.4 }             // start once ~40% of the video is on screen
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.removeEventListener('loadedmetadata', setRate);
    };
  }, [projectName, isMobile, started]);

  const play = () => {
    setStarted(true);
    trackVideoPlay(projectName, `${projectName} walkthrough`);
    ref.current?.play().catch(() => {});
  };

  const showPoster = isMobile && !started;

  return (
    <>
      <video
        ref={ref}
        className="project-video__player"
        /* No src at all until it is wanted on mobile — with a src set, even
           preload="none" costs a request, and some browsers fetch more. */
        src={showPoster ? undefined : src}
        poster={poster}
        muted
        loop
        playsInline
        controls={isMobile && started}
        /* metadata only — the film is below the fold and must not compete with
           the hero image for bandwidth on a phone (read.md §56) */
        preload={isMobile ? 'none' : 'metadata'}
      />

      {showPoster && (
        <button
          type="button"
          className="project-video__play"
          onClick={play}
          aria-label={`Play the ${projectName} walkthrough`}
        >
          <span className="project-video__play-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M8 5.5l11 6.5-11 6.5V5.5z" fill="currentColor" />
            </svg>
          </span>
          <span className="project-video__play-label">Play the walkthrough</span>
        </button>
      )}
    </>
  );
}

// Decorative hero flank cutouts per project — like Oscar Palace's birds, each
// project gets its own themed pair (gold to match the brand; IIT Greens stays
// green). Elements drift with scroll parallax; hovering offers the brochure
// when a local PDF exists. Sources: Wikimedia Commons (public domain / CC).
const flankPair = (slug) => ({
  left: `/images/flanks/${slug}-left.png`,
  right: `/images/flanks/${slug}-right.png`,
});
const FLANKS = {
  'oscar-palace': { left: '/images/oscar/3.png', right: '/images/oscar/4.png' },
  // client-provided art (left image mirrored on the right)
  'oscar-fort':              flankPair('oscar-fort'),
  'oscar-billionaire':       flankPair('oscar-billionaire'),
  'saatvik-vihar':           flankPair('saatvik-vihar'),
  'eden-garden':             flankPair('eden-garden'),
  'labham-city':             flankPair('labham-city'),
  'iit-greens':              flankPair('iit-greens'),
  'dream-victoria':          flankPair('dream-victoria'),
  'victoria-park':           flankPair('victoria-park'),
  'singapore-business-park': flankPair('singapore-business-park'),
  // gold placeholders (Wikimedia Commons) until the client provides art
  'siddhayatan':             flankPair('siddhayatan'),
  'glamour-highway-city':    flankPair('glamour-highway-city'),
  'glamour-hill-city':       flankPair('glamour-hill-city'),
  'ruchi-enclave':           flankPair('ruchi-enclave'),
  'ruchi-lifescapes':        flankPair('ruchi-lifescapes'),
  'singapore-corridor':      flankPair('singapore-corridor'),
  'singapore-lifestyle-2':   flankPair('singapore-lifestyle-2'),
};

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const { openEnquiry } = useEnquiry();
  const project = projectsBySlug[slug];
  const flank = FLANKS[slug];
  const lineRefs = useRef([]);
  // matches the 720px breakpoint where the CSS used to swap title variants
  const isMobile = useMediaQuery('(max-width: 720px)');
  // Below 960px the CSS hides the flank's "Download Brochure" label and shrinks
  // the artwork to ~60px. A control that small, with no visible label, is not a
  // usable target — so on mobile the flanks go back to being pure decoration
  // and the brochure lives in the hero CTAs and the overview section instead.
  const flanksDecorative = useMediaQuery('(max-width: 960px)');
  const flankLeftRef = useRef(null);
  const flankRightRef = useRef(null);

  useEffect(() => {
    if (window.lenis) window.lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (project) trackProjectView(project);
  }, [project]);

  useEffect(() => {
    const lines = lineRefs.current.filter(Boolean);
    if (!lines.length) return;
    const ctx = gsap.context(() => {
      gsap.set(lines, { yPercent: 110 });
      gsap.to(lines, {
        yPercent: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.14,
        delay: 0.1,
      });
    });
    return () => ctx.revert();
  }, [slug]);

  // Scroll parallax for the hero flank cutouts — the two images drift
  // at different speeds/directions as the hero scrolls past.
  useEffect(() => {
    if (!FLANKS[slug]) return;
    const left = flankLeftRef.current;
    const right = flankRightRef.current;
    if (!left && !right) return;

    const ctx = gsap.context(() => {
      const heroSection = (left || right).closest('.project-hero');
      const make = (el, from, to, fadeDelay) => {
        if (!el) return;
        // animate the whole link block (image + hint text) so they drift together
        const img = el.querySelector('.project-hero__flank-link') || el.querySelector('img');
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

  const gallery = useMemo(
    () => (project ? categoriseGallery(project.gallery || [], project.name) : []),
    [project],
  );

  // The banner rotates the hero frame plus the project's own gallery. Capped:
  // past a handful of frames the visitor is scrolling to the gallery anyway,
  // and every extra slide is another lazy request on a page that already
  // carries a walkthrough film.
  const bannerImages = useMemo(() => {
    if (!project) return [];
    const hero = project.hero_image ? [{ src: project.hero_image, alt: `${project.name} — hero` }] : [];
    return [...hero, ...gallery].slice(0, 8);
  }, [project, gallery]);
  const faqs = useMemo(() => buildProjectFaqs(project), [project]);
  const plans = useMemo(() => projectPlans(project), [project]);
  const related = useMemo(() => (project ? relatedProjects(slug, 3) : []), [project, slug]);

  // An unknown slug is a genuine 404 — render the real one so the status,
  // the copy and the noindex all match every other missing URL on the site.
  if (!project) return <NotFoundPage />;

  const {
    name, tagline, location, total_area, plot_sizes, status,
    description, amenities = [], connectivity = [], highlights = [],
    hero_image, brochure_url, amenityImages = {},
    video_url, video_poster, specifications, constructionUpdates = [],
    rera, developer, marketedBy, documents = [], possession, price, seo,
    mapQuery, coordinates,
  } = project;

  const statusLabel = status === 'trending' ? 'Trending now'
    : status === 'upcoming' ? 'Upcoming'
    : 'Completed';

  const nameWords = name.split(' ');
  const titleBreak = Math.ceil(nameWords.length / 2);
  const desktopTitleLines = [
    nameWords.slice(0, titleBreak).join(' '),
    nameWords.slice(titleBreak).join(' '),
  ].filter(Boolean);

  // ---- lead flows, one per intent ----
  const bookSiteVisit = () => openEnquiry({
    intent: LEAD_INTENTS.SITE_VISIT,
    project: name,
    source: `Site visit — ${name}`,
    eyebrow: 'Site visit',
    heading: `Book a site visit at ${name}.`,
    // The project is already known, so only the appointment needs asking.
    fields: ['name', 'phone', 'preferredDate', 'preferredTime'],
    submitLabel: 'Request a site visit',
    successMessage: `Thank you — we'll confirm your ${name} site visit by phone shortly.`,
  });

  const requestPrice = () => openEnquiry({
    intent: LEAD_INTENTS.PRICE,
    project: name,
    source: `Price request — ${name}`,
    eyebrow: 'Pricing',
    heading: `Get price details for ${name}.`,
    fields: ['name', 'phone'],
    submitLabel: 'Get price details',
    successMessage: `Thank you — we'll send ${name} pricing across shortly.`,
  });

  // The flank cutouts have offered the brochure since the original build; that
  // action now runs through BrochureGate so the lead is captured once, in one
  // place, and remembered for the session.
  const flankSide = (side) => (
    <div
      className={`project-hero__flank project-hero__flank--${side}${slug !== 'oscar-palace' ? ' project-hero__flank--compact' : ''}${slug === 'siddhayatan' ? ' project-hero__flank--sm' : ''}`}
      ref={side === 'left' ? flankLeftRef : flankRightRef}
    >
      {flanksDecorative ? (
        <span className="project-hero__flank-link project-hero__flank-link--static">
          <img src={flank[side]} alt="" aria-hidden="true" loading="lazy" />
        </span>
      ) : (
        <BrochureGate
          projectName={name}
          brochureUrl={brochure_url}
          className="project-hero__flank-link"
          label={
            <>
              <img src={flank[side]} alt="" aria-hidden="true" loading="lazy" />
              <span className="project-hero__flank-hint">
                {brochure_url ? 'Download Brochure' : 'Request Brochure'}
              </span>
            </>
          }
        />
      )}
    </div>
  );

  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name, path: `/projects/${slug}` },
  ];

  // Trim to a clean meta description: first sentence of the copy, capped so
  // Google doesn't truncate mid-word in the SERP.
  const metaDescription = seo?.description || (() => {
    const base = tagline || description || '';
    const text = `${name}, ${location}. ${base}`.replace(/\s+/g, ' ').trim();
    return text.length > 158 ? `${text.slice(0, 155).trimEnd()}…` : text;
  })();

  // Only facts the project genuinely publishes (read.md §14).
  const quickFacts = [
    { label: 'Location', value: location },
    { label: 'Status', value: statusLabel },
    { label: 'Plot sizes', value: plot_sizes },
    { label: 'Development', value: total_area },
    { label: 'Possession', value: possession },
    { label: 'Price', value: price?.display },
    { label: 'RERA', value: rera?.number, href: rera?.url },
    { label: 'Developer', value: developer },
  ];

  return (
    <>
      <Seo
        title={seo?.title || `${name} — ${location}`}
        description={metaDescription}
        path={`/projects/${slug}`}
        image={hero_image}
        type="article"
        jsonLd={[
          breadcrumbSchema(trail),
          projectSchema(project),
          videoObjectSchema(project),
          imageObjectSchema(hero_image, `${name}, ${location}`),
          faqSchema(faqs),
        ]}
      />

      {/* ====== HERO ====== */}
      <section className={`project-hero ${flank ? 'project-hero--flanked' : ''}`}>
        <div className="container project-hero__inner">
          {flank && (
            <div className="project-hero__flanks">
              {flankSide('left')}
              {flankSide('right')}
            </div>
          )}
          <Reveal as="span" className="eyebrow project-hero__eyebrow">
            {statusLabel} · {location}
          </Reveal>
          {/* Only the variant for the current viewport is rendered. Both used
              to be in the DOM with one hidden by CSS, which put the project
              name in the H1 twice ("Oscar PalaceOscar Palace") for anything
              reading raw text. */}
          <h1 className="display project-hero__title">
            {isMobile ? (
              <span className="project-hero__title-mobile">
                {nameWords.map((word) => (
                  <span className="project-hero__line" key={word}>
                    <span className="project-hero__line-inner">
                      {word}
                    </span>
                  </span>
                ))}
              </span>
            ) : (
              <span className="project-hero__title-desktop">
                {desktopTitleLines.map((line, i) => (
                  <span className="project-hero__line" key={line}>
                    <span className="project-hero__line-inner" ref={(el) => (lineRefs.current[i] = el)}>
                      {line}
                    </span>
                  </span>
                ))}
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

          {/* Two contextual actions, in intent order (read.md §13, §49). */}
          <Reveal className="project-hero__actions" delay={0.7}>
            <button type="button" className="cta project-hero__cta" onClick={bookSiteVisit}>
              Book a Site Visit
            </button>
            <button type="button" className="cta cta--ghost project-hero__cta" onClick={requestPrice}>
              Get Price Details
            </button>
          </Reveal>
        </div>
      </section>

      <Breadcrumbs trail={trail} />

      {/* ====== BANNER ====== */}
      <ProjectBannerCarousel images={bannerImages} projectName={name} />

      {/* ====== OVERVIEW ======
          First thing under the banner. A visitor who has just looked at the
          photographs wants to know what the place IS; the fact strip and the
          highlights both read better once they have. */}
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
            <Reveal className="project-overview__actions" delay={0.15}>
              <BrochureGate projectName={name} brochureUrl={brochure_url} className="cta cta--ghost" />
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

      {/* ====== QUICK FACTS ====== */}
      <ProjectQuickFacts facts={quickFacts} id="facts" />

      {/* ====== WHY THIS PROJECT ====== */}
      {highlights.length > 0 && (
        <section className="project-highlights">
          <div className="container">
            <Reveal as="span" className="eyebrow project-highlights__eyebrow">Why this project</Reveal>
            <Reveal as="h2" className="display project-highlights__heading" delay={0.05}>
              What stands out.
            </Reveal>
            <div className="project-highlights__grid">
              {highlights.map((h, i) => (
                <Reveal key={h} className="project-highlights__card" delay={i * 0.06}>
                  <span className="project-highlights__num">{String(i + 1).padStart(2, '0')}</span>
                  <p>{h}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ====== PLANS ====== */}
      {plans.length > 0 && (
        <PlanViewer
          plans={plans}
          projectName={name}
          kind="master"
          id="plans"
          eyebrow="Layout"
          heading="The master plan."
          lede="Open it full screen and zoom in — plot positions, road widths and orientation are all readable. No form required."
          className="project-plans"
        />
      )}

      {/* ====== LOCATION & CONNECTIVITY ====== */}
      <LocationSection
        projectName={name}
        location={location}
        mapQuery={mapQuery}
        coordinates={coordinates}
        connectivity={connectivity}
        id="location"
        heading="Where it stands."
        className="project-location"
      />

      {/* ====== AMENITIES ====== */}
      <AmenitiesSection
        amenities={amenities}
        amenityImages={amenityImages}
        projectName={name}
        id="amenities"
        className="project-amenities"
      />

      {/* ====== GALLERY ====== */}
      <ProjectGallery
        images={gallery}
        projectName={name}
        id="gallery"
        className="project-gallery-section"
      />

      {/* ====== FILM ====== */}
      {video_url && (
        <section className="project-video" id="film">
          <div className="container">
            <Reveal as="span" className="eyebrow project-video__eyebrow">The film</Reveal>
            <Reveal as="h2" className="display project-video__heading" delay={0.05}>
              Walk through {name}.
            </Reveal>
          </div>
          <Reveal className="project-video__stage" delay={0.1}>
            <div className="project-video__frame">
              <ProjectVideo src={video_url} poster={video_poster || hero_image} projectName={name} />
            </div>
          </Reveal>
        </section>
      )}

      {/* ====== CONSTRUCTION ====== */}
      <ConstructionUpdates
        updates={constructionUpdates}
        projectName={name}
        id="construction"
        className="project-construction"
      />

      {/* ====== SPECIFICATIONS ====== */}
      <ProjectSpecifications
        specifications={specifications}
        id="specifications"
        className="project-specs"
      />

      {/* ====== RERA & DOCUMENTATION ====== */}
      <ProjectCompliance
        rera={rera}
        developer={developer}
        marketedBy={marketedBy || 'Icon Realty'}
        documents={documents}
        projectName={name}
        id="rera"
      />

      {/* ====== BANKING ====== */}
      <BankPartners
        id="banking"
        action={
          <button type="button" className="cta cta--ghost" onClick={requestPrice}>
            Talk to us about financing
          </button>
        }
      />

      <TrustModule
        eyebrow="Who you're buying from"
        heading="Two decades. One city."
        variant="compact"
        action={<Link to="/about" className="cta cta--ghost">About Icon Realty</Link>}
      />

      {/* ====== FAQ ====== */}
      <FAQSection
        items={faqs}
        id="faq"
        heading={`${name}, answered.`}
        lede="If your question isn't here, call us — the number goes to the sales team, not a queue."
      />

      {/* ====== FINAL CTA ====== */}
      <section className="project-finalcta">
        <div className="project-finalcta__shell">
          <div className="container project-finalcta__inner project-finalcta__inner--split">
            <div className="project-finalcta__block">
              <Reveal as="span" className="eyebrow project-finalcta__eyebrow">Next step</Reveal>
              <Reveal as="h2" className="display project-finalcta__title" delay={0.05}>
                Come and walk {name}.
              </Reveal>
              <Reveal as="p" className="project-finalcta__lede" delay={0.1}>
                Site visits are by appointment. Our team will take you through the plots, the
                planning, and the long view — and answer the awkward questions.
              </Reveal>
              <Reveal className="project-finalcta__actions" delay={0.15}>
                <a href={telHref()} className="cta cta--ghost project-finalcta__ghost">
                  {PRIMARY_PHONE.label}
                </a>
                <BrochureGate
                  projectName={name}
                  brochureUrl={brochure_url}
                  className="cta cta--ghost project-finalcta__ghost"
                />
              </Reveal>
            </div>

            {/* The form is on the page rather than behind a button: this is the
                point of highest intent on the whole site, and a modal is one
                more tap between wanting a visit and asking for one. */}
            <Reveal className="project-finalcta__form" delay={0.2}>
              <SiteVisitForm project={name} source={`Project page — ${name}`} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ====== RELATED ====== */}
      {related.length > 0 && (
        <section className="project-related">
          <div className="container">
            <Reveal as="span" className="eyebrow project-related__eyebrow">Also worth seeing</Reveal>
            <Reveal as="h2" className="display project-related__heading" delay={0.05}>
              Other Icon Realty addresses.
            </Reveal>
            <div className="project-related__grid">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.05}>
                  <Link to={`/projects/${p.slug}`} className="project-related__card">
                    <MediaFigure
                      src={p.thumbnail || p.hero_image}
                      alt={`${p.name} — ${p.location}`}
                      ratio="4 / 3"
                    />
                    <span className="project-related__name">{p.name}</span>
                    <span className="project-related__meta">{p.location}</span>
                  </Link>
                </Reveal>
              ))}
            </div>
            <Reveal className="project-related__action" delay={0.2}>
              <Link to="/projects" className="cta cta--ghost">All projects</Link>
            </Reveal>
          </div>
        </section>
      )}

      <StickyMobileCTA
        project={name}
        intent={LEAD_INTENTS.SITE_VISIT}
        heading={`Enquire about ${name}.`}
        message={waMessage.project(name)}
      />
    </>
  );
}
