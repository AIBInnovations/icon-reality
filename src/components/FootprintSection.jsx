import SectionHeading from './SectionHeading';
import InfoGrid from './InfoGrid';
import { projectsByMarket } from '../data/projects';
import './FootprintSection.css';

// Where the portfolio actually stands: one card per micro-market, read from
// projects.js, so the list can never name a corridor without a project on it.
const MARKETS = projectsByMarket().map(({ market, projects }) => ({
  k: market,
  v: projects.map((p) => p.name).join(', '),
  horizon: `${projects.length} ${projects.length === 1 ? 'project' : 'projects'}`,
}));

export default function FootprintSection() {
  return (
    <section className="footprint" id="footprint">
      <div className="container">
        <SectionHeading eyebrow="Our footprint" title="Across Indore's growth corridors." />
        <InfoGrid items={MARKETS} variant="text" columns={4} />
      </div>
    </section>
  );
}
