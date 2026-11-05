// Build-time SEO assets:
//   • sitemap.xml   — regenerated from src/seo/routes.js on every build, so it
//                     auto-updates when a project is added or removed
//   • robots.txt    — points at the sitemap; blocks indexing on non-production
//   • index.html    — site-wide JSON-LD (Organization, WebSite) and Open Graph
//                     defaults injected as STATIC markup, so crawlers and
//                     social scrapers that don't execute JavaScript still see
//                     them. Per-route tags are layered on top by <Seo>.
//   • all routes    — real HTML from existing React components. Blog URLs
//                     use the established block renderer, carrying each post's
//                     title, description, canonical, Open Graph, BlogPosting
//                     and FAQPage JSON-LD and the article text. Google renders
//                     JavaScript and would see <Seo>'s runtime tags anyway;
//                     most other crawlers, including the ones behind AI
//                     answers, do not. Vercel matches the filesystem before it
//                     applies the SPA rewrite in vercel.json, so these files
//                     are what /blog and /blog/<slug> actually serve, and
//                     React takes over from there.
//
// Everything reads the same src/seo/* modules the app does, so there is one
// source of truth for the domain and the business details.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { createServer } from 'vite';

/**
 * @param {object} opts
 * @param {boolean} opts.indexable  false on staging → noindex + Disallow: /
 */
