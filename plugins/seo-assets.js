// Build-time SEO assets:
//   • sitemap.xml   — regenerated from src/seo/routes.js on every build, so it
//                     auto-updates when a project is added or removed
//   • robots.txt    — points at the sitemap; blocks indexing on non-production
//   • index.html    — site-wide JSON-LD (Organization, WebSite) and Open Graph
//                     defaults injected as STATIC markup, so crawlers and
//                     social scrapers that don't execute JavaScript still see
//                     them. Per-route tags are layered on top by <Seo>.
//
// Everything reads the same src/seo/* modules the app does, so there is one
// source of truth for the domain and the business details.

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

      staticHead = [
        ...(gscToken ? [`<meta name="google-site-verification" content="${gscToken}" />`] : []),
        `<link rel="canonical" href="${SITE_URL}/" />`,
        `<meta name="robots" content="${indexable ? 'index, follow' : 'noindex, nofollow'}" />`,
        `<meta property="og:site_name" content="${SITE_NAME}" />`,
        `<meta property="og:locale" content="en_IN" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:title" content="${DEFAULT_TITLE}" />`,
        `<meta property="og:description" content="${DEFAULT_DESCRIPTION}" />`,
        `<meta property="og:url" content="${SITE_URL}/" />`,
        `<meta property="og:image" content="${ogImage}" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${DEFAULT_TITLE}" />`,
        `<meta name="twitter:description" content="${DEFAULT_DESCRIPTION}" />`,
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
      const lastmod = new Date().toISOString().slice(0, 10);

      const sitemap =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        routes
          .map(
            (r) =>
              `  <url>\n` +
              `    <loc>${siteUrl}${r.path === '/' ? '/' : r.path}</loc>\n` +
              `    <lastmod>${lastmod}</lastmod>\n` +
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
  };
}
