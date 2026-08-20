import LeadForm from './LeadForm';
import { LEAD_INTENTS } from '../services/leads';

/**
 * Callback scheduler (read.md §52) — name, phone, date, time and preferred
 * mode (phone / WhatsApp / video call).
 *
 * Reusable on the Investor Corner, the NRI pages and project pages. Like
 * SiteVisitForm it is a preset over <LeadForm> rather than another form, so
 * there is still exactly one submit path on the site.
 *
 * The mode matters more than it looks: an NRI buyer eight time zones away and a
 * local buyer at work want completely different things from "we'll call you",
 * and asking costs one tap.
 */
export default function ScheduleCallback({
  project,
  source,
  eyebrow = 'Callback',
  heading = 'Prefer we call you?',
  hint,
  className,
  ...rest
}) {
  return (
    <LeadForm
      intent={LEAD_INTENTS.CALLBACK}
      project={project}
      source={source || `Callback${project ? ` — ${project}` : ''}`}
      eyebrow={eyebrow}
      heading={heading}
      steps={[{
        hint: hint || 'Pick a day and a time that suits you, and how you would like us to reach you.',
        fields: ['name', 'phone', 'preferredDate', 'preferredTime', 'preferredMode'],
      }]}
      submitLabel="Schedule the call"
      successMessage="Thank you — we'll call at the time you selected."
      className={className}
      {...rest}
    />
  );
}
