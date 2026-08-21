import Reveal from './Reveal';
import MediaFigure from './MediaFigure';
import './EditorialSplit.css';

/**
 * Image on one side, copy on the other — the layout the About and Trust
 * sections already use, generalised so the new pages can alternate sides down
 * a page instead of stacking identical icon cards (read.md §17, §28).
 *
 * `flip` puts the media on the right. `items` renders as a checklist under the
 * copy when supplied.
 */
export default function EditorialSplit({
  eyebrow,
  title,
  body,
  items,
  media,
  flip = false,
  actions,
  ratio = '4 / 5',
  className = '',
  headingLevel: Heading = 'h2',
}) {
  return (
    <div className={`editorial-split ${flip ? 'editorial-split--flip' : ''} ${className}`}>
      <Reveal className="editorial-split__media">
        <MediaFigure src={media?.src} alt={media?.alt} credit={media?.credit} ratio={ratio} />
      </Reveal>

      <div className="editorial-split__copy">
        {eyebrow && <Reveal as="span" className="eyebrow editorial-split__eyebrow">{eyebrow}</Reveal>}
        {title && (
          <Reveal as={Heading} className="display editorial-split__title" delay={0.05}>{title}</Reveal>
        )}
        {body && <Reveal as="p" className="editorial-split__body" delay={0.1}>{body}</Reveal>}

        {items?.length > 0 && (
          <Reveal className="editorial-split__list" delay={0.15}>
            <ul>
              {items.map((item) => (
                <li key={typeof item === 'string' ? item : item.k}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                    <path d="M3 9L7 13L15 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {typeof item === 'string' ? (
                    <span>{item}</span>
                  ) : (
                    <span>
                      <strong>{item.k}</strong>
                      {item.v ? <>: {item.v}</> : null}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {actions && <Reveal className="editorial-split__actions" delay={0.2}>{actions}</Reveal>}
      </div>
    </div>
  );
}
