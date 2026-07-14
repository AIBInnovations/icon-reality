import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import { projectsList } from '../data/projects';
import './CompletedProjects.css';

const PORTFOLIO_ORDER = [
  'oscar-palace',
  'oscar-fort',
  'oscar-billionaire',
  'saatvik-vihar',
  'siddhayatan',
  'eden-garden',
  'labham-city',
  'iit-greens',
  'glamour-highway-city',
  'glamour-hill-city',
  'ruchi-enclave',
  'ruchi-lifescapes',
  'singapore-corridor',
  'singapore-lifestyle-2',
  'singapore-business-park',
  'dream-victoria',
];

const landmarks = PORTFOLIO_ORDER
  .map((slug) => projectsList.find((project) => project.slug === slug))
  .filter(Boolean);

export default function CompletedProjects() {
  return (
    <section className="completed" id="completed">
      <img className="completed__art" src="/images/oscar/landmarks-art.png" alt="" aria-hidden="true" />
      <div className="container completed__head">
        <Reveal as="span" className="eyebrow completed__eyebrow">The Icon Realty portfolio</Reveal>
        <Reveal as="h2" className="display completed__title" delay={0.05}>
          Sixteen landmarks.<br/>Thousands of homes.
        </Reveal>
        <Reveal as="p" className="completed__lede" delay={0.1}>
          Icon Realty has shaped landmarks right across Indore — from Oscar Palace
          to IIT Greens — places where families now live, gardens have grown, and roads quietly fill
          with the rhythm of everyday life.
        </Reveal>
      </div>

      <div className="container">
        <div className="completed__grid">
          {landmarks.map((p) => (
            <div key={p.slug}>
              <Link to={`/projects/${p.slug}`} className="completed__card">
                <div className="completed__media">
                  <img src={p.thumbnail || p.hero_image} alt={`${p.name} — ${p.location}`} loading="lazy" />
                  <span className="completed__badge">Icon Realty</span>
                </div>
                <div className="completed__body">
                  <h3 className="completed__name">{p.name}</h3>
                  <span className="completed__location">{p.location}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
