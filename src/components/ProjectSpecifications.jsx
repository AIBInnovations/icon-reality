import Reveal from './Reveal';
import './ProjectSpecifications.css';

/**
 * Specifications table.
 *
 * `specifications` is a plain object of group → array of lines, e.g.
 *   { Roads: ['100 ft and 60 ft main roads'], Utilities: [...] }
 *
 * Groups with no entries are dropped, and the whole section disappears when the
 * project publishes no specifications at all — rather than rendering an empty
 * table with hyphens in it (read.md §14, §76).
 */
export default function ProjectSpecifications({
  specifications,
  eyebrow = 'The build',
  heading = 'Specifications.',
  lede,
  className = '',
  id,
}) {
  const groups = Object.entries(specifications || {})
    .map(([group, items]) => [group, (Array.isArray(items) ? items : [items]).filter(Boolean)])
    .filter(([, items]) => items.length > 0);

  if (!groups.length) return null;

  return (
    <section className={`specs ${className}`} id={id}>
      <div className="container">
        <div className="specs__head">
          <Reveal as="span" className="eyebrow specs__eyebrow">{eyebrow}</Reveal>
          <Reveal as="h2" className="display specs__heading" delay={0.05}>{heading}</Reveal>
          {lede && <Reveal as="p" className="specs__lede" delay={0.1}>{lede}</Reveal>}
        </div>

        <dl className="specs__table">
          {groups.map(([group, items], i) => (
            <Reveal as="div" key={group} className="specs__row" delay={Math.min(i, 6) * 0.04} y={20}>
              <dt className="specs__k">{group}</dt>
              <dd className="specs__v">
                <ul>
                  {items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
