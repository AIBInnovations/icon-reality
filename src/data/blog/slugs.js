// The post slugs, on their own.
//
// App.jsx needs them to register the legacy root-level redirects, and importing
// the full blog registry there would pull every post's copy into the main
// bundle, the opposite of why each route is lazily loaded. This module stays
// free of content so that import costs nothing.
//
// src/data/blog/index.js asserts, in dev, that this list and the posts it
// actually loads describe the same articles.
//
// Every slug is the one the post's SEO brief wrote its schema against, so the
// brief's mainEntityOfPage URL and the live URL differ only by the /blog prefix.
export const POST_SLUGS = [
  'residential-plots-in-simrol-indore',
  'plots-near-iit-indore-simrol',
  'siddhayatan-indore-premium-residential-plots-manglia',
  'why-choose-siddhayatan-manglia-residential-plot-indore',
  'verify-rera-title-land-documents-before-buying-plot-indore',
  'plot-vs-flat-in-indore-investment-2026',
  'super-corridor-vs-ujjain-road-buying-plot-indore',
  'super-corridor-indore-property-guide-investment',
  'what-to-check-before-buying-residential-plot-in-indore',
  'best-areas-to-buy-residential-plots-in-indore',
  'gated-plotted-development-vs-open-plot-indore',
  'top-5-residential-projects-in-indore-by-icon-realty',
];

/**
 * The flat, root-level URLs the SEO brief's schema was written against. The
 * posts live under /blog, so App.jsx keeps these resolving as redirects rather
 * than 404s: the same treatment the old /nri/<topic> URLs get.
 */
export const LEGACY_POST_PATHS = POST_SLUGS.map((slug) => ({
  from: `/${slug}`,
  to: `/blog/${slug}`,
}));

/**
 * Slugs that were live before the post moved to its brief's URL. The September
 * posts first shipped (19 Sep 2026) under slugs made from their headlines; they
 * were indexed and shared under those, so the old URLs redirect rather than 404.
 * vercel.json carries the same list as 301s at the edge.
 */
export const RENAMED_POST_PATHS = [
  ['how-to-verify-rera-title-and-land-documents-before-buying-plot-in-indore', 'verify-rera-title-land-documents-before-buying-plot-indore'],
  ['plot-vs-flat-in-indore-which-is-better-for-investment-in-2026', 'plot-vs-flat-in-indore-investment-2026'],
  ['super-corridor-vs-ujjain-road-which-is-better-for-buying-a-plot-in-indore', 'super-corridor-vs-ujjain-road-buying-plot-indore'],
  ['super-corridor-indore-property-guide-what-buyers-should-know-before-investing', 'super-corridor-indore-property-guide-investment'],
].map(([from, to]) => ({ from: `/blog/${from}`, to: `/blog/${to}` }));
