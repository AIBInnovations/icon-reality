import Reveal from './Reveal';
import { WHO_WE_ARE } from '../data/company';
import './PillarsCards.css';

// "Who we are": the company's belief and three principles (company.js), set in
// the three-card layout. The card colours run in this order.
const VARIANTS = ['dark', 'sand', 'peach'];

export default function PillarsCards() {
  const { eyebrow, title, lede, principles } = WHO_WE_ARE;

  return (
    <section className="pillars" id="pillars">
      <div className="container">
        <div className="pillars__head">
          <Reveal as="span" className="eyebrow pillars__eyebrow">{eyebrow}</Reveal>
          <Reveal as="h2" className="display pillars__title" delay={0.05}>
            {title[0]}<br/>{title[1]}
          </Reveal>
          <Reveal as="p" className="pillars__lede" delay={0.1}>{lede}</Reveal>
        </div>

        <div className="pillars__grid">
          {principles.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <article className={`pillar pillar--${VARIANTS[i % VARIANTS.length]}`}>
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
