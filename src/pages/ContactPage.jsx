import { useEffect } from 'react';
import Reveal from '../components/Reveal';
import FinalCTA from '../components/FinalCTA';
import EnquiryForm from '../components/EnquiryForm';
import ScheduleCallback from '../components/ScheduleCallback';
import Breadcrumbs from '../components/Breadcrumbs';
import Seo from '../seo/Seo';
import { breadcrumbSchema, webPageSchema, realEstateAgentSchema } from '../seo/schema';
import { EMAIL, PHONES, PRIMARY_PHONE, ADDRESS, MAPS_URL, SOCIALS, telHref } from '../data/contact';
import { whatsappUrl, waMessage } from '../services/whatsapp';
import { LEAD_INTENTS } from '../services/leads';
import './ContactPage.css';

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
];

// Every entry resolves from data/contact.js, so a number changes in one file.
const channels = [
  {
    key: 'email',
    eyebrow: 'Email',
    value: EMAIL,
    href: `mailto:${EMAIL}?subject=Enquiry%20from%20website`,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M3 7l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    key: 'whatsapp',
    eyebrow: 'WhatsApp',
    value: PRIMARY_PHONE.label,
    href: whatsappUrl(waMessage.general()),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 5h16a1 1 0 011 1v10a1 1 0 01-1 1H9l-4 4V6a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    key: 'phone',
    eyebrow: 'Phone',
    value: PHONES.map((p) => p.label).join(' / '),
    href: telHref(),
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.8a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.35 1.84.59 2.8.72A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    key: 'address',
    eyebrow: 'Office',
    value: `${ADDRESS.locality}, ${ADDRESS.region} – ${ADDRESS.postalCode}`,
    href: MAPS_URL,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 22s7-7.58 7-13a7 7 0 10-14 0c0 5.42 7 13 7 13z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.6"/>
      </svg>
    ),
  },
];

const socials = SOCIALS;

export default function ContactPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Seo
        title="Contact Icon Realty: Indore"
        description="Get in touch with Icon Realty, Indore. Call +91 9425 9425 10, WhatsApp us, or send an enquiry to book a site visit at any of our plotted developments."
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
            {/* The contact form is a general enquiry, not a project-specific
                one — pre-filling "Oscar Palace" mislabelled every lead from
                visitors who arrived here about a different project. */}
            <EnquiryForm
              source="Contact Page"
              intent={LEAD_INTENTS.GENERAL}
              eyebrow="Send a request"
              heading="Tell us what you're looking for."
              submitLabel="Send Request"
            />
          </Reveal>
        </div>
      </section>

      {/* A second, lower-commitment route to the same team: some visitors will
          not write a message but will happily pick a time to be called. */}
      <section className="contact-callback">
        <div className="container contact-callback__inner">
          <div className="contact-callback__copy">
            <Reveal as="span" className="eyebrow">Callback</Reveal>
            <Reveal as="h2" className="display contact-callback__heading" delay={0.05}>
              Rather we called you?
            </Reveal>
            <Reveal as="p" className="contact-callback__lede" delay={0.1}>
              Pick a day, a time and how you would like us to reach you: phone, WhatsApp or a
              video call. Useful if you are abroad, or if you would rather not type out a
              requirement.
            </Reveal>
          </div>
          <Reveal className="contact-callback__form" delay={0.15}>
            <ScheduleCallback source="Contact page: callback" />
          </Reveal>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
