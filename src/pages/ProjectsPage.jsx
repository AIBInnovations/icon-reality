import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import MediaFigure from '../components/MediaFigure';
import ProjectsCarousel from '../components/ProjectsCarousel';
import FinalCTA from '../components/FinalCTA';
import Breadcrumbs from '../components/Breadcrumbs';
import Seo from '../seo/Seo';
import { breadcrumbSchema, projectListSchema } from '../seo/schema';
import {
  projectsList, availableStatuses, availableCategories,
  PROJECT_STATUSES, CATEGORY_LABEL,
} from '../data/projects';
import './ProjectsPage.css';

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: '/projects' },
];

const STATUS_LABEL = PROJECT_STATUSES.reduce((acc, s) => {
  acc[s.key] = s.label;
  return acc;
}, {});

export default function ProjectsPage() {
  // The filters live in the URL, not in component state: a filtered view is
  // then linkable and survives a back navigation, and the header's mega-menu
  // can point straight at /projects?status=completed (read.md §66).
  const [params, setParams] = useSearchParams();
  const active = params.get('status') || 'all';
  const activeCat = params.get('category') || 'all';

  const statuses = useMemo(() => availableStatuses(), []);
  const categories = useMemo(() => availableCategories(), []);

  // Status and band compose — "Ongoing" + "High end" is a real question a buyer
  // asks, and answering it needs both filters applied at once.
  const visible = useMemo(
    () => projectsList
      .filter((p) => active === 'all' || p.status === active)
      .filter((p) => activeCat === 'all' || p.category === activeCat),
    [active, activeCat],
  );

  // Counts shown on a chip are counts WITHIN the other filter, so a chip never
  // advertises results the current view cannot show.
  const inStatus = useMemo(
    () => projectsList.filter((p) => active === 'all' || p.status === active),
    [active],
  );
  const inCat = useMemo(
    () => projectsList.filter((p) => activeCat === 'all' || p.category === activeCat),
    [activeCat],
  );

  // replace, not push — filtering shouldn't fill the back button with
  // intermediate states between two real pages
  const apply = (next) => {
    const merged = { status: active, category: activeCat, ...next };
    const out = {};
    if (merged.status !== 'all') out.status = merged.status;
    if (merged.category !== 'all') out.category = merged.category;
    setParams(out, { replace: true });
  };
  const setStatus = (key) => apply({ status: key });
  const setCategory = (key) => apply({ category: key });

  const currentLabel = [
    activeCat === 'all' ? null : CATEGORY_LABEL[activeCat],
    active === 'all' ? 'All projects' : `${STATUS_LABEL[active] || ''} projects`,
  ].filter(Boolean).join(' · ');

  return (
    <>
      <Seo
        title="Projects in Indore: plotted developments by Icon Realty"
        description="Explore Icon Realty's plotted developments in Indore, Oscar Palace, Oscar Fort, IIT Greens, Labham City and more. Currently building and already lived in."
        path="/projects"
        jsonLd={[breadcrumbSchema(TRAIL), projectListSchema(projectsList)]}
      />

      <PageHero
        eyebrow="The portfolio"
        title={['Currently building.', 'Already lived in.']}
        lede="A portfolio shaped by patience, landmarks that age into the city, not against it. Browse the projects taking shape now and the ones already lived in."
      />

      <Breadcrumbs trail={TRAIL} />

      <ProjectsCarousel />

      {/* ---------- FILTERED LIST ---------- */}
      <section className="projects-list" id="projects">
        <div className="container projects-list__head">
          <Reveal as="span" className="eyebrow projects-list__eyebrow">{currentLabel}</Reveal>
          <Reveal as="h2" className="display projects-list__title" delay={0.05}>
            {visible.length} {visible.length === 1 ? 'address' : 'addresses'}, one city.
          </Reveal>
        </div>

        <div className="container">
          <Reveal className="projects-filter" delay={0.08}>
            <div className="projects-filter__chips" role="tablist" aria-label="Filter projects by status">
              <span className="projects-filter__legend">Status</span>
              <button
                type="button"
                role="tab"
                aria-selected={active === 'all'}
                className={`projects-filter__chip ${active === 'all' ? 'is-active' : ''}`}
                onClick={() => setStatus('all')}
              >
                All
                <span className="projects-filter__count">{inCat.length}</span>
              </button>

              {statuses.map((s) => (
                <button
                  type="button"
                  key={s.key}
                  role="tab"
                  aria-selected={active === s.key}
                  className={`projects-filter__chip ${active === s.key ? 'is-active' : ''}`}
                  onClick={() => setStatus(s.key)}
                >
                  {s.label}
                  <span className="projects-filter__count">
                    {inCat.filter((p) => p.status === s.key).length}
                  </span>
                </button>
              ))}
            </div>

            {/* Second axis: the positioning band (change.md #4). */}
            <div
              className="projects-filter__chips projects-filter__chips--category"
              role="tablist"
              aria-label="Filter projects by category"
            >
              <span className="projects-filter__legend">Category</span>
              <button
                type="button"
                role="tab"
                aria-selected={activeCat === 'all'}
                className={`projects-filter__chip ${activeCat === 'all' ? 'is-active' : ''}`}
                onClick={() => setCategory('all')}
              >
                All
                <span className="projects-filter__count">{inStatus.length}</span>
              </button>
              {categories.map((c) => (
                <button
                  type="button"
                  key={c.key}
                  role="tab"
                  aria-selected={activeCat === c.key}
                  title={c.blurb}
                  className={`projects-filter__chip ${activeCat === c.key ? 'is-active' : ''}`}
                  onClick={() => setCategory(c.key)}
                >
                  {c.label}
                  <span className="projects-filter__count">
                    {inStatus.filter((p) => p.category === c.key).length}
                  </span>
                </button>
              ))}
            </div>
          </Reveal>

          {visible.length > 0 ? (
            <div className="projects-list__grid">
              {visible.map((p, i) => (
                <Reveal key={p.slug} delay={Math.min(i, 8) * 0.04}>
                  <Link to={`/projects/${p.slug}`} className="projects-list__card">
                    <div className="projects-list__media">
                      <MediaFigure
                        src={p.thumbnail || p.hero_image}
                        alt={`${p.name}, ${p.location}`}
                        ratio="4 / 5"
                      />
                      <span className={`projects-list__badge projects-list__badge--${p.status}`}>
                        {STATUS_LABEL[p.status] || p.status}
                      </span>
                      {p.category && (
                        <span className="projects-list__cat">{CATEGORY_LABEL[p.category]}</span>
                      )}
                    </div>
                    <div className="projects-list__body">
                      <h3 className="projects-list__name">{p.name}</h3>
                      <div className="projects-list__meta">
                        <span>{p.location}</span>
                        {p.total_area && (
                          <>
                            <span className="projects-list__dot">·</span>
                            <span>{p.total_area}</span>
                          </>
                        )}
                      </div>
                      {p.plot_sizes && <p className="projects-list__plots">{p.plot_sizes}</p>}
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            /* Cannot happen with today's data — availableStatuses() only offers
               tabs that have projects — but a filter must never dead-end. */
            <p className="projects-list__empty">
              No projects match that combination right now.{' '}
              <button type="button" onClick={() => setParams({}, { replace: true })}>
                See all projects
              </button>
            </p>
          )}
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
