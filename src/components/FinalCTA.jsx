import Reveal from './Reveal';
import './FinalCTA.css';

export default function FinalCTA() {
  return (
    <section className="final-cta">
      <div className="final-cta__shell">
        <div className="container final-cta__inner">
          <Reveal as="span" className="eyebrow final-cta__eyebrow">
            Plots are limited
          </Reveal>

          <Reveal as="h2" className="display final-cta__title" delay={0.05}>
            The right address.<br/>The right time.
          </Reveal>

          <Reveal as="p" className="final-cta__lede" delay={0.1}>
            Come walk the land before it walks away. Site visits are by appointment —
            our team will take you through the plots, the planning, and the long view.
          </Reveal>

          <Reveal className="final-cta__actions" delay={0.15}>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=iconrealty02@gmail.com&su=Book%20a%20Visit%20%E2%80%94%20Oscar%20Palace" target="_blank" rel="noreferrer" className="cta final-cta__primary">
              Book a Site Visit
            </a>
            <a href="tel:+919425942510" className="cta cta--ghost final-cta__secondary">
              +91 9425 9425 10 / 11
            </a>
          </Reveal>

          <Reveal className="final-cta__foot" delay={0.2}>
            <span className="final-cta__foot-k">Or write to us</span>
            <a className="final-cta__foot-v" href="mailto:iconrealty2@icloud.com">iconrealty2@icloud.com</a>
          </Reveal>
        </div>

        <div className="final-cta__bars" aria-hidden />
      </div>
    </section>
  );
}
