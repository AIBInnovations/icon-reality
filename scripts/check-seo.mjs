import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { allRoutes } from '../src/seo/routes.js';
import { SITE_URL } from '../src/seo/site.js';

const dir = process.argv[2] || 'dist';
const indexable = !process.argv.includes('--noindex');
const sitemap = await readFile(join(dir, 'sitemap.xml'), 'utf8');
const robots = await readFile(join(dir, 'robots.txt'), 'utf8');
assert.ok(robots.includes(indexable ? `Sitemap: ${SITE_URL}/sitemap.xml` : 'Disallow: /'));

for (const route of allRoutes()) {
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
  for (const [, json] of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    JSON.parse(json);
  }
}
console.log(`SEO checks passed for ${allRoutes().length} pages (${indexable ? 'indexable' : 'noindex'}).`);
