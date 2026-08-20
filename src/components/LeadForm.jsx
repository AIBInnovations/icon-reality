import { useId, useMemo, useState } from 'react';
import { submitLead, LEAD_INTENTS, INTENT_LABELS } from '../services/leads';
import './EnquiryForm.css';
import './LeadForm.css';

/**
 * The site's one lead form.
 *
 * Every enquiry journey — general enquiry, price request, brochure gate, site
 * visit, virtual tour, investor consultation, NRI assistance, channel-partner
 * registration, callback — renders THIS component with a different `intent`
 * and `fields` list. Submission itself is not implemented here: it goes through
 * services/leads.js, so the endpoint and the analytics live in one place.
 *
 * Layout rules (read.md §61): single column on mobile, visible labels, correct
 * phone keyboard, accessible inline errors, and never more fields than the
 * intent genuinely needs. A high-intent form can be name + phone alone.
 *
 * Multi-step (`steps`) is progressive disclosure, not a longer form: the user
 * sees four fields at a time and the lead is only sent at the end.
 */

/** Every field the site can ask for, defined once. */
const FIELDS = {
  name:     { label: 'Full name',   type: 'text',  placeholder: 'Your name', autoComplete: 'name', required: true },
  phone:    { label: 'Phone',       type: 'tel',   placeholder: '+91 …', autoComplete: 'tel', inputMode: 'tel', required: true, half: true },
  email:    { label: 'Email',       type: 'email', placeholder: 'you@email.com', autoComplete: 'email', inputMode: 'email', half: true },
  city:     { label: 'City',        type: 'text',  placeholder: 'Where you live', autoComplete: 'address-level2', half: true },
  country:  { label: 'Country',     type: 'text',  placeholder: 'Country of residence', autoComplete: 'country-name', half: true },
  company:  { label: 'Company / Brokerage', type: 'text', placeholder: 'Registered business name', autoComplete: 'organization', half: true },
  reraNumber: { label: 'RERA registration number', type: 'text', placeholder: 'If registered', half: true },
  experience: { label: 'Years of experience', type: 'text', placeholder: 'e.g. 5 years', inputMode: 'numeric', half: true },
  businessType: {
    label: 'Business type', type: 'select', half: true,
    options: ['Individual agent', 'Brokerage firm', 'Channel partner network', 'Other'],
  },
  preferredDate: { label: 'Preferred date', type: 'date', half: true },
  preferredTime: {
    label: 'Preferred time', type: 'select', half: true,
    options: ['Morning (9am – 12pm)', 'Afternoon (12pm – 4pm)', 'Evening (4pm – 7pm)'],
  },
  preferredMode: {
    label: 'Preferred mode', type: 'chips',
    options: ['Phone call', 'WhatsApp', 'Video call'],
  },
  budget: {
    label: 'Investment range (optional)', type: 'select', half: true,
    options: ['Under ₹25 lakh', '₹25 – 50 lakh', '₹50 lakh – 1 crore', 'Above ₹1 crore', 'Not decided yet'],
  },
  preferredProjects: { label: 'Preferred projects', type: 'text', placeholder: 'Projects you are interested in' },
  preferredAreas:    { label: 'Preferred areas', type: 'text', placeholder: 'Areas of Indore you work in' },
  message:  { label: 'Requirement / Message', type: 'textarea', placeholder: 'Anything you would like us to know…' },
};

const DEFAULT_FIELDS = ['name', 'phone', 'email', 'message'];

/** Fields whose value is not a top-level CRM column travel in `extra`. */
const TOP_LEVEL = new Set(['name', 'phone', 'email', 'message']);

function validate(values, fieldNames) {
  const errors = {};
  for (const key of fieldNames) {
    const def = FIELDS[key];
    if (!def?.required) continue;
    if (!String(values[key] || '').trim()) errors[key] = `${def.label} is required.`;
  }
  // A phone we can't call is a lost lead — check it looks like one before the
  // CRM has to reject it. Deliberately permissive: 8–15 digits covers Indian
  // mobiles as well as the international numbers NRI buyers submit.
  if (fieldNames.includes('phone') && values.phone) {
    const digits = values.phone.replace(/\D/g, '');
    if (digits.length < 8 || digits.length > 15) errors.phone = 'Enter a valid phone number.';
  }
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) {
    errors.email = 'Enter a valid email address.';
  }
  return errors;
}

