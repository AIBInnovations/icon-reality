import { useState } from 'react';
import Reveal from './Reveal';
import './FAQSection.css';

/**
 * Accordion FAQ. Pair it with faqSchema(items) on the same page so the markup
 * and the FAQPage JSON-LD always describe the same questions.
 *
 * Built on <button aria-expanded> + a region, not a clickable div, so it works
 * from the keyboard and announces its state (read.md §62). Answers stay in the
 * DOM (hidden with `hidden`) so browser find-in-page can still reach them.
 */
export default function FAQSection({
  items = [],
  eyebrow = 'Questions',
  heading = 'Frequently asked.',
  lede,
  className = '',
  id,
}) {
  const [open, setOpen] = useState(0);
  if (!items.length) return null;

  return (
    <section className={`faq ${className}`} id={id}>
      <div className="container faq__grid">
        <div className="faq__head">
          {eyebrow && <Reveal as="span" className="eyebrow faq__eyebrow">{eyebrow}</Reveal>}
          <Reveal as="h2" className="display faq__heading" delay={0.05}>{heading}</Reveal>
          {lede && <Reveal as="p" className="faq__lede" delay={0.1}>{lede}</Reveal>}
        </div>

        <div className="faq__list">
          {items.map((item, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            const btnId = `faq-btn-${i}`;
            return (
              <Reveal key={item.q} className={`faq__item ${isOpen ? 'is-open' : ''}`} delay={Math.min(i, 6) * 0.04} y={20}>
                <h3 className="faq__q">
                  <button
                    type="button"
                    id={btnId}
                    className="faq__trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{item.q}</span>
                    <span className="faq__icon" aria-hidden>
                      <svg viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <path className="faq__icon-bar" d="M8 3v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className="faq__a"
                  hidden={!isOpen}
                >
                  <p>{item.a}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
