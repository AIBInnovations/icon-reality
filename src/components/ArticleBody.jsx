import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import MediaFigure from './MediaFigure';
import { projectsBySlug } from '../data/projects';
import './ArticleBody.css';

/**
 * Renders a blog post's block model (src/data/blog/index.js) as an article.
 *
 * Three things this component is responsible for and a page is not:
 *
 *  1. Heading levels. The post title is the page's only <h1>; every 'h2' block
 *     here is an <h2>, every 'h3' an <h3>, every 'h4' an <h4>, in document
 *     order and with no level skipped (CLAUDE.md §9).
 *  2. Inline anchors. A `{ text, to }` node is the SEO brief's bolded target
 *     keyword: it renders as a bold, underlined internal link, so the keyword
 *     and the anchor are one element rather than a <strong> wrapped in an <a>.
 *  3. Wide content. Tables scroll inside their own container instead of pushing
 *     the page sideways (CLAUDE.md §7).
 */

/** RichText → React. Strings pass through; objects become links or bold runs. */
function RichText({ nodes }) {
  if (nodes == null) return null;
  const list = Array.isArray(nodes) ? nodes : [nodes];

  return list.map((node, i) => {
    if (typeof node === 'string') return node;
    if (node.to) {
      return (
        <Link key={i} to={node.to} className="article__link">{node.text}</Link>
      );
    }
    if (node.href) {
      return (
        <a key={i} href={node.href} target="_blank" rel="noreferrer" className="article__link">
          {node.text}
        </a>
      );
    }
    return <strong key={i} className="article__strong">{node.text}</strong>;
  });
}

/** Project cards, resolved from data/projects.js — never hardcoded here (§4). */
function ProjectLinks({ slugs = [] }) {
  const items = slugs.map((s) => projectsBySlug[s]).filter(Boolean);
  if (!items.length) return null;

  return (
    <ul className="article__projects">
      {items.map((p) => (
        <li key={p.slug}>
          <Link to={`/projects/${p.slug}`} className="article__project">
            <span className="article__project-name">{p.name}</span>
            <span className="article__project-loc">{p.location}</span>
            <span className="article__project-go" aria-hidden>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Block({ block }) {
  switch (block.type) {
    case 'h2':
      return (
        <Reveal as="h2" id={block.id} className="article__h2" y={20}>
          <RichText nodes={block.text} />
        </Reveal>
      );

    case 'h3':
      return (
        <Reveal as="h3" id={block.id} className="article__h3" y={18}>
          <RichText nodes={block.text} />
        </Reveal>
      );

    case 'h4':
      return (
        <Reveal as="h4" id={block.id} className="article__h4" y={16}>
          <RichText nodes={block.text} />
        </Reveal>
      );

    case 'ul':
      return (
        <Reveal as="ul" className="article__ul" y={18}>
          {block.items.map((item, i) => (
            <li key={i}><RichText nodes={item} /></li>
          ))}
        </Reveal>
      );

    case 'ol':
      return (
        <Reveal as="ol" className="article__ol" y={18}>
          {block.items.map((item, i) => (
            <li key={i}><RichText nodes={item} /></li>
          ))}
        </Reveal>
      );

    case 'checklist':
      return (
        <Reveal as="ul" className="article__checklist" y={18}>
          {block.items.map((item, i) => (
            <li key={i}>
              <svg className="article__tick" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M2.5 7.4l3 3 6-6.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span><RichText nodes={item} /></span>
            </li>
          ))}
        </Reveal>
      );

    case 'table':
      return (
        <Reveal className="article__table-wrap" y={18}>
          {/* its own scroll container: a comparison table must never be what
              makes the page scroll sideways on a 320px screen */}
          <div className="article__table-scroll" tabIndex={0} role="group" aria-label={block.caption || 'Comparison table'}>
            <table className="article__table">
              {block.caption && <caption>{block.caption}</caption>}
              <thead>
                <tr>{block.head.map((cell, i) => <th key={i} scope="col"><RichText nodes={cell} /></th>)}</tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, c) => (
                      c === 0
                        ? <th key={c} scope="row"><RichText nodes={cell} /></th>
                        : <td key={c}><RichText nodes={cell} /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      );

    case 'callout':
      return (
        <Reveal as="aside" className="article__callout" y={18}>
          {block.title && <span className="article__callout-title">{block.title}</span>}
          <p><RichText nodes={block.text} /></p>
        </Reveal>
      );

    case 'figure':
      return (
        <Reveal className="article__figure" y={20}>
          <MediaFigure
            src={block.src}
            alt={block.alt}
            credit={block.credit}
            ratio={block.ratio || '16 / 9'}
          />
        </Reveal>
      );

    case 'projects':
      return (
        <Reveal className="article__projects-wrap" y={18}>
          <ProjectLinks slugs={block.slugs} />
        </Reveal>
      );

    case 'p':
    default:
      return (
        <Reveal as="p" className="article__p" y={16}>
          <RichText nodes={block.text} />
        </Reveal>
      );
  }
}

export default function ArticleBody({ blocks = [], className = '' }) {
  if (!blocks.length) return null;
  return (
    <div className={`article ${className}`}>
      {blocks.map((block, i) => <Block key={i} block={block} />)}
    </div>
  );
}
