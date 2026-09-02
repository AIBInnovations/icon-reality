import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ArticleBody from '../components/ArticleBody';
import FAQSection from '../components/FAQSection';
import MediaFigure from '../components/MediaFigure';
import Reveal from '../components/Reveal';
import CtaBand from '../components/CtaBand';
import NotFoundPage from './NotFoundPage';
import Seo from '../seo/Seo';
import { breadcrumbSchema, blogPostingSchema, faqSchema } from '../seo/schema';
import { LEAD_INTENTS } from '../services/leads';
import { postsBySlug, relatedPosts } from '../data/blog';
import { projectsBySlug } from '../data/projects';
import './BlogPostPage.css';

/** 2026-08-24 → 24 August 2026. Fixed locale: the date must read the same for
 *  every visitor and match the ISO date in the BlogPosting schema. */
const formatDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  });

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = postsBySlug[slug];

  // A real 404 for an unknown slug, not a redirect to the index — the same
  // choice the project detail page and the NRI topic redirects make.
  if (!post) return <NotFoundPage />;

  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post.cardTitle || post.title },
  ];

  const others = relatedPosts(post.slug);
  // Short posts skip the contents list, and the layout drops to one centred
  // column. Driven by a class rather than :has(), so the fallback is a real
  // rule everywhere instead of a selector some browsers ignore.
  const hasToc = post.toc.length > 2;
  const projects = (post.relatedProjects || []).map((s) => projectsBySlug[s]).filter(Boolean);

  return (
    <>
      <Seo
        title={post.metaTitle}
        exactTitle
        description={post.metaDescription}
        path={post.path}
        image={post.image}
        type="article"
        jsonLd={[
          breadcrumbSchema(trail),
          blogPostingSchema(post),
          faqSchema(post.faqs),
        ]}
      />

      <article className="post">
        {/* ---------- header ----------
            The post title is the page's only <h1>. It is set in sentence case
            rather than PageHero's uppercase display: these headlines are
            questions, and a 120px uppercase question reads as a banner, not as
            an article. Everything else about the header (eyebrow colour, lede
            measure, banner frame) matches PageHero. */}
        <header className="post__head">
          <div className="container post__head-inner">
            <Reveal as="span" className="eyebrow post__eyebrow">{post.category}</Reveal>

            <Reveal as="h1" className="post__title" delay={0.05} y={30}>{post.title}</Reveal>

            <Reveal as="p" className="post__lede" delay={0.1}>{post.excerpt}</Reveal>

            <Reveal as="p" className="post__meta" delay={0.15}>
              <time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time>
              <span className="post__meta-sep" aria-hidden>/</span>
              <span>{post.readingMinutes} min read</span>
            </Reveal>
          </div>
        </header>

        {post.image && (
          <div className="post__banner">
            <div className="post__banner-shell">
              <img
                src={post.image}
                alt={post.imageAlt || ''}
                /* the LCP image on this route */
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
              {post.imageCredit && (
                <span className="post__banner-credit">{post.imageCredit}</span>
              )}
            </div>
          </div>
        )}

        <Breadcrumbs trail={trail} />

        <div className={`container post__layout ${hasToc ? '' : 'post__layout--no-toc'}`}>
          {/* ---------- contents ----------
              An <aside> beside the column on desktop, above it on mobile. Every
              entry points at a generated heading id, so it cannot drift out of
              sync with the article (see normalise() in data/blog). */}
          {hasToc && (
            <aside className="post__toc" aria-labelledby="post-toc-title">
              <span className="post__toc-title" id="post-toc-title">In this article</span>
              <nav>
                <ol className="post__toc-list">
                  {post.toc.map((item) => (
                    <li key={item.id}>
                      {/* A router <Link> to the hash, not a bare <a> and not
                          a hand-rolled scroll: that routes the click through
                          RouteTransition, the one place on this site that
                          knows how to move Lenis to a section and correct
                          itself once the reveals have settled. A raw anchor
                          jump fights Lenis (CLAUDE.md §2) and lands short. */}
                      <Link to={{ hash: `#${item.id}` }}>{item.text}</Link>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
          )}

          <div className="post__column">
            {/* The direct answer. Kept first and kept short: this is the
                passage a featured snippet or an AI overview lifts, and it is
                the same wording as the brief's answer paragraph. */}
            {post.answer && (
              <Reveal className="post__answer" y={20}>
                <span className="post__answer-label">In short</span>
                <p>{post.answer}</p>
              </Reveal>
            )}

            <ArticleBody blocks={post.blocks} />

            {/* ---------- related projects ---------- */}
            {projects.length > 0 && (
              <section className="post__projects" aria-labelledby="post-projects-title">
                <h2 className="post__section-title" id="post-projects-title">
                  Projects mentioned in this article
                </h2>
                <ul className="post__project-list">
                  {projects.map((p) => (
                    <li key={p.slug}>
                      <Link to={`/projects/${p.slug}`} className="post__project">
                        <MediaFigure
                          src={p.hero_image}
                          alt={p.name}
                          ratio="16 / 10"
                          className="post__project-media"
                        />
                        <span className="post__project-name">{p.name}</span>
                        <span className="post__project-loc">{p.location}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        <FAQSection
          items={post.faqs}
          eyebrow="FAQ"
          heading="Questions buyers ask."
          className="post__faq"
        />

        {/* ---------- keep reading ---------- */}
        {others.length > 0 && (
          <section className="post__more" aria-labelledby="post-more-title">
            <div className="container">
              <h2 className="post__section-title post__more-title" id="post-more-title">
                Keep reading
              </h2>
              <ul className="post__more-list">
                {others.map((other) => (
                  <li key={other.slug}>
                    <Link to={other.path} className="post__more-card">
                      <MediaFigure src={other.image} alt={other.imageAlt} ratio="16 / 10" />
                      <span className="post__more-cat eyebrow">{other.category}</span>
                      <span className="post__more-name">{other.title}</span>
                      <span className="post__more-excerpt">{other.excerpt}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </article>

      <CtaBand
        eyebrow="Site visit"
        heading="See the plot before you decide anything."
        body="Every point in this article is easier to check standing on the land. Pick a date and we will walk the layout with you."
        primaryLabel="Book a Site Visit"
        image={post.image}
        enquiry={{
          intent: LEAD_INTENTS.SITE_VISIT,
          source: `Blog: ${post.cardTitle || post.title}`,
          eyebrow: 'Site visit',
          heading: 'Book a site visit.',
          fields: ['name', 'phone', 'preferredDate', 'preferredTime'],
          submitLabel: 'Request a site visit',
        }}
      />
    </>
  );
}
