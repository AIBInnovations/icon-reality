// Source: https://iconrealty.homes/project/<slug>/
// Trending projects (7) — full detail content fetched from iconrealty.homes.
// Completed projects (10) — mostly sparse content (iconrealty.homes has no
// dedicated detail pages for them); list pages use local thumbnails for visual
// continuity. Oscar Billionaire is delivered but keeps its full content and
// still sits in the trending block of this file — `status` is what the UI reads.
//
// ---------------------------------------------------------------------------
// SHAPE
//
// Required on every project:
//   slug, name, status, category, location, tagline, description,
//   hero_image, thumbnail
//
//   featured: true            opts the project into the home page's three
//                             highlighted projects. Exactly three carry it.
//
// Optional — a project carries a field only when the data genuinely exists, and
// every component hides its section when the field is absent (read.md §11, §71).
// Do NOT fill these in with estimates:
//
//   total_area, plot_sizes        as published by the project
//   amenities[]                   list of amenity names
//   amenityImages{}               amenity name -> photograph
//   connectivity[]                nearby landmarks, as published
//   mapQuery                      exact string to search Google Maps with,
//                                 when the project name alone mislands the pin
//   coordinates                   { lat, lng, zoom? } — verified site
//                                 coordinates. Preferred over mapQuery: the pin
//                                 is exact rather than geocoded. Only add
//                                 coordinates the client has confirmed (§5).
//   highlights[]                  what distinguishes the project
//   gallery[]                     image paths, or { src, category, alt }
//   video_url, video_poster       walkthrough film
//   brochure_url                  local PDF; null means "request the brochure"
//   masterPlan[]                  [{ src, label, note }] — approved layouts
//   floorPlans[]                  [{ src, label, note }] — unit plans, if any
//   documents[]                   [{ label, href }] downloadable documents
//   developer                     who is building it
//   marketedBy                    who is selling it
//   rera                          { number, url, authority } or null
//   price                         { startingFrom, display, disclaimer } or null
//   possession                    string or null
//   specifications{}              group -> [lines]
//   constructionUpdates[]         [{ date, title, description, images[], video, progress }]
//   faqs[]                        [{ q, a }] — project-specific overrides
//   seo                           { title, description }
//
// STATUS values:   'trending' (currently selling), 'upcoming', 'completed'.
// CATEGORY values: 'high-end', 'lower-high-end', 'mid-range' — the positioning
//                  band, see PROJECT_CATEGORIES at the foot of this file.
// ---------------------------------------------------------------------------

