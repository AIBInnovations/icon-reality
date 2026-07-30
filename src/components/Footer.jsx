import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import { useEnquiry } from '../enquiry/enquiryContext';
import './Footer.css';

export default function Footer() {
  const { openEnquiry } = useEnquiry();
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__lead">
            <Reveal>
              <img src="/icon-logo.png" alt="Icon Realty" className="footer__logo" loading="lazy" decoding="async" />
            </Reveal>
            <Reveal as="p" className="footer__pitch" delay={0.05}>
              Over two decades of trust, 15+ landmark projects, 4,500+ happy families — Icon Realty builds addresses that quietly change everything.
            </Reveal>
            <Reveal delay={0.1}>
              <button type="button" className="cta" onClick={() => openEnquiry({ source: 'Footer' })}>Book a Site Visit</button>
            </Reveal>
          </div>

          <div className="footer__cols-mobile">
            <div className="footer__col">
              <span className="footer__col-title">Menu</span>
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/projects">Projects</Link>
              <Link to="/contact">Contact</Link>
              <a href="#completed">Completed</a>
              <a href="#testimonials">Testimonials</a>
            </div>

            <div className="footer__col">
              <span className="footer__col-title">Contact</span>
              <a href="mailto:iconrealty02@gmail.com">iconrealty02@gmail.com</a>
              <a href="tel:+919425942510">+91 9425 9425 10</a>
              <a href="tel:+919425942511">+91 9425 9425 11</a>
              <a href="https://instagram.com/iconrealtyofficial" rel="noreferrer" target="_blank">Instagram</a>
              <a href="https://youtube.com/@IconRealtyOfficial" rel="noreferrer" target="_blank">YouTube</a>
              <a href="https://facebook.com/IconRealtyOfficial" rel="noreferrer" target="_blank">Facebook</a>
              <p className="footer__address">
                Icon Realty<br/>
                Indore, Madhya Pradesh – 452001<br/>
                Site visits by appointment
              </p>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span className="footer__bottom-desktop">© {new Date().getFullYear()} Icon Realty. All rights reserved.</span>
          <span className="footer__bottom-desktop">Crafting premium addresses in Indore</span>
          <span className="footer__bottom-mobile">Icon Realty · Indore, Madhya Pradesh – 452001</span>
        </div>
      </div>

      <div className="footer__bars" aria-hidden />
    </footer>
  );
}
