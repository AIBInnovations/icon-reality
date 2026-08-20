import Reveal from './Reveal';
import MediaFigure from './MediaFigure';
import './InfoGrid.css';

/**
 * Key/value editorial cards. Two variants, because "grid of identical icon
 * cards" is exactly what read.md §17/§28 asks us not to build:
 *
 *  - variant="text"  typographic cards, a hairline rule and a number. For
 *                    facts, values and checklists.
 *  - variant="media" photo-led cards, for anything we have real project
 *                    photography for.
 *
 * Items are { k, v } (or { title, body }), optionally with { image, credit }.
 * A media item without an image falls back to the text card rather than
 * rendering an empty frame.
 */
export default function InfoGrid({
  items = [],
  variant = 'text',
  columns = 3,
  numbered = false,
  ratio = '4 / 3',
  className = '',
}) {
  if (!items.length) return null;

  return (
    <div
      className={`info-grid info-grid--${variant} ${className}`}
      style={{ '--info-cols': columns }}
    >
      {items.map((item, i) => {
        const k = item.k ?? item.title ?? item.name;
        const v = item.v ?? item.body ?? item.note;
        const showMedia = variant === 'media' && item.image;

        return (
          <Reveal key={k || i} className="info-grid__card" delay={Math.min(i, 5) * 0.06}>
            {showMedia && (
              <MediaFigure src={item.image} alt={k} credit={item.credit} ratio={ratio} />
            )}
            <div className="info-grid__body">
              {numbered && (
                <span className="info-grid__num" aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
              )}
              {item.status && <span className="info-grid__status">{item.status}</span>}
              {k && <h3 className="info-grid__k">{k}</h3>}
              {v && <p className="info-grid__v">{v}</p>}
              {item.horizon && <span className="info-grid__tag">{item.horizon}</span>}
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
