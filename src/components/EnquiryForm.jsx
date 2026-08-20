import LeadForm from './LeadForm';
import { LEAD_INTENTS } from '../services/leads';

/**
 * The general website enquiry — name, phone, email, message.
 *
 * Kept as a named preset rather than a second implementation: it renders
 * <LeadForm> with the default field set, so the Contact page and the app-wide
 * enquiry modal share the exact submission, validation and analytics path as
 * every other lead journey on the site (site visit, brochure, investor, NRI,
 * channel partner). Change the form once, in LeadForm.
 *
 * `idPrefix` is accepted for backwards compatibility with existing call sites;
 * LeadForm now derives unique field ids from React's useId, so two copies of
 * the form can be mounted at once (modal over /contact) without colliding.
 */
export default function EnquiryForm({
  eyebrow = 'Send a request',
  heading = 'Book a site visit.',
  headingId,
  headingLevel = 'h2',
  source = 'Website',
  project,
  intent = LEAD_INTENTS.GENERAL,
  fields = ['name', 'phone', 'email', 'message'],
  submitLabel = 'Send Request',
  // eslint-disable-next-line no-unused-vars -- accepted for call-site compatibility
  idPrefix,
  ...rest
}) {
  return (
    <LeadForm
      intent={intent}
      project={project}
      source={source}
      eyebrow={eyebrow}
      heading={heading}
      headingId={headingId}
      headingLevel={headingLevel}
      fields={fields}
      submitLabel={submitLabel}
      {...rest}
    />
  );
}
