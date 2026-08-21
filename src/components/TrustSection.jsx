import Reveal from './Reveal';
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
        {/* PENDING ARTWORK (change.md #6): the supplied trusted.png has
            "1500+ HAPPY FAMILIES" baked into the composite. The client has
            corrected the figure to 4,000+, so this file needs re-exporting from
            the original design — the number cannot be fixed in code.
            DELIBERATE, CONFIRMED WITH THE CLIENT: the image says 4,000+ while
            the site copy (company.js TRUST_STATS, the footer, the About and SEO
            descriptions) says 4,500+. Do not "reconcile" the two — the written
            figure stays at 4,500+.
            The alt text therefore does NOT repeat the figure, so it cannot
            contradict whichever version of the picture is in place. */}
        <Reveal className="trust__image-wrap">
          <img src="/images/trusted.png" alt="Mr. Nilesh Porwal, Director of Icon Realty — a summary of projects delivered, families welcomed home, and two decades of trust" loading="lazy" decoding="async" />
        </Reveal>

        <div className="trust__copy">
          <Reveal as="h2" className="display trust__heading">
            Twenty years of<br/>trusted addresses
          </Reveal>
          <Reveal as="p" className="trust__lede" delay={0.05}>
            Since 2004, Icon Realty has designed and marketed residential plotted developments
            across Indore — fifteen-plus landmarks and more than four thousand families. Under
            the direction of Mr. Siddharth Porwal and Mr. Nilesh Porwal, the company plans for
            the decade after handover, not the quarter after launch.
          </Reveal>

          <Reveal as="p" className="trust__architect" delay={0.08}>
            <span className="trust__architect-k">What we do</span>
            We <strong>design and market residential plotted communities</strong>. On some projects
            we are the developer; on others — Oscar Palace among them — we are the design, marketing
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
