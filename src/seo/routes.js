// Every indexable URL on the site, in one place. Read by the sitemap generator
// at build time. Anything not listed here is either noindex (404s) or doesn't
// exist — which is what keeps "no orphan pages" true.
import { projectsList } from '../data/projects.js';
import { BLOG_POSTS } from '../data/blog/index.js';

export const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/projects', changefreq: 'weekly', priority: 0.9 },
  { path: '/about', changefreq: 'monthly', priority: 0.7 },
  { path: '/contact', changefreq: 'monthly', priority: 0.7 },

  // Business sections
  { path: '/why-indore', changefreq: 'monthly', priority: 0.8 },
  { path: '/investors', changefreq: 'monthly', priority: 0.8 },
  // The NRI Corner and the Channel Partner programme are one page each; their
  // former sub-pages are #sections of them and redirect there, so they are
  // deliberately NOT listed as separate URLs.
  { path: '/nri', changefreq: 'monthly', priority: 0.8 },
  { path: '/channel-partners', changefreq: 'monthly', priority: 0.7 },

  // The blog index. Each post is added below from the blog data, so a new
  // post appears in the sitemap the moment its data file is imported.
  { path: '/blog', changefreq: 'weekly', priority: 0.7 },
];

/**
 * Static pages + one URL per project, auto-updating as the data files change —
 * which is what keeps "no orphan pages" true as the site grows.
 */
export function allRoutes() {
  return [
    ...STATIC_ROUTES,
    ...projectsList.map((p) => ({
      path: `/projects/${p.slug}`,
      changefreq: 'monthly',
      // trending projects are the ones actively being sold
      priority: p.status === 'trending' ? 0.8 : 0.6,
    })),
    ...BLOG_POSTS.map((post) => ({
      path: post.path,
      changefreq: 'monthly',
      priority: 0.6,
      lastmod: post.dateModified || post.datePublished,
    })),
  ];
}
