// Static HTML for the blog routes, emitted at build time.
//
// The site is a single-page app: <Seo> writes the title, the meta tags and the
// JSON-LD after React mounts. Google renders JavaScript and sees them; a great
// many other crawlers do not, and the brief asks specifically for the FAQPage
// and BlogPosting markup to be visible for AI overviews. So the build also
// writes a real HTML file per blog URL, with the head tags and the article
// already in it (plugins/seo-assets.js does the writing).
//
// This module is deliberately plain: no React, no CSS, no browser APIs, so it
// runs in Node during the build. It reads the SAME block model the React
// renderer reads (src/components/ArticleBody.jsx), which is what keeps the
// static copy and the rendered copy the same article.
import { plain, escapeHtml } from '../data/blog/rich.js';
import { BLOG_POSTS, BLOG_INTRO } from '../data/blog/index.js';
import { projectsBySlug } from '../data/projects.js';
import { SITE_NAME, TITLE_TEMPLATE, absoluteUrl } from './site.js';
import {
  breadcrumbSchema, blogPostingSchema, blogSchema, faqSchema, webPageSchema,
} from './schema.js';

const esc = escapeHtml;

/* ----------------------------------------------------------------- inline -- */

function inlineHtml(nodes) {
  if (nodes == null) return '';
  const list = Array.isArray(nodes) ? nodes : [nodes];
  return list
    .map((node) => {
      if (typeof node === 'string') return esc(node);
      if (node.to) return `<a class="article__link" href="${esc(node.to)}">${esc(node.text)}</a>`;
      if (node.href) {
        return `<a class="article__link" href="${esc(node.href)}" target="_blank" rel="noreferrer">${esc(node.text)}</a>`;
      }
      return `<strong class="article__strong">${esc(node.text)}</strong>`;
    })
    .join('');
}

const li = (items) => items.map((item) => `<li>${inlineHtml(item)}</li>`).join('');

/* ----------------------------------------------------------------- blocks -- */

function blockHtml(block) {
  switch (block.type) {
    case 'h2':
      return `<h2 class="article__h2" id="${esc(block.id)}">${inlineHtml(block.text)}</h2>`;
    case 'h3':
      return `<h3 class="article__h3" id="${esc(block.id)}">${inlineHtml(block.text)}</h3>`;
    case 'h4':
      return `<h4 class="article__h4" id="${esc(block.id)}">${inlineHtml(block.text)}</h4>`;
    case 'ul':
      return `<ul class="article__ul">${li(block.items)}</ul>`;
    case 'ol':
      return `<ol class="article__ol">${li(block.items)}</ol>`;
    case 'checklist':
      return `<ul class="article__checklist">${li(block.items)}</ul>`;
    case 'table': {
      const head = block.head.map((c) => `<th scope="col">${inlineHtml(c)}</th>`).join('');
      const rows = block.rows
        .map((row) => {
          const cells = row
            .map((cell, i) => (i === 0
              ? `<th scope="row">${inlineHtml(cell)}</th>`
              : `<td>${inlineHtml(cell)}</td>`))
            .join('');
          return `<tr>${cells}</tr>`;
        })
        .join('');
      return (
        `<div class="article__table-wrap"><div class="article__table-scroll"><table class="article__table">` +
        (block.caption ? `<caption>${esc(block.caption)}</caption>` : '') +
        `<thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div></div>`
      );
    }
    case 'callout':
      return (
        `<aside class="article__callout">` +
        (block.title ? `<span class="article__callout-title">${esc(block.title)}</span>` : '') +
        `<p>${inlineHtml(block.text)}</p></aside>`
      );
    case 'figure':
      return (
        `<figure class="media-figure media-figure--rounded article__figure">` +
        `<span class="media-figure__frame"><img src="${esc(block.src)}" alt="${esc(block.alt || '')}" loading="lazy" decoding="async" /></span>` +
        (block.credit ? `<figcaption class="media-figure__credit">${esc(block.credit)}</figcaption>` : '') +
        `</figure>`
      );
    case 'projects': {
      const items = (block.slugs || [])
        .map((s) => projectsBySlug[s])
        .filter(Boolean)
        .map((p) => (
          `<li><a class="article__project" href="/projects/${esc(p.slug)}">` +
          `<span class="article__project-name">${esc(p.name)}</span>` +
          `<span class="article__project-loc">${esc(p.location)}</span></a></li>`
        ))
        .join('');
      return items ? `<ul class="article__projects">${items}</ul>` : '';
    }
    case 'p':
    default:
      return `<p class="article__p">${inlineHtml(block.text)}</p>`;
  }
}

