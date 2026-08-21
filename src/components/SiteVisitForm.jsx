import LeadForm from './LeadForm';
import { LEAD_INTENTS } from '../services/leads';

/**
 * Site visit request (read.md §51).
 *
 * A named preset over <LeadForm>, not a second form implementation — so it
 * shares the validation, the submit path and the analytics with every other
 * lead journey on the site.
 *
 * When it is rendered on a project page, `project` pre-fills automatically and
 * the field is not asked for at all: the visitor is already looking at the
 * project, so asking which one costs a conversion and tells us nothing.
 * Off a project page, the project becomes an optional free-text field.
 */
export default function SiteVisitForm({
  project,
  source,
  heading,
  eyebrow = 'Site visit',
  className,
  ...rest
}) {
  const fields = project
    ? ['name', 'phone', 'preferredDate', 'preferredTime']
    : ['name', 'phone', 'preferredProjects', 'preferredDate', 'preferredTime'];

  return (
    <LeadForm
      intent={LEAD_INTENTS.SITE_VISIT}
      project={project}
      source={source || `Site visit${project ? `: ${project}` : ''}`}
      eyebrow={eyebrow}
      heading={heading || (project ? `Visit ${project}.` : 'Book a site visit.')}
      fields={fields}
      submitLabel="Request a site visit"
      successMessage={
        project
          ? `Thank you. We'll call to confirm your ${project} visit shortly.`
          : "Thank you. We'll call to confirm your visit shortly."
      }
      className={className}
      {...rest}
    />
  );
}
