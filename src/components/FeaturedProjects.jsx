import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import { useEnquiry } from '../enquiry/enquiryContext';
import { featuredProjects, CATEGORY_LABEL, PROJECT_STATUSES } from '../data/projects';
import './FeaturedProjects.css';

/**
 * The three projects the home page leads with (change.md #5).
 *
 * Which three is data, not markup: a project carries `featured: true` in
 * projects.js and appears here (CLAUDE.md §4). Everything shown — name,
 * location, plot sizes, positioning band — is read from the same record the
 * project page uses, so the two can never drift apart.
 */
const STATUS_LABEL = PROJECT_STATUSES.reduce((acc, s) => {
  acc[s.key] = s.label;
  return acc;
}, {});

export default function FeaturedProjects() {
  const projects = featuredProjects();
  const { openEnquiry } = useEnquiry();

  if (!projects.length) return null;

  return (
    <section className="featured" id="featured">
      <div className="container featured__head">
        <Reveal as="span" className="eyebrow featured__eyebrow">Currently highlighted</Reveal>
        <Reveal as="h2" className="display featured__title" delay={0.05}>
          Three to see<br/>first.
        </Reveal>
        <Reveal as="p" className="featured__lede" delay={0.1}>
          Fifteen-plus landmarks is a lot to walk. If you are starting somewhere, start with these —
          an estate-scale flagship, a garden community, and a plotted address with a straight run
          through to Ujjain.
        </Reveal>
      </div>

      <div className="container">
        <div className="featured__grid">
          {projects.map((p, i) => (
            <Reveal key={p.slug} className="featured__cell" delay={i * 0.08}>
              <article className="featured__card">
                <Link to={`/projects/${p.slug}`} className="featured__media">
                  <img
                    src={p.thumbnail || p.hero_image}
                    alt={`${p.name} — ${p.location}`}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="featured__rank" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                  <span className="featured__badges">
                    {p.category && (
                      <span className="featured__badge featured__badge--cat">
                        {CATEGORY_LABEL[p.category]}
                      </span>
                    )}
                    <span className={`featured__badge featured__badge--${p.status}`}>
                      {STATUS_LABEL[p.status]}
                    </span>
                  </span>
                </Link>

                <div className="featured__body">
                  <h3 className="featured__name">
                    <Link to={`/projects/${p.slug}`}>{p.name}</Link>
                  </h3>
                  <span className="featured__location">{p.location}</span>
                  <p className="featured__tagline">{p.tagline}</p>

                  <dl className="featured__facts">
                    {p.plot_sizes && (
                      <div>
                        <dt>Plot sizes</dt>
                        <dd>{p.plot_sizes}</dd>
                      </div>
                    )}
                    {p.total_area && (
                      <div>
                        <dt>Development</dt>
                        <dd>{p.total_area}</dd>
                      </div>
                    )}
                  </dl>

                  <div className="featured__actions">
                    <Link to={`/projects/${p.slug}`} className="featured__link">
                      View project
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
                        <path d="M3 7.5h8M7.5 4l3.5 3.5L7.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                    <button
                      type="button"
                      className="featured__visit"
                      onClick={() => openEnquiry({
                        project: p.name,
                        source: `Home — highlighted: ${p.name}`,
                      })}
                    >
                      Book a site visit
                    </button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
