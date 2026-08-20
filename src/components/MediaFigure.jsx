import { useState } from 'react';
import './MediaFigure.css';

/**
 * A framed project photograph with an optional credit caption.
 *
 * Two jobs beyond rendering an <img>:
 *
 *  1. Failed loads collapse the figure instead of leaving a broken-image icon
 *     in the middle of an editorial layout (read.md §76). Sections that pass a
 *     path which no longer exists degrade to text rather than to a hole.
 *  2. The credit line. Every photograph on the new pages is Icon Realty's own
 *     project photography, and it is captioned with the project it shows — so
 *     a Labham City frame on the Why Indore page is never mistaken for a stock
 *     photo of the corridor itself.
 */
export default function MediaFigure({
  src,
  alt = '',
  credit,
  ratio = '4 / 3',
  className = '',
  eager = false,
  rounded = true,
  children,
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;

  return (
    <figure
      className={`media-figure ${rounded ? 'media-figure--rounded' : ''} ${className}`}
      style={{ '--media-ratio': ratio }}
    >
      <span className="media-figure__frame">
        <img
          src={src}
          alt={alt || credit || ''}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          /* low, not auto: these are section photographs below the fold and
             must not compete with the hero sequence for bandwidth */
          fetchPriority={eager ? 'high' : 'low'}
          onError={() => setFailed(true)}
        />
        {children}
      </span>
      {credit && <figcaption className="media-figure__credit">{credit}</figcaption>}
    </figure>
  );
}