export const projectsList = [
  // ===================== TRENDING =====================
  {
    slug: 'oscar-palace',
    name: 'Oscar Palace',
    status: 'trending',
    category: 'high-end',
    featured: true,
    location: 'Indore–Nagpur Highway, Indore',
    total_area: 'Royal estate',
    plot_sizes: '3,000 – 20,000 sq ft',
    tagline: "Central India's most beautiful and well-equipped royal estate colony.",
    description:
      'Oscar Palace is a luxury residential plotting project by Ruchi Realty, mindfully designed and marketed by Icon Realty, on the new Indore–Nagpur Highway. Designed by renowned Jaipur architect Ravi Gupta Ji, it brings royal Indian architecture to plotted living: palace-style gates, marble baradaris, a heritage temple, and 2,80,000 sq ft of garden and open spaces. Sport and everyday life are planned in too, a tennis court, a pickleball court, a skating rink and a multipurpose cricket and football turf, with EV car charging at the plots. The estate\'s own overhead water tank and watch tower stand over the layout: independent water supply and a clear line of sight across every block.',
    amenities: [
      '2,80,000 sq ft of garden & open spaces',
      'Heritage temple & marble baradaris',
      'Tennis court',
      'Pickleball court',
      'Skating rink',
      'Multipurpose cricket & football turf',
      'EV car charging',
      'Overhead water tank & watch tower',
      'Gymnasium & yoga deck',
      "Children's play zone & open gym",
      'Multi-purpose hall',
      '24×7 multi-tier security',
    ],
    // Only amenities with a photograph that ACTUALLY SHOWS THEM are listed here.
    // The new sport and utility amenities (pickleball, skating, the turf, EV
    // charging, the water tank and watch tower) have no supplied imagery yet, so
    // they are deliberately absent — AmenitiesSection renders an un-imaged
    // amenity as a named list item rather than borrowing a photo of something
    // else. Add each entry as the photography arrives (change.md #9).
    amenityImages: {
      '2,80,000 sq ft of garden & open spaces': '/images/oscar/park/park-1.jpg',
      'Heritage temple & marble baradaris': '/images/oscar/temple/temple-1.jpg',
      'Tennis court': '/images/oscar/amenities/amenity-1.jpg',
      'Gymnasium & yoga deck': '/images/oscar/amenities/amenity-2.jpg',
      "Children's play zone & open gym": '/images/oscar/amenities/amenity-3.jpg',
      'Multi-purpose hall': '/images/oscar/photos/photo-1.jpg',
      '24×7 multi-tier security': '/images/oscar/entrance/entrance-1.jpg',
    },
    connectivity: [
      'On the new Indore–Nagpur Highway',
      '1 minute to the expressway',
      'Top-rated schools within 4 km',
      'Hospital & retail 2 minutes away',
      '27 km from Devi Ahilyabai Holkar Airport',
      '4+ rated schools nearby',
    ],
    highlights: [
      'Designed by Ravi Gupta Ji of Jaipur: architect behind several Oberoi hotels',
      'A Ruchi Realty project, mindfully designed & marketed by Icon Realty',
      'East & west facing, Vastu-compliant plots from 3,000 to 20,000 sq ft',
      'Bank loans available on every plot',
    ],
    brochure_url: '/downloads/oscar-palace-brochure.pdf',
    developer: 'Ruchi Realty',
    marketedBy: 'Icon Realty',
    // Real layout sheets that ship in public/images/oscar/layout — shown large
    // in the PlanViewer rather than buried in the gallery.
    masterPlan: [
      { src: '/images/oscar/layout/layout-1.jpg', label: 'Master layout' },
      { src: '/images/oscar/layout/layout-2.jpg', label: 'Plot layout' },
      { src: '/images/oscar/layout/layout-3.jpg', label: 'Site plan' },
    ],
    documents: [
      { label: 'Plot layout (PDF)', href: '/downloads/oscar-palace-plot-layout.pdf' },
      { label: 'Location plan (PDF)', href: '/downloads/oscar-palace-location-plan.pdf' },
    ],
    specifications: {
      Roads: ['Maximum roads 100 ft and 60 ft wide'],
      Plots: ['East and west facing', 'Vastu-compliant', '3,000 – 20,000 sq ft'],
      Landscape: ['2,80,000 sq ft of garden and open spaces'],
      Community: ['Heritage temple and marble baradaris', 'Multi-purpose hall'],
      Sport: ['Tennis court', 'Pickleball court', 'Skating rink', 'Multipurpose cricket and football turf'],
      Utilities: ['Overhead water tank: independent estate water supply', 'EV car charging'],
      Security: ['24×7 multi-tier security', 'Watch tower overlooking the layout'],
      Financing: ['Bank loans available on every plot'],
    },
    hero_image: '/images/oscar/entrance/entrance-1.jpg',
    // PENDING FILM (change.md #9): the client is supplying the long-form film
    // shot by the TITA team. Drop it in public/video and point video_url at it
    // — the player, the poster, the mobile tap-to-play gate and the VideoObject
    // schema all read this one field. Until then this is the existing
    // walkthrough. Confirm whether the TITA film replaces it or sits alongside.
    video_url: '/video/oscar-palace-walkthrough.mp4',
    video_poster: '/images/oscar/entrance/entrance-1.jpg',
    gallery: [
      '/images/oscar/entrance/entrance-2.jpg',
      '/images/oscar/temple/temple-1.jpg',
      '/images/oscar/park/park-1.jpg',
      '/images/oscar/photos/photo-1.jpg',
      '/images/oscar/amenities/amenity-1.jpg',
      '/images/oscar/photos/photo-8.jpg',
      '/images/oscar/park/park-7.jpg',
      '/images/oscar/photos/photo-4.jpg',
      '/images/oscar/entrance/entrance-3.jpg',
    ],
    thumbnail: '/images/oscar/entrance/entrance-1.jpg',
  },
  {
    slug: 'oscar-fort',
    name: 'Oscar Fort',
    status: 'trending',
    category: 'high-end',
    location: 'Bicholi Mardana, Indore',
    total_area: 'Royal estate',
    plot_sizes: '2,800 – 5,000 sq ft',
    tagline: 'A tribute to the majestic mahals of the past, designed to feel like your own private fortress.',
    description:
      'Oscar Fort blends regal architecture with modern luxury, secured by a 12-foot boundary wall. The development features landscaped heritage-themed gardens, an infinity pool, gymnasium, and grand entrance. It sits very close to Scheme 140 and Bicholi, so the city is not somewhere you drive to, it is already around you: schools, hospitals, malls and the Ring Road are all a short run from the gate, while the fort wall keeps the noise of it outside. Designed and marketed by Icon Realty.',
    amenities: [
      "Kids' play area",
      'Gymnasium',
      'Senior Citizen Garden',
      'Swimming Pool',
      'Highly Secured Fort Wall',
      'Sauna',
      'Yoga & Meditation Area',
    ],
    connectivity: [
      'Very close to Scheme 140',
      'Minutes from Bicholi Mardana & Bicholi Hapsi',
      '3–4 km from Scheme 140',
      '2–3 km from Agrawal Public School',
      '6–7 km from Phoenix Citadel Mall',
      '8–9 km from Marriott Hotel',
      '10–11 km from Indore Railway Station',
      '18–20 km from Indore Airport',
    ],
    highlights: [
      'Very close to Scheme 140 and Bicholi: city convenience already around you',
      '12-foot high boundary wall ensuring absolute privacy and safety',
      'Heritage-themed landscape by renowned landscaper Savita Punde',
      'Infinity swimming pool and fully equipped gymnasium',
      'Designed and marketed by Icon Realty',
    ],
    brochure_url: '/downloads/oscar-fort-brochure.pdf',
    developer: 'Icon Realty',
    marketedBy: 'Icon Realty',
    specifications: {
      Plots: ['2,800 – 5,000 sq ft'],
      Location: ['Very close to Scheme 140', 'Minutes from Bicholi Mardana and Bicholi Hapsi'],
      Security: ['12-foot high boundary wall'],
      Landscape: ['Heritage-themed landscape by Savita Punde'],
      Wellness: ['Infinity swimming pool', 'Fully equipped gymnasium', 'Sauna', 'Yoga and meditation area'],
    },
    hero_image: '/images/oscar-fort/hero.jpg',
    video_url: '/video/oscar-fort-walkthrough.mp4',
    video_poster: '/images/oscar-fort/hero.jpg',
    gallery: [
      '/images/oscar-fort/gallery-1.jpg',
      '/images/oscar-fort/gallery-2.jpg',
      '/images/oscar-fort/gallery-3.jpg',
      '/images/oscar-fort/gallery-4.jpg',
      '/images/oscar-fort/gallery-5.jpg',
      '/images/oscar-fort/gallery-6.jpg',
      '/images/oscar-fort/gallery-7.jpg',
      '/images/oscar-fort/gallery-8.jpg',
      '/images/oscar-fort/gallery-9.jpg',
      '/images/oscar-fort/gallery-10.jpg',
    ],
    thumbnail: '/images/oscar-fort/thumb.jpg',
  },
  {
    slug: 'oscar-billionaire',
    name: 'Oscar Billionaire',
    // Delivered. It sits in the trending block only because it was written
    // here first; the status field is what every list and badge reads.
    status: 'completed',
    category: 'high-end',
    location: 'Bicholi Hapsi, Indore',
    total_area: '24 acres',
    plot_sizes: '85 plots',
    tagline: 'An ode to grandeur, a unique presentation of empirical lifestyle.',
    description:
      'A completed Icon Realty luxury plotted development blending traditional royal living with contemporary sophistication. Delivered across 24 acres with a majestic grand entrance, gold-leaf gazebos, cascading fountains and landscaped vistas, built, handed over, and lived in.',
    amenities: [
      'State-of-the-art gymnasium',
      '400 ft frontage',
      'Meditation deck',
      'Holistic Ayurvedic spa',
      'Dense plantation oxygen zone',
      '10,000 sq ft clubhouse',
      '3 outdoor courts',
      '35,000 sq ft landscape garden',
      'Indoor heated pool',
    ],
    connectivity: [
      '15 minutes from Indore International Airport',
      '10 minutes from Vijay Nagar commercial hub',
      '5 minutes from top-tier schools',
      'Near the upcoming metro corridor',
    ],
    highlights: [
      'Completed and delivered: walk it before you decide',
      'Rooted in illustrious heritage yet attuned to modern aspirations',
      'Exemplifies professionalism, integrity, and architectural finesse',
      'A timeless splendour where legacy and luxury coexist',
    ],
    brochure_url: null,
    hero_image: '/images/oscar-billionaire/hero.jpg',
    gallery: [
      '/images/oscar-billionaire/gallery-1.jpg',
      '/images/oscar-billionaire/gallery-2.jpg',
      '/images/oscar-billionaire/gallery-3.jpg',
      '/images/oscar-billionaire/gallery-4.jpg',
      '/images/oscar-billionaire/gallery-5.jpg',
      '/images/oscar-billionaire/gallery-6.jpg',
      '/images/oscar-billionaire/gallery-7.jpg',
      '/images/oscar-billionaire/gallery-8.jpg',
    ],
    thumbnail: '/images/oscar-billionaire/gallery-1.jpg',
  },
  {
    slug: 'saatvik-vihar',
    name: 'Saatvik Vihar',
    status: 'trending',
    category: 'mid-range',
    location: 'Manglia, Indore',
    total_area: 'Township',
    plot_sizes: '600 – 1,800 sq ft',
    tagline: 'A symbol of trust, integrity, and accessible living.',
    description:
      'Saatvik Vihar emphasizes practical design, serene ambience, and quality construction. The development reflects Icon Realty\'s commitment to combining affordability with comfort and quality, rooted in honest practices and customer satisfaction.',
    amenities: [
      'Gymnasium',
      'Gazebo',
      "Kids' Play Zone",
      'Yoga Garden',
      'Senior Citizen Garden',
      'CCTV Security',
      'Club House',
    ],
    connectivity: [
      'Located at AB Road Extension near upcoming metro corridor',
      '15 minutes from Indore International Airport',
      '10 minutes from Vijay Nagar commercial hub',
      '5 minutes from top-tier schools',
    ],
    highlights: [
      'Practical design and serene ambience',
      'Enduring construction quality',
      'Family-focused approach',
      'Accessibility and affordability',
    ],
    brochure_url: null,
    hero_image: '/images/saatvik-vihar/saatvik-2.jpg',
    video_url: '/video/saatvik-vihar-walkthrough.mp4',
    video_poster: '/images/saatvik-vihar/saatvik-2.jpg',
    gallery: [
      '/images/saatvik-vihar/saatvik-1.jpg',
      '/images/saatvik-vihar/saatvik-2.jpg',
      '/images/saatvik-vihar/saatvik-3.jpg',
      '/images/saatvik-vihar/saatvik-4.jpg',
      '/images/saatvik-vihar/saatvik-5.jpg',
      '/images/saatvik-vihar/saatvik-6.jpg',
    ],
    thumbnail: '/images/saatvik-vihar/saatvik-1.jpg',
  },
  {
    slug: 'siddhayatan',
    name: 'Siddhayatan',
    status: 'trending',
    category: 'mid-range',
    featured: true,
    location: 'Manglia, Indore',
    total_area: 'Community',
    plot_sizes: '600 – 1,500 sq ft',
    tagline: 'Premium plotted development for crafting your own way of living.',
    description:
      'A premium residential plotted community offering well-designed spaces with open landscapes. The development emphasizes individual expression within a connected community framework, combining accessibility with serene surroundings. Connectivity is the quiet advantage here, Manglia sits on the Indore–Ujjain route, so the run from the gate to Ujjain is an easy, uninterrupted one, with Indore itself just as close in the other direction.',
    amenities: [
      'Football / Cricket Turf',
      '24×7 Security',
      'Temple for spiritual retreat',
      'Water conservation systems',
      '150 thoughtfully planned plots',
    ],
    connectivity: [
      'Excellent connectivity from Manglia to Ujjain',
      'On the Indore–Ujjain route',
      'Located at AB Road Extension near upcoming metro corridor',
      '15 minutes from Indore International Airport',
      '10 minutes from Vijay Nagar commercial hub',
      '5 minutes from top-tier schools',
    ],
    highlights: [
      'Excellent connectivity from Manglia to Ujjain',
      'Well-laid roads and open landscapes',
      'Design philosophy encouraging individuality',
      'Community-focused planning',
      'Balanced accessibility and serenity',
    ],
    brochure_url: '/downloads/siddhayatan-brochure.pdf',
    marketedBy: 'Icon Realty',
    masterPlan: [
      { src: '/images/siddhayatan/layout-1.jpg', label: 'Site layout' },
    ],
    specifications: {
      Plots: ['600 – 1,500 sq ft', '150 thoughtfully planned plots'],
      Location: ['Manglia: on the Indore–Ujjain route', 'Excellent connectivity from Manglia to Ujjain'],
      Community: ['Temple for spiritual retreat', 'Football / cricket turf'],
      Sustainability: ['Water conservation systems'],
      Security: ['24×7 security'],
    },
    // PENDING PHOTOGRAPHY (change.md #12): the gallery and hero below are the
    // original supplied set. The TITA team's shoot replaces them — drop the
    // files into public/images/siddhayatan and update hero_image, thumbnail and
    // gallery here. Nothing else needs touching; every component reads this
    // record (CLAUDE.md §4).
    hero_image: '/images/siddhayatan/hero.jpg',
    video_url: '/video/siddhayatan-walkthrough.mp4',
    video_poster: '/images/siddhayatan/hero.jpg',
    gallery: [
      '/images/siddhayatan/gallery-1.jpg',
      '/images/siddhayatan/gallery-2.jpg',
      '/images/siddhayatan/gallery-3.jpg',
      '/images/siddhayatan/gallery-4.jpg',
      '/images/siddhayatan/gallery-5.jpg',
      '/images/siddhayatan/gallery-6.jpg',
      '/images/siddhayatan/gallery-7.jpg',
      '/images/siddhayatan/gallery-8.jpg',
    ],
    thumbnail: '/images/siddhayatan/hero.jpg',
  },
  {
    slug: 'eden-garden',
    name: 'Eden Garden',
    status: 'trending',
    category: 'lower-high-end',
    featured: true,
    location: 'Ambamoliya, Indore',
    total_area: 'Plotted',
    plot_sizes: '800 – 2,000 sq ft',
    tagline: 'The Garden of Happiness.',
    description:
      'A serene residential retreat where nature and modern living coexist. Eden Garden features wide green avenues, landscaped spaces, and community zones designed for wellness and tranquility.',
    amenities: [
      'Football Garden',
      'Sand pit for kids',
      'Open Gym',
      'Pickleball / Basketball Court',
      'Temple',
      'Skating Rink',
    ],
    connectivity: [
      '15 minutes from Indore International Airport',
      '10 minutes from Vijay Nagar commercial hub',
      '5 minutes from top-tier schools',
      'Near the upcoming metro corridor',
    ],
    highlights: [
      'Thoughtfully crafted ecosystem',
      'Wide green avenues and landscaped open spaces',
      'Community zones nurturing connection',
    ],
    brochure_url: '/downloads/eden-garden-brochure.pdf',
    hero_image: '/images/eden-garden/eden-1.jpg',
    video_url: '/video/eden-garden-walkthrough.mp4',
    video_poster: '/images/eden-garden/eden-1.jpg',
    gallery: [
      '/images/eden-garden/eden-1.jpg',
      '/images/eden-garden/eden-2.jpg',
      '/images/eden-garden/eden-3.jpg',
      '/images/eden-garden/eden-4.jpg',
      '/images/eden-garden/eden-5.jpg',
      '/images/eden-garden/eden-6.jpg',
    ],
    thumbnail: '/images/eden-garden/eden-4.jpg',
  },
  {
    slug: 'labham-city',
    name: 'Labham City',
    status: 'trending',
    category: 'high-end',
    location: 'Super Corridor, Indore',
    total_area: '34 acres',
    plot_sizes: 'Township',
    tagline: "A premier Roman-themed residential township in Indore's Super Corridor.",
    description:
      'A Roman-themed residential township on MR5 Road, designed for corporate professionals with proximity to TCS and Infosys campuses and top educational institutions.',
    amenities: [
      'State-of-the-art gymnasium',
      '400 ft frontage',
      'Meditation deck',
      'Holistic Ayurvedic spa',
      '10,000 sq ft clubhouse',
      '3 outdoor courts',
      '35,000 sq ft landscape garden',
      'Indoor heated pool',
    ],
    connectivity: [
      'Minutes from Narsee Monjee (NMIMS)',
      'Minutes from Symbiosis University',
      'Rapid airport access',
      'Opposite government residential housing',
      'Primary economic hub with major corporate presence',
    ],
    highlights: [
      'Designed for corporate professionals',
      'Unique Roman architecture',
      "Located in the fastest-developing area of Super Corridor",
      'Premium lifestyle community',
    ],
    brochure_url: '/downloads/labham-city-brochure.pdf',
    hero_image: '/images/labham-city/photo-1.jpg',
    gallery: [
      '/images/labham-city/photo-1.jpg',
      '/images/labham-city/photo-2.jpg',
      '/images/labham-city/photo-3.jpg',
      '/images/labham-city/photo-4.jpg',
      '/images/labham-city/photo-5.jpg',
      '/images/labham-city/photo-6.jpg',
      '/images/labham-city/photo-7.jpg',
      '/images/labham-city/photo-8.jpg',
      '/images/labham-city/photo-9.jpg',
    ],
    thumbnail: '/images/labham-city/photo-1.jpg',
  },
  {
    slug: 'iit-greens',
    name: 'IIT Greens',
    status: 'trending',
    category: 'lower-high-end',
    location: 'Simrol, Indore-Khandwa Highway',
    total_area: '28 acres',
    plot_sizes: 'Education corridor',
    tagline: 'Strategically planned residential development redefining modern living.',
    description:
      'A premium residential project by Icon Realty located opposite IIT Indore, built on a commitment to a 6-month completion timeline. Features wellness-focused design with green spaces and modern infrastructure throughout.',
    amenities: [
      'Open-to-sky gym',
      'Dense plantation oxygen zone',
      'Sand pit for kids',
      'Acupressure walking track',
      'Meditation deck',
      'Walking tracks',
      'Fitness zones',
      'Yoga and meditation areas',
    ],
    connectivity: [
      '1 min from IIT Indore Campus',
      '10 min from Tejaji Nagar Square',
      '25 min from City Centre',
      '50 min from Indore Railway Station',
      '60 min from Devi Ahilya Bai Holkar Airport',
      'Direct Indore-Khandwa Highway access',
      'Near Omkareshwar Temple',
    ],
    highlights: [
      'Record-breaking 6-month completion timeline',
      'Strategic location opposite IIT Indore',
      'Highway frontage with main gate access',
      'Comprehensive wellness infrastructure',
    ],
    brochure_url: '/downloads/iit-greens-brochure.pdf',
    developer: 'Icon Realty',
    marketedBy: 'Icon Realty',
    specifications: {
      Location: ['Opposite IIT Indore', 'Highway frontage with main gate access'],
      Landscape: ['Dense plantation oxygen zone', 'Acupressure walking track', 'Meditation deck'],
      Wellness: ['Open-to-sky gym', 'Walking tracks', 'Fitness zones'],
      Children: ['Sand pit for kids'],
    },
    hero_image: '/images/projects/iit-greens.jpg',
    video_url: '/video/iit-greens-walkthrough.mp4',
    video_poster: '/images/projects/iit-greens.jpg',
    gallery: [
      '/images/iit-greens/render-1.jpg',
      '/images/iit-greens/render-2.jpg',
      '/images/iit-greens/render-3.jpg',
      '/images/iit-greens/render-4.jpg',
      '/images/iit-greens/render-5.jpg',
      '/images/iit-greens/render-6.jpg',
      '/images/iit-greens/render-7.jpg',
      '/images/iit-greens/render-8.jpg',
      '/images/iit-greens/render-9.jpg',
    ],
    thumbnail: '/images/projects/iit-greens.jpg',
  },

  // ===================== COMPLETED =====================
  // No dedicated detail pages on iconrealty.homes; using a uniform sparse shape.
  {
    slug: 'glamour-highway-city',
    name: 'Glamour Highway City',
    status: 'completed',
    category: 'mid-range',
    location: 'Pithampur',
    total_area: 'Township',
    plot_sizes: 'Plotted development',
    tagline: 'A delivered township along the Pithampur highway.',
    description:
      'One of Icon Realty\'s completed plotted developments, Glamour Highway City sits on the Pithampur corridor and is fully delivered and lived in. Wide planned roads, green pockets, and quiet community living define the project.',
    amenities: ['Wide planned roads', 'Landscaped greens', 'Community plot layout', 'Secure boundary'],
    connectivity: [
      'Pithampur industrial corridor',
      'Highway-adjacent location',
      'Easy access to Indore main city',
    ],
    highlights: ['Fully completed and delivered', 'Highway-adjacent for connectivity', 'Established community'],
    brochure_url: null,
    hero_image: '/images/glamour-highway-city/hero.jpg',
    gallery: [
      '/images/glamour-highway-city/hero.jpg',
      '/images/glamour-highway-city/gallery-1.jpg',
      '/images/glamour-highway-city/gallery-2.jpg',
    ],
    thumbnail: '/images/glamour-highway-city/thumb.jpg',
  },
  {
    slug: 'glamour-hill-city',
    name: 'Glamour Hill City',
    status: 'completed',
    category: 'mid-range',
    location: 'Rau',
    total_area: 'Township',
    plot_sizes: 'Plotted development',
    tagline: "A completed development overlooking Rau's gentle hills.",
    description:
      'Glamour Hill City is an Icon Realty delivered township in Rau. Its hillside layout offers thoughtful orientations, planned greenery, and a serene community feel away from the city centre.',
    amenities: ['Hillside layout', 'Wide internal roads', 'Green common areas', 'Secure community'],
    connectivity: ['Rau growth corridor', 'Easy reach from Indore main city', 'Educational institutions nearby'],
    highlights: ['Fully completed and inhabited', 'Hillside orientation', 'Long-term value in a growth corridor'],
    brochure_url: null,
    hero_image: '/images/glamour-hill-city/hero.jpg',
    gallery: [
      '/images/glamour-hill-city/hero.jpg',
      '/images/glamour-hill-city/gallery-1.jpg',
    ],
    thumbnail: '/images/glamour-hill-city/thumb.jpg',
  },
  {
    slug: 'ruchi-enclave',
    name: 'Ruchi Enclave',
    status: 'completed',
    category: 'lower-high-end',
    location: 'Jhalaria',
    total_area: 'Enclave',
    plot_sizes: 'Premium plotted',
    tagline: 'A premium enclave delivered in the heart of Jhalaria.',
    description:
      'Ruchi Enclave is an Icon Realty completed plotted community in Jhalaria, a quiet residential pocket with planned infrastructure, green spaces, and family-first layouts.',
    amenities: ['Planned roads', 'Garden and open spaces', 'Family-oriented layout', 'Secure boundary'],
    connectivity: ['Jhalaria residential corridor', 'Schools and markets within easy reach'],
    highlights: ['Established family community', 'Premium plotted enclave', 'Fully delivered'],
    brochure_url: null,
    hero_image: '/images/ruchi-enclave/hero.jpg',
    gallery: [
      '/images/ruchi-enclave/gallery-1.jpg',
      '/images/ruchi-enclave/gallery-2.jpg',
      '/images/ruchi-enclave/gallery-3.jpg',
      '/images/ruchi-enclave/gallery-4.jpg',
      '/images/ruchi-enclave/gallery-5.jpg',
      '/images/ruchi-enclave/gallery-6.jpg',
      '/images/ruchi-enclave/gallery-7.jpg',
    ],
    thumbnail: '/images/ruchi-enclave/hero.jpg',
  },
  {
    slug: 'ruchi-lifescapes',
    name: 'Ruchi Lifescapes',
    status: 'completed',
    category: 'lower-high-end',
    location: 'Jhalaria',
    total_area: 'Premium plotted',
    plot_sizes: 'Family plots',
    tagline: 'An elevated lifestyle community already in residence.',
    description:
      'Ruchi Lifescapes is Icon Realty\'s premium plotted offering in Jhalaria, delivered, occupied, and known for its layout discipline and community quality.',
    amenities: ['Premium plot sizing', 'Planned community design', 'Greenery throughout', 'Resident-led upkeep'],
    connectivity: ['Jhalaria residential corridor', 'Quick city access'],
    highlights: ['Premium positioning', 'Delivered with all utilities', 'Strong resale value'],
    brochure_url: null,
    hero_image: '/images/ruchi-lifescapes/hero.jpg',
    gallery: [
      '/images/ruchi-lifescapes/gallery-1.jpg',
      '/images/ruchi-lifescapes/gallery-2.jpg',
      '/images/ruchi-lifescapes/gallery-3.jpg',
      '/images/ruchi-lifescapes/gallery-4.jpg',
      '/images/ruchi-lifescapes/gallery-5.jpg',
      '/images/ruchi-lifescapes/gallery-6.jpg',
      '/images/ruchi-lifescapes/gallery-7.jpg',
      '/images/ruchi-lifescapes/gallery-8.jpg',
    ],
    thumbnail: '/images/ruchi-lifescapes/hero.jpg',
  },
  {
    slug: 'singapore-corridor',
    name: 'Singapore Corridor',
    status: 'completed',
    category: 'mid-range',
    location: 'Super Corridor, Indore',
    total_area: 'Township',
    plot_sizes: 'Plotted development',
    tagline: "An Icon Realty delivery along Indore's Super Corridor.",
    description:
      'Singapore Corridor is a completed Icon Realty township along the Super Corridor, Indore\'s fastest-growing corporate and infrastructural axis. The development is fully delivered and lived in.',
    amenities: ['Wide corridor frontage', 'Planned plots', 'Community open space', 'Secure boundary'],
    connectivity: ['Super Corridor: fastest-growing corporate axis', 'Quick airport access', 'Schools and hospitals nearby'],
    highlights: ['Strategic corporate corridor location', 'Fully completed', 'High appreciation potential'],
    brochure_url: null,
    hero_image: '/images/singapore-corridor/hero.jpg',
    gallery: [
      '/images/singapore-corridor/gallery-1.jpg',
      '/images/singapore-corridor/gallery-2.jpg',
      '/images/singapore-corridor/gallery-3.jpg',
    ],
    thumbnail: '/images/singapore-corridor/thumb.jpg',
  },
  {
    slug: 'singapore-lifestyle-2',
    name: 'Singapore Lifestyle 2',
    status: 'completed',
    category: 'mid-range',
    location: 'Super Corridor, Indore',
    total_area: 'Township phase II',
    plot_sizes: 'Plotted development',
    tagline: 'The second phase delivery in the Super Corridor lifestyle community.',
    description:
      'Singapore Lifestyle 2 extends Icon Realty\'s presence along Indore\'s Super Corridor. Built on the success of phase one, this completed development continues the same emphasis on planning, greenery, and community.',
    amenities: ['Phase-2 community planning', 'Continuity with phase 1', 'Planned roads', 'Common green spaces'],
    connectivity: ['Super Corridor location', 'Corporate hubs nearby', 'Airport-adjacent'],
    highlights: ['Phase-2 completion of a proven community', 'Strong corporate-area positioning', 'Delivered'],
    brochure_url: null,
    hero_image: '/images/singapore-lifestyle-2/hero.jpg',
    gallery: [
      '/images/singapore-lifestyle-2/gallery-1.jpg',
      '/images/singapore-lifestyle-2/gallery-2.jpg',
      '/images/singapore-lifestyle-2/gallery-3.jpg',
      '/images/singapore-lifestyle-2/gallery-4.jpg',
      '/images/singapore-lifestyle-2/gallery-5.jpg',
      '/images/singapore-lifestyle-2/gallery-6.jpg',
      '/images/singapore-lifestyle-2/gallery-7.jpg',
    ],
    thumbnail: '/images/singapore-lifestyle-2/hero.jpg',
  },
  {
    slug: 'dream-victoria',
    name: 'Dream Victoria',
    status: 'completed',
    category: 'mid-range',
    location: 'Super Corridor, Indore',
    total_area: 'Township',
    plot_sizes: 'Plotted development',
    tagline: 'A Super Corridor address that already feels like home.',
    description:
      'Dream Victoria is an Icon Realty completed community along the Super Corridor, known for its planned layouts, ample greenery, and the quiet quality of life its residents have come to enjoy.',
    amenities: ['Wide planned roads', 'Family-first plot layout', 'Green pockets', 'Established community'],
    connectivity: ['Super Corridor', 'Educational institutes nearby', 'Quick airport access'],
    highlights: ['Lived-in community', 'Premium positioning along Super Corridor', 'Completed and delivered'],
    brochure_url: null,
    hero_image: '/images/dream-victoria/victoria-1.jpg',
    gallery: [
      '/images/dream-victoria/victoria-1.jpg',
      '/images/dream-victoria/victoria-2.jpg',
      '/images/dream-victoria/victoria-3.jpg',
      '/images/dream-victoria/victoria-4.jpg',
      '/images/dream-victoria/victoria-5.jpg',
      '/images/dream-victoria/victoria-6.jpg',
    ],
    thumbnail: '/images/dream-victoria/victoria-6.jpg',
  },
  {
    slug: 'victoria-park',
    name: 'Victoria Park',
    status: 'completed',
    category: 'mid-range',
    location: 'Super Corridor, Indore',
    total_area: 'Plotted park-side',
    plot_sizes: 'Park-facing plots',
    tagline: 'Park-facing plots in a delivered Super Corridor community.',
    description:
      "Victoria Park sits on Indore's Super Corridor with park-facing plots and a quiet, established neighborhood feel. Fully delivered by Icon Realty.",
    amenities: ['Park-facing plots', 'Open green spaces', 'Family-oriented layout', 'Secure community'],
    connectivity: ['Super Corridor', 'Schools and markets within easy reach'],
    highlights: ['Park-front positioning', 'Fully completed and inhabited', 'Strong family neighborhood'],
    brochure_url: null,
    // NO PROJECT PHOTOGRAPHY SUPPLIED. These three are unattributed numbered
    // frames from /images/projects, not pictures of Victoria Park — every
    // other project on this list shows its own site. Replace all three the
    // moment the client sends photographs (change.md #1).
    // /images/projects/victoria-park.jpg is the wordmark, not a photo.
    hero_image: '/images/projects/08.jpg',
    gallery: ['/images/projects/08.jpg', '/images/projects/04.jpg', '/images/projects/05.jpg'],
    thumbnail: '/images/projects/08.jpg',
  },
  {
    slug: 'singapore-business-park',
    name: 'Singapore Business Park',
    status: 'completed',
    category: 'mid-range',
    location: 'LIG Square, Indore',
    total_area: 'Mixed-use',
    plot_sizes: 'Plotted & commercial',
    tagline: 'A business-and-living address at the heart of Indore.',
    description:
      'Singapore Business Park is an Icon Realty development at LIG Square, a central, high-visibility address that pairs plotted living with commercial frontage in one of Indore\'s most connected pockets.',
    amenities: ['Commercial frontage', 'Planned roads', 'Green common areas', 'Secure boundary'],
    connectivity: ['LIG Square: central Indore', 'Schools, hospitals & markets within easy reach', 'Quick city-wide connectivity'],
    highlights: ['Central LIG Square location', 'Live-work flexibility', 'High footfall & visibility'],
    brochure_url: '/downloads/singapore-business-park-brochure.pdf',
    hero_image: '/images/singapore-business-park/hero.jpg',
    gallery: [
      '/images/singapore-business-park/gallery-1.jpg',
      '/images/singapore-business-park/gallery-2.jpg',
      '/images/singapore-business-park/gallery-3.jpg',
      '/images/singapore-business-park/gallery-4.jpg',
      '/images/singapore-business-park/gallery-5.jpg',
    ],
    thumbnail: '/images/singapore-business-park/thumb.jpg',
  },
];

