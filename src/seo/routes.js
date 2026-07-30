// Every indexable URL on the site, in one place. Read by the sitemap generator
// at build time. Anything not listed here is either noindex (404s) or doesn't
// exist — which is what keeps "no orphan pages" true.
import { projectsList } from '../data/projects';

export const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/projects', changefreq: 'weekly', priority: 0.9 },
  { path: '/about', changefreq: 'monthly', priority: 0.7 },
  { path: '/contact', changefreq: 'monthly', priority: 0.7 },
];

/** Static pages + one URL per project, auto-updating as projects.js changes. */
export function allRoutes() {
  return [
    ...STATIC_ROUTES,
    ...projectsList.map((p) => ({
      path: `/projects/${p.slug}`,
      changefreq: 'monthly',
      // trending projects are the ones actively being sold
      priority: p.status === 'trending' ? 0.8 : 0.6,
    })),
  ];
}
