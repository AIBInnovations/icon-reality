import Reveal from './Reveal';
import './ForBuyers.css';

export default function ForBuyers() {
  return (
    <section className="forbuyers">
      <div className="container forbuyers__grid">
        <div className="forbuyers__copy">
          <Reveal as="h2" className="display forbuyers__heading">
            For families<br/>seeking a refined<br/>sanctuary
          </Reveal>
          <Reveal as="p" className="forbuyers__lede" delay={0.05}>
            Icon Realty is for buyers who care about how a place will feel ten years from now:
            families who want room to grow, investors who value structural appreciation, and
            individuals who recognise that the right address quietly changes everything.
          </Reveal>
        </div>
        <Reveal className="forbuyers__image">
          <img src="/images/for-buyers.jpg" alt="A refined home interior at an Icon Realty development" loading="lazy" decoding="async" />
        </Reveal>
      </div>
    </section>
  );
}
