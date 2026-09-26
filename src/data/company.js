// Company facts, in one place.
//
// NO INVENTED DATA (read.md §71). Every figure and name below already appears
// in Icon Realty's own published material — the existing site copy, the footer,
// the About page and the project pages. Anything the company has not published
// is `null` here rather than guessed, and the components that read this file
// skip a null field instead of rendering a blank slot.
//
// The delivered-projects figure is counted from projects.js rather than typed
// out, so adding a project can never leave the trust stats contradicting the
// portfolio page.

import { projectsByStatus } from './projects';

const DELIVERED = projectsByStatus('completed').length;

export const COMPANY = {
  name: 'Icon Realty',
  city: 'Indore',
  region: 'Madhya Pradesh',
  founded: 2004,
  tagline: 'Premium plotted developments in Indore.',
};

/**
 * The trust numbers. `value`/`suffix` drive the counter animation; `label` and
 * `sub` are the copy. Add a new metric only when the company has published it.
 */
export const TRUST_STATS = [
  { key: 'years',    value: 20,   suffix: '+', label: 'Years of trust',     sub: 'Building since 2004' },
  { key: 'projects', value: 15,   suffix: '+', label: 'Landmark projects',  sub: 'Across Indore & beyond' },
  { key: 'families', value: 4500, suffix: '+', label: 'Happy families',     sub: 'Welcomed home' },
  { key: 'delivered',value: DELIVERED, suffix: '', label: 'Projects delivered', sub: 'Completed and lived in' },
];

/**
 * The three figures that were baked into the directors' banner artwork.
 *
 * They are rendered as HTML beneath the image rather than living inside the
 * JPEG, because the client has already revised one of them once ("1500+" to
 * "4,000+") and a number burned into a composite cannot be corrected without a
 * re-export from the original design file.
 *
 * NOTE, deliberate and previously confirmed with the client: this strip reads
 * 4,000+ while TRUST_STATS above (and the footer, About page and SEO
 * descriptions) reads 4,500+. Do not "reconcile" the two on your own; the
 * banner figure and the site-copy figure were supplied separately.
 */
export const BANNER_STATS = [
  { value: '15+',    label: 'Successful projects delivered' },
  { value: '4,000+', label: 'Happy families' },
  { value: '2',      label: 'Decades of trust' },
];

/** Short editorial paragraphs — the company story, told in three beats. */
export const STORY = [
  {
    title: 'Who we are',
    body:
      "Icon Realty evolved from a promising vision into one of Indore's most trusted names in premium real estate. Under the direction of Mr. Siddharth Porwal and Mr. Nilesh Porwal, the company has built more than fifteen landmark developments. Each a quiet, considered statement of what plotted living can be.",
  },
  {
    title: 'Our relationship with Indore',
    body:
      "Every project we have built stands in and around Indore, from the Super Corridor to the Indore–Nagpur Highway, from Rau to Simrol. We are not visitors to this market. We know which corridors are being built, which ones are being talked about, and the difference between the two.",
  },
  {
    title: 'How we work',
    body:
      'We plan for the decade after handover, not the quarter after launch. Wide planned roads. Real green cover. Boundaries that mean something. The details a family lives with long after the brochure has been put away.',
  },
  {
    title: 'What we do',
    body:
      'Icon Realty develops and markets plotted residential communities. On some projects we are the developer; on others, Oscar Palace among them, we are the marketing and sales partner to the developer. Which role we hold on which project is stated on the project page itself.',
  },
];

/** Company philosophy — reused on About and Investor Corner. */
export const VALUES = [
  { k: 'Integrity',     v: 'Honesty, transparency, and ethical responsibility in every decision.' },
  { k: 'Craftsmanship', v: 'Superior design, meticulous planning, and an obsession with quality.' },
  { k: 'Customer-First',v: 'Long-term commitment with post-sales support and quick responsiveness.' },
  { k: 'Innovation',    v: 'New ideas, technologies, and design philosophies, applied with purpose.' },
];

export const VISION =
  'To be a trusted leader in luxury real estate by creating community-centric spaces, defined by dense tree plantations and vibrant greenery, delivering timeless landmarks with enduring quality and a healthier lifestyle.';

export const MISSION =
  'To create developments that rise beyond architecture: shaped with precision, purpose and refined elegance, through ethical practices and a customer-first approach.';

export const LEADERSHIP = [
  {
    name: 'Mr. Nilesh Porwal',
    role: 'Director, Icon Realty',
    photo: '/images/team/director-nilesh.png',
    bio: "Over two decades shaping Central India's premium townships. He leads on craftsmanship, planning, and the unglamorous details: wide roads, real green cover, boundaries that age into landmarks.",
  },
  {
    name: 'Mr. Siddharth Porwal',
    role: 'Director, Icon Realty',
    photo: '/images/team/director-siddharth.png',
    bio: "Under his direction, Icon Realty has evolved from a promising vision into one of Indore's most trusted names. Champion of transparency, ethical practice, and a long view that puts families ahead of quarters.",
  },
];

/**
 * Milestones. Only entries with a year the company has published are listed.
 * When the client supplies dated milestones (launches, deliveries, awards),
 * push them here and the About timeline renders them automatically.
 */
export const MILESTONES = [
  { year: 2004, title: 'Icon Realty is founded', body: 'The first plotted development in Indore.' },
  { year: null, title: 'Super Corridor townships', body: 'Singapore Corridor, Singapore Lifestyle 2, Dream Victoria and Victoria Park delivered along Indore\'s fastest-growing corporate axis.' },
  { year: null, title: 'Oscar Palace', body: 'Appointed design and marketing partner for the Ruchi Realty royal-estate colony on the Indore–Nagpur Highway, with architecture by Ravi Gupta Ji of Jaipur.' },
  { year: null, title: 'IIT Greens', body: 'A premium development opposite IIT Indore, completed on a six-month timeline.' },
];

/**
 * Awards & press. Empty until Icon Realty supplies verifiable entries — the
 * About page hides the section entirely rather than showing placeholder logos.
 * Shape: { title, issuer, year, url }
 */
export const AWARDS = [];
export const PRESS = [];

/**
 * Founder message video. Null until the client provides the file; the About
 * page skips the section while it is null.
 * Shape: { src, poster, title, quote, attribution }
 */
export const FOUNDER_MESSAGE = null;

/**
 * Banking partners. Icon Realty states that bank loans are available on its
 * plots, but has not published a list of specific lenders — so this stays
 * empty and BankPartners renders the general statement only, never invented
 * bank logos (read.md §36, §71).
 */
export const BANK_PARTNERS = [];

export const BANK_PARTNER_NOTE =
  'Home-loan assistance is available on our plotted developments. Our team coordinates directly with lenders on your behalf; eligibility and terms are determined by the bank.';

/** Why buyers choose Icon — used on About, Investor Corner and project pages. */
export const TRUST_PILLARS = [
  {
    k: 'Two decades in one city',
    v: 'Every project we have built stands in and around Indore. Local knowledge is the product.',
  },
  {
    k: 'Delivered, not just launched',
    v: 'Ten completed communities are lived in today. You can visit them before you buy from us.',
  },
  {
    k: 'Planning you can walk',
    v: 'Wide planned roads, real green cover, secured boundaries: visible on site, not only in the brochure.',
  },
  {
    k: 'Documentation support',
    v: 'Registration, loan coordination and post-sale paperwork handled by the same team that sold you the plot.',
  },
];
