import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import { useEnquiry } from '../enquiry/enquiryContext';
import { whatsappUrl } from '../services/whatsapp';
import { PRIMARY_PHONE, telHref } from '../data/contact';
import './CtaBand.css';

/**
 * The contextual call-to-action band.
 *
 * Replaces the repeated generic "Contact Us" (read.md §49): every band names
 * the action the visitor is actually taking — Schedule an Investment
 * Consultation, Speak With NRI Assistance, Book a Site Visit — and opens the
 * enquiry modal pre-configured with the matching lead intent, so the CRM shows
 * which journey produced the lead.
 *
 * `image` puts a project photograph behind the charcoal shell. It is decorative,
 * so it carries an empty alt and sits behind a scrim that keeps the copy at a
 * readable contrast.
 */
export default function CtaBand({
  eyebrow,
  heading,
  body,
  /** Primary button label + the enquiry config it opens. */
  primaryLabel = 'Book a Site Visit',
  enquiry,
  /** Or point the primary button at a route instead of the modal. */
  to,
  /** Secondary action: 'call' | 'whatsapp' | 'none' */
  secondary = 'call',
  whatsappMessage,
  image,
  className = '',
}) {
  const { openEnquiry } = useEnquiry();

  const primary = to ? (
    <Link to={to} className="cta cta-band__primary">{primaryLabel}</Link>
  ) : (
    <button
      type="button"
      className="cta cta-band__primary"
      onClick={() => openEnquiry(enquiry || { source: heading })}
    >
      {primaryLabel}
    </button>
  );

  return (
    <section className={`cta-band ${className}`}>
      <div className="cta-band__shell">
        {image && (
          <div className="cta-band__bg" aria-hidden>
            <img src={image} alt="" loading="lazy" decoding="async" />
          </div>
        )}

        <div className="container cta-band__inner">
          {eyebrow && <Reveal as="span" className="eyebrow cta-band__eyebrow">{eyebrow}</Reveal>}
          <Reveal as="h2" className="display cta-band__title" delay={0.05}>{heading}</Reveal>
          {body && <Reveal as="p" className="cta-band__lede" delay={0.1}>{body}</Reveal>}

          <Reveal className="cta-band__actions" delay={0.15}>
            {primary}

            {secondary === 'call' && (
              <a href={telHref()} className="cta cta--ghost cta-band__secondary">
                {PRIMARY_PHONE.label}
              </a>
            )}
            {secondary === 'whatsapp' && (
              <a
                href={whatsappUrl(whatsappMessage)}
                target="_blank"
                rel="noreferrer"
                className="cta cta--ghost cta-band__secondary"
              >
                WhatsApp us
              </a>
            )}
          </Reveal>
        </div>

        <div className="cta-band__bars" aria-hidden />
      </div>
    </section>
  );
}
