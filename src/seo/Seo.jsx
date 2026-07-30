import { useEffect } from 'react';
import {
  SITE_NAME,
  TITLE_TEMPLATE,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  absoluteUrl,
} from './site';

/**
 * Per-route document head: title, description, canonical, robots, Open Graph,
 * Twitter card and JSON-LD.
 *
 * Tags are upserted (found and updated, or created) rather than appended, so a
 * route change can never leave two <meta name="description"> or two canonicals
 * behind — a classic SPA SEO bug. JSON-LD blocks are tagged with a data
 * attribute and fully replaced on every route change.
 */

function upsertMeta(attr, key, content) {
  if (content == null || content === '') return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', String(content));
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

const JSONLD_ATTR = 'data-seo-jsonld';

function setJsonLd(blocks) {
  document.head.querySelectorAll(`script[${JSONLD_ATTR}]`).forEach((n) => n.remove());
  blocks
    .filter(Boolean)
    .forEach((block) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute(JSONLD_ATTR, '');
      script.textContent = JSON.stringify(block);
      document.head.appendChild(script);
    });
}

export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  /** Path of THIS page, e.g. "/projects/oscar-palace". Becomes the canonical. */
  path = '/',
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
  jsonLd,
}) {
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  // serialise so the effect re-runs when the schema content actually changes
  const jsonLdKey = JSON.stringify(blocks);

  useEffect(() => {
    const fullTitle = TITLE_TEMPLATE(title);
    const url = absoluteUrl(path);
    const img = absoluteUrl(image);

    document.title = fullTitle;

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    upsertLink('canonical', url);

    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:locale', 'en_IN');
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', img);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', img);

    setJsonLd(JSON.parse(jsonLdKey));
  }, [title, description, path, image, type, noindex, jsonLdKey]);

  return null;
}
