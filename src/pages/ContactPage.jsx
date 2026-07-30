import { useEffect } from 'react';
import Reveal from '../components/Reveal';
import FinalCTA from '../components/FinalCTA';
import EnquiryForm from '../components/EnquiryForm';
import Breadcrumbs from '../components/Breadcrumbs';
import Seo from '../seo/Seo';
import { breadcrumbSchema, webPageSchema, realEstateAgentSchema } from '../seo/schema';
import './ContactPage.css';

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
];

const channels = [
  {
    key: 'email',
    eyebrow: 'Email',
    value: 'iconrealty02@gmail.com',
    href: 'mailto:iconrealty02@gmail.com?subject=Enquiry%20from%20website',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M3 7l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    key: 'whatsapp',
    eyebrow: 'WhatsApp',
    value: '+91 9425 9425 10',
    href: 'https://wa.me/919425942510?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20Oscar%20Palace.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 5h16a1 1 0 011 1v10a1 1 0 01-1 1H9l-4 4V6a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    key: 'phone',
    eyebrow: 'Phone',
    value: '+91 9425 9425 10 / 11',
    href: 'tel:+919425942510',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.8a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.35 1.84.59 2.8.72A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    key: 'address',
    eyebrow: 'Office',
    value: 'Indore, Madhya Pradesh – 452001',
    href: 'https://maps.google.com/?q=Indore+Madhya+Pradesh',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 22s7-7.58 7-13a7 7 0 10-14 0c0 5.42 7 13 7 13z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.6"/>
      </svg>
    ),
  },
];

const socials = [
  { name: 'Instagram', url: 'https://www.instagram.com/iconrealtyofficial/' },
  { name: 'YouTube', url: 'https://www.youtube.com/@IconRealtyOfficial' },
  { name: 'Facebook', url: 'https://www.facebook.com/IconRealtyOfficial' },
];

export default function ContactPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Seo
        title="Contact Icon Realty — Indore"
        description="Get in touch with Icon Realty, Indore. Call +91 9425 9425 10, WhatsApp us, or send an enquiry to book a site visit at Oscar Palace and our other plotted developments."
        path="/contact"
        jsonLd={[
          breadcrumbSchema(TRAIL),
          webPageSchema('ContactPage', {
            name: 'Contact Icon Realty',
            description: 'Phone, WhatsApp, email and office address for Icon Realty, Indore.',
            path: '/contact',
          }),
          realEstateAgentSchema(),
        ]}
      />

      <Breadcrumbs trail={TRAIL} variant="top" />

      <section className="contact-grid">
        <div className="container contact-grid__inner">
          {/* LEFT — channels + socials */}
          <div className="contact-info">
            <Reveal as="span" className="eyebrow contact-info__eyebrow">
              Channels
            </Reveal>
            {/* the page's single H1 — was an H2, leaving /contact with no H1 */}
            <Reveal as="h1" className="display contact-info__heading" delay={0.05}>
              A few ways to reach<br/>the team.
            </Reveal>

            <div className="contact-info__list">
              {channels.map((c, i) => (
                <Reveal
                  key={c.key}
                  delay={i * 0.05}
                  className="contact-info__row-wrap"
                >
                  <a
                    href={c.href}
                    target={c.key === 'address' || c.key === 'whatsapp' ? '_blank' : undefined}
                    rel={c.key === 'address' || c.key === 'whatsapp' ? 'noreferrer' : undefined}
                    className="contact-info__row"
                  >
                    <span className="contact-info__icon">{c.icon}</span>
                    <span className="contact-info__row-body">
                      <span className="contact-info__row-eyebrow">{c.eyebrow}</span>
                      <span className="contact-info__row-value">{c.value}</span>
                    </span>
                    <span className="contact-info__row-arrow" aria-hidden>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>

            <Reveal className="contact-info__socials" delay={0.25}>
              <span className="eyebrow">Follow</span>
              <div className="contact-info__socials-list">
                {socials.map((s) => (
                  <a key={s.name} href={s.url} target="_blank" rel="noreferrer">
                    {s.name}
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          {/* RIGHT — form */}
          <Reveal className="contact-form-wrap" delay={0.15}>
            <EnquiryForm source="Contact Page" project="Oscar Palace" />
          </Reveal>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
