import { useMemo, useState } from 'react';
import Reveal from './Reveal';
import ImageViewer from './ImageViewer';
import './AmenitiesSection.css';

/**
 * Amenities, laid out editorially rather than as thirty identical icon cards
 * (read.md §17).
 *
 * Amenities that have a photograph become large feature tiles — the ones worth
 * looking at. The rest become a typographic list beneath them, which is the
 * honest treatment for "CCTV security" and "wide planned roads": real, worth
 * stating, not worth a hero image.
 *
 * Grouping (Wellness / Sports / Community …) is applied only when the data
 * supports it; a flat array stays flat rather than being force-fitted into
 * invented categories.
 */

/**
 * Keyword → group. Used only to organise amenities the project already lists;
 * it never adds an amenity, and anything unmatched simply stays ungrouped.
 */
const GROUP_RULES = [
  { group: 'Wellness',    match: /gym|yoga|meditation|spa|sauna|pool|wellness|oxygen|acupressure|walking|fitness/i },
  { group: 'Sports',      match: /court|turf|badminton|tennis|basketball|pickleball|cricket|football|skating|outdoor court/i },
  { group: 'Children',    match: /kid|child|play|sand pit|sand-pit/i },
  { group: 'Community',   match: /club|hall|temple|gazebo|baradari|senior|community|multi-purpose/i },
  { group: 'Landscape',   match: /garden|green|park|landscape|plantation|open space|avenue|deck/i },
  { group: 'Security',    match: /security|cctv|gate|boundary|wall|guard/i },
  { group: 'Convenience', match: /road|water|parking|electric|utility|street|drainage|frontage|plots?/i },
];

const groupOf = (name) => GROUP_RULES.find((r) => r.match.test(name))?.group || 'More';

export default function AmenitiesSection({
  amenities = [],
  amenityImages = {},
  projectName,
  eyebrow = 'Inside the project',
  heading = 'The lived experience.',
  lede,
  className = '',
  id,
}) {
  const [viewerAt, setViewerAt] = useState(null);
  const [failed, setFailed] = useState({});

  const featured = useMemo(
    () => amenities
      .filter((a) => amenityImages[a] && !failed[a])
      .map((a) => ({ name: a, src: amenityImages[a], group: groupOf(a) })),
    [amenities, amenityImages, failed],
  );

  const rest = useMemo(
    () => amenities.filter((a) => !amenityImages[a] || failed[a]),
    [amenities, amenityImages, failed],
  );

  /** Group the plain list only when it produces more than one real group. */
  const grouped = useMemo(() => {
    const map = new Map();
    for (const a of rest) {
      const g = groupOf(a);
      if (!map.has(g)) map.set(g, []);
      map.get(g).push(a);
    }
    return map.size > 1 ? [...map.entries()] : null;
  }, [rest]);

  if (!amenities.length) return null;

  return (
    <section className={`amenities ${className}`} id={id}>
      <div className="container">
        <div className="amenities__head">
          <Reveal as="span" className="eyebrow amenities__eyebrow">{eyebrow}</Reveal>
          <Reveal as="h2" className="display amenities__heading" delay={0.05}>{heading}</Reveal>
          {lede && <Reveal as="p" className="amenities__lede" delay={0.1}>{lede}</Reveal>}
          <Reveal as="span" className="amenities__count" delay={0.12}>
            {amenities.length} {amenities.length === 1 ? 'amenity' : 'amenities'}
          </Reveal>
        </div>

        {featured.length > 0 && (
          <div className="amenities__features">
            {featured.map((f, i) => (
              <Reveal key={f.name} className="amenities__feature" delay={Math.min(i, 6) * 0.05}>
                <button
                  type="button"
                  className="amenities__feature-tile"
                  onClick={() => setViewerAt(i)}
                  aria-label={`View ${f.name}`}
                >
                  <img
                    src={f.src}
                    alt={`${projectName ? `${projectName}: ` : ''}${f.name}`}
                    loading={i < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                    onError={() => setFailed((s) => ({ ...s, [f.name]: true }))}
                  />
                  <span className="amenities__feature-veil" aria-hidden />
                  <span className="amenities__feature-body">
                    <span className="amenities__feature-group">{f.group}</span>
                    <span className="amenities__feature-name">{f.name}</span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        )}

        {rest.length > 0 && (
          <div className={`amenities__list ${grouped ? 'amenities__list--grouped' : ''}`}>
            {grouped
              ? grouped.map(([group, items], gi) => (
                  <Reveal key={group} className="amenities__group" delay={Math.min(gi, 5) * 0.05}>
                    <h3 className="amenities__group-title">{group}</h3>
                    <ul>
                      {items.map((a) => (
                        <li key={a}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                            <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                ))
              : (
                <Reveal className="amenities__group">
                  <ul>
                    {rest.map((a) => (
                      <li key={a}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                          <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
          </div>
        )}
      </div>

      {viewerAt !== null && featured.length > 0 && (
        <ImageViewer
          images={featured.map((f) => ({
            src: f.src,
            label: f.name,
            alt: `${projectName ? `${projectName}: ` : ''}${f.name}`,
          }))}
          index={viewerAt}
          onIndexChange={setViewerAt}
          onClose={() => setViewerAt(null)}
          title={projectName ? `${projectName}: amenities` : 'Amenities'}
        />
      )}
    </section>
  );
}
