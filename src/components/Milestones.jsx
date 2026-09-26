import Reveal from './Reveal';
import { MILESTONES } from '../data/company';
import './Milestones.css';

/**
 * The company timeline as a ruled list: year, title, one line of copy.
 *
 * Shared by the About page and the home page; the entries live in company.js.
 * A milestone without a published year shows a dot rather than an estimate.
 */
export default function Milestones({ items = MILESTONES }) {
  if (!items.length) return null;

  return (
    <ol className="milestones">
      {items.map((m, i) => (
        <Reveal as="li" key={m.title} className="milestones__item" delay={Math.min(i, 5) * 0.05} y={20}>
          <span className="milestones__year">{m.year ?? '·'}</span>
          <div className="milestones__body">
            <h3 className="milestones__title">{m.title}</h3>
            <p className="milestones__copy">{m.body}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
