import Reveal from './Reveal';
import './ProjectQuickFacts.css';

/**
 * The information strip directly under the project hero — the six or seven
 * things a buyer checks before reading anything else.
 *
 * Every row is conditional on real data. A project without a published price,
 * possession date or RERA number simply shows fewer facts; it never renders an
 * empty slot, a dash, or "Price on request" dressed up as a data point
 * (read.md §14, §71).
 */
export default function ProjectQuickFacts({ facts = [], className = '', id }) {
  const present = facts.filter((f) => f && f.value);
  if (!present.length) return null;

  return (
    <section className={`quick-facts ${className}`} id={id}>
      <div className="container">
        <dl className="quick-facts__grid">
          {present.map((f, i) => (
            <Reveal
              as="div"
              key={f.label}
              className="quick-facts__item"
              delay={Math.min(i, 6) * 0.05}
              y={20}
            >
              <dt className="quick-facts__k">{f.label}</dt>
              <dd className="quick-facts__v">
                {f.href ? (
                  <a href={f.href} target="_blank" rel="noreferrer" className="quick-facts__link">
                    {f.value}
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
                      <path d="M4 10L10 4M10 4H5.5M10 4v4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                ) : f.value}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
