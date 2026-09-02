// The post slugs, on their own.
//
// App.jsx needs them to register the legacy root-level redirects, and importing
// the full blog registry there would pull every post's copy into the main
// bundle — the opposite of why each route is lazily loaded. This module stays
// free of content so that import costs nothing.
//
// src/data/blog/index.js asserts, in dev, that this list and the posts it
// actually loads describe the same four articles.
export const POST_SLUGS = [
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
