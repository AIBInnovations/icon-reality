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

/**
 * The hero copy per status filter.
 *
 * /projects, ?status=trending and ?status=completed are the same route with a
 * different query, and the header links to all three separately — so a single
 * hardcoded headline made the Ongoing and Completed pages read as identical
 * pages. Each filter now states which half of the portfolio you are looking at,
 * in the page title and the SEO title alike.
 */
const HERO = {
  all: {
    eyebrow: 'The portfolio',
    title: ['Currently building.', 'Already lived in.'],
    lede: 'A portfolio shaped by patience, landmarks that age into the city, not against it. Browse the projects taking shape now and the ones already lived in.',
    seoTitle: 'Projects in Indore: plotted developments by Icon Realty',
    seoDesc: "Explore Icon Realty's plotted developments in Indore, Oscar Palace, Oscar Fort, IIT Greens, Labham City and more. Currently building and already lived in.",
  },
  trending: {
    eyebrow: 'Ongoing projects',
    title: ['Currently', 'building.'],
    lede: 'The addresses taking shape right now. Plots are open in each of these, and every one of them can be walked before you decide.',
    seoTitle: 'Ongoing projects in Indore: plots available now',
    seoDesc: "Icon Realty's ongoing plotted developments in Indore, including Oscar Palace, Oscar Fort, IIT Greens and Labham City. Plots currently open for booking.",
  },
  upcoming: {
    eyebrow: 'Upcoming projects',
    title: ['Not open', 'yet.'],
    lede: 'Planned, drawn and not yet released. Register your interest and you will hear from us before these open publicly.',
    seoTitle: 'Upcoming projects in Indore by Icon Realty',
    seoDesc: 'Plotted developments Icon Realty has planned but not yet released in Indore. Register early interest ahead of public launch.',
  },
  completed: {
    eyebrow: 'Completed projects',
    title: ['Already', 'lived in.'],
    lede: 'Delivered, occupied and a decade into their lives. Go and see what an Icon Realty address looks like long after handover, before you buy into the next one.',
    seoTitle: 'Completed projects in Indore: delivered by Icon Realty',
    seoDesc: 'Icon Realty communities already delivered and lived in across Indore, including Victoria Park, Singapore Corridor, Glamour Hill City and Ruchi Enclave.',
  },
};

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

  const hero = HERO[active] || HERO.all;

  const currentLabel = [
    activeCat === 'all' ? null : CATEGORY_LABEL[activeCat],
    active === 'all' ? 'All projects' : `${STATUS_LABEL[active] || ''} projects`,
  ].filter(Boolean).join(' · ');

  return (
    <>
      <Seo
        title={hero.seoTitle}
        description={hero.seoDesc}
        path="/projects"
        jsonLd={[breadcrumbSchema(TRAIL), projectListSchema(projectsList)]}
      />

      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        lede={hero.lede}
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
