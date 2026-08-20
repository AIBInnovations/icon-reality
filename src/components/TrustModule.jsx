import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Reveal from './Reveal';
import MediaFigure from './MediaFigure';
import { TRUST_STATS, TRUST_PILLARS } from '../data/company';
import './TrustModule.css';

/**
 * The reusable trust module — home, About, Investor Corner and project pages.
 *
 * Replaces the pattern of each page hand-rolling its own credibility block.
 * TrustSection (the Oscar Palace-specific one on the home page) stays where it
 * is; this is the portable one, and every figure it shows comes from
 * data/company.js. No metric appears here that Icon Realty has not published
 * (read.md §24, §71).
 *
 * Variants:
 *   'full'    stats + pillars + photograph        (About, Investor)
 *   'compact' stats + pillars, no photograph      (project pages)
 *   'strip'   stats only, one row                 (anywhere it must stay light)
 */
function Counter({ to, suffix = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Respect reduced motion: show the final number rather than animating it.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = format(to) + suffix;
      return undefined;
    }

    const obj = { v: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        v: to,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: () => { el.textContent = format(Math.round(obj.v)) + suffix; },
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      });
    }, ref);
    return () => ctx.revert();
  }, [to, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

const format = (n) => (n >= 1000 ? n.toLocaleString('en-IN') : String(n));

export default function TrustModule({
  eyebrow = 'Why Icon Realty',
  heading = 'Two decades. One standard.',
  lede,
  stats = TRUST_STATS,
  pillars = TRUST_PILLARS,
  media,
  variant = 'full',
  tone = 'light',
  action,
  className = '',
  id,
}) {
  // ScrollTrigger positions are measured on mount; a page that lazily reveals
  // this section below other animated content can leave the counters' triggers
  // stale, so nudge a refresh once after mount.
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => clearTimeout(t);
  }, []);

  const showPillars = variant !== 'strip' && pillars?.length > 0;
  const showMedia = variant === 'full' && media?.src;

  return (
    <section
      className={`trust-module trust-module--${variant} tone-${tone} ${className}`}
      id={id}
    >
      <div className="container trust-module__inner">
        <div className="trust-module__head">
          {eyebrow && <Reveal as="span" className="eyebrow trust-module__eyebrow">{eyebrow}</Reveal>}
          {heading && (
            <Reveal as="h2" className="display trust-module__heading" delay={0.05}>{heading}</Reveal>
          )}
          {lede && <Reveal as="p" className="trust-module__lede" delay={0.1}>{lede}</Reveal>}
        </div>

        <div className={`trust-module__grid ${showMedia ? 'has-media' : ''}`}>
          {showMedia && (
            <Reveal className="trust-module__media">
              <MediaFigure src={media.src} alt={media.alt} credit={media.credit} ratio="3 / 4" />
            </Reveal>
          )}

          <div className="trust-module__content">
            <div className="trust-module__stats">
              {stats.map((s, i) => (
                <Reveal key={s.key || s.label} className="trust-module__stat" delay={i * 0.06}>
                  <span className="trust-module__stat-v">
                    <Counter to={s.value} suffix={s.suffix} />
                  </span>
                  <span className="trust-module__stat-k">{s.label}</span>
                  {s.sub && <span className="trust-module__stat-sub">{s.sub}</span>}
                </Reveal>
              ))}
            </div>

            {showPillars && (
              <ul className="trust-module__pillars">
                {pillars.map((p, i) => (
                  <Reveal as="li" key={p.k} className="trust-module__pillar" delay={i * 0.05}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                      <path d="M3 9L7 13L15 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>
                      <strong>{p.k}</strong>
                      <span className="trust-module__pillar-v">{p.v}</span>
                    </span>
                  </Reveal>
                ))}
              </ul>
            )}

            {action && (
              <Reveal className="trust-module__action" delay={0.2}>
                {typeof action === 'string' ? (
                  <Link to={action} className="cta cta--ghost">See our projects</Link>
                ) : action}
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
