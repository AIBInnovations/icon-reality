import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEnquiry } from '../enquiry/enquiryContext';
import './Header.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { openEnquiry } = useEnquiry();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close mobile drawer on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  const openForm = () => { setOpen(false); openEnquiry({ source: 'Header' }); };

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="site-header__inner">
        <nav className="site-header__nav">
          <Link to="/about">About</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <Link to="/" className="site-header__brand" aria-label="Icon Realty home">
          <span className="site-header__logo-wrap">
            <img src="/icon-logo.png" alt="Icon Realty" className="site-header__logo" />
            <img src="/icon-logo.png" alt="" aria-hidden="true" className="site-header__logo site-header__logo--white" />
          </span>
        </Link>

        <div className="site-header__actions">
          <button type="button" className="cta" onClick={openForm}>Book a Site Visit</button>
          <button
            className={`hamburger ${open ? 'is-open' : ''}`}
            onClick={() => setOpen(o => !o)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className={`site-header__sheet ${open ? 'is-open' : ''}`}>
        <div className="site-header__sheet-inner">
          <div className="site-header__sheet-col site-header__sheet-col--nav">
            <span className="site-header__sheet-eyebrow">Explore</span>
            <nav>
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/projects">Projects</Link>
              <Link to="/contact">Contact</Link>
              <a href="#testimonials">Testimonials</a>
            </nav>
          </div>

          <div className="site-header__sheet-col site-header__sheet-col--contact">
            <span className="site-header__sheet-eyebrow">Get in touch</span>
            <a href="mailto:iconrealty02@gmail.com" className="site-header__sheet-link">iconrealty02@gmail.com</a>
            <a href="tel:+919425942510" className="site-header__sheet-link">+91 9425 9425 10 / 11</a>
            <p className="site-header__sheet-address">
              Icon Realty<br/>
              Indore, Madhya Pradesh
            </p>
            <button
              type="button"
              className="cta site-header__sheet-cta"
              onClick={openForm}
            >
              Book a Site Visit
            </button>
          </div>
        </div>
      </div>

    </header>
  );
}