export const projectsBySlug = projectsList.reduce((acc, p) => {
  acc[p.slug] = p;
  return acc;
}, {});

/**
 * Status vocabulary for the projects index filter and the navigation.
 * `trending` is the site's existing word for "currently selling"; the UI shows
 * it as "Ongoing" because that is what a buyer filtering a list expects.
 */
/**
 * `total_area` holds a real measurement for some projects ("24 acres") and a
 * development category for others ("Royal estate", "Township"). Labelling every
 * one of them "Total area" made the category rows read as wrong data, so the
 * label follows the value: a measurement keeps "Total area", anything else is
 * described as what it actually is.
 */
const MEASUREMENT = /\d/;

export const areaFactLabel = (value) =>
  MEASUREMENT.test(String(value ?? '')) ? 'Total area' : 'Estate type';

export const PROJECT_STATUSES = [
  { key: 'trending', label: 'Ongoing', plural: 'Ongoing projects' },
  { key: 'upcoming', label: 'Upcoming', plural: 'Upcoming projects' },
  { key: 'completed', label: 'Completed', plural: 'Completed projects' },
];

/**
 * Price/positioning bands, ordered high to low. Every project carries a
 * `category` key from this list; the projects index offers them as a second
 * filter alongside status, and the card badge names the band.
 */
