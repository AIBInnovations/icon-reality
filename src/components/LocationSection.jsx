import { useMemo } from 'react';
import Reveal from './Reveal';
import './LocationSection.css';

/**
 * Location & connectivity — the map, the address, and what is genuinely around
 * the project.
 *
 * Connectivity strings come from projects.js exactly as the project published
 * them. Where a string already carries a distance or a time ("15 minutes from
 * Indore International Airport", "27 km from …"), that fragment is split out
 * and shown as the metric. Where it does not, no metric is shown — travel times
 * are never invented to fill the column (read.md §18, §71).
 */

/** Pull a leading distance/time out of a connectivity line, if it has one. */
function splitMetric(line) {
  const m = line.match(/^(\d[\d\s.,–-]*\+?\s*(?:km|kms|kilometres?|min|mins|minutes?|minute|hrs?|hours?))\s*(?:from|to)?\s*(.*)$/i);
  if (m && m[2]) return { metric: m[1].trim(), place: m[2].trim() };

  // "Within 4 km" / "1 minute to the expressway" style, metric in the middle
  const m2 = line.match(/^(.*?)\s+(?:within|approx\.?|about)?\s*(\d[\d\s.,–-]*\+?\s*(?:km|kms|min|mins|minutes?))\s*$/i);
  if (m2 && m2[1]) return { metric: m2[2].trim(), place: m2[1].trim() };

  return { metric: null, place: line };
}

/** Loose categorisation, used only to label lines the project already lists. */
const CATEGORY_RULES = [
  { label: 'Airport',    match: /airport/i },
  { label: 'Rail',       match: /railway|station|metro/i },
  { label: 'Roads',      match: /highway|corridor|expressway|road|bypass|frontage/i },
  { label: 'Education',  match: /school|college|university|iit|iim|nmims|symbiosis|institute|campus/i },
  { label: 'Healthcare', match: /hospital|clinic|healthcare|medical/i },
  { label: 'Retail',     match: /mall|market|retail|shopping|citadel/i },
  { label: 'Work',       match: /commercial|corporate|it |tcs|infosys|business|employment|hub|scheme/i },
  { label: 'Hospitality',match: /hotel|marriott|resort/i },
  { label: 'Landmarks',  match: /temple|omkareshwar|landmark/i },
];
const categoryOf = (line) => CATEGORY_RULES.find((r) => r.match.test(line))?.label || 'Nearby';

export default function LocationSection({
  projectName,
  location,
  connectivity = [],
  mapQuery,
  coordinates,
  eyebrow = 'Location',
  heading = 'Where it stands.',
  lede,
  className = '',
  id,
}) {
  const points = useMemo(
    () => connectivity.map((line) => ({ ...splitMetric(line), category: categoryOf(line), raw: line })),
    [connectivity],
  );

  // A text search drops the pin wherever Google's geocoder lands, which for a
  // project on a new highway is often the wrong side of it. When projects.js
  // publishes verified coordinates we address the map by lat/lng instead, and
  // the pin is exact (change.md #9).
  const query = mapQuery || `${projectName || ''} ${location || ''}`.trim();
  const hasCoords = Number.isFinite(coordinates?.lat) && Number.isFinite(coordinates?.lng);
  const pin = hasCoords ? `${coordinates.lat},${coordinates.lng}` : query;
  const embedSrc = hasCoords
    ? `https://www.google.com/maps?q=${pin}&z=${coordinates.zoom || 15}&output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  const openSrc = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pin)}`;

  if (!query && !hasCoords && !points.length) return null;

  return (
    <section className={`location ${className}`} id={id}>
      <div className="container">
        <div className="location__head">
          <Reveal as="span" className="eyebrow location__eyebrow">{eyebrow}</Reveal>
          <Reveal as="h2" className="display location__heading" delay={0.05}>{heading}</Reveal>
          {location && <Reveal as="p" className="location__address" delay={0.08}>{location}</Reveal>}
          {lede && <Reveal as="p" className="location__lede" delay={0.1}>{lede}</Reveal>}
        </div>

        <div className="location__grid">
          {(query || hasCoords) && (
            <Reveal className="location__map">
              <div className="location__map-frame">
                <iframe
                  title={`${projectName || 'Project'} location map`}
                  src={embedSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <a
                href={openSrc}
                target="_blank"
                rel="noreferrer"
                className="cta cta--ghost location__map-cta"
              >
                Open in Google Maps
              </a>
            </Reveal>
          )}

          {points.length > 0 && (
            <div className="location__points">
              <ul>
                {points.map((p, i) => (
                  <Reveal as="li" key={p.raw} className="location__point" delay={Math.min(i, 8) * 0.04} y={20}>
                    <span className="location__point-cat">{p.category}</span>
                    <span className="location__point-place">{p.place}</span>
                    {p.metric && <span className="location__point-metric">{p.metric}</span>}
                  </Reveal>
                ))}
              </ul>
              <p className="location__note">
                Distances and travel times are as published for this project and are indicative.
                Actual travel time varies with route and traffic.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
