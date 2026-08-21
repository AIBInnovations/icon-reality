// Why Indore — structured content.
//
// Everything here is publicly verifiable civic/institutional fact (institutions
// that exist, corridors that are built, the airport that operates). Nothing is
// a market projection, an appreciation figure, or a completion date the state
// has not published. Where a number would be needed to make a claim, the claim
// is written without one (read.md §26, §29, §73).

export const INDORE_INTRO =
  "Indore is Madhya Pradesh's largest city and its commercial capital, an education and healthcare hub for central India, the state's busiest airport, and the address of both an IIT and an IIM. That combination is unusual for a tier-two Indian city, and it is the reason the residential market here is driven by people who live and work in Indore rather than by buyers from elsewhere.";

/**
 * At-a-glance facts. `value` is null wherever a precise published figure isn't
 * available — the card then shows the label and note only, never a made-up
 * number.
 */
export const AT_A_GLANCE = [
  {
    k: 'Commercial capital of Madhya Pradesh',
    v: "The state's largest city and its principal trade, finance and services centre.",
  },
  {
    k: 'IIT and IIM in the same city',
    v: 'IIT Indore at Simrol and IIM Indore on the Rau–Pithampur road, a pairing only a handful of Indian cities have.',
  },
  {
    k: "India's cleanest city, repeatedly",
    v: 'Ranked first in the Government of India\'s Swachh Survekshan survey for several consecutive years.',
  },
  {
    k: 'Devi Ahilya Bai Holkar International Airport',
    v: "Central India's busiest airport, with domestic connectivity to every major Indian metro.",
  },
  {
    k: 'Healthcare hub for central India',
    v: 'Multi-speciality hospitals and medical colleges that draw patients from across the region.',
  },
  {
    k: 'Pithampur industrial belt',
    v: "One of India's larger automotive and pharmaceutical manufacturing clusters, on Indore's doorstep.",
  },
];

/** Infrastructure — what exists, what is under construction. No dates invented. */
export const INFRASTRUCTURE = [
  {
    title: 'Indore Metro',
    body: 'A metro rail network is under construction in Indore, with the first corridor running through the Super Corridor and Vijay Nagar side of the city. Stations along a metro alignment change how a residential corridor is valued long before the trains run.',
    status: 'Under construction',
  },
  {
    title: 'Super Corridor',
    body: "Indore's planned corporate axis, connecting the city to the airport and to the IT campuses along MR-10 and MR-5. Wide right-of-way, planned utilities, and the reason several of our completed communities sit here.",
    status: 'Operational, still developing',
  },
  {
    title: 'Devi Ahilya Bai Holkar International Airport',
    body: "The busiest airport in central India. Proximity to it, measured honestly in kilometres rather than promised minutes, is one of the few location factors that holds its value through a market cycle.",
    status: 'Operational',
  },
  {
    title: 'Ring road & bypass network',
    body: 'The AB Bypass and ring road network move through-traffic around the city rather than through it, which is what has allowed residential corridors to form on the outer edges without inheriting highway congestion.',
    status: 'Operational',
  },
  {
    title: 'Indore–Nagpur Highway',
    body: 'A national highway corridor running south-east out of the city. Oscar Palace sits on the new alignment, a minute from the expressway.',
    status: 'Operational',
  },
  {
    title: 'Indore–Khandwa Highway',
    body: 'The southern corridor past Simrol and IIT Indore, continuing towards Omkareshwar. IIT Greens has frontage on it.',
    status: 'Operational',
  },
];

/** Employment & industry — drivers of genuine end-user housing demand. */
export const EMPLOYMENT = [
  {
    title: 'IT & corporate campuses',
    body: 'Major IT services companies including TCS and Infosys operate campuses on the Super Corridor, alongside government and private office development along the same axis.',
  },
  {
    title: 'Pithampur industrial area',
    body: 'A large automotive, pharmaceutical and engineering manufacturing cluster roughly 30 km from the city, employing a substantial workforce that lives in and around Indore.',
  },
  {
    title: 'Trade, finance & services',
    body: 'As the commercial capital of Madhya Pradesh, Indore carries the state\'s largest concentration of trading houses, banks, professional services and wholesale distribution.',
  },
  {
    title: 'Education economy',
    body: 'IIT Indore, IIM Indore, NMIMS, Symbiosis, DAVV and a dense network of professional colleges bring students, faculty and staff into the city every year, and keep a share of them here after graduation.',
  },
  {
    title: 'Startup & SME base',
    body: "A growing base of small businesses and startups, supported by the city's lower operating costs relative to the metros.",
  },
];

export const EMPLOYMENT_NOTE =
  'Employment concentration is what separates a residential corridor with genuine end-user demand from one that depends on resale to the next investor. It is the first thing worth checking about any location, including ours.';

export const EDUCATION = [
  { name: 'IIT Indore', note: 'Indian Institute of Technology, at Simrol on the Indore–Khandwa Highway.' },
  { name: 'IIM Indore', note: 'Indian Institute of Management, on the Rau–Pithampur road.' },
  { name: 'DAVV', note: 'Devi Ahilya Vishwavidyalaya, the state university, with campuses across the city.' },
  { name: 'NMIMS Indore', note: 'Narsee Monjee Institute of Management Studies, on the Super Corridor.' },
  { name: 'Symbiosis University', note: 'Symbiosis, also on the Super Corridor.' },
  { name: 'MGM Medical College', note: 'One of central India\'s established government medical colleges.' },
];

