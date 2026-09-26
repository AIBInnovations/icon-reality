import Reveal from './Reveal';
import Picture from './Picture';
import { MILESTONES } from '../data/company';
import './Milestones.css';

/**
 * The company timeline: one card per milestone, each with a photograph of a
 * project it names, a step number, and the year where the company has
 * published one (never an estimate).
 *
 * Shared by the About page and the home page; the entries live in company.js.
 */
export default function Milestones({ items = MILESTONES }) {
  if (!items.length) return null;

  return (
    <ol className="milestones">
      {items.map((m, i) => (
        <Reveal as="li" key={m.title} className="milestones__item" delay={Math.min(i, 5) * 0.06} y={20}>
          {m.image && (
            <div className="milestones__media">
              <Picture src={m.image} alt={m.imageAlt || ''} loading="lazy" decoding="async" />
            </div>
          )}
          <div className="milestones__body">
            <div className="milestones__marker">
              <span className="milestones__step">{String(i + 1).padStart(2, '0')}</span>
              {m.year && <span className="milestones__year">{m.year}</span>}
            </div>
            <h3 className="milestones__title">{m.title}</h3>
            <p className="milestones__copy">{m.body}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
