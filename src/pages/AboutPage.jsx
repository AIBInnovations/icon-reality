import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Reveal from '../components/Reveal';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import FinalCTA from '../components/FinalCTA';
import './AboutPage.css';

const ABOUT_FRAME_COUNT = 192;
const ABOUT_BOOTSTRAP = 60;
const aboutFrame = (i) => `/about-frames/f${String(i + 1).padStart(3, '0')}.jpg`;

export default function AboutPage() {
  const lineRefs = useRef([]);
  const wrapRef = useRef(null);
  const innerRef = useRef(null);
  const canvasRef = useRef(null);
  const stateRef = useRef({ images: [], progress: 0 });
  const [ready, setReady] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);

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

      {/* STORY */}
      <section className="about-story">
        <div className="container about-story__grid">
          <div className="about-story__col">
            <Reveal as="span" className="eyebrow about-story__eyebrow">
              The story
            </Reveal>
            <Reveal as="h2" className="display about-story__heading" delay={0.05}>
              Two decades<br/>of building trust.
            </Reveal>
          </div>
          <div className="about-story__col">
            <Reveal as="p" className="about-story__copy" delay={0.05}>
              Icon Realty evolved from a promising vision into one of Indore's most trusted names in premium real estate.
              Under the direction of <strong>Mr. Siddharth Porwal</strong>, the company has built more than fifteen landmark
              developments — each one a quiet, considered statement of what plotted living can be.
            </Reveal>
            <Reveal as="p" className="about-story__copy" delay={0.1}>
              Our work is shaped by ethical practice, customer-first thinking, and a refusal to cut corners on the things
              residents will live with for decades. Wide planned roads. Real green cover. Boundaries that mean something.
              Landmarks that age into the city, not against it.
            </Reveal>
          </div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="about-vm">
        <div className="container about-vm__grid">
          <Reveal className="about-vm__card about-vm__card--vision">
            <span className="about-vm__tag">Vision</span>
            <p>
              To be a trusted leader in luxury real estate by creating community-centric spaces — defined by dense tree
              plantations and vibrant greenery — delivering timeless landmarks with enduring quality and a healthier
              lifestyle.
            </p>
          </Reveal>
          <Reveal className="about-vm__card about-vm__card--mission" delay={0.08}>
            <span className="about-vm__tag">Mission</span>
            <p>
              To create developments that rise beyond architecture — shaped with precision, purpose, and refined
              elegance — through ethical practices and a customer-first approach.
            </p>
          </Reveal>
        </div>

        <div className="container about-vm__values">
          <Reveal as="h3" className="about-vm__values-title">Our core values</Reveal>
          <div className="about-vm__values-grid">
            {[
              { k: 'Integrity', v: 'Honesty, transparency, and ethical responsibility in every decision.' },
              { k: 'Craftsmanship', v: 'Superior design, meticulous planning, and an obsession with quality.' },
              { k: 'Customer-First', v: 'Long-term commitment with post-sales support and quick responsiveness.' },
              { k: 'Innovation', v: 'New ideas, technologies, and design philosophies — applied with purpose.' },
            ].map((x, i) => (
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
          {[
            {
              name: 'Mr. Nilesh Porwal',
              role: 'Director, Icon Realty',
              photo: '/images/team/director-nilesh.png',
              bio: 'Over two decades shaping Central India\'s premium townships. He leads on craftsmanship, planning, and the unglamorous details — wide roads, real green cover, boundaries that age into landmarks.',
            },
            {
              name: 'Mr. Siddharth Porwal',
              role: 'Director, Icon Realty',
              photo: '/images/team/director-siddharth.png',
              bio: 'Under his direction, Icon Realty has evolved from a promising vision into one of Indore\'s most trusted names. Champion of transparency, ethical practice, and a long view that puts families ahead of quarters.',
            },
          ].map((d, i) => (
            <Reveal key={d.name} className="team-card" delay={i * 0.08}>
              <div className="team-card__photo">
                <img src={d.photo} alt={d.name} />
              </div>
              <div className="team-card__veil" aria-hidden />
              <div className="team-card__body">
                <h3 className="team-card__name">{d.name}</h3>
                <span className="team-card__role">{d.role}</span>
                <p className="team-card__bio">{d.bio}</p>
              </div>
            </Reveal>
          ))}
          </div>
        </div>
        </div>
      </section>

      <Stats />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