export const HEALTHCARE = [
  { name: 'Multi-speciality private hospitals', note: 'Several large private hospital groups operate multi-speciality facilities across the city.' },
  { name: 'Government medical infrastructure', note: 'MGM Medical College and its associated hospitals serve patients from across the region.' },
  { name: 'Regional referral centre', note: 'Indore is the healthcare destination for much of western and central Madhya Pradesh.' },
];

/**
 * Growth corridors, each mapped to the Icon Realty projects that sit on it.
 * `projects` holds slugs from data/projects.js so the Why Indore page can link
 * straight through — no duplicated project content.
 */
export const CORRIDORS = [
  {
    name: 'Super Corridor',
    body: 'The corporate axis between the city and the airport: IT campuses, universities, planned road width and the metro alignment.',
    projects: ['labham-city', 'singapore-corridor', 'singapore-lifestyle-2', 'dream-victoria', 'victoria-park'],
    // Photography is always of the Icon Realty project named in `credit`, never
    // a stock image standing in for the corridor itself.
    image: '/images/labham-city/photo-1.jpg',
    credit: 'Labham City, Super Corridor',
  },
  {
    name: 'Indore–Nagpur Highway',
    body: 'The south-eastern highway corridor, developing outward from the AB Bypass with large-format plotted estates.',
    projects: ['oscar-palace'],
    image: '/images/oscar/entrance/entrance-1.jpg',
    credit: 'Oscar Palace, Indore–Nagpur Highway',
  },
  {
    name: 'Bicholi Mardana & Bicholi Hapsi',
    body: "The eastern residential belt beyond Vijay Nagar: established schools, retail and hospitals already in place.",
    projects: ['oscar-fort', 'oscar-billionaire'],
    image: '/images/oscar-fort/hero.jpg',
    credit: 'Oscar Fort, Bicholi Mardana',
  },
  {
    name: 'AB Road Extension / Manglia',
    body: 'The northern corridor towards Dewas, near the upcoming metro alignment, with accessible plot sizes.',
    projects: ['saatvik-vihar', 'siddhayatan'],
    image: '/images/saatvik-vihar/saatvik-2.jpg',
    credit: 'Saatvik Vihar, Manglia',
  },
  {
    name: 'Simrol & the education corridor',
    body: 'The southern stretch of the Indore–Khandwa Highway anchored by IIT Indore.',
    projects: ['iit-greens'],
    image: '/images/iit-greens/render-1.jpg',
    credit: 'IIT Greens, Simrol',
  },
  {
    name: 'Ambamoliya',
    body: 'A quieter residential pocket on the southern edge, developing around green, low-density plotting.',
    projects: ['eden-garden'],
    image: '/images/eden-garden/eden-1.jpg',
    credit: 'Eden Garden, Ambamoliya',
  },
];

/**
 * Hero and section imagery for the Why Indore page. Every frame is Icon Realty's
 * own project photography, captioned with the project it shows — no stock
 * cityscape pretending to be Indore, and no render captioned as civic
 * infrastructure.
 */
export const INDORE_MEDIA = {
  hero: { src: '/images/labham-city/photo-2.jpg', credit: 'Labham City, Super Corridor' },
  infrastructure: { src: '/images/oscar/entrance/entrance-4.jpg', credit: 'Oscar Palace, Indore–Nagpur Highway' },
  employment: { src: '/images/singapore-business-park/hero.jpg', credit: 'Singapore Business Park, LIG Square' },
  institutions: { src: '/images/iit-greens/render-3.jpg', credit: 'IIT Greens, opposite IIT Indore' },
  lifestyle: [
    { src: '/images/oscar/park/park-1.jpg', credit: 'Oscar Palace' },
    { src: '/images/siddhayatan/gallery-2.jpg', credit: 'Siddhayatan' },
    { src: '/images/eden-garden/eden-4.jpg', credit: 'Eden Garden' },
    { src: '/images/ruchi-lifescapes/gallery-3.jpg', credit: 'Ruchi Lifescapes' },
  ],
};

/**
 * Historical price appreciation.
 *
 * DELIBERATELY EMPTY. Icon Realty has not published audited area-level price
 * history, and inventing appreciation figures for a real-estate investment page
 * is exactly the claim regulators and buyers are right to distrust (read.md
 * §29, §71, §73). The Why Indore page hides the chart while this is empty.
 *
 * Shape when real data arrives:
 *   { area: 'Super Corridor', year: 2022, averagePrice: 3200, unit: '₹/sq ft', source: '…' }
 */
export const PRICE_HISTORY = [];

export const PRICE_HISTORY_DISCLAIMER =
  'Past performance does not guarantee future property appreciation.';

export const INVESTMENT_DISCLAIMER =
  'Property values move with the market. Nothing on this page is a guarantee of appreciation, rental yield or resale value.';
