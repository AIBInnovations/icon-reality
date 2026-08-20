import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEnquiry } from '../enquiry/enquiryContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { NAV, childrenOf, navLeft, navRight } from '../data/nav';
import { PRIMARY_PHONE, telHref, EMAIL, ADDRESS } from '../data/contact';
import { LEAD_INTENTS } from '../services/leads';
import './Header.css';

// Long enough for the incoming route to render and lay out before a cross-page
// anchor jump. Was 1500 to clear the old route loader's hold + slide-up; with
// the loader gone it only has to outlast the render.
const ROUTE_SETTLE_MS = 400;
// Grace period before a mega-menu closes, so a diagonal mouse path from the
// trigger to the panel doesn't dismiss it mid-travel.
const MENU_CLOSE_MS = 140;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);              // mobile drawer
  const [openGroup, setOpenGroup] = useState(null);     // mobile accordion
  const [megaMenu, setMegaMenu] = useState(null);       // desktop mega-menu label
  // Which mega panels have ever been opened. The panels sit in the DOM so they
  // can animate, and a hidden panel's <img> is still downloaded by the browser
  // — that was ~1.2 MB of dropdown photography fetched on every page load, on
  // every route, for menus most visitors never open. Contents are rendered on
  // first open and kept mounted after, so re-opening stays instant.
  const [primedMenus, setPrimedMenus] = useState(() => new Set());
  const closeTimer = useRef(null);
  const { openEnquiry } = useEnquiry();
  // Above this width the top bar shows the full navigation with mega-menus, so
  // the drawer must not repeat it — it lists the six sections flat and leaves
  // the sub-pages to the dropdowns. Below it the drawer IS the navigation, and
  // the accordion groups carry the whole architecture (read.md §9, §10).
  const hasDesktopNav = useMediaQuery('(min-width: 861px)');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Backstop: close everything on route change. Adjusted during render rather
  // than in an effect, so the menu never paints open for a frame on the
  // incoming page. Not sufficient on its own — clicking a link for the page
  // you're already on (or the #testimonials anchor) never changes the URL, so
  // every link also closes the menu directly via closeMenu.
  const routeKey = `${location.pathname}${location.search}`;
  const [lastRoute, setLastRoute] = useState(routeKey);
  if (lastRoute !== routeKey) {
    setLastRoute(routeKey);
    setOpen(false);
    setMegaMenu(null);
    setOpenGroup(null);
  }

  // Escape closes whichever layer is open.
  useEffect(() => {
    if (!open && !megaMenu) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (megaMenu) setMegaMenu(null);
      else setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, megaMenu]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const closeMenu = () => { setOpen(false); setMegaMenu(null); setOpenGroup(null); };

  // Picture for the drawer's second column: the open group's feature if it has
  // one, that group's own image otherwise, and the flagship project as the
  // resting state.
  const drawerFeature = (() => {
    const active = NAV.find((i) => i.label === openGroup);
    if (active?.feature) return active.feature;
    if (active?.image) {
      return { image: active.image, title: active.label, note: `Explore ${active.label}`, to: active.to };
    }
    return {
      image: '/images/oscar/entrance/entrance-1.jpg',
      title: 'Oscar Palace',
      note: 'Royal-estate plotting on the Indore–Nagpur Highway',
      to: '/projects/oscar-palace',
    };
  })();

  const holdMenu = (label) => {
    clearTimeout(closeTimer.current);
    setMegaMenu(label);
    setPrimedMenus((prev) => (prev.has(label) ? prev : new Set(prev).add(label)));
  };
  const releaseMenu = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaMenu(null), MENU_CLOSE_MS);
  };

  // The anchor lives on Home and About. Jump smoothly through Lenis when it's
  // on the current page; otherwise route Home first and scroll once the
  // route transition has handed over.
  const goToTestimonials = (e) => {
    e.preventDefault();
    closeMenu();

    const scrollToIt = () => {
      const el = document.getElementById('testimonials');
      if (!el) return;
      if (window.lenis) window.lenis.scrollTo(el, { offset: -90 });
      else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (document.getElementById('testimonials')) scrollToIt();
    else { navigate('/'); setTimeout(scrollToIt, ROUTE_SETTLE_MS); }
  };

  const openForm = () => {
    closeMenu();
    openEnquiry({
      source: 'Header',
      intent: LEAD_INTENTS.SITE_VISIT,
      eyebrow: 'Site visit',
      heading: 'Book a site visit.',
      fields: ['name', 'phone', 'preferredDate', 'preferredTime'],
      submitLabel: 'Request a site visit',
    });
  };

  const isActive = (to) => to === '/'
    ? location.pathname === '/'
    : location.pathname === to || location.pathname.startsWith(`${to}/`);

  /**
   * One top-level entry, with its mega-menu anchored to the entry itself
   * rather than to the whole header — so each panel opens under its own
   * trigger, and right-hand entries open from their right edge instead of
   * every menu appearing in the same place on the left.
   */
  function renderNavItem(item) {
    const kids = childrenOf(item);
    const hasMenu = kids.length > 0;
    const isOpen = megaMenu === item.label;

    return (
      <div
        key={item.label}
        className={`site-header__nav-item ${isOpen ? 'is-open' : ''}`}
        onMouseEnter={hasMenu ? () => holdMenu(item.label) : undefined}
        onMouseLeave={hasMenu ? releaseMenu : undefined}
      >
        <Link
          to={item.to}
          className={isActive(item.to) ? 'is-current' : ''}
          onClick={closeMenu}
          // Keyboard users get the panel on focus; the link itself still
          // navigates, so the group is never a dead end.
          onFocus={hasMenu ? () => holdMenu(item.label) : undefined}
          aria-expanded={hasMenu ? isOpen : undefined}
          aria-haspopup={hasMenu ? 'true' : undefined}
        >
          {item.label}
          {hasMenu && (
            <svg className="site-header__caret" viewBox="0 0 10 6" fill="none" aria-hidden>
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </Link>

        {hasMenu && (
          <div
            className={`mega mega--${item.side === 'right' ? 'right' : 'left'} ${isOpen ? 'is-open' : ''}`}
            aria-hidden={!isOpen}
          >
            {primedMenus.has(item.label) && (
              <div className={`mega__inner ${item.feature ? '' : 'mega__inner--solo'}`}>
                <div className="mega__links">
                  <span className="mega__eyebrow">{item.label}</span>
                  <ul>
                    {kids.map((child) => (
                      <li key={child.to}>
                        <Link to={child.to} onClick={closeMenu} tabIndex={isOpen ? 0 : -1}>
                          <span className="mega__link-label">{child.label}</span>
                          {child.note && <span className="mega__link-note">{child.note}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {item.feature && (
                  <Link
                    to={item.feature.to}
                    className="mega__feature"
                    onClick={closeMenu}
                    tabIndex={isOpen ? 0 : -1}
                  >
                    <span className="mega__feature-media">
                      <img src={item.feature.image} alt="" loading="lazy" decoding="async" />
                    </span>
                    <span className="mega__feature-body">
                      <span className="mega__feature-title">{item.feature.title}</span>
                      <span className="mega__feature-note">{item.feature.note}</span>
                    </span>
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="site-header__inner">
        {/* ---------- left of the logo ----------
             The bar used to carry every link on the left and every control on
             the right, which left ~230px of dead space beside the wordmark.
             The call link balances the CTA on the far right, and on a
             real-estate site a one-tap phone number in the header earns its
             place regardless. */}
        <div className="site-header__start">
          <a href={telHref()} className="site-header__call">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.8a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.35 1.84.59 2.8.72A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{PRIMARY_PHONE.label}</span>
          </a>

          <nav className="site-header__nav site-header__nav--left" aria-label="Primary">
            {navLeft().map(renderNavItem)}
          </nav>
        </div>

        <Link to="/" className="site-header__brand" aria-label="Icon Realty home" onClick={closeMenu}>
          <span className="site-header__logo-wrap">
            <img src="/icon-logo.png" alt="Icon Realty" className="site-header__logo" />
            <img src="/icon-logo.png" alt="" aria-hidden="true" className="site-header__logo site-header__logo--white" />
          </span>
        </Link>

        <div className="site-header__end">
          <nav className="site-header__nav site-header__nav--right" aria-label="Secondary">
            {navRight().map(renderNavItem)}
          </nav>

          <div className="site-header__actions">
            <button type="button" className="cta" onClick={openForm}>Book a Site Visit</button>
            <button
              className={`hamburger ${open ? 'is-open' : ''}`}
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="site-menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </div>

      {/* ---------- mobile drawer ---------- */}
      <div
        className={`site-header__sheet ${open ? 'is-open' : ''}`}
        id="site-menu"
        /* the drawer scrolls internally on small screens — without this Lenis
           swallows the touch/wheel and the list can't be reached */
        data-lenis-prevent
      >
        <div className="site-header__sheet-inner">
          <div className="site-header__sheet-col site-header__sheet-col--nav">
            <span className="site-header__sheet-eyebrow">Explore</span>

            <nav aria-label="Mobile">
              <Link to="/" onClick={closeMenu} className="drawer__top">Home</Link>

              {NAV.map((item) => {
                const kids = childrenOf(item);
                // No children, or the top bar already exposes them → a plain link.
                if (!kids.length || hasDesktopNav) {
                  return (
                    <Link key={item.label} to={item.to} onClick={closeMenu} className="drawer__top">
                      {item.label}
                    </Link>
                  );
                }
                const expanded = openGroup === item.label;
                return (
                  <div key={item.label} className={`drawer__group ${expanded ? 'is-open' : ''}`}>
                    {/* A real button: the group toggles, it does not navigate.
                        The group's own landing page is the first child link. */}
                    <button
                      type="button"
                      className="drawer__group-trigger"
                      aria-expanded={expanded}
                      aria-controls={`drawer-${item.label}`}
                      onClick={() => setOpenGroup(expanded ? null : item.label)}
                    >
                      <span>{item.label}</span>
                      <span className="drawer__chevron" aria-hidden>
                        <svg viewBox="0 0 14 14" fill="none">
                          <path d="M3 7h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                          <path className="drawer__chevron-bar" d="M7 3v8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                        </svg>
                      </span>
                    </button>

                    <div className="drawer__panel" id={`drawer-${item.label}`} hidden={!expanded}>
                      {kids.map((child) => (
                        <Link key={child.to} to={child.to} onClick={closeMenu} className="drawer__child">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}

              <a href="#testimonials" onClick={goToTestimonials} className="drawer__top">Testimonials</a>
              <Link to="/contact" onClick={closeMenu} className="drawer__top">Contact</Link>
            </nav>
          </div>

          <div className="site-header__sheet-col site-header__sheet-col--contact">
            <span className="site-header__sheet-eyebrow">Get in touch</span>
            <a href={`mailto:${EMAIL}`} className="site-header__sheet-link">{EMAIL}</a>
            <a href={telHref()} className="site-header__sheet-link">{PRIMARY_PHONE.label}</a>
            <p className="site-header__sheet-address">
              {ADDRESS.lines.map((line) => <span key={line}>{line}<br/></span>)}
            </p>
            <button type="button" className="cta site-header__sheet-cta" onClick={openForm}>
              Book a Site Visit
            </button>
          </div>

          {/* The dropdowns are image-led; the drawer should be too. It shows
              the open group's picture, falling back to the flagship. Its own
              column, so it sits beside the contact details rather than
              stacking on top of them and doubling the panel's height. */}
          <Link to={drawerFeature.to} className="drawer__feature" onClick={closeMenu}>
            <span className="drawer__feature-media">
              <img src={drawerFeature.image} alt="" loading="lazy" decoding="async" />
            </span>
            <span className="drawer__feature-body">
              <span className="drawer__feature-title">{drawerFeature.title}</span>
              <span className="drawer__feature-note">{drawerFeature.note}</span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
