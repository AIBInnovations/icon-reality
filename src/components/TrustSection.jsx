import Reveal from './Reveal';
import './TrustSection.css';

const points = [
  'Wide, planned roads',
  'Green & open spaces',
  'Secure, gated community',
];

export default function TrustSection() {
  return (
    <section className="trust" id="about">
      <div className="container trust__grid">
        <Reveal className="trust__image-wrap">
          <img src="/images/projects/oscar-palace-1.jpg" alt="Oscar Palace — heritage landmark tower" />
        </Reveal>

        <div className="trust__copy">
          <Reveal as="h2" className="display trust__heading">
            A trusted address<br/>for premium living
          </Reveal>
          <Reveal as="p" className="trust__lede" delay={0.05}>
            Oscar Palace is crafted for those who value space, peace, and a sense of arrival.
            Every plot is designed with the long view in mind — for owners who care about
            quality, growth, and the way a place makes a family feel.
          </Reveal>

          <Reveal as="p" className="trust__architect" delay={0.08}>
            <span className="trust__architect-k">The architect</span>
            Designed by <strong>Ravi Gupta Ji</strong> of Jaipur — the architect behind several
            Oberoi hotels, Suryagarh Palace, and other landmark heritage properties — whose
            vocabulary of arches, courtyards, and symmetry gives Oscar Palace its royal character.
          </Reveal>

          <Reveal className="trust__points" delay={0.1}>
            <ul>
              {points.map((p, i) => (
                <li key={i}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                    <path d="M3 9L7 13L15 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
