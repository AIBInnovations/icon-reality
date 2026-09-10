import { useMemo, useState } from 'react';
import Reveal from './Reveal';
import Picture from './Picture';
import ImageViewer from './ImageViewer';
import './ProjectCampaign.css';

/**
 * The project's campaign creatives, as an accordion.
 *
 * Same interaction as the home page's projects carousel (ProjectsCarousel):
 * a row of cards with one open, the rest collapsed to slivers, and a click to
 * move between them. It reads as the same site because it is the same idea.
 *
 * The difference is what the open card does with its image. These creatives
 * are square artworks with their wording set into the picture, so the open
 * card uses `object-fit: contain` and shows the whole thing, never a crop.
 * Only the collapsed slivers are covered, and those are navigation, not
 * reading material.
 *
 * On phones a sliver is useless, so the open card takes the full width and the
 * others step in behind it, one at a time.
 *
 * Clicking the open card opens the shared fullscreen ImageViewer, the same
 * second-click behaviour the home carousel uses to open a project.
 */
export default function ProjectCampaign({
  images = [],
  projectName = 'Project',
  eyebrow = 'The campaign',
  // Count-free on purpose: the default has to read correctly for a project
  // that carries three creatives as well as one that carries eight.
  heading = 'The case, frame by frame.',
  lede,
  className = '',
  id,
}) {
  const slides = useMemo(
    () => images
      .map((img) => (typeof img === 'string' ? { src: img } : img))
      .filter((img) => img?.src && !/^https?:\/\//i.test(img.src)),
    [images],
  );

  const [active, setActive] = useState(0);
  const [viewerAt, setViewerAt] = useState(null);

  const count = slides.length;
  const step = (n) => setActive(((n % count) + count) % count);

  // First click opens a card; clicking the open one goes fullscreen — the same
  // two-step the home carousel uses.
  const handleCard = (i) => {
    if (i === active) setViewerAt(i);
    else setActive(i);
  };

  // Section hides itself when the project has no creatives (CLAUDE.md §5).
  if (!count) return null;

  const label = (img, i) => img.alt || `${projectName}: campaign creative ${i + 1}`;

  return (
    <section className={`campaign ${className}`} id={id}>
      <div className="container">
        <div className="campaign__head">
          <Reveal as="span" className="eyebrow campaign__eyebrow">{eyebrow}</Reveal>
          <Reveal as="h2" className="display campaign__heading" delay={0.05}>{heading}</Reveal>
          {lede && <Reveal as="p" className="campaign__lede" delay={0.1}>{lede}</Reveal>}
        </div>

        <Reveal className="campaign__stage" delay={0.1}>
          <div className="campaign__accordion">
            {slides.map((img, i) => (
              <button
                type="button"
                key={img.src}
                className={`campaign__card ${i === active ? 'is-active' : ''}`}
                onClick={() => handleCard(i)}
                aria-label={i === active
                  ? `Open ${label(img, i)} full screen`
                  : `Show ${label(img, i)}`}
              >
                <Picture
                  src={img.src}
                  alt={i === active ? label(img, i) : ''}
                  /* The open card is the only one worth fetching up front;
                     the slivers arrive as they are stepped to. */
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </button>
            ))}
          </div>

          {count > 1 && (
            <div className="campaign__controls">
              <div className="campaign__counter">
                <span className="is-current">{String(active + 1).padStart(2, '0')}</span>
                <span className="campaign__counter-sep" />
                <span>{String(count).padStart(2, '0')}</span>
              </div>
              <div className="campaign__buttons">
                <button type="button" onClick={() => step(active - 1)} aria-label="Previous creative">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                    <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button type="button" className="is-primary" onClick={() => step(active + 1)} aria-label="Next creative">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                    <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </Reveal>
      </div>

      {viewerAt !== null && (
        <ImageViewer
          images={slides.map((img, i) => ({ src: img.src, alt: label(img, i) }))}
          index={viewerAt}
          onIndexChange={setViewerAt}
          onClose={() => setViewerAt(null)}
          title={`${projectName}: campaign`}
        />
      )}
    </section>
  );
}
