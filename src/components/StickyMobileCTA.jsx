import { useEffect, useState } from 'react';
import { useEnquiry } from '../enquiry/enquiryContext';
import { whatsappUrl, waMessage } from '../services/whatsapp';
import { telHref } from '../data/contact';
import { LEAD_INTENTS } from '../services/leads';
import './StickyMobileCTA.css';

/**
 * Bottom-fixed conversion bar on high-intent pages (project detail, NRI,
 * investor, channel partners). Mobile only — desktop already has the header CTA
 * and the QuickDock.
 *
 * Call and WhatsApp are plain <a href="tel:"> / <a href="https://wa.me/…">
 * links, never JS click handlers (read.md §46, §48): the OS handles them,
 * long-press works, and the delegated tracker in Analytics.jsx counts them
 * automatically.
 *
 * It appears only after the hero has scrolled past, so it never covers the
 * hero's own call to action on first paint.
 */
export default function StickyMobileCTA({
  project,
  intent = LEAD_INTENTS.SITE_VISIT,
  enquiryLabel = 'Enquire',
  heading,
  message,
}) {
  const [visible, setVisible] = useState(false);
  const { openEnquiry } = useEnquiry();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // The QuickDock's floating button sits bottom-right at the same height as
  // this bar. Flag the body so the dock lifts above it on the pages that mount
  // a sticky CTA, instead of the two overlapping.
  useEffect(() => {
    document.body.classList.add('has-sticky-cta');
    return () => document.body.classList.remove('has-sticky-cta');
  }, []);

  const wa = message || (project ? waMessage.project(project) : waMessage.general());

  return (
    <div className={`sticky-cta ${visible ? 'is-visible' : ''}`} aria-hidden={!visible}>
      <a
        href={telHref()}
        className="sticky-cta__action"
        tabIndex={visible ? 0 : -1}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.8a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.35 1.84.59 2.8.72A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Call</span>
      </a>

      <a
        href={whatsappUrl(wa)}
        target="_blank"
        rel="noreferrer"
        className="sticky-cta__action sticky-cta__action--wa"
        tabIndex={visible ? 0 : -1}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M3.5 20.5l1.3-4.3A8.2 8.2 0 1120.5 12a8.2 8.2 0 01-12.3 7.1l-4.7 1.4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
        </svg>
        <span>WhatsApp</span>
      </a>

      <button
        type="button"
        className="sticky-cta__action sticky-cta__action--primary"
        tabIndex={visible ? 0 : -1}
        onClick={() => openEnquiry({
          intent,
          project,
          source: `Sticky CTA${project ? `: ${project}` : ''}`,
          eyebrow: 'Quick enquiry',
          heading: heading || (project ? `Enquire about ${project}.` : 'Send an enquiry.'),
          // Name + phone only: this is the highest-intent, lowest-patience
          // moment on the page (read.md §61).
          fields: ['name', 'phone'],
          submitLabel: 'Send enquiry',
        })}
      >
        <span>{enquiryLabel}</span>
      </button>
    </div>
  );
}
