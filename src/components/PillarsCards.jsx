import Reveal from './Reveal';
import './PillarsCards.css';

const pillars = [
  {
    name: 'Status',
    variant: 'dark',
    body: 'Not every address reflects your standard. Icon Realty designs for those who recognise quality without needing it announced — a place that carries quiet weight in every detail, from the gate to the garden.',
  },
  {
    name: 'Investment',
    variant: 'sand',
    body: 'Land is limited, opportunities are not. A premium growth corridor on the Indore–Nagpur Highway, structured planning, and the long view in mind — buy early, hold long-term, and let the location do the rest. Bank loans are available on every plot.',
  },
  {
    name: 'Lifestyle',
    variant: 'peach',
    body: 'Upgrade from living to breathing. Open spaces, green surroundings, and a peaceful environment crafted for everyday life — where mornings feel slower and weekends feel longer.',
  },
];

export default function PillarsCards() {
  return (
    <section className="pillars" id="pillars">
      <div className="container">
        <Reveal as="h2" className="display pillars__title">
          Three pillars.<br/>One standard.
        </Reveal>

        <div className="pillars__grid">
          {pillars.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <article className={`pillar pillar--${p.variant}`}>
                <h3 className="pillar__name">{p.name}</h3>
                <p className="pillar__body">{p.body}</p>
                <span className="pillar__deco" aria-hidden />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