/* ------------------------------------------------------------------- head -- */

const meta = (attr, key, content) =>
  content ? `<meta ${attr}="${esc(key)}" content="${esc(content)}" />` : '';

const ld = (obj) =>
  obj ? `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>` : '';

/**
 * The head block for one blog URL: exactly the tags <Seo> would write at
 * runtime, so the static file and the hydrated page never disagree.
 */
function headHtml({ title, description, path, image, type, blocks, indexable }) {
  const url = absoluteUrl(path);
  const img = absoluteUrl(image);

  return [
    `<title>${esc(title)}</title>`,
    meta('name', 'description', description),
    meta('name', 'robots', indexable ? 'index, follow' : 'noindex, nofollow'),
    `<link rel="canonical" href="${esc(url)}" />`,
    meta('property', 'og:site_name', SITE_NAME),
    meta('property', 'og:locale', 'en_IN'),
    meta('property', 'og:type', type),
    meta('property', 'og:title', title),
    meta('property', 'og:description', description),
    meta('property', 'og:url', url),
    meta('property', 'og:image', img),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', title),
    meta('name', 'twitter:description', description),
    meta('name', 'twitter:image', img),
    ...blocks.map(ld),
  ]
    .filter(Boolean)
    .join('\n    ');
}

/* ------------------------------------------------------------------ pages -- */

const postTrail = (post) => [
  { name: 'Home', path: '/' },
  { name: 'Blog', path: '/blog' },
  { name: post.cardTitle || post.title },
];

const BLOG_TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Blog', path: '/blog' },
];

const crumbHtml = (trail) =>
  `<nav class="breadcrumbs" aria-label="Breadcrumb"><div class="container"><ol class="breadcrumbs__list">` +
  trail
    .map((c, i) => (i === trail.length - 1 || !c.path
      ? `<li class="breadcrumbs__item"><span class="breadcrumbs__current" aria-current="page">${esc(c.name)}</span></li>`
      : `<li class="breadcrumbs__item"><a class="breadcrumbs__link" href="${esc(c.path)}">${esc(c.name)}</a><span class="breadcrumbs__sep" aria-hidden>/</span></li>`))
    .join('') +
  `</ol></div></nav>`;

function postBodyHtml(post) {
  return [
    `<article class="post">`,
    `<header class="post__head"><div class="container post__head-inner">`,
    `<span class="eyebrow post__eyebrow">${esc(post.category)}</span>`,
    `<h1 class="post__title">${esc(post.title)}</h1>`,
    `<p class="post__lede">${esc(post.excerpt)}</p>`,
    `<p class="post__meta"><time datetime="${esc(post.datePublished)}">${esc(post.datePublished)}</time>`,
    `<span class="post__meta-sep" aria-hidden>/</span><span>${post.readingMinutes} min read</span></p>`,
    `</div></header>`,
    post.image
      ? `<div class="post__banner"><div class="post__banner-shell"><img src="${esc(post.image)}" alt="${esc(post.imageAlt || '')}" /></div></div>`
      : '',
    crumbHtml(postTrail(post)),
    `<div class="container post__layout post__layout--no-toc"><div class="post__column">`,
    post.answer ? `<div class="post__answer"><span class="post__answer-label">In short</span><p>${esc(post.answer)}</p></div>` : '',
    `<div class="article">${post.blocks.map(blockHtml).join('')}</div>`,
    `</div></div>`,
    // The FAQ as plain markup rather than the accordion: a crawler that does
    // not run JS still reads every answer, and it matches the FAQPage JSON-LD
    // above it question for question.
    post.faqs?.length
      ? `<section class="faq"><div class="container faq__grid"><div class="faq__head">` +
        `<span class="eyebrow">FAQ</span><h2 class="display faq__heading">Questions buyers ask.</h2></div>` +
        `<div class="faq__list">` +
        post.faqs
          .map((f) => `<div class="faq__item"><h3 class="faq__q">${esc(f.q)}</h3><div class="faq__a"><p>${esc(f.a)}</p></div></div>`)
          .join('') +
        `</div></div></section>`
      : '',
    `</article>`,
  ]
    .filter(Boolean)
    .join('\n');
}

