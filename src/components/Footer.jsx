import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import { useEnquiry } from '../enquiry/enquiryContext';
import { NAV, childrenOf } from '../data/nav';
import { PHONES, EMAIL, ADDRESS, SOCIALS, telHref } from '../data/contact';
import { whatsappUrl, waMessage } from '../services/whatsapp';
import { LEAD_INTENTS } from '../services/leads';
import './Footer.css';

/**
 * Site footer.
 *
 * Structure, deliberately, in three bands rather than one wide grid:
 *
 *   1. brand   logo, pitch, CTA and the contact essentials — one column
 *   2. links   exactly four equal columns generated from data/nav.js
 *   3. base    copyright, socials, tagline
 *
 * The link columns come from NAV so the footer, the header mega-menu and the
 * mobile drawer can never describe different versions of the site.
 *
 * Every phone number is a tel: link and WhatsApp is a real wa.me URL
 * (read.md §46–48), which also means the delegated tracker in Analytics.jsx
 * counts them without any per-link wiring.
 */
export default function Footer() {
  const { openEnquiry } = useEnquiry();

  const bookVisit = () => openEnquiry({
    intent: LEAD_INTENTS.SITE_VISIT,
    source: 'Footer',
    eyebrow: 'Site visit',
    heading: 'Book a site visit.',
    fields: ['name', 'phone', 'preferredDate', 'preferredTime'],
    submitLabel: 'Request a site visit',
  });

  // Three groups have children (Projects, NRI, Partners); the flat top-level
  // entries collect into a fourth "Company" column. Four columns, always.
  const groups = NAV.filter((item) => childrenOf(item).length > 0);
  const flat = NAV.filter((item) => childrenOf(item).length === 0);

  return (
    <footer className="footer" id="contact">
      <div className="container footer__inner">
        <div className="footer__top">
          {/* ---- brand + contact ---- */}
          <div className="footer__brand">
            <Reveal>
              <img src="/icon-logo.png" alt="Icon Realty" className="footer__logo" loading="lazy" decoding="async" />
            </Reveal>
            <Reveal as="p" className="footer__pitch" delay={0.05}>
              Over two decades of trust, 15+ landmark projects, 4,500+ happy families.
            </Reveal>
            <Reveal delay={0.1}>
              <button type="button" className="cta footer__cta" onClick={bookVisit}>Book a Site Visit</button>
            </Reveal>

          </div>

          {/* ---- four link columns ---- */}
          <nav className="footer__links" aria-label="Footer">
            {groups.map((group) => (
              <div className="footer__col" key={group.label}>
                <span className="footer__col-title">{group.label}</span>
                {childrenOf(group).map((child) => (
                  <Link key={child.to} to={child.to}>{child.label}</Link>
                ))}
              </div>
            ))}

            <div className="footer__col">
              <span className="footer__col-title">Company</span>
              <Link to="/">Home</Link>
              {flat.map((item) => (
                <Link key={item.to} to={item.to}>{item.label}</Link>
              ))}
              <Link to="/contact">Contact</Link>
            </div>
          </nav>
        </div>

        {/* ---- contact band ----
             A horizontal strip spanning the full width rather than a tail on
             the brand column: stacked under the logo it made that column twice
             the height of the link columns and left a dead gap beside them. */}
        <Reveal className="footer__contact" delay={0.1}>
          <div className="footer__contact-item">
            <span className="footer__contact-k">Email</span>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </div>
          <div className="footer__contact-item">
            <span className="footer__contact-k">Phone</span>
            <span className="footer__phones">
              {PHONES.map((phone) => (
                <a key={phone.tel} href={telHref(phone)}>{phone.label}</a>
              ))}
            </span>
          </div>
          <div className="footer__contact-item">
            <span className="footer__contact-k">WhatsApp</span>
            <a href={whatsappUrl(waMessage.general())} target="_blank" rel="noreferrer">
              Chat with the team
            </a>
          </div>
          <div className="footer__contact-item">
            <span className="footer__contact-k">Office</span>
            <address className="footer__address">
              {ADDRESS.locality}, {ADDRESS.region} – {ADDRESS.postalCode}
              <br />Site visits by appointment
            </address>
          </div>
        </Reveal>

        {/* ---- base bar ---- */}
        <div className="footer__base">
          <span className="footer__copy">© {new Date().getFullYear()} Icon Realty. All rights reserved.</span>

          <div className="footer__socials">
            {SOCIALS.map((s) => (
              <a key={s.name} href={s.url} rel="noreferrer" target="_blank">{s.name}</a>
            ))}
          </div>

          <span className="footer__tagline">Crafting premium addresses in Indore</span>
        </div>
      </div>

      <div className="footer__bars" aria-hidden />
    </footer>
  );
}
