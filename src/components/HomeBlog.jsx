import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import MediaFigure from './MediaFigure';
import { BLOG_POSTS, BLOG_INTRO } from '../data/blog';
import './HomeBlog.css';

/**
 * The homepage's door into the blog.
 *
 * Three posts, not four: this is a teaser, and the fourth is one click away
 * behind "All articles". Deliberately a different shape from AudiencePaths
 * above it — a left-aligned head with the index link opposite, and short
 * landscape cards rather than four tall portrait ones, so two card sections
 * near the foot of the page do not read as the same section twice.
 *
 * HomePage loads this lazily. It is the only homepage section that pulls in
 * the blog data, and that chunk must not be downloading while the hero frame
 * sequence still is (CLAUDE.md §3).
 */
const TEASER_COUNT = 3;

export default function HomeBlog() {
  const posts = BLOG_POSTS.slice(0, TEASER_COUNT);
  if (!posts.length) return null;

  return (
    <section className="home-blog">
      <div className="container">
        <div className="home-blog__head">
          <div className="home-blog__intro">
            <Reveal as="span" className="eyebrow home-blog__eyebrow">Blog</Reveal>
            <Reveal as="h2" className="display home-blog__heading" delay={0.05}>
              Questions worth asking first.
            </Reveal>
            <Reveal as="p" className="home-blog__lede" delay={0.1}>{BLOG_INTRO}</Reveal>
          </div>

          <Reveal className="home-blog__all" delay={0.15}>
            <Link to="/blog" className="home-blog__all-link">
              All articles
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </Reveal>
        </div>

        <ul className="home-blog__grid">
          {posts.map((post, i) => (
            <Reveal as="li" key={post.slug} delay={Math.min(i, 3) * 0.06}>
              <Link to={post.path} className="home-blog__card">
                <MediaFigure src={post.image} alt={post.imageAlt} ratio="16 / 10" />
                {/* the text is wrapped, not left as siblings of the figure:
                    the tablet layout turns the last card sideways, and without
                    this the category, title, excerpt and read time would each
                    become their own column beside the photograph */}
                <div className="home-blog__body">
                  <span className="home-blog__cat">{post.category}</span>
                  <h3 className="home-blog__title">{post.title}</h3>
                  <p className="home-blog__excerpt">{post.excerpt}</p>
                  <span className="home-blog__meta">{post.readingMinutes} min read</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
