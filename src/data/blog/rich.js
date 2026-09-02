// Shared helpers for the blog's content model. Deliberately free of React, CSS
// and browser APIs: the build-time prerenderer (src/seo/blogHtml.js) imports
// this file in Node, and the page components import it in the browser, so the
// two renderers can never disagree about what a block means.

/**
 * RichText — the inline content model.
 *
 *   'plain sentence'                                a bare string
 *   ['text ', { text: 'anchor', to: '/projects' }]  mixed inline nodes
 *
 * Inline node shapes:
 *   { text, to }    internal link  → <Link> in React, <a href> in the prerender
 *   { text, href }  external link  → opens in a new tab, rel="noreferrer"
 *   { text, b }     bold, no link
 *
 * The SEO brief asks for the targeted keywords to be bold AND anchored, which
 * is what the `to` nodes are: .article__link renders bold + underlined, so one
 * node covers both requirements instead of nesting <strong> inside <a>.
 */

/** RichText → plain text. Used for reading time, excerpts and JSON-LD. */
export function plain(node) {
  if (node == null || node === false) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(plain).join('');
  return node.text || '';
}

/** "What Should You Check?" → "what-should-you-check". Heading ids and slugs. */
export function slugify(text) {
  return String(text)
    .toLowerCase()
    // en/em dashes and the rest of the punctuation become word breaks, so
    // "Indore–Nagpur Highway" and "Indore Nagpur Highway" produce one id
    .replace(/[‐-―]/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Escape a string for interpolation into HTML. Prerender only. */
export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
