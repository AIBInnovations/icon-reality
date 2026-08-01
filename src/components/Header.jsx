import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEnquiry } from '../enquiry/enquiryContext';
import './Header.css';

// Long enough for the incoming route to render and lay out before a cross-page
// anchor jump. Was 1500 to clear the old route loader's hold + slide-up; with
// the loader gone it only has to outlast the render.
const ROUTE_SETTLE_MS = 400;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { openEnquiry } = useEnquiry();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Backstop: close the drawer on route change. Not sufficient on its own —
  // clicking a link for the page you're already on (or the #testimonials
  // anchor) never changes pathname, so the effect never fires and the sheet
  // stays open. Every link closes it directly via closeMenu instead.
  useEffect(() => { setOpen(false); }, [location.pathname]);

  const closeMenu = () => setOpen(false);

  // The anchor lives on Home and About. Jump smoothly through Lenis when it's
  // on the current page; otherwise route Home first and scroll once the
  // RouteTransition loader has handed over.
  const goToTestimonials = (e) => {
    e.preventDefault();
    setOpen(false);

    const scrollToIt = () => {
      const el = document.getElementById('testimonials');
      if (!el) return;
      if (window.lenis) window.lenis.scrollTo(el, { offset: -90 });
      else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (document.getElementById('testimonials')) scrollToIt();
    else { navigate('/'); setTimeout(scrollToIt, ROUTE_SETTLE_MS); }
  };

  const openForm = () => { setOpen(false); openEnquiry({ source: 'Header' }); };

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="site-header__inner">
        <nav className="site-header__nav">
          <Link to="/about" onClick={closeMenu}>About</Link>
          <Link to="/projects" onClick={closeMenu}>Projects</Link>
          <Link to="/contact" onClick={closeMenu}>Contact</Link>
        </nav>

        <Link to="/" className="site-header__brand" aria-label="Icon Realty home" onClick={closeMenu}>
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
              <Link to="/" onClick={closeMenu}>Home</Link>
              <Link to="/about" onClick={closeMenu}>About</Link>
              <Link to="/projects" onClick={closeMenu}>Projects</Link>
              <Link to="/contact" onClick={closeMenu}>Contact</Link>
              <a href="#testimonials" onClick={goToTestimonials}>Testimonials</a>
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
