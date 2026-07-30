import { useState } from 'react';
import './EnquiryForm.css';

/**
 * The site's one enquiry form — posts to /api/contact.
 * Used by the Contact page and by the QuickDock fallback modal, so a change to
 * the fields or the submit flow only has to happen in one place.
 *
 * idPrefix keeps label/input ids unique when two copies are mounted at once
 * (e.g. the modal opened on top of /contact).
 */
export default function EnquiryForm({
  eyebrow = 'Send a request',
  heading = 'Book a site visit.',
  headingId,
  idPrefix = 'cf',
  // The form heading must sit one level below the host page's H1, otherwise the
  // page skips a heading level (h1 → h3), which fails an accessibility/SEO
  // heading-hierarchy audit.
  headingLevel: Heading = 'h2',
  // sent to the CRM as sub_source_name / project_name so leads can be traced
  // back to the exact form and project they came from
  source = 'Website',
  project,
}) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '', consent: false });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.consent || status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          message: form.message,
          source,
          project,
        }),
      });
      if (!res.ok) {
        // surface the real reason in the console — a 404 means the serverless
        // function isn't running, a 500 means mail creds are missing/wrong
        const detail = await res.text().catch(() => '');
        throw new Error(`/api/contact responded ${res.status} ${detail}`);
      }
      setStatus('sent');
      setForm({ name: '', phone: '', email: '', message: '', consent: false });
    } catch (err) {
      console.error('[contact form]', err);
      setStatus('error');
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <span className="contact-form__eyebrow">{eyebrow}</span>
      <Heading className="contact-form__heading" id={headingId}>{heading}</Heading>

      <div className="contact-form__field">
        <label htmlFor={`${idPrefix}-name`}>Full name</label>
        <input
          id={`${idPrefix}-name`}
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
          <label htmlFor={`${idPrefix}-phone`}>Phone</label>
          <input
            id={`${idPrefix}-phone`}
            name="phone"
            type="tel"
            required
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 …"
          />
        </div>
        <div className="contact-form__field">
          <label htmlFor={`${idPrefix}-email`}>Email</label>
          <input
            id={`${idPrefix}-email`}
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
        <label htmlFor={`${idPrefix}-message`}>Requirement / Message</label>
        <textarea
          id={`${idPrefix}-message`}
          name="message"
          rows={3}
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

      <button
        type="submit"
        className="cta contact-form__submit"
        disabled={!form.consent || status === 'sending'}
      >
        {status === 'sending' ? 'Sending…' : 'Send Request'}
      </button>

      {status === 'sent' && (
        <p className="contact-form__status contact-form__status--ok" role="status">
          Thank you — your request has been sent. We'll get back to you shortly.
        </p>
      )}
      {status === 'error' && (
        <p className="contact-form__status contact-form__status--err" role="alert">
          Something went wrong. Please try again, or call us directly at +91 9425 9425 10.
        </p>
      )}
    </form>
  );
}