function indexBodyHtml(posts) {
  return [
    `<section class="page-hero page-hero--center"><div class="container page-hero__inner">`,
    `<span class="eyebrow page-hero__eyebrow">Blog</span>`,
    `<h1 class="display page-hero__title">Before you buy the land.</h1>`,
    `<p class="page-hero__lede">${esc(BLOG_INTRO)}</p>`,
    `</div></section>`,
    crumbHtml(BLOG_TRAIL),
    `<section class="blog-list"><div class="container"><ul class="blog-list__grid">`,
    posts
      .map((post) => (
        `<li><a class="blog-card" href="${esc(post.path)}">` +
        (post.image ? `<img src="${esc(post.image)}" alt="${esc(post.imageAlt || '')}" loading="lazy" />` : '') +
        `<span class="eyebrow blog-card__cat">${esc(post.category)}</span>` +
        `<h2 class="blog-card__title">${esc(post.title)}</h2>` +
        `<p class="blog-card__excerpt">${esc(post.excerpt)}</p></a></li>`
      ))
      .join(''),
    `</ul></div></section>`,
  ].join('\n');
}

/**
 * Every blog URL the build should write a static file for.
 *
 * @param {object} opts
 * @param {boolean} opts.indexable  false on staging, matching robots.txt
 * @returns {Array<{ path, file, head, body }>} `file` is relative to the
 *          output dir, e.g. "blog/<slug>/index.html"
 */
export function blogStaticPages({ indexable = true } = {}) {
  const index = {
    path: '/blog',
    file: 'blog/index.html',
    head: headHtml({
      title: TITLE_TEMPLATE('Blog: guides to buying residential plots in Indore'),
      description:
        "Icon Realty's blog: what to check before buying a residential plot in Indore, the city's best plotting corridors, gated plotted developments versus open plots, and our projects.",
      path: '/blog',
      image: BLOG_POSTS[0]?.image,
      type: 'website',
      indexable,
      blocks: [
        breadcrumbSchema(BLOG_TRAIL),
        webPageSchema('CollectionPage', {
          name: 'Blog',
          description: BLOG_INTRO,
          path: '/blog',
        }),
        blogSchema(BLOG_POSTS),
      ],
    }),
    body: indexBodyHtml(BLOG_POSTS),
  };

  const posts = BLOG_POSTS.map((post) => ({
    path: post.path,
    file: `blog/${post.slug}/index.html`,
    head: headHtml({
      // The React page passes exactTitle for the same reason: the brief's meta
      // titles already carry the brand, so no suffix is appended here either.
      title: post.metaTitle,
      description: post.metaDescription,
      path: post.path,
      image: post.image,
      type: 'article',
      indexable,
      blocks: [
        breadcrumbSchema(postTrail(post)),
        blogPostingSchema(post),
        faqSchema(post.faqs),
      ],
    }),
    body: postBodyHtml(post),
  }));

  return [index, ...posts];
}

/** Plain text of a post, for a sanity line in the build log. */
export const postWordCount = (post) =>
  post.blocks.map((b) => plain(b.text)).join(' ').trim().split(/\s+/).length;
