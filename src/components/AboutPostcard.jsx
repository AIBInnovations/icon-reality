import Reveal from './Reveal';
import './AboutPostcard.css';

// A postcard-themed "About" band — ties the project's heritage/postcard motif to the
// who-built-it copy (Ruchi Realty + Icon Realty). Sits just before the Status pillars.
export default function AboutPostcard() {
  return (
    <section className="about-postcard" id="about-oscar">
      <div className="container">
        <Reveal className="postcard">
          <div className="postcard__left">
            <span className="postcard__eyebrow">About the project</span>
            <h2 className="postcard__title display">Greetings from<br/>Oscar Palace</h2>
            <p className="postcard__msg">
              Oscar Palace is a luxury plotting project by <strong>Ruchi Realty</strong> —
              mindfully designed and marketed by <strong>Icon Realty</strong>. A residential
              estate on the Indore–Nagpur Highway, drawn from royal Indian architecture and
              built for families who value heritage, symmetry, and the long view.
            </p>
            <a
              href="mailto:iconrealty2@icloud.com?subject=Book%20a%20Visit%20%E2%80%94%20Oscar%20Palace"
              className="cta postcard__cta"
            >
              Book a Site Visit
            </a>
          </div>

          <div className="postcard__right">
            <div className="postcard__meta">
              <div className="postcard__stamp" aria-hidden>
                <span className="postcard__stamp-star">✦</span>
                <span className="postcard__stamp-name">OSCAR<br/>PALACE</span>
              </div>
              <div className="postcard__postmark" aria-hidden>
                <span>INDORE · M.P.</span>
                <svg viewBox="0 0 120 18" fill="none">
                  <path d="M2 4 Q10 0 18 4 T34 4 T50 4 T66 4 T82 4 T98 4 T114 4" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M2 9 Q10 5 18 9 T34 9 T50 9 T66 9 T82 9 T98 9 T114 9" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M2 14 Q10 10 18 14 T34 14 T50 14 T66 14 T82 14 T98 14 T114 14" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
              </div>
            </div>

            <div className="postcard__address">
              <span className="postcard__address-k">To</span>
              <span className="postcard__address-line">The future resident</span>
              <span className="postcard__address-line">Indore–Nagpur Highway</span>
              <span className="postcard__address-line">Indore, Madhya Pradesh — 452001</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
