// Single source of truth for everything SEO reads: canonical origin, business
// details, and the default social card. Imported by the <Seo> component, the
// sitemap generator (build time) and the static JSON-LD in index.html.

// Canonical origin — no trailing slash. Override per environment with
// VITE_SITE_URL (e.g. a staging domain) without touching code.
//
// Resolved from import.meta.env in the browser bundle and from process.env in
// Node, so build-time tooling (the sitemap generator, the index.html JSON-LD
// injector) reads exactly the same value the app does.
const envSiteUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_SITE_URL) ||
  'https://iconrealty.homes';

export const SITE_URL = envSiteUrl.replace(/\/+$/, '');

export const SITE_NAME = 'Icon Realty';

export const DEFAULT_TITLE = 'Residential Plots in Indore | Icon Realty';
export const TITLE_TEMPLATE = (t) => (t ? `${t} | ${SITE_NAME}` : DEFAULT_TITLE);

export const DEFAULT_DESCRIPTION =
  'Explore residential plotted developments in Indore with Icon Realty. Discover our projects, locations and amenities, and enquire about a site visit.';

export const DEFAULT_OG_IMAGE = '/images/oscar/entrance/entrance-1.jpg';

export const ORGANISATION = {
  name: SITE_NAME,
  legalName: 'Icon Realty',
  logo: '/icon-logo.png',
  email: 'iconrealty02@gmail.com',
  telephone: ['+91-9425942510', '+91-9425942511'],
  address: {
    locality: 'Indore',
    region: 'Madhya Pradesh',
    postalCode: '452001',
    country: 'IN',
  },
  sameAs: [
    'https://www.instagram.com/iconrealtyofficial/',
    'https://www.youtube.com/@IconRealtyOfficial',
    'https://www.facebook.com/IconRealtyOfficial',
  ],
};

/** Relative path → absolute URL. Absolute inputs pass through untouched. */
export const absoluteUrl = (path = '/') =>
  /^https?:\/\//i.test(path) ? path : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
