// Every indexable URL on the site, in one place. Read by the sitemap generator
// at build time. Anything not listed here is either noindex (404s) or doesn't
// exist — which is what keeps "no orphan pages" true.
import { projectsList } from '../data/projects';
import { NRI_TOPICS } from '../data/nri';

export const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/projects', changefreq: 'weekly', priority: 0.9 },
  { path: '/about', changefreq: 'monthly', priority: 0.7 },
  { path: '/contact', changefreq: 'monthly', priority: 0.7 },

  // Business sections
  { path: '/why-indore', changefreq: 'monthly', priority: 0.8 },
  { path: '/investors', changefreq: 'monthly', priority: 0.8 },
  { path: '/nri', changefreq: 'monthly', priority: 0.8 },
  { path: '/channel-partners', changefreq: 'monthly', priority: 0.7 },
  { path: '/channel-partners/why-icon', changefreq: 'monthly', priority: 0.6 },
  { path: '/channel-partners/commission-support', changefreq: 'monthly', priority: 0.6 },
  { path: '/channel-partners/register', changefreq: 'monthly', priority: 0.6 },
];

/**
 * Static pages + one URL per project + one per NRI topic, all auto-updating as
 * their data files change — which is what keeps "no orphan pages" true as the
 * site grows.
 */
export function allRoutes() {
  return [
    ...STATIC_ROUTES,
    ...NRI_TOPICS.map((t) => ({
      path: `/nri/${t.slug}`,
      changefreq: 'monthly',
      priority: 0.7,
    })),
    ...projectsList.map((p) => ({
      path: `/projects/${p.slug}`,
      changefreq: 'monthly',
      // trending projects are the ones actively being sold
      priority: p.status === 'trending' ? 0.8 : 0.6,
    })),
  ];
}
