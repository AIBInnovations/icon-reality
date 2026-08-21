/**
 * Project FAQs, derived from the project's own data.
 *
 * Every answer is assembled from fields that already exist in projects.js — the
 * location, the plot sizes, the amenities the project lists, whether a brochure
 * PDF ships with the site. Nothing is asserted that the data does not support,
 * and a question is dropped entirely when its answer would have to be invented
 * (read.md §71).
 *
 * A project can override or extend these by setting `faqs: [{ q, a }]` on its
 * entry in projects.js; explicit entries always win.
 */
import { PRIMARY_PHONE } from './contact';

export function buildProjectFaqs(project) {
  if (!project) return [];
  if (project.faqs?.length) return project.faqs;

  const {
    name, location, plot_sizes, total_area, status,
    amenities = [], connectivity = [], brochure_url, rera,
    developer, marketedBy, masterPlan = [],
  } = project;

  const faqs = [];

  if (location) {
    faqs.push({
      q: `Where is ${name} located?`,
      a: `${name} is at ${location}.${connectivity.length ? ` Nearby landmarks include ${connectivity.slice(0, 3).join(', ')}.` : ''}`,
    });
  }

  if (plot_sizes) {
    faqs.push({
      q: `What plot sizes are available at ${name}?`,
      a: `${name} offers ${plot_sizes}${total_area && total_area !== plot_sizes ? ` across a ${total_area.toLowerCase()} development` : ''}. Availability changes as plots are booked. Our team confirms what is currently open when you enquire.`,
    });
  }

  faqs.push({
    q: `Is ${name} ready, or still under development?`,
    a: status === 'completed'
      ? `${name} is complete and delivered. The community is occupied, and you are welcome to visit it before deciding on any of our current projects.`
      : `${name} is one of our currently selling projects. The best way to judge progress is to visit the site. We arrange visits by appointment.`,
  });

  if (amenities.length) {
    faqs.push({
      q: `What amenities does ${name} have?`,
      a: `${name} lists ${amenities.length} amenities, including ${amenities.slice(0, 4).join(', ')}. The full list is on this page.`,
    });
  }

  if (masterPlan.length) {
    faqs.push({
      q: `Can I see the layout plan for ${name}?`,
      a: 'Yes, the approved layout is published on this page and can be opened full screen and zoomed. You do not need to submit a form to view it.',
    });
  }

  faqs.push({
    q: `What is the RERA registration for ${name}?`,
    a: rera?.number
      ? `${name} is registered under RERA number ${rera.number}${rera.url ? ', which can be verified on the authority\'s own website' : ''}.`
      : `Registration and approval details for ${name} are shared with the full documentation set on request, and are verifiable directly with the authority before you commit to anything. We do not publish a registration number we cannot evidence on this page.`,
  });

  if (developer || marketedBy) {
    faqs.push({
      q: `Who is developing ${name}?`,
      a: [
        developer && `${name} is developed by ${developer}.`,
        marketedBy && `${marketedBy} handles design, marketing and sales for the project.`,
      ].filter(Boolean).join(' '),
    });
  }

  faqs.push({
    q: 'Are home loans available?',
    a: 'Home-loan assistance is available on our plotted developments, our team coordinates directly with lenders on your behalf. Eligibility, rate and terms are determined by the bank, not by us.',
  });

  faqs.push({
    q: brochure_url ? 'How do I get the brochure?' : 'How do I get pricing and the brochure?',
    a: brochure_url
      ? `The ${name} brochure is available on this page. We ask for a name and phone number so we can answer questions about it afterwards.`
      : `Request the ${name} brochure on this page, or call us on ${PRIMARY_PHONE.label}. Pricing is shared directly because it changes with plot position, size and phase.`,
  });

  faqs.push({
    q: 'Can I book a site visit?',
    a: `Yes. Site visits are by appointment. Pick a date and time on this page, or call ${PRIMARY_PHONE.label} and our team will meet you at the site and walk the layout with you.`,
  });

  return faqs;
}