export const PROJECT_CATEGORIES = [
  { key: 'high-end',       label: 'High end',       blurb: 'Estate-scale plots, signature architecture, the full amenity programme.' },
  { key: 'lower-high-end', label: 'Lower high end', blurb: 'Premium planning and landscape at a more reachable plot size.' },
  { key: 'mid-range',      label: 'Mid range',      blurb: 'Honest, well-planned plotted living for first-home and growing families.' },
];

export const CATEGORY_LABEL = PROJECT_CATEGORIES.reduce((acc, c) => {
  acc[c.key] = c.label;
  return acc;
}, {});

export const projectsByCategory = (category) =>
  projectsList.filter((p) => p.category === category);

/** Only the bands that actually have projects, so no filter chip dead-ends. */
export const availableCategories = () =>
  PROJECT_CATEGORIES.filter((c) => projectsList.some((p) => p.category === c.key));

/**
 * The three projects the client asks the home page to lead with. Ordered as
 * they appear in projectsList so the flagship stays first.
 */
export const featuredProjects = () => projectsList.filter((p) => p.featured);

export const projectsByStatus = (status) => projectsList.filter((p) => p.status === status);

/**
 * Only the statuses that actually have projects, so the filter never offers an
 * "Upcoming" tab that resolves to an empty list. Add a project with
 * status: 'upcoming' and the tab appears on its own.
 */
export const availableStatuses = () =>
  PROJECT_STATUSES.filter((s) => projectsList.some((p) => p.status === s.key));

/** Every plan sheet a project publishes, master layouts first. */
export const projectPlans = (project) => [
  ...(project?.masterPlan || []),
  ...(project?.floorPlans || []),
].filter((p) => p?.src);

/** Related projects — same status first, then anything else, excluding self. */
export function relatedProjects(slug, limit = 3) {
  const current = projectsBySlug[slug];
  if (!current) return projectsList.slice(0, limit);
  const sameStatus = projectsList.filter((p) => p.slug !== slug && p.status === current.status);
  const others = projectsList.filter((p) => p.slug !== slug && p.status !== current.status);
  return [...sameStatus, ...others].slice(0, limit);
}
