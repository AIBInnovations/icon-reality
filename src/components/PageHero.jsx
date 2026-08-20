import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Reveal from './Reveal';
import './PageHero.css';

/**
 * The editorial page hero every new section route uses.
 *
 * It is the Projects/About hero lifted into one component so the new pages
 * (Why Indore, Investor Corner, NRI Corner, Channel Partners) open exactly the
 * way the existing site does — masked lines rising into place, then the lede.
 * Reusing it is what stops the new pages reading as a second website bolted on.
 *
 * `title` is an array of lines; each gets its own overflow-hidden mask so the
 * stagger reads as type sliding up from behind a rule.
 */
export default function PageHero({
  eyebrow,
  title = [],
  lede,
  actions,
  /** { src, credit } — optional framed banner below the type. */
  media,
  align = 'center',
  className = '',
}) {
  const lineRefs = useRef([]);
  // Hoisted so the dependency is a plain string the linter can check — the
  // tween must restart when the headline itself changes, not on every render.
  const titleKey = title.join('|');

  useEffect(() => {
    const lines = lineRefs.current.filter(Boolean);
    if (!lines.length) return;
    // gsap.context so the tween is reverted cleanly on unmount and can never
    // leave a half-animated transform behind on a route change.
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
  }, [titleKey]);

  return (
    <>
      <section className={`page-hero page-hero--${align} ${className}`}>
        <div className="container page-hero__inner">
          {eyebrow && (
            <Reveal as="span" className="eyebrow page-hero__eyebrow">{eyebrow}</Reveal>
          )}

          <h1 className="display page-hero__title">
            {title.map((line, i) => (
              <span className="page-hero__line" key={line}>
                <span className="page-hero__line-inner" ref={(el) => (lineRefs.current[i] = el)}>
                  {line}
                </span>
              </span>
            ))}
          </h1>

          {lede && (
            <Reveal as="p" className="page-hero__lede" delay={0.6}>{lede}</Reveal>
          )}

          {actions && (
            <Reveal className="page-hero__actions" delay={0.7}>{actions}</Reveal>
          )}
        </div>
      </section>

      {media?.src && (
        <section className="page-hero__banner">
          <div className="page-hero__banner-shell">
            <img
              src={media.src}
              alt={media.alt || media.credit || ''}
              /* the LCP image on these routes — decode it eagerly */
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            {media.credit && (
              <span className="page-hero__banner-credit">{media.credit}</span>
            )}
          </div>
        </section>
      )}
    </>
  );
}
