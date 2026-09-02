// The blog, in one place.
//
// Every post is a data file in this folder; nothing about a post's copy,
// keywords, meta tags, FAQs or schema lives in a component (CLAUDE.md §4).
// Two renderers read this model and must stay in agreement:
//
//   src/components/ArticleBody.jsx  the React article, in the browser
//   src/seo/blogHtml.js             static HTML, emitted at build time so
//                                   crawlers that don't run JS still get the
//                                   article, its meta tags and its JSON-LD
//
// ---------------------------------------------------------------------------
// POST SHAPE
// ---------------------------------------------------------------------------
//   slug              URL segment. The post lives at /blog/<slug>.
//   title             the H1, verbatim. Also the BlogPosting headline.
//   cardTitle         short label for listing cards and related-post links
//   category          'Buying guide' | 'Location guide' | 'Projects' | 'Explainer'
//   metaTitle         <title>, from the SEO brief, verbatim
//   metaDescription   <meta name="description">, from the brief, verbatim
//   excerpt           one-sentence summary: listing cards + OG description fallback
//   answer            optional direct-answer paragraph rendered above the intro,
//                     which is the passage AI overviews and featured snippets lift
//   datePublished     ISO date, from the brief
//   dateModified      ISO date
//   image             hero photograph, a real Icon Realty project frame
//   imageAlt          what the photograph shows
//   imageCredit       which project it is, so it is never read as a stock photo
//   keywords          BlogPosting keywords, from the brief
//   relatedProjects   project slugs linked at the foot of the article
//   blocks            the article body, see BLOCK TYPES
//   faqs              [{ q, a }] rendered as the FAQ accordion AND as FAQPage
//                     JSON-LD, so the markup and the schema can never drift
//
// ---------------------------------------------------------------------------
// BLOCK TYPES        (`text`/`items`/cells are RichText, see ./rich.js)
// ---------------------------------------------------------------------------
//   { type: 'p', text }
//   { type: 'h2', text }                 ids are generated, never hand-written
//   { type: 'h3', text }
//   { type: 'h4', text }
//   { type: 'ul', items: [] }
//   { type: 'ol', items: [] }
//   { type: 'checklist', items: [] }     the ✔ list, rendered as a marked list
//   { type: 'table', head: [], rows: [[]] }
//   { type: 'callout', title, text }     a set-apart note or caveat
//   { type: 'figure', src, alt, credit, ratio }
//   { type: 'projects', slugs: [] }      inline project cards
//
// Explicit .js on every import in this file and its dependencies: the build's
// prerenderer loads them with a bare Node `import()` (plugins/seo-assets.js),
// and Node does not do extensionless resolution the way the bundler does.
import { plain, slugify } from './rich.js';
import { POST_SLUGS } from './slugs.js';

export { POST_SLUGS, LEGACY_POST_PATHS } from './slugs.js';

import buyingChecklist from './what-to-check-before-buying-residential-plot-in-indore.js';
import bestAreas from './best-areas-to-buy-residential-plots-in-indore.js';
import topProjects from './top-5-residential-projects-in-indore-by-icon-realty.js';
import gatedVsOpen from './gated-plotted-development-vs-open-plot-indore.js';

/** Reading speed used for the "n min read" line. Nothing else depends on it. */
const WORDS_PER_MINUTE = 220;

const HEADINGS = new Set(['h2', 'h3', 'h4']);

/** Every string in a block, so reading time counts the whole article. */
function blockText(block) {
  switch (block.type) {
    case 'ul':
    case 'ol':
    case 'checklist':
      return block.items.map(plain).join(' ');
    case 'table':
      return [...(block.head || []), ...block.rows.flat()].map(plain).join(' ');
    case 'callout':
      return `${plain(block.title)} ${plain(block.text)}`;
    case 'figure':
    case 'projects':
      return '';
    default:
      return plain(block.text);
  }
}

/**
 * Heading ids are derived, not authored: an id is a public URL once it is in a
 * table of contents or an inbound link (CLAUDE.md §6), and deriving them means
 * the contents list and the heading it points at can never disagree. Collisions
 * get a numeric suffix rather than silently producing two identical anchors.
 */
function normalise(post) {
  const seen = new Map();

  const blocks = post.blocks.map((block) => {
    if (!HEADINGS.has(block.type)) return block;
    const base = slugify(plain(block.text)) || 'section';
    const n = (seen.get(base) || 0) + 1;
    seen.set(base, n);
    return { ...block, id: n === 1 ? base : `${base}-${n}` };
  });

  const words = blocks.map(blockText).join(' ').trim().split(/\s+/).length;

  return {
    ...post,
    blocks,
    path: `/blog/${post.slug}`,
    readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
    /** h2s only: a contents list of every h3 is a wall, not a summary. */
    toc: blocks.filter((b) => b.type === 'h2').map((b) => ({ id: b.id, text: plain(b.text) })),
  };
}

/**
 * Editorial order, which is also newest-first: the four posts publish together,
 * so the listing runs foundational → location → comparison → portfolio rather
 * than sorting four identical dates.
 */
export const BLOG_POSTS = [buyingChecklist, bestAreas, gatedVsOpen, topProjects].map(normalise);

export const postsBySlug = Object.fromEntries(BLOG_POSTS.map((p) => [p.slug, p]));

/** Other posts, in editorial order, for the "keep reading" rail. */
export const relatedPosts = (slug, limit = 3) =>
  BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, limit);

export const BLOG_INTRO =
  "Notes on buying land in Indore: what to verify before you pay, how the city's residential corridors differ, and how a planned plotted development compares with an open plot.";

// Dev-only guard: the redirect list and the loaded posts must describe the same
// articles, or a renamed slug would silently start 404ing at its old URL.
if (import.meta.env?.DEV) {
  const loaded = BLOG_POSTS.map((p) => p.slug).sort().join();
  if (loaded !== [...POST_SLUGS].sort().join()) {
    console.warn('[blog] data/blog/slugs.js is out of sync with the loaded posts');
  }
}