export function seoAssets({ indexable = true } = {}) {
  let siteUrl = '';
  let staticHead = '';

  return {
    name: 'seo-assets',
    apply: 'build',

    async buildStart() {
      // Loaded here (not at module scope) so Vite resolves the app's own ESM.
      const { SITE_URL, DEFAULT_TITLE, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, SITE_NAME } =
        await import('../src/seo/site.js');
      const { organisationSchema, websiteSchema } = await import('../src/seo/schema.js');

      siteUrl = SITE_URL;

      const ogImage = `${SITE_URL}${DEFAULT_OG_IMAGE}`;
      const ld = (obj) =>
        `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

      // Google Search Console ownership token, meta-tag method. Set
      // VITE_GSC_VERIFICATION in the Vercel dashboard; only rendered when set.
      const gscToken = process.env.VITE_GSC_VERIFICATION;
      const esc = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

      staticHead = [
        ...(gscToken ? [`<meta name="google-site-verification" content="${esc(gscToken)}" />`] : []),
        `<link rel="canonical" href="${SITE_URL}/" />`,
        `<meta name="robots" content="${indexable ? 'index, follow' : 'noindex, nofollow'}" />`,
        `<meta property="og:site_name" content="${SITE_NAME}" />`,
        `<meta property="og:locale" content="en_IN" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:title" content="${esc(DEFAULT_TITLE)}" />`,
        `<meta property="og:description" content="${esc(DEFAULT_DESCRIPTION)}" />`,
        `<meta property="og:url" content="${SITE_URL}/" />`,
        `<meta property="og:image" content="${ogImage}" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${esc(DEFAULT_TITLE)}" />`,
        `<meta name="twitter:description" content="${esc(DEFAULT_DESCRIPTION)}" />`,
        `<meta name="twitter:image" content="${ogImage}" />`,
        ld(organisationSchema()),
        ld(websiteSchema()),
      ].join('\n    ');
    },

    transformIndexHtml(html) {
      return html.replace('</head>', `  ${staticHead}\n  </head>`);
    },

    async generateBundle() {
      const { allRoutes } = await import('../src/seo/routes.js');
      const routes = allRoutes();

      const sitemap =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        routes
          .map(
            (r) =>
              `  <url>\n` +
              `    <loc>${siteUrl}${r.path === '/' ? '/' : r.path}</loc>\n` +
              (r.lastmod ? `    <lastmod>${r.lastmod}</lastmod>\n` : '') +
              `    <changefreq>${r.changefreq}</changefreq>\n` +
              `    <priority>${r.priority.toFixed(1)}</priority>\n` +
              `  </url>`
          )
          .join('\n') +
        `\n</urlset>\n`;

      const robots = indexable
        ? `# Icon Realty — production\n` +
          `User-agent: *\n` +
          `Allow: /\n\n` +
          `# no search, filter or login URLs exist on this site; /api is not content\n` +
          `Disallow: /api/\n\n` +
          `Sitemap: ${siteUrl}/sitemap.xml\n`
        : `# non-production build — keep this deployment out of the index\n` +
          `User-agent: *\n` +
          `Disallow: /\n`;

      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots });

      this.info(`seo-assets: sitemap.xml with ${routes.length} URLs, robots.txt (${indexable ? 'indexable' : 'noindex'})`);
    },

    /**
     * Static HTML for every indexable URL.
     *
     * Runs in writeBundle, not generateBundle, because it needs the FINISHED
     * index.html: the hashed script and stylesheet tags in it are what boot the
     * app on these URLs, and the site-wide JSON-LD is already inside it.
     *
     * Each file is that shell with the head's page-level tags swapped for the
     * post's own and the article dropped into #root. React clears #root when it
     * mounts, so a visitor sees the normal app and a crawler that never runs
     * the script still gets the full article and its schema.
     */
    async writeBundle(options) {
      const outDir = options.dir;
      const shell = await readFile(join(outDir, 'index.html'), 'utf8');

      const { blogStaticPages, postWordCount } = await import('../src/seo/blogHtml.js');
      const { BLOG_POSTS } = await import('../src/data/blog/index.js');

      const pages = blogStaticPages({ indexable });
      const { allRoutes } = await import('../src/seo/routes.js');
      const { SITE_NAME, absoluteUrl } = await import('../src/seo/site.js');
      const { escapeHtml: esc } = await import('../src/data/blog/rich.js');
      // A separate Vite module runner handles JSX/CSS without changing the
      // browser build or introducing a production rendering service.
      const renderer = await createServer({
        server: { middlewareMode: true, watch: null },
        appType: 'custom',
      });
      try {
        const { renderPage } = await renderer.ssrLoadModule('/src/seo/render.jsx');
        for (const route of allRoutes().filter((r) => !r.path.startsWith('/blog'))) {
          const { body, metadata: m } = renderPage(route.path);
          const url = absoluteUrl(m.path);
          const image = absoluteUrl(m.image);
          const blocks = m.jsonLd ? (Array.isArray(m.jsonLd) ? m.jsonLd : [m.jsonLd]) : [];
          const head = [
            `<title>${esc(m.title)}</title>`,
            `<meta name="description" content="${esc(m.description)}" />`,
            `<meta name="robots" content="${indexable && !m.noindex ? 'index, follow' : 'noindex, nofollow'}" />`,
            `<link rel="canonical" href="${esc(url)}" />`,
            ...Object.entries({ 'site_name': SITE_NAME, locale: 'en_IN', type: m.type, title: m.title, description: m.description, url, image })
              .map(([key, value]) => `<meta property="og:${key}" content="${esc(value)}" />`),
            ...Object.entries({ card: 'summary_large_image', title: m.title, description: m.description, image })
              .map(([key, value]) => `<meta name="twitter:${key}" content="${esc(value)}" />`),
            ...blocks.filter(Boolean).map((block) => `<script type="application/ld+json" data-seo-jsonld>${JSON.stringify(block).replace(/</g, '\\u003c')}</script>`),
          ].join('\n');
          pages.push({ file: route.path === '/' ? 'index.html' : `${route.path.slice(1)}/index.html`, head, body });
        }
      } finally {
        await renderer.close();
      }

      for (const page of pages) {
        // Strip the tags this page is about to replace. Leaving any of them
        // behind would ship two titles or two canonicals, which is worse than
        // shipping none, so the result is asserted below.
        let html = shell
          .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
          .replace(/<meta\s+name="description"[^>]*>\s*/gi, '')
          .replace(/<meta\s+name="robots"[^>]*>\s*/gi, '')
          .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '')
          .replace(/<meta\s+property="og:[^"]*"[^>]*>\s*/gi, '')
          .replace(/<meta\s+name="twitter:[^"]*"[^>]*>\s*/gi, '');

        html = html.replace('</head>', `  ${page.head}\n  </head>`);

        const rootTag = '<div id="root"></div>';
        if (!html.includes(rootTag)) {
          this.error(`seo-assets: could not find ${rootTag} in index.html; prerender aborted`);
        }
        html = html.replace(rootTag, `<div id="root">${page.body}</div>`);

        for (const [label, pattern] of [
          ['<title>', /<title>/gi],
          ['canonical', /rel="canonical"/gi],
          ['description', /name="description"/gi],
        ]) {
          const hits = (html.match(pattern) || []).length;
          if (hits !== 1) {
            this.error(
              `seo-assets: ${page.file} ended up with ${hits} ${label} tags (expected 1). ` +
              `The head-stripping patterns no longer match index.html.`
            );
          }
        }

        const file = join(outDir, page.file);
        await mkdir(dirname(file), { recursive: true });
        await writeFile(file, html, 'utf8');
      }

      const words = BLOG_POSTS.reduce((n, p) => n + postWordCount(p), 0);
      this.info(
        `seo-assets: prerendered ${pages.length} pages ` +
        `(${BLOG_POSTS.length} posts, ${words} words) with BlogPosting + FAQPage JSON-LD`
      );
    },
  };
}
