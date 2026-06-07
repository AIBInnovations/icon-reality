import { useEffect, useState } from 'react';
import Reveal from '../components/Reveal';
import FinalCTA from '../components/FinalCTA';
import './ContactPage.css';

const channels = [
  {
    key: 'email',
    eyebrow: 'Email',
    value: 'iconrealty2@icloud.com',
    href: 'mailto:iconrealty2@icloud.com?subject=Enquiry%20from%20website',
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
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '', consent: false });

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.consent) return;
    const subject = encodeURIComponent('Enquiry — Oscar Palace (website)');
    const body = encodeURIComponent(
      `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:iconrealty2@icloud.com?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <section className="contact-grid">
        <div className="container contact-grid__inner">
          {/* LEFT — channels + socials */}
          <div className="contact-info">
            <Reveal as="span" className="eyebrow contact-info__eyebrow">
              Channels
            </Reveal>
            <Reveal as="h2" className="display contact-info__heading" delay={0.05}>
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
            <form className="contact-form" onSubmit={handleSubmit}>
              <span className="contact-form__eyebrow">Send a request</span>
              <h3 className="contact-form__heading">Book a site visit.</h3>

              <div className="contact-form__field">
                <label htmlFor="cf-name">Full name</label>
                <input
                  id="cf-name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />
              </div>

              <div className="contact-form__row">
                <div className="contact-form__field">
                  <label htmlFor="cf-phone">Phone</label>
                  <input
                    id="cf-phone"
                    name="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 …"
                  />
                </div>
                <div className="contact-form__field">
                  <label htmlFor="cf-email">Email</label>
                  <input
                    id="cf-email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@email.com"
                  />
                </div>
              </div>

              <div className="contact-form__field">
                <label htmlFor="cf-message">Requirement / Message</label>
                <textarea
                  id="cf-message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us which project interests you, plot size, timeline, anything else…"
                />
              </div>

              <label className="contact-form__consent">
                <input
                  name="consent"
                  type="checkbox"
                  checked={form.consent}
                  onChange={handleChange}
                />
                <span>I have read and accept the privacy policy.</span>
              </label>

              <button type="submit" className="cta contact-form__submit" disabled={!form.consent}>
                Send Request
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
