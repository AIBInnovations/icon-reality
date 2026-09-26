import Reveal from './Reveal';
import { useEnquiry } from '../enquiry/enquiryContext';
import { OFFICE_HOURS } from '../data/contact';
import './FinalCTA.css';

export default function FinalCTA() {
  const { openEnquiry } = useEnquiry();
  return (
    <section className="final-cta">
      <div className="final-cta__shell">
        <div className="container final-cta__inner">
          <Reveal as="span" className="eyebrow final-cta__eyebrow">
            Plots are limited
          </Reveal>

          <Reveal as="h2" className="display final-cta__title" delay={0.05}>
            Connect to discover<br/>true luxury.
          </Reveal>

          <Reveal as="p" className="final-cta__lede" delay={0.1}>
            Our advisors are available {OFFICE_HOURS}. Free consultation. No&nbsp;obligation.
            Site visits are by appointment.
          </Reveal>

          <Reveal className="final-cta__actions" delay={0.15}>
            <button type="button" className="cta final-cta__primary" onClick={() => openEnquiry({ source: 'Final CTA', project: 'Oscar Palace' })}>
              Book a Site Visit
            </button>
            <a href="tel:+919425942510" className="cta cta--ghost final-cta__secondary">
              +91 9425 9425 10 / 11
            </a>
          </Reveal>

          <Reveal className="final-cta__foot" delay={0.2}>
            <span className="final-cta__foot-k">Or write to us</span>
            <a className="final-cta__foot-v" href="mailto:iconrealty02@gmail.com">iconrealty02@gmail.com</a>
          </Reveal>
        </div>

        <div className="final-cta__bars" aria-hidden />
      </div>
    </section>
  );
}
