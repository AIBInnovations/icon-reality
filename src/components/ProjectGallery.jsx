import { useMemo, useState } from 'react';
import Reveal from './Reveal';
import ImageViewer from './ImageViewer';
import { trackGalleryView } from '../analytics/events';
import './ProjectGallery.css';

/**
 * Project gallery with category filter and a fullscreen lightbox.
 *
 * Images may be plain paths or { src, category, alt }. When at least two
 * categories are present a filter rail appears; otherwise the section stays a
 * clean grid rather than showing a one-button filter (read.md §19).
 *
 * Everything below the first row is lazy — a 40-image gallery must not cost the
 * visitor 40 requests before they scroll.
 */
const CATEGORY_ORDER = ['Exterior', 'Interior', 'Amenities', 'Lifestyle', 'Location', 'Construction'];

export default function ProjectGallery({
  images = [],
  projectName,
  eyebrow = 'Gallery',
  heading = 'See the place.',
  lede,
  className = '',
  id,
}) {
  const [filter, setFilter] = useState('All');
  const [openAt, setOpenAt] = useState(null);
  const [failed, setFailed] = useState({});

  const normalised = useMemo(
    () => images
      .map((img) => (typeof img === 'string' ? { src: img } : img))
      // external hosts don't resolve from this deployment; hide rather than
      // render a broken frame
      .filter((img) => img?.src && !/^https?:\/\//i.test(img.src)),
    [images],
  );

  const categories = useMemo(() => {
    const present = [...new Set(normalised.map((i) => i.category).filter(Boolean))];
    present.sort((a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b));
    return present;
  }, [normalised]);

  const visible = useMemo(() => {
    const list = filter === 'All' ? normalised : normalised.filter((i) => i.category === filter);
    return list.filter((_, i) => !failed[`${filter}-${i}`]);
  }, [normalised, filter, failed]);

  if (!visible.length) return null;

  const pick = (cat) => {
    setFilter(cat);
    trackGalleryView(projectName, cat);
  };

  return (
    <section className={`project-gallery-v2 ${className}`} id={id}>
      <div className="container">
        <div className="project-gallery-v2__head">
          {eyebrow && <Reveal as="span" className="eyebrow project-gallery-v2__eyebrow">{eyebrow}</Reveal>}
          <Reveal as="h2" className="display project-gallery-v2__heading" delay={0.05}>{heading}</Reveal>
          {lede && <Reveal as="p" className="project-gallery-v2__lede" delay={0.1}>{lede}</Reveal>}
        </div>

        {categories.length > 1 && (
          <Reveal className="project-gallery-v2__filters" delay={0.08}>
            <div className="project-gallery-v2__chips" role="tablist" aria-label="Filter gallery">
              {['All', ...categories].map((cat) => (
                <button
                  type="button"
                  key={cat}
                  role="tab"
                  aria-selected={filter === cat}
                  className={`project-gallery-v2__chip ${filter === cat ? 'is-active' : ''}`}
                  onClick={() => pick(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        <div className="project-gallery-v2__grid">
          {visible.map((img, i) => (
            <Reveal
              key={img.src}
              className="project-gallery-v2__item"
              delay={Math.min(i, 8) * 0.04}
            >
              <button
                type="button"
                className="project-gallery-v2__tile"
                onClick={() => { setOpenAt(i); trackGalleryView(projectName, filter); }}
                aria-label={`Open image ${i + 1} of ${visible.length} full screen`}
              >
                <img
                  src={img.src}
                  alt={img.alt || `${projectName || 'Project'} — image ${i + 1}`}
                  /* first row is above the fold on most viewports */
                  loading={i < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                  onError={() => setFailed((f) => ({ ...f, [`${filter}-${i}`]: true }))}
                />
                {img.category && (
                  <span className="project-gallery-v2__tag">{img.category}</span>
                )}
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {openAt !== null && (
        <ImageViewer
          images={visible.map((img, i) => ({
            src: img.src,
            alt: img.alt || `${projectName || 'Project'} — image ${i + 1}`,
            label: img.category,
          }))}
          index={openAt}
          onIndexChange={setOpenAt}
          onClose={() => setOpenAt(null)}
          title={projectName ? `${projectName} — gallery` : 'Gallery'}
        />
      )}
    </section>
  );
}