export default function LeadForm({
  intent = LEAD_INTENTS.GENERAL,
  project,
  source,
  eyebrow = 'Send a request',
  heading = 'Book a site visit.',
  headingId,
  headingLevel: Heading = 'h2',
  /** Single-step field list. Ignored when `steps` is given. */
  fields = DEFAULT_FIELDS,
  /** [{ title, hint, fields: [] }] — progressive disclosure. */
  steps,
  submitLabel = 'Send Request',
  successMessage = "Thank you — your request has been sent. We'll get back to you shortly.",
  /** Fired after a successful submit (e.g. to unlock a brochure download). */
  onSuccess,
  /** Prefilled values, e.g. { preferredProjects: 'Oscar Palace' }. */
  initialValues,
  className = '',
  compact = false,
}) {
  const autoId = useId();
  const idPrefix = `lf-${autoId.replace(/:/g, '')}`;

  const stepList = useMemo(
    () => (steps?.length ? steps : [{ fields }]),
    [steps, fields],
  );
  const allFields = useMemo(
    () => [...new Set(stepList.flatMap((s) => s.fields))],
    [stepList],
  );

  const [values, setValues] = useState(() => {
    const seed = {};
    for (const key of allFields) seed[key] = '';
    return { ...seed, ...initialValues, consent: false };
  });
  const [errors, setErrors] = useState({});
  const [stepIndex, setStepIndex] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const isLastStep = stepIndex === stepList.length - 1;
  const currentFields = stepList[stepIndex].fields;

  const setValue = (key, value) => {
    setValues((v) => ({ ...v, [key]: value }));
    // Clear the error as soon as the user starts fixing it — an error that
    // stays put while you type reads as "still wrong".
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValue(name, type === 'checkbox' ? checked : value);
  };

  const goNext = () => {
    const stepErrors = validate(values, currentFields);
    if (Object.keys(stepErrors).length) {
      setErrors(stepErrors);
      return;
    }
    setStepIndex((i) => i + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;

    if (!isLastStep) { goNext(); return; }

    const allErrors = validate(values, allFields);
    if (!values.consent) allErrors.consent = 'Please accept the privacy policy to continue.';
    if (Object.keys(allErrors).length) {
      setErrors(allErrors);
      return;
    }

    setStatus('sending');
    try {
      const extra = {};
      for (const key of allFields) {
        if (!TOP_LEVEL.has(key) && values[key]) extra[key] = values[key];
      }

      await submitLead({
        name: values.name,
        phone: values.phone,
        email: values.email,
        message: values.message,
        intent,
        project,
        source: source || `${INTENT_LABELS[intent] || 'Website'}${project ? ` — ${project}` : ''}`,
        extra,
      });

      setStatus('sent');
      onSuccess?.(values);
    } catch (err) {
      console.error('[lead form]', err);
      setStatus('error');
    }
  };

  const renderField = (key) => {
    const def = FIELDS[key];
    if (!def) return null;
    const id = `${idPrefix}-${key}`;
    const errId = `${id}-err`;
    const error = errors[key];
    const shared = {
      id,
      name: key,
      value: values[key] ?? '',
      onChange: handleChange,
      'aria-invalid': error ? 'true' : undefined,
      'aria-describedby': error ? errId : undefined,
    };

    return (
      <div className={`contact-form__field ${error ? 'is-invalid' : ''}`} key={key}>
        <label htmlFor={def.type === 'chips' ? undefined : id} id={def.type === 'chips' ? `${id}-label` : undefined}>
          {def.label}
        </label>

        {def.type === 'textarea' && (
          <textarea {...shared} rows={compact ? 2 : 3} placeholder={def.placeholder} />
        )}

        {def.type === 'select' && (
          <div className="lead-form__select">
            <select {...shared}>
              <option value="">Select…</option>
              {def.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <svg viewBox="0 0 12 8" fill="none" aria-hidden>
              <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}

        {def.type === 'chips' && (
          <div className="lead-form__chips" role="radiogroup" aria-labelledby={`${id}-label`}>
            {def.options.map((o) => (
              <button
                type="button"
                key={o}
                role="radio"
                aria-checked={values[key] === o}
                className={`lead-form__chip ${values[key] === o ? 'is-active' : ''}`}
                onClick={() => setValue(key, o)}
              >
                {o}
              </button>
            ))}
          </div>
        )}

        {!['textarea', 'select', 'chips'].includes(def.type) && (
          <input
            {...shared}
            type={def.type}
            placeholder={def.placeholder}
            autoComplete={def.autoComplete}
            inputMode={def.inputMode}
            // Stop a date picker offering yesterday for a site visit.
            {...(def.type === 'date' ? { min: new Date().toISOString().slice(0, 10) } : {})}
          />
        )}

        {error && <span className="lead-form__error" id={errId} role="alert">{error}</span>}
      </div>
    );
  };

  /** Pair consecutive half-width fields into one row; everything else is full width. */
  const renderFields = (keys) => {
    const out = [];
    for (let i = 0; i < keys.length; i++) {
      const def = FIELDS[keys[i]];
      const nextDef = FIELDS[keys[i + 1]];
      if (def?.half && nextDef?.half) {
        out.push(
          <div className="contact-form__row" key={`${keys[i]}-${keys[i + 1]}`}>
            {renderField(keys[i])}
            {renderField(keys[i + 1])}
          </div>
        );
        i++;
      } else {
        out.push(renderField(keys[i]));
      }
    }
    return out;
  };

  if (status === 'sent') {
    return (
      <div className={`contact-form lead-form lead-form--done ${className}`}>
        <span className="lead-form__tick" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M4 12.5L9.5 18L20 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <Heading className="contact-form__heading" id={headingId}>Request received.</Heading>
        <p className="lead-form__done-copy" role="status">{successMessage}</p>
      </div>
    );
  }

  return (
    <form className={`contact-form lead-form ${className}`} onSubmit={handleSubmit} noValidate>
      <span className="contact-form__eyebrow">{eyebrow}</span>
      <Heading className="contact-form__heading" id={headingId}>{heading}</Heading>

      {stepList.length > 1 && (
        <div className="lead-form__steps" aria-label={`Step ${stepIndex + 1} of ${stepList.length}`}>
          {stepList.map((s, i) => (
            <span
              key={s.title || i}
              className={`lead-form__step ${i === stepIndex ? 'is-active' : ''} ${i < stepIndex ? 'is-done' : ''}`}
            >
              <span className="lead-form__step-num">{i + 1}</span>
              <span className="lead-form__step-label">{s.title || `Step ${i + 1}`}</span>
            </span>
          ))}
        </div>
      )}

      {stepList[stepIndex].hint && (
        <p className="lead-form__hint">{stepList[stepIndex].hint}</p>
      )}

      {renderFields(currentFields)}

      {isLastStep && (
        <>
          <label className={`contact-form__consent ${errors.consent ? 'is-invalid' : ''}`}>
            <input
              name="consent"
              type="checkbox"
              checked={values.consent}
              onChange={handleChange}
              aria-describedby={errors.consent ? `${idPrefix}-consent-err` : undefined}
            />
            <span>I have read and accept the privacy policy.</span>
          </label>
          {errors.consent && (
            <span className="lead-form__error" id={`${idPrefix}-consent-err`} role="alert">{errors.consent}</span>
          )}
        </>
      )}

      <div className="lead-form__actions">
        {stepIndex > 0 && (
          <button type="button" className="cta cta--ghost lead-form__back" onClick={() => setStepIndex((i) => i - 1)}>
            Back
          </button>
        )}
        <button type="submit" className="cta contact-form__submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : isLastStep ? submitLabel : 'Continue'}
        </button>
      </div>

      {status === 'error' && (
        <p className="contact-form__status contact-form__status--err" role="alert">
          Something went wrong. Please try again, or call us directly at{' '}
          <a href="tel:+919425942510">+91 9425 9425 10</a>.
        </p>
      )}
    </form>
  );
}
