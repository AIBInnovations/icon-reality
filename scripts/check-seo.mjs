import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { allRoutes } from '../src/seo/routes.js';
import { SITE_URL } from '../src/seo/site.js';
import { BLOG_POSTS, POST_SLUGS, postsBySlug } from '../src/data/blog/index.js';
import { escapeHtml } from '../src/data/blog/rich.js';

const dir = process.argv[2] || 'dist';
const indexable = !process.argv.includes('--noindex');
const sitemap = await readFile(join(dir, 'sitemap.xml'), 'utf8');
const robots = await readFile(join(dir, 'robots.txt'), 'utf8');
assert.ok(robots.includes(indexable ? `Sitemap: ${SITE_URL}/sitemap.xml` : 'Disallow: /'));

const routes = allRoutes();
const paths = new Set(routes.map((route) => route.path));
assert.equal(new Set(POST_SLUGS).size, POST_SLUGS.length, 'Blog slugs must be unique');
assert.deepEqual([...POST_SLUGS].sort(), BLOG_POSTS.map((post) => post.slug).sort(), 'Blog registry and routes must agree');

for (const route of routes) {
  const html = await readFile(join(dir, route.path.slice(1), 'index.html'), 'utf8');
  const count = (pattern) => [...html.matchAll(pattern)].length;
  assert.equal(count(/<h1\b/gi), 1, `${route.path}: expected one H1`);
  assert.equal(count(/<title>/gi), 1, `${route.path}: expected one title`);
  assert.equal(count(/<meta\s+name="description"/gi), 1, `${route.path}: expected one description`);
  assert.equal(count(/<link\s+rel="canonical"/gi), 1, `${route.path}: expected one canonical`);
  assert.ok(html.includes(`href="${SITE_URL}${route.path}"`), `${route.path}: missing canonical URL`);
  assert.ok(html.includes(`<meta name="robots" content="${indexable ? 'index, follow' : 'noindex, nofollow'}"`), `${route.path}: incorrect robots`);
  assert.ok(sitemap.includes(`<loc>${SITE_URL}${route.path}</loc>`), `${route.path}: missing from sitemap`);
  for (const [tag] of html.matchAll(/<img\b[^>]*>/gi)) {
    assert.match(tag, /\balt="[^"]*"/, `${route.path}: missing image alt attribute`);
  }
  const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
    .map(([, json]) => JSON.parse(json));

  const post = postsBySlug[route.path.replace(/^\/blog\//, '')];
  if (post) {
    assert.ok(html.includes(`<title>${escapeHtml(post.metaTitle)}</title>`), `${route.path}: incorrect supplied meta title`);
    assert.ok(html.includes(`<meta name="description" content="${escapeHtml(post.metaDescription)}"`), `${route.path}: incorrect supplied meta description`);

    // Count contextual article anchors, excluding the header, contents and cards.
    const links = [...html.matchAll(/<a\b[^>]*class="article__link"[^>]*href="([^"]+)"/g)]
      .map(([, href]) => href)
      .filter((href) => href.startsWith('/') && !href.startsWith('//'));
    assert.ok(links.length >= 6, `${route.path}: expected at least six contextual internal links, got ${links.length}`);
    for (const target of ['/', '/about', '/contact']) {
      assert.ok(links.includes(target), `${route.path}: missing contextual link to ${target}`);
    }
    assert.ok(links.some((href) => href.startsWith('/projects/')), `${route.path}: missing a contextual project link`);
    for (const href of links) {
      const { pathname } = new URL(href, SITE_URL);
      assert.ok(paths.has(pathname), `${route.path}: broken internal link ${href}`);
    }

    let previousLevel = 0;
    for (const [, level] of html.matchAll(/<h([1-4])\b/gi)) {
      const nextLevel = Number(level);
      assert.ok(nextLevel <= previousLevel + 1, `${route.path}: heading skips from H${previousLevel} to H${nextLevel}`);
      previousLevel = nextLevel;
    }
    for (const [tag] of html.matchAll(/<img\b[^>]*>/gi)) {
      if (/\baria-hidden="true"/.test(tag)) continue;
      assert.match(tag, /\balt="[^"]+"/, `${route.path}: blog image needs descriptive alt text`);
    }

    const article = schemas.find((schema) => schema['@type'] === 'BlogPosting');
    assert.ok(article, `${route.path}: missing BlogPosting schema`);
    assert.equal(article.mainEntityOfPage['@id'], `${SITE_URL}${route.path}`, `${route.path}: schema URL differs from canonical`);
    assert.equal(article.description, post.schemaDescription || post.metaDescription || post.excerpt, `${route.path}: incorrect schema description`);
    assert.ok(!/ADD-[A-Z-]+|YYYY-MM-DD/.test(JSON.stringify(article)), `${route.path}: schema contains brief placeholders`);

    if (post.faqs?.length) {
      const faq = schemas.find((schema) => schema['@type'] === 'FAQPage');
      assert.ok(faq, `${route.path}: missing FAQPage schema`);
      assert.deepEqual(faq.mainEntity.map((item) => ({ q: item.name, a: item.acceptedAnswer.text })), post.faqs, `${route.path}: FAQ schema differs from visible FAQs`);
    }
  }
}
console.log(`SEO checks passed for ${routes.length} pages, including contextual links and schema for ${BLOG_POSTS.length} posts (${indexable ? 'indexable' : 'noindex'}).`);
