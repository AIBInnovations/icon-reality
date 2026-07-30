import { Link } from 'react-router-dom';
import './Breadcrumbs.css';

/**
 * Visible breadcrumb trail. Pair it with breadcrumbSchema(trail) on the same
 * page so the markup and the JSON-LD always describe the same path.
 *
 * trail: [{ name, path }] — the last item is the current page and its `path`
 * is ignored (rendered as plain text, per Google's guidance).
 *
 * variant="top" when the page has no hero above the trail, so it needs to clear
 * the fixed floating header itself.
 */
export default function Breadcrumbs({ trail = [], variant }) {
  if (trail.length < 2) return null;

  return (
    <nav
      className={`breadcrumbs ${variant === 'top' ? 'breadcrumbs--top' : ''}`}
      aria-label="Breadcrumb"
    >
      <div className="container">
        <ol className="breadcrumbs__list">
          {trail.map((crumb, i) => {
            const isLast = i === trail.length - 1;
            return (
              <li key={crumb.path || crumb.name} className="breadcrumbs__item">
                {isLast || !crumb.path ? (
                  <span className="breadcrumbs__current" aria-current="page">{crumb.name}</span>
                ) : (
                  <>
                    <Link to={crumb.path} className="breadcrumbs__link">{crumb.name}</Link>
                    <span className="breadcrumbs__sep" aria-hidden>/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
