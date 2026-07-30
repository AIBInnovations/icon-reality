import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEnquiry } from '../enquiry/enquiryContext';
import './QuickDock.css';

const WHATSAPP = 'https://wa.me/919425942510?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20Icon%20Realty.';
const MAPS = 'https://maps.google.com/?q=Icon+Realty+Indore+Madhya+Pradesh';

const icon = (paths) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden>
    {paths}
  </svg>
);

/* Essentials. An item without `href`/`to` has nowhere to redirect, so it opens
   the enquiry form modal instead (same form as /contact). */
const ITEMS = [
  {
    key: 'visit',
    title: 'Book a Site Visit',
    sub: 'Enquire in 30 seconds',
    icon: icon(
      <>
        <path d="M8 3v4M16 3v4M3.5 9.5h17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <rect x="3.5" y="5" width="17" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M8.5 14.5l2.2 2.2 4.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </>
    ),
  },
  {
    key: 'brochure',
    title: 'Brochure',
    sub: 'Oscar Palace PDF',
    href: '/downloads/oscar-palace-brochure.pdf',
    download: true,
    icon: icon(
      <>
        <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M12 11v5m0 0l-2-2m2 2l2-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </>
    ),
  },
  {
    key: 'projects',
    title: 'Our Projects',
    sub: '15+ landmark addresses',
    to: '/projects',
    icon: icon(
      <>
        <path d="M3 21h18M5 21V7l6-4v18M19 21V11l-8-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 9.5h.01M8 13h.01M8 16.5h.01M14.5 13h.01M14.5 16.5h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </>
    ),
  },
  {
    key: 'whatsapp',
    title: 'WhatsApp',
    sub: 'Chat with the team',
    href: WHATSAPP,
    external: true,
    icon: icon(
      <>
        <path d="M3.5 20.5l1.3-4.3A8.2 8.2 0 1120.5 12a8.2 8.2 0 01-12.3 7.1l-4.7 1.4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M9 8.6c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.5l.6 1.4c.1.3 0 .5-.1.6l-.4.5c-.1.2-.2.3 0 .6a6 6 0 002.5 2.2c.3.2.5.1.6 0l.5-.6c.2-.2.4-.2.6-.1l1.4.7c.2.1.4.2.4.4v.5c0 .6-.5 1.2-1.1 1.3-.5.1-1.2.2-3.5-.9a8 8 0 01-3.4-3.6c-.6-1.3-.5-2.3-.3-2.7z" fill="currentColor"/>
      </>
    ),
  },
  {
    key: 'call',
    title: 'Call Us',
    sub: '+91 9425 9425 10',
    href: 'tel:+919425942510',
    icon: icon(
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.8a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.35 1.84.59 2.8.72A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    ),
  },
  {
    key: 'email',
    title: 'Email Us',
    sub: 'iconrealty02@gmail.com',
    href: 'mailto:iconrealty02@gmail.com?subject=Enquiry%20from%20website',
    icon: icon(
      <>
        <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      </>
    ),
  },
  {
    key: 'locate',
    title: 'Visit Office',
    sub: 'Indore, Madhya Pradesh',
    href: MAPS,
    external: true,
    icon: icon(
      <>
        <path d="M12 22s7-7.58 7-13a7 7 0 10-14 0c0 5.42 7 13 7 13z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.6"/>
      </>
    ),
  },
];

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function QuickDock() {
  const [open, setOpen] = useState(false);
  const dockRef = useRef(null);
  const { pathname } = useLocation();
  const [lastPath, setLastPath] = useState(pathname);
  const { openEnquiry } = useEnquiry();

  // close the panel on route change (adjust-state-during-render, so the dock
  // never paints open on the incoming page)
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Esc closes the panel (the modal handles its own Esc)
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // click anywhere outside the dock closes the panel
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (dockRef.current && !dockRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const openForm = () => {
    setOpen(false);
    openEnquiry({
      eyebrow: 'Quick enquiry',
      source: 'Quick Links',
      project: 'Oscar Palace',
    });
  };

  const renderInner = (item) => (
    <>
      <span className="quick-dock__icon">{item.icon}</span>
      <span className="quick-dock__text">
        <span className="quick-dock__title">{item.title}</span>
        <span className="quick-dock__sub">{item.sub}</span>
      </span>
      <span className="quick-dock__arrow" aria-hidden><Arrow /></span>
    </>
  );

  const renderItem = (item) => {
    // internal route
    if (item.to) {
      return (
        <Link to={item.to} className="quick-dock__item" onClick={() => setOpen(false)}>
          {renderInner(item)}
        </Link>
      );
    }
    // external / protocol link (pdf, wa.me, tel:, mailto:, maps)
    if (item.href) {
      return (
        <a
          href={item.href}
          className="quick-dock__item"
          onClick={() => setOpen(false)}
          {...(item.download ? { download: '' } : {})}
          {...(item.external ? { target: '_blank', rel: 'noreferrer' } : {})}
        >
          {renderInner(item)}
        </a>
      );
    }
    // nowhere to redirect → open the enquiry form
    return (
      <button type="button" className="quick-dock__item" onClick={openForm}>
        {renderInner(item)}
      </button>
    );
  };

  return (
    <>
      <div className={`quick-dock ${open ? 'is-open' : ''}`} ref={dockRef}>
        <div
          className={`quick-dock__panel ${open ? 'is-open' : ''}`}
          id="quick-dock-panel"
          data-lenis-prevent
          aria-hidden={!open}
        >
          <div className="quick-dock__head">
            <span className="quick-dock__eyebrow">Quick Links</span>
            <span className="quick-dock__heading">Essentials</span>
            <button
              type="button"
              className="quick-dock__close"
              onClick={() => setOpen(false)}
              aria-label="Close quick links"
              tabIndex={open ? 0 : -1}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <ul className="quick-dock__list">
            {ITEMS.map((item) => (
              <li key={item.key} className="quick-dock__row">{renderItem(item)}</li>
            ))}
          </ul>

          <button type="button" className="cta quick-dock__cta" onClick={openForm} tabIndex={open ? 0 : -1}>
            Send an Enquiry
          </button>
        </div>

        <div className="quick-dock__toggle-wrap">
          <span className="quick-dock__label" aria-hidden>Quick Links</span>
          <button
            type="button"
            className={`quick-dock__toggle ${open ? 'is-open' : ''}`}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="quick-dock-panel"
            aria-label={open ? 'Close quick links' : 'Open quick links'}
          >
            <span className="quick-dock__pip" aria-hidden />
            <span className="quick-dock__glyph" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" className="quick-dock__glyph-grid">
                <rect x="3.5" y="3.5" width="7" height="7" rx="2.2" stroke="currentColor" strokeWidth="1.7"/>
                <rect x="13.5" y="3.5" width="7" height="7" rx="2.2" stroke="currentColor" strokeWidth="1.7"/>
                <rect x="3.5" y="13.5" width="7" height="7" rx="2.2" stroke="currentColor" strokeWidth="1.7"/>
                <rect x="13.5" y="13.5" width="7" height="7" rx="2.2" stroke="currentColor" strokeWidth="1.7"/>
              </svg>
              <svg viewBox="0 0 24 24" fill="none" className="quick-dock__glyph-x">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </span>
          </button>
        </div>
      </div>

    </>
  );
}
