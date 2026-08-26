import Reveal from './Reveal';
import { BANNER_STATS } from '../data/company';
import './TrustSection.css';

const points = [
  'Wide, planned roads',
  'Green & open spaces',
  'Secure, gated communities',
  'Plots from 600 to 20,000 sq ft',
];

export default function TrustSection() {
  return (
    <section className="trust" id="about">
      <div className="container trust__grid">
        {/* The supplied banner artwork carried "15+ / 1500+ / 2 DECADES" baked
            into a band across its foot. The client revised 1500+ to 4,000+, and
            a number burned into a composite cannot be corrected in code, so the
            band was cropped off the JPEG and rebuilt below as HTML from
            company.js BANNER_STATS. Correcting a figure is now a data edit.
            The alt text does not repeat any figure, so it can never contradict
            whichever artwork is in place. */}
        <div className="trust__banner">
          <Reveal className="trust__image-wrap">
            <img
              src="/images/directors-banner.jpg"
              alt="Mr. Siddharth Porwal and Mr. Nilesh Porwal, Directors of Icon Realty"
              width="1122"
              height="1107"
              loading="lazy"
              decoding="async"
            />
          </Reveal>

          <Reveal as="dl" className="trust__stats" delay={0.06}>
            {BANNER_STATS.map((s) => (
              <div key={s.label} className="trust__stat">
                <dt className="trust__stat-v">{s.value}</dt>
                <dd className="trust__stat-k">{s.label}</dd>
              </div>
            ))}
          </Reveal>
        </div>

        <div className="trust__copy">
          <Reveal as="h2" className="display trust__heading">
            Twenty years of<br/>trusted addresses
          </Reveal>
          <Reveal as="p" className="trust__lede" delay={0.05}>
            Since 2004, Icon Realty has designed and marketed residential plotted developments
            across Indore: fifteen-plus landmarks and more than four thousand families. Under
            the direction of Mr. Siddharth Porwal and Mr. Nilesh Porwal, the company plans for
            the decade after handover, not the quarter after launch.
          </Reveal>

          <Reveal as="p" className="trust__architect" delay={0.08}>
            <span className="trust__architect-k">What we do</span>
            We <strong>design and market residential plotted communities</strong>. On some projects
            we are the developer; on others, Oscar Palace among them, we are the design, marketing
            and sales partner. Which role we hold on which project is stated on the project page
            itself, never blurred.
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
