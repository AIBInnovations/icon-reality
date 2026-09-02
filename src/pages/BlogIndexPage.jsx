import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import Breadcrumbs from '../components/Breadcrumbs';
import MediaFigure from '../components/MediaFigure';
import Reveal from '../components/Reveal';
import CtaBand from '../components/CtaBand';
import Seo from '../seo/Seo';
import { breadcrumbSchema, blogSchema, webPageSchema } from '../seo/schema';
import { LEAD_INTENTS } from '../services/leads';
import { BLOG_POSTS, BLOG_INTRO } from '../data/blog';
import './BlogIndexPage.css';

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Blog', path: '/blog' },
];

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
  });

export default function BlogIndexPage() {
  const [lead, ...rest] = BLOG_POSTS;

  return (
    <>
      <Seo
        title="Blog: guides to buying residential plots in Indore"
        description="Icon Realty's blog: what to check before buying a residential plot in Indore, the city's best plotting corridors, gated plotted developments versus open plots, and our projects."
        path="/blog"
        image={lead?.image}
        jsonLd={[
          breadcrumbSchema(TRAIL),
          webPageSchema('CollectionPage', {
            name: 'Blog',
            description: BLOG_INTRO,
            path: '/blog',
          }),
          blogSchema(BLOG_POSTS),
        ]}
      />

      <PageHero
        eyebrow="Blog"
        title={['Before you', 'buy the land.']}
        lede={BLOG_INTRO}
      />

      <Breadcrumbs trail={TRAIL} />

      {/* ---------- lead article ----------
          The first post gets the full-width editorial treatment and the rest
          run as a grid below it, so the index reads as a front page rather
          than four identical cards. */}
      {lead && (
        <section className="blog-lead">
          <div className="container">
            <Reveal>
              <Link to={lead.path} className="blog-lead__card">
                <MediaFigure
                  src={lead.image}
                  alt={lead.imageAlt}
                  credit={lead.imageCredit}
                  ratio="16 / 9"
                  className="blog-lead__media"
                  eager
                />
                <div className="blog-lead__body">
                  <span className="eyebrow blog-lead__cat">{lead.category}</span>
                  <h2 className="blog-lead__title">{lead.title}</h2>
                  <p className="blog-lead__excerpt">{lead.excerpt}</p>
                  <span className="blog-lead__meta">
                    <time dateTime={lead.datePublished}>{formatDate(lead.datePublished)}</time>
                    <span aria-hidden>/</span>
                    <span>{lead.readingMinutes} min read</span>
                  </span>
                  <span className="blog-lead__go">
                    Read the guide
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
                      <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ---------- the rest ---------- */}
      {rest.length > 0 && (
        <section className="blog-list">
          <div className="container">
            <ul className="blog-list__grid">
              {rest.map((post, i) => (
                <Reveal as="li" key={post.slug} delay={Math.min(i, 4) * 0.06}>
                  <Link to={post.path} className="blog-card">
                    <MediaFigure src={post.image} alt={post.imageAlt} ratio="16 / 10" />
                    <span className="eyebrow blog-card__cat">{post.category}</span>
                    <h2 className="blog-card__title">{post.title}</h2>
                    <p className="blog-card__excerpt">{post.excerpt}</p>
                    <span className="blog-card__meta">
                      <time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time>
                      <span aria-hidden>/</span>
                      <span>{post.readingMinutes} min read</span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand
        eyebrow="Site visit"
        heading="Reading only gets you so far."
        body="Walk the layout, check the approach road, stand on the plot. We will keep the paperwork open while you do."
        primaryLabel="Book a Site Visit"
        image={lead?.image}
        enquiry={{
          intent: LEAD_INTENTS.SITE_VISIT,
          source: 'Blog index',
          eyebrow: 'Site visit',
          heading: 'Book a site visit.',
          fields: ['name', 'phone', 'preferredDate', 'preferredTime'],
          submitLabel: 'Request a site visit',
        }}
      />
    </>
  );
}
