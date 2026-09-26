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

import { projectsByStatus, projectsBySlug } from './projects';

const DELIVERED = projectsByStatus('completed').length;

/** A project's card photograph, the same one its cards use across the site. */
const coverOf = (slug) => projectsBySlug[slug]?.thumbnail || projectsBySlug[slug]?.hero_image || null;

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

/*
 * Who we are, vision, mission, values and milestones below are the client's
 * own copy (content.md, Sep 2026), set in house style (no em dashes). Where
 * that copy contradicted this file or projects.js, the published record won
 * and the claim was left out rather than repeated:
 *
 *  - "15+ delivered, every one on time: Oscar Fort, Siddhayatan, Eden Garden"
 *    All three are ongoing in projects.js.
 *  - "Icon launches the Oscar Collection: Fort, Billionaire, Palace"
 *    Oscar Palace is Ruchi Realty's colony; Icon is its design and marketing
 *    partner. The milestone below says so.
 *  - "A 10-acre township in a record 6 months"
 *    IIT Greens is 8.5 acres (corrected Sep 2026). Its six-month timeline was
 *    already published and is kept; "record" is not a claim we can stand up.
 *  - "20+ projects", "11 micro-markets" (incl. Ratlam, Hingolia, Bypass)
 *    projects.js lists 17, none in those three places. The home footprint
 *    section derives its list from projects.js instead.
 *  - Award-winning architects, "all projects RERA registered with clear
 *    titles", AIIMS and Metro Phase 2, brand collaborations, and founder
 *    profiles still holding "[Founder Name]" placeholders.
 *
 * Add any of these back only once the client supplies something verifiable
 * (CLAUDE.md §5).
 */

/** "Who we are" on the home page: the belief, then three principles. */
export const WHO_WE_ARE = {
  eyebrow: 'Who we are',
  title: ['We create inspiring spaces', 'that elevate life.'],
  lede:
    'Icon Realty was founded on a singular belief: that Indore deserves world-class addresses. Not just buildings, but communities. Not just square footage, but stories.',
  principles: [
    {
      name: 'Innovative design',
      body: "Our creative team, including collaborators from Jaipur's leading architectural practices, pushes boundaries to deliver unique, modern designs that reflect your vision and the spirit of the city.",
    },
    {
      name: 'Uncompromising quality',
      body: 'We ensure every detail is perfected using only the finest materials and most skilled craftsmanship. Your address will stand the test of time.',
    },
    {
      name: 'Customer-first culture',
      body: 'From booking to handover, and beyond. Our clients call us approachable, transparent, and committed to long-term relationships, not one-time transactions.',
    },
  ],
};

/**
 * Company values: shown with the vision and mission on About and the home page.
 * `icon` names a drawing in VisionMission.jsx.
 */
export const VALUES = [
  { k: 'Trust',      icon: 'handshake', v: 'Every promise made during booking, honoured at handover.' },
  { k: 'Excellence', icon: 'award',     v: 'Jaipur architects. Premium materials. No compromise.' },
  { k: 'Innovation', icon: 'lightbulb', v: 'Designs that anticipate tomorrow. Technology-driven planning. Forward-looking communities.' },
  { k: 'Legacy',     icon: 'landmark',  v: "We don't build projects. We build addresses that define a generation of Indore." },
];

export const VISION =
  'To make Indore the most aspirational address in Central India, one iconic project at a time.';

export const VISION_DETAIL =
  "We envision a city where world-class living is not a compromise, where families from Indore can access architecture, infrastructure and community on par with any metropolitan market in India. Icon Realty exists to make that vision a daily reality: on the Super Corridor, at IIT's doorstep, and across every micro-market we enter.";

export const MISSION =
  "To deliver landmark developments that honour our buyers' trust: on time, on promise, beyond expectation.";

export const MISSION_DETAIL =
  'Every plot we sell and every community we plan must represent the best of what Indore has to offer. We achieve this through rigorous planning, best-in-class partnerships and a culture of transparency that has earned us the trust of thousands of families and investors.';

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
 * Milestones. A year is shown only where the company has published one; the
 * others are numbered, never given an estimated date. Each is illustrated with
 * a project it names, using that project's own card photograph.
 * When the client supplies dated milestones (launches, deliveries, awards),
 * push them here and both timelines render them automatically.
 */
export const MILESTONES = [
  {
    year: 2004,
    title: 'The beginning',
    image: coverOf('glamour-hill-city'),
    imageAlt: 'Glamour Hill City, Rau',
    body: "Icon Realty is founded in Indore with a mission to redefine Central India's real estate landscape. The first projects, Glamour Hill City in Rau and Ruchi Enclave in Jhalaria, set the benchmark for quality.",
  },
  {
    year: null,
    title: 'The Super Corridor',
    image: coverOf('dream-victoria'),
    imageAlt: 'Dream Victoria on the Super Corridor',
    body: "Icon enters the Super Corridor, Indore's fastest-growing IT and knowledge belt. Singapore Corridor, Singapore Lifestyle 2, Dream Victoria and Victoria Park: four landmark projects at the city's new frontier.",
  },
  {
    year: null,
    title: 'The Oscar series',
    image: coverOf('oscar-palace'),
    imageAlt: 'The gate of Oscar Palace',
    body: "A defining moment: Oscar Billionaire, Oscar Fort and Oscar Palace. On Oscar Palace, Icon is the design and marketing partner for Ruchi Realty's royal-estate colony on the Indore–Nagpur Highway, with architecture by Ravi Gupta Ji of Jaipur.",
  },
  {
    year: null,
    title: 'IIT Greens',
    image: coverOf('iit-greens'),
    imageAlt: 'The gardens of IIT Greens',
    body: "Opposite IIT Indore and Icon's boldest bet on the city's future: a premium development completed on a six-month timeline.",
  },
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
