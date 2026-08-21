// Channel Partners — one page: why-partner, benefits, portfolio, journey,
// commission & support, registration. Those were four routes once; they are
// sections of /channel-partners now, and the old URLs redirect onto the
// matching anchor (App.jsx).
//
// Commission percentages are NOT stated anywhere in this file. Icon Realty has
// not published them, and inventing a number that a partner would then hold us
// to is worse than saying it is project-specific (read.md §41, §71).

export const CP_INTRO =
  "We work with channel partners who sell property in Indore for a living. What we offer is straightforward: a portfolio a client can visit, inventory information that is current, and a team that answers the phone on a Sunday when your client is standing at the site.";

export const CP_MEDIA = {
  hero: { src: '/images/oscar/entrance/entrance-3.jpg', credit: 'Oscar Palace, Indore–Nagpur Highway' },
  support: { src: '/images/labham-city/photo-5.jpg', credit: 'Labham City, Super Corridor' },
  portfolio: { src: '/images/oscar-fort/gallery-6.jpg', credit: 'Oscar Fort, Bicholi Mardana' },
};

export const WHY_PARTNER = [
  {
    k: 'A portfolio your client can walk',
    v: 'Nine delivered communities and eight currently selling. When a client asks what you have actually handed over, there is an answer with an address.',
    image: '/images/ruchi-enclave/gallery-3.jpg',
    credit: 'Ruchi Enclave — delivered',
  },
  {
    k: 'A local brand with two decades behind it',
    v: 'Icon Realty has built in and around Indore since 2004. You are not introducing your client to a name they have never heard.',
    image: '/images/oscar-billionaire/gallery-4.jpg',
    credit: 'Oscar Billionaire, Bicholi Hapsi',
  },
  {
    k: 'Range across price and format',
    v: 'From 600 sq ft plots at Saatvik Vihar to 20,000 sq ft royal-estate plots at Oscar Palace — you can place most clients somewhere in the portfolio.',
    image: '/images/saatvik-vihar/saatvik-4.jpg',
    credit: 'Saatvik Vihar, Manglia',
  },
  {
    k: 'Site visit coordination that shows up',
    v: 'Weekend and short-notice site visits are coordinated by our team, so your client is met by someone who knows the layout.',
    image: '/images/eden-garden/eden-3.jpg',
    credit: 'Eden Garden, Ambamoliya',
  },
];

export const PARTNER_BENEFITS = [
  { k: 'Relationship manager', v: 'A named point of contact, not a shared inbox.' },
  { k: 'Current inventory', v: 'Plot availability communicated as it changes, so you are not selling something that has gone.' },
  { k: 'Creatives & project decks', v: 'Brochures, layouts, renders and social creatives you can use with clients.' },
  { k: 'Launch information first', v: 'New project and phase information shared with registered partners ahead of public launch.' },
  { k: 'Site visit support', v: 'Coordination, on-site presence and layout walkthroughs for your client visits.' },
  { k: 'Lead coordination', v: 'A clear registration route for your client so attribution is settled up front, not argued later.' },
  { k: 'Training', v: 'Project briefings so your team can answer layout, plot and location questions without calling us mid-meeting.' },
  { k: 'Documentation support', v: 'Booking, agreement and registration paperwork handled by our team.' },
];

/** The partner journey, as a visual process. */
export const PARTNER_JOURNEY = [
  { title: 'Register', body: 'Submit your details and business information through the registration form.' },
  { title: 'Verification', body: 'We verify your business details and RERA registration where applicable.' },
  { title: 'Onboarding', body: 'You are assigned a relationship manager and briefed on the current portfolio.' },
  { title: 'Project access', body: 'Inventory, creatives, project decks and launch information are shared with you.' },
  { title: 'Lead submission', body: 'Register your client so attribution is recorded before the first site visit.' },
  { title: 'Site visit', body: 'We coordinate the visit and support you on site.' },
  { title: 'Booking', body: 'Booking, agreement and registration handled with our documentation team.' },
  { title: 'Commission processing', body: 'Processed per the commercial terms agreed for that project.' },
];

export const SUPPORT_STRUCTURE = [
  { k: 'Relationship manager', v: 'One named contact for inventory, pricing and site-visit coordination.' },
  { k: 'Inventory updates', v: 'Plot availability shared as it moves.' },
  { k: 'Marketing creatives', v: 'Project creatives and brochures for your own campaigns.' },
  { k: 'Project decks', v: 'Layout, location and specification decks for client meetings.' },
  { k: 'Launch information', v: 'Advance information on new phases and launches.' },
  { k: 'Site visit support', v: 'On-site coordination and layout walkthroughs.' },
  { k: 'Lead coordination', v: 'Client registration and attribution recorded up front.' },
  { k: 'Training', v: 'Briefings for your sales team on each project.' },
  { k: 'Documentation support', v: 'Booking through registration, handled with you.' },
];

/**
 * Commercial terms. Deliberately not a number — see the file header.
 */
export const COMMISSION_STATEMENT =
  'Project-specific commercial terms are shared after successful partner verification.';

export const COMMISSION_NOTES = [
  'Terms differ by project, plot size and phase, so a single site-wide percentage would be misleading.',
  'Terms are confirmed in writing before you begin selling a project — not after a booking.',
  'Client attribution is recorded at registration, which is what prevents disputes at the commission stage.',
];

/** Registration form — progressive disclosure, three steps (read.md §43). */
export const REGISTRATION_STEPS = [
  {
    title: 'You',
    hint: 'Just enough to get in touch. Two minutes.',
    fields: ['name', 'phone', 'email', 'city'],
  },
  {
    title: 'Business',
    hint: 'Your business details, so we can verify and onboard you.',
    fields: ['company', 'reraNumber', 'experience', 'businessType'],
  },
  {
    title: 'Focus',
    hint: 'Optional — helps us brief you on the right part of the portfolio first.',
    fields: ['preferredProjects', 'preferredAreas', 'message'],
  },
];

export const REGISTRATION_NOTE =
  'If document uploads are required for verification, our team will request them directly after this form.';
