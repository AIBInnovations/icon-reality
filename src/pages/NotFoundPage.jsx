import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Seo from '../seo/Seo';
import './NotFoundPage.css';

/**
 * Real 404. Previously the catch-all route rendered the home page, which makes
 * every mistyped URL look like a valid page to Google (a "soft 404") and lets
 * junk URLs get indexed as duplicates of the homepage.
 */
export default function NotFoundPage() {
  const { pathname } = useLocation();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <section className="notfound">
      <Seo
        title="Page not found"
        description="This page does not exist. Browse Icon Realty's plotted developments in Indore, or get in touch with the team."
        path={pathname}
        noindex
      />

      <div className="container notfound__inner">
        <span className="eyebrow notfound__eyebrow">404</span>

        <h1 className="display notfound__title">
          This address<br />doesn’t exist.
        </h1>

        <p className="notfound__lede">
          The page you’re looking for has moved, or the link was mistyped.
          Everything we’re building is a click away.
        </p>

        <div className="notfound__actions">
          <Link to="/projects" className="cta">Browse projects</Link>
          <Link to="/" className="cta cta--ghost">Back to home</Link>
        </div>

        <div className="notfound__links">
          <span className="notfound__links-title">Popular pages</span>
          <nav className="notfound__links-list">
            <Link to="/projects/oscar-palace">Oscar Palace</Link>
            <Link to="/projects">All projects</Link>
            <Link to="/about">About us</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
      </div>
    </section>
  );
}
