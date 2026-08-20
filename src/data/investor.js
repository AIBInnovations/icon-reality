// Investor Corner — structured content.
//
// Measured, factual language only. No assured returns, no guaranteed
// appreciation, no rental-yield promises (read.md §73). Where a number would be
// required to make a claim, the claim is made without one.

export const INVESTOR_INTRO =
  'Plotted land is a different asset from a built apartment: there is no depreciating structure, no maintenance corpus, and the value sits almost entirely in the location and the quality of the layout. That makes the decision simpler to analyse — and makes who you buy it from matter more.';

export const WHY_ICON = [
  {
    k: 'A delivered track record you can walk',
    v: 'Nine of our communities are completed and lived in. Before you invest in one that is still being built, visit one that is finished — the layout discipline, the road widths and the green cover are all visible on site.',
  },
  {
    k: 'One city, two decades',
    v: 'Every project Icon Realty has built stands in and around Indore. We are not allocating capital across ten cities and hoping — we know which corridors are actually being built.',
  },
  {
    k: 'Plot-level clarity',
    v: 'Plot sizes, orientations, road widths and the master layout are shown before you enquire, not gated behind a form.',
  },
  {
    k: 'Documentation & registration support',
    v: 'Registration, bank-loan coordination and post-sale paperwork are handled by the same team that sold you the plot.',
  },
];

/** How investors typically approach plotted land. Descriptive, not promissory. */
export const OPPORTUNITY_TYPES = [
  {
    title: 'Long-hold land',
    body: 'Buying in a corridor before its infrastructure completes, and holding through the build-out. The longest horizon and the one most dependent on choosing the corridor correctly.',
    horizon: 'Long term',
    image: '/images/labham-city/photo-3.jpg',
    credit: 'Labham City, Super Corridor',
  },
  {
    title: 'Build-to-occupy',
    body: 'Buying a plot with the intention of constructing a home on it within a few years. The plot is the land bank and the house is the end use.',
    horizon: 'Medium term',
    image: '/images/oscar-billionaire/gallery-2.jpg',
    credit: 'Oscar Billionaire, Bicholi Hapsi',
  },
  {
    title: 'Portfolio diversification',
    body: 'Adding a physical, non-depreciating asset in a market you can visit and verify, alongside financial holdings.',
    horizon: 'Varies',
    image: '/images/ruchi-lifescapes/gallery-2.jpg',
    credit: 'Ruchi Lifescapes, Jhalaria',
  },
  {
    title: 'NRI ownership',
    body: 'Holding property in India while living abroad, with remote inspection, documentation support and a power of attorney where appropriate.',
    horizon: 'Varies',
    image: '/images/siddhayatan/gallery-4.jpg',
    credit: 'Siddhayatan, Manglia',
  },
];

/** Section imagery — Icon Realty's own project photography throughout. */
export const INVESTOR_MEDIA = {
  hero: { src: '/images/oscar-billionaire/gallery-1.jpg', credit: 'Oscar Billionaire, Bicholi Hapsi' },
  track: { src: '/images/ruchi-enclave/gallery-2.jpg', credit: 'Ruchi Enclave, Jhalaria — delivered' },
  diligence: { src: '/images/oscar/layout/layout-1.jpg', credit: 'Oscar Palace — approved plot layout' },
};

/** What an investor should actually check — ours included. */
export const DUE_DILIGENCE = [
  'Who the developer is, and which projects they have completed rather than launched.',
  'The approved layout and the plot dimensions in writing, matched against what is on site.',
  'Road widths, drainage and electrical provision inside the layout — the things that are expensive to retrofit.',
  'Registration status, title documentation and any applicable RERA registration for the project.',
  'Real distance to employment, schools and hospitals — measured in kilometres, not in promised minutes.',
  'What the corridor already has, separately from what has been announced for it.',
];

export const MARKET_NOTES = [
  {
    title: 'Demand is local',
    body: "Indore's residential demand is driven mainly by people who live and work in the city — the IT campuses on the Super Corridor, the Pithampur industrial belt, the trading economy, and the education institutions. End-user demand behaves differently from investor-led demand.",
  },
  {
    title: 'Infrastructure is the variable',
    body: 'Metro construction, corridor widening and airport connectivity change how a location is valued. Which of these are built and which are announced is the distinction worth holding on to.',
  },
  {
    title: 'Plotted supply is finite by geography',
    body: 'Large-format plotted layouts need contiguous land near a working corridor. That constraint is structural, not a sales line.',
  },
];

/** Consultation form config — intent-specific, not a generic "Contact Us". */
export const CONSULTATION = {
  eyebrow: 'Investor desk',
  heading: 'Schedule an investment consultation.',
  hint: 'A 20-minute call with our team — corridor by corridor, project by project, with the documentation you should ask any developer for. Name and phone are enough to start.',
  submitLabel: 'Schedule the consultation',
  success:
    "Thank you — our investor desk will call you at the time you selected to confirm. If you'd like to speak sooner, call +91 9425 9425 10.",
};

export const DISCLAIMER =
  'Information on this page is general and for evaluation purposes. It is not investment, tax or legal advice. Property values move with the market — past performance does not guarantee future appreciation, and no return, yield or resale value is promised.';
