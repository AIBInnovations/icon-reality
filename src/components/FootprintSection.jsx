import { Link } from 'react-router-dom';
import SectionHeading from './SectionHeading';
import Reveal from './Reveal';
import Picture from './Picture';
import { projectsByMarket, projectsList } from '../data/projects';
import './FootprintSection.css';

// Where the portfolio actually stands: one photograph per micro-market, read
// from projects.js, so the map can never name a place without a project in it.
// The busiest market takes the big tile and markets with two projects run
// wide; with today's portfolio that fills the grid exactly.
const MARKETS = projectsByMarket();
const sizeOf = (count) => (count >= 3 ? 'feature' : count === 2 ? 'wide' : 'single');
const coverOf = (p) => p.thumbnail || p.hero_image;

export default function FootprintSection() {
  return (
    <section className="footprint" id="footprint">
      <div className="container">
        <SectionHeading
          eyebrow="Our footprint"
          title="Across Indore's growth corridors."
          lede={`${projectsList.length} projects across ${MARKETS.length} micro-markets, every one of them in and around Indore.`}
        />

        <ul className="footprint__grid">
          {MARKETS.map(({ market, projects }, i) => {
            const single = projects.length === 1;
            return (
              <Reveal
                as="li"
                key={market}
                className={`footprint__tile footprint__tile--${sizeOf(projects.length)}`}
                delay={Math.min(i, 6) * 0.05}
              >
                <Picture
                  className="footprint__img"
                  src={coverOf(projects[0])}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <div className="footprint__meta">
                  <span className="footprint__count">
                    {projects.length} {single ? 'project' : 'projects'}
                  </span>
                  <h3 className="footprint__market">{market}</h3>
                  {single ? (
                    <span className="footprint__name">{projects[0].name}</span>
                  ) : (
                    <ul className="footprint__projects">
                      {projects.map((p) => (
                        <li key={p.slug}>
                          <Link to={`/projects/${p.slug}`} className="footprint__link">{p.name}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* One project: the whole tile is its link. */}
                {single && (
                  <Link
                    to={`/projects/${projects[0].slug}`}
                    className="footprint__cover-link"
                    aria-label={`${projects[0].name}, ${market}`}
                  />
                )}
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
