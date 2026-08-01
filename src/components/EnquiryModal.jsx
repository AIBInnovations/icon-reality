import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import EnquiryForm from './EnquiryForm';

/**
 * The one enquiry-form modal, shared by the Header and the QuickDock so both
 * open the exact same form and card. Rendered through a portal to document.body
 * so it always covers the viewport — mounting it inside an ancestor that has a
 * backdrop-filter/transform (e.g. the header) would otherwise trap a
 * position:fixed child inside that ancestor's box and make it unclickable.
 *
 * Any prop not listed here (idPrefix, eyebrow, heading, source, project…) is
 * forwarded straight to EnquiryForm.
 */
export default function EnquiryModal({ open, onClose, headingId = 'enquiry-modal-title', ...formProps }) {
  const cardRef = useRef(null);

  // Esc closes; freeze the page behind the modal (Lenis drives scrolling, so
  // stop it too) and move focus into the card.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Drops the fixed header — the scrim is translucent, so the logo and
    // hamburger otherwise read straight through it (see Header.css).
    document.body.classList.add('has-modal');
    window.lenis?.stop();
    cardRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove('has-modal');
      window.lenis?.start();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="qd-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="qd-modal__card" ref={cardRef} tabIndex={-1} data-lenis-prevent>
        <button
          type="button"
          className="qd-modal__close"
          onClick={onClose}
          aria-label="Close enquiry form"
        >
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <EnquiryForm headingId={headingId} {...formProps} />
      </div>
    </div>,
    document.body,
  );
}
