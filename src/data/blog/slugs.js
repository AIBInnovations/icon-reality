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
  'how-to-verify-rera-title-and-land-documents-before-buying-plot-in-indore',
  'plot-vs-flat-in-indore-which-is-better-for-investment-in-2026',
  'super-corridor-vs-ujjain-road-which-is-better-for-buying-a-plot-in-indore',
  'super-corridor-indore-property-guide-what-buyers-should-know-before-investing',
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
