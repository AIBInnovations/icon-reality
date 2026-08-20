import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import TrustModule from '../components/TrustModule';
import MediaFigure from '../components/MediaFigure';
import SectionHeading from '../components/SectionHeading';
import Testimonials from '../components/Testimonials';
import CtaBand from '../components/CtaBand';
import Breadcrumbs from '../components/Breadcrumbs';
import Seo from '../seo/Seo';
import { breadcrumbSchema, webPageSchema } from '../seo/schema';
import { LEAD_INTENTS } from '../services/leads';
import {
  STORY, VALUES, VISION, MISSION, LEADERSHIP,
  MILESTONES, AWARDS, PRESS, FOUNDER_MESSAGE,
} from '../data/company';
import './AboutPage.css';

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
];

const ABOUT_FRAME_COUNT = 192;
const ABOUT_BOOTSTRAP = 60;
// bump ASSET_REV whenever the frame images themselves are re-exported, so
// browsers holding an older copy re-fetch instead of serving it from cache
const ASSET_REV = 2;
const aboutFrame = (i) =>
  `/about-frames/f${String(i + 1).padStart(3, '0')}.jpg?v=${ASSET_REV}`;

export default function AboutPage() {
  const lineRefs = useRef([]);
  const wrapRef = useRef(null);
  const innerRef = useRef(null);
  const canvasRef = useRef(null);
  const stateRef = useRef({ images: [], progress: 0 });
  const [ready, setReady] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  // Which director card is expanded. Desktop reveals the bio on :hover, but
  // touch has no hover — without this the bio is unreachable on mobile.
  const [openBio, setOpenBio] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
  }, []);

  // Canvas scroll-scrub for the about video
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!canvas || !wrap || !inner) return;
    let mounted = true;

    const ctx = canvas.getContext('2d', { alpha: false });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cw = 0, ch = 0;

    const resize = () => {
      // Mobile browser bars collapsing on scroll fire resize with an unchanged
      // box — setting canvas.width blanks the frame, so skip the reallocation
      // and just repaint.
      if (inner.clientWidth === cw && inner.clientHeight === ch) {
        draw(stateRef.current.progress);
        return;
      }
      cw = inner.clientWidth;
      ch = inner.clientHeight;
      canvas.width = Math.floor(cw * dpr);
      canvas.height = Math.floor(ch * dpr);
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(stateRef.current.progress);
    };

    const placeImage = (img) => {
      const iw = img.naturalWidth, ih = img.naturalHeight;
      const s = Math.max(cw / iw, ch / ih);
      const w = iw * s, h = ih * s;
      return { x: (cw - w) / 2, y: (ch - h) / 2, w, h };
    };

    const draw = (progress) => {
      stateRef.current.progress = progress;
      const fIdx = progress * (ABOUT_FRAME_COUNT - 1);
      const i0 = Math.max(0, Math.min(ABOUT_FRAME_COUNT - 1, Math.floor(fIdx)));
      const i1 = Math.max(0, Math.min(ABOUT_FRAME_COUNT - 1, i0 + 1));
      const t = fIdx - i0;
      const img0 = stateRef.current.images[i0];
      const img1 = stateRef.current.images[i1];
      if (!img0 || !img0.complete || !img0.naturalWidth) return;
      const p0 = placeImage(img0);
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, cw, ch);
      ctx.globalAlpha = 1;
      ctx.drawImage(img0, p0.x, p0.y, p0.w, p0.h);
      if (img1 && img1.complete && img1.naturalWidth && i1 !== i0 && t > 0) {
        ctx.globalAlpha = t;
        ctx.drawImage(img1, p0.x, p0.y, p0.w, p0.h);
        ctx.globalAlpha = 1;
      }
    };

    // preload frames
    const images = [];
    let loaded = 0;
    for (let i = 0; i < ABOUT_FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        loaded++;
        if (loaded <= ABOUT_BOOTSTRAP) {
          setBootProgress(Math.min(1, loaded / ABOUT_BOOTSTRAP));
        }
      };
      img.onerror = () => { loaded++; };
      img.src = aboutFrame(i);
      images.push(img);
    }
    stateRef.current.images = images;

    const bootstrap = Promise.all(
      images.slice(0, ABOUT_BOOTSTRAP).map((img) => new Promise((res) => {
        if (img.complete) res();
        else {
          img.addEventListener('load', () => res(), { once: true });
          img.addEventListener('error', () => res(), { once: true });
        }
      }))
    );

    resize();
    window.addEventListener('resize', resize);

    let gsapCtx = null;
    bootstrap.then(() => {
      if (!mounted) return;
      setReady(true);
      resize();
      // Scoped context so revert() unwinds pinSpacer cleanly on unmount
      gsapCtx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: wrap,
          start: 'top top',
          end: 'bottom bottom', // CSS position:sticky on .about-video__sticky handles the visual pin
          scrub: 0.4,
          invalidateOnRefresh: true,
          onUpdate: (self) => draw(self.progress),
        });
      });
      ScrollTrigger.refresh();
    });

    return () => {
      mounted = false;
      window.removeEventListener('resize', resize);
      if (gsapCtx) gsapCtx.revert();
    };
  }, []);

  return (
    <>
      <Seo
        title="About Icon Realty — 20+ years of plotted development in Indore"
        description="Two decades of trust, 15+ landmark projects and 4,500+ happy families. Meet the team behind Icon Realty's plotted developments in Indore, Madhya Pradesh."
        path="/about"
        jsonLd={[
          breadcrumbSchema(TRAIL),
          webPageSchema('AboutPage', {
            name: 'About Icon Realty',
            description: 'The story, values and team behind Icon Realty, Indore.',
            path: '/about',
          }),
        ]}
      />

      {/* MODUS-STYLE HERO */}
      <section className="about-hero">
        <div className="container about-hero__inner">
          <h1 className="display about-hero__title">
            <span className="about-hero__line">
              <span className="about-hero__line-inner" ref={(el) => (lineRefs.current[0] = el)}>
                Because it
              </span>
            </span>
            <span className="about-hero__line">
              <span className="about-hero__line-inner" ref={(el) => (lineRefs.current[1] = el)}>
                better can.
              </span>
            </span>
          </h1>
          <Reveal as="p" className="about-hero__lede" delay={0.6}>
            Our motivation? More character and quality in every plotted development — without sacrificing budget,
            timelines, or the long view that protects our families' investments.
          </Reveal>
        </div>
      </section>

      <Breadcrumbs trail={TRAIL} />

      {/* VIDEO BAND — scroll-scrubbed canvas (sticky child) */}
      <section ref={wrapRef} className="about-video">
        <div className="about-video__sticky">
          <div ref={innerRef} className="about-video__shell">
            <canvas ref={canvasRef} className="about-video__canvas" />
            {!ready && (
              <div className="about-video__loading" aria-hidden>
                <div className="about-video__loading-bar">
                  <span style={{ width: `${bootProgress * 100}%` }} />
                </div>
                <span className="about-video__loading-txt">PREPARING THE STORY</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* STORY — short editorial beats, not one long paragraph (read.md §23) */}
      <section className="about-story">
        <div className="container about-story__grid">
          <div className="about-story__col">
            <Reveal as="span" className="eyebrow about-story__eyebrow">
              The story
            </Reveal>
            <Reveal as="h2" className="display about-story__heading" delay={0.05}>
              Two decades<br/>of building trust.
            </Reveal>
            <Reveal className="about-story__media" delay={0.1}>
              <MediaFigure
                src="/images/ruchi-enclave/gallery-2.jpg"
                credit="Ruchi Enclave, Jhalaria — delivered"
                ratio="4 / 5"
              />
            </Reveal>
          </div>
          <div className="about-story__col">
            {STORY.map((beat, i) => (
              <Reveal key={beat.title} className="about-story__beat" delay={0.05 + i * 0.05}>
                <h3 className="about-story__beat-title">{beat.title}</h3>
                <p className="about-story__copy">{beat.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="about-vm">
        <div className="container about-vm__grid">
          <Reveal className="about-vm__card about-vm__card--vision">
            <span className="about-vm__tag">Vision</span>
            <p>{VISION}</p>
          </Reveal>
          <Reveal className="about-vm__card about-vm__card--mission" delay={0.08}>
            <span className="about-vm__tag">Mission</span>
            <p>{MISSION}</p>
          </Reveal>
        </div>

        <div className="container about-vm__values">
          <Reveal as="h3" className="about-vm__values-title">Our core values</Reveal>
          <div className="about-vm__values-grid">
            {VALUES.map((x, i) => (
              <Reveal key={x.k} className="about-vm__value" delay={i * 0.06}>
                <span className="about-vm__value-k">{x.k}</span>
                <span className="about-vm__value-v">{x.v}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DIRECTORS / LEADERSHIP */}
      <section className="about-team">
        <div className="about-team__shell">
        <div className="container about-team__split">
          <div className="about-team__left">
            <Reveal as="h2" className="display about-team__heading">
              Other thinking,<br/>smarter realize.
            </Reveal>
            <Reveal as="p" className="about-team__lede" delay={0.05}>
              A compact leadership team, with direct lines and fast decisions —
              so we stay involved in every project, every step.
            </Reveal>
          </div>

          <div className="about-team__cards">
          {LEADERSHIP.map((d, i) => (
            <Reveal
              key={d.name}
              className={`team-card ${openBio === i ? 'is-open' : ''}`}
              delay={i * 0.08}
              role="button"
              tabIndex={0}
              aria-expanded={openBio === i}
              aria-label={`${d.name} — read bio`}
              onClick={() => setOpenBio((o) => (o === i ? null : i))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setOpenBio((o) => (o === i ? null : i));
                }
              }}
            >
              <div className="team-card__photo">
                <img src={d.photo} alt={d.name} loading="lazy" decoding="async" />
              </div>
              <div className="team-card__veil" aria-hidden />
              <div className="team-card__body">
                <h3 className="team-card__name">{d.name}</h3>
                <span className="team-card__role">{d.role}</span>
                <p className="team-card__bio">{d.bio}</p>
              </div>

              {/* Standing affordance — the card looked inert, so nobody knew the
                  bio was behind a hover/tap. Sits outside __body and absolutely
                  positioned: the hidden bio still reserves its height, so an
                  in-flow cue would be pushed away from the name. */}
              <span className="team-card__cta" aria-hidden>
                View
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7H11M7 3L11 7L7 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Reveal>
          ))}
          </div>
        </div>
        </div>
      </section>

      {/* MILESTONES */}
      {MILESTONES.length > 0 && (
        <section className="about-milestones">
          <div className="container">
            <SectionHeading
              eyebrow="Milestones"
              title="How the portfolio grew."
              lede="Only entries Icon Realty has published. Where a year has not been stated publicly, it is left blank rather than estimated."
            />
            <ol className="about-milestones__list">
              {MILESTONES.map((m, i) => (
                <Reveal as="li" key={m.title} className="about-milestones__item" delay={Math.min(i, 5) * 0.05} y={20}>
                  <span className="about-milestones__year">{m.year ?? '—'}</span>
                  <div className="about-milestones__body">
                    <h3 className="about-milestones__title">{m.title}</h3>
                    <p className="about-milestones__copy">{m.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* AWARDS & PRESS — hidden until data/company.js carries verifiable
          entries, rather than showing placeholder logos (read.md §71). */}
      {(AWARDS.length > 0 || PRESS.length > 0) && (
        <section className="about-awards">
          <div className="container">
            <SectionHeading eyebrow="Recognition" title="Awards & press." />
            <ul className="about-awards__list">
              {[...AWARDS, ...PRESS].map((a) => (
                <li key={a.title}>
                  {a.url
                    ? <a href={a.url} target="_blank" rel="noreferrer">{a.title}</a>
                    : <span>{a.title}</span>}
                  <span className="about-awards__meta">
                    {[a.issuer, a.year].filter(Boolean).join(' · ')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* FOUNDER MESSAGE — null until the client provides the film. */}
      {FOUNDER_MESSAGE && (
        <section className="about-founder">
          <div className="container about-founder__grid">
            <div className="about-founder__media">
              <video
                src={FOUNDER_MESSAGE.src}
                poster={FOUNDER_MESSAGE.poster}
                controls
                preload="none"
                playsInline
              />
            </div>
            <div className="about-founder__copy">
              <Reveal as="span" className="eyebrow">Founder message</Reveal>
              <Reveal as="blockquote" className="about-founder__quote" delay={0.05}>
                {FOUNDER_MESSAGE.quote}
              </Reveal>
              <Reveal as="cite" className="about-founder__cite" delay={0.1}>
                {FOUNDER_MESSAGE.attribution}
              </Reveal>
            </div>
          </div>
        </section>
      )}

      <TrustModule
        eyebrow="By the numbers"
        heading="Two decades. One standard."
        lede="From the first plot to the latest landmark — every figure below is one Icon Realty has published."
        media={{ src: '/images/oscar/park/park-1.jpg', credit: 'Oscar Palace, Indore–Nagpur Highway' }}
        action={<Link to="/projects" className="cta cta--ghost">See the projects</Link>}
      />

      <Testimonials />

      <CtaBand
        eyebrow="Next step"
        heading="Come and see one we finished."
        body="The most useful thing you can do before buying from any developer is walk a project they delivered five years ago. Ours are open to visit."
        primaryLabel="Book a Site Visit"
        image="/images/oscar/entrance/entrance-2.jpg"
        enquiry={{
          intent: LEAD_INTENTS.SITE_VISIT,
          source: 'About — site visit',
          eyebrow: 'Site visit',
          heading: 'Book a site visit.',
          fields: ['name', 'phone', 'preferredDate', 'preferredTime'],
          submitLabel: 'Request a site visit',
        }}
      />
    </>
  );
}
