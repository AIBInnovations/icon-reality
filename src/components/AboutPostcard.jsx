import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEnquiry } from '../enquiry/enquiryContext';
import './AboutPostcard.css';

gsap.registerPlugin(ScrollTrigger);

// Vintage "POST CARD" about-band — Icon Realty's note to the city it has built
// in since 2004. Click the button → the postcard shrinks & slides left while the
// stamp-edged photo emerges from the right. Flanking cutouts drift on scroll.
//
// The copy is the company's, not one project's (change.md #2); the stamp still
// carries Oscar Palace because that is the photograph behind it.
export default function AboutPostcard() {
  const stageRef = useRef(null);
  const birdLRef = useRef(null);
  const birdRRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { openEnquiry } = useEnquiry();

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      const span = { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: 1.2 };
      if (birdLRef.current) gsap.fromTo(birdLRef.current, { yPercent: -12 }, { yPercent: 16, ease: 'none', scrollTrigger: span });
      if (birdRRef.current) gsap.fromTo(birdRRef.current, { yPercent: 16 }, { yPercent: -12, ease: 'none', scrollTrigger: span });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="postcard-scene" id="about-icon">
      <div className="container">
        <div className="ps-flank ps-flank--l"><img ref={birdLRef} src="/images/oscar/3.png" alt="" aria-hidden="true" loading="lazy" decoding="async" /></div>
        <div className="ps-flank ps-flank--r"><img ref={birdRRef} src="/images/oscar/4.png" alt="" aria-hidden="true" loading="lazy" decoding="async" /></div>

        <div className={`pc2-stage ${open ? 'is-open' : ''}`} ref={stageRef}>

          {/* revealed photo — slides out from the right */}
          <figure className="pc2-photo">
            <img src="/images/oscar/oscar-stamp.png" alt="Oscar Palace — the royal gate" loading="lazy" decoding="async" />
          </figure>

          {/* the postcard */}
          <div className="pc2-card">
            <h2 className="pc2-title">POST CARD</h2>

            <div className="pc2-body">
              <div className="pc2-left">
                <p className="pc2-poem">
                  Twenty years in one city.<br/>
                  Fifteen landmarks. Four<br/>
                  thousand families home.
                </p>
                <p className="pc2-sign">From Indore, with care —</p>
                <p className="pc2-credit">
                  <b>Icon Realty</b> — designing &amp; marketing residential plotted
                  developments since <b>2004</b>. Plots from 600 to 20,000 sq ft.
                </p>
              </div>

              <span className="pc2-divider" aria-hidden />

              <div className="pc2-right" aria-hidden>
                <div className="pc2-postline">
                  <svg className="pc2-waves" viewBox="0 0 84 34" fill="none">
                    <path d="M2 6 Q12 1 22 6 T42 6 T62 6 T82 6M2 17 Q12 12 22 17 T42 17 T62 17 T82 17M2 28 Q12 23 22 28 T42 28 T62 28 T82 28" stroke="currentColor" strokeWidth="1.3"/>
                  </svg>
                  <div className="pc2-postmark">
                    <svg viewBox="0 0 100 100" fill="none">
                      <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1.3"/>
                    </svg>
                    <span>ICON<br/>REALTY</span>
                  </div>
                </div>
                <div className="pc2-stamp">
                  <svg className="pc2-stamp__emblem" viewBox="0 0 44 44">
                    <g fill="currentColor">
                      <ellipse cx="22" cy="9" rx="2.3" ry="8"/>
                      <ellipse cx="22" cy="9" rx="2.3" ry="8" transform="rotate(45 22 22)"/>
                      <ellipse cx="22" cy="9" rx="2.3" ry="8" transform="rotate(90 22 22)"/>
                      <ellipse cx="22" cy="9" rx="2.3" ry="8" transform="rotate(135 22 22)"/>
                      <ellipse cx="22" cy="9" rx="2.3" ry="8" transform="rotate(180 22 22)"/>
                      <ellipse cx="22" cy="9" rx="2.3" ry="8" transform="rotate(225 22 22)"/>
                      <ellipse cx="22" cy="9" rx="2.3" ry="8" transform="rotate(270 22 22)"/>
                      <ellipse cx="22" cy="9" rx="2.3" ry="8" transform="rotate(315 22 22)"/>
                    </g>
                    <circle cx="22" cy="22" r="2.6" fill="currentColor"/>
                  </svg>
                  <span className="pc2-stamp__name">OSCAR</span>
                  <span className="pc2-stamp__sub">PALACE</span>
                  <span className="pc2-stamp__tag">Royally, yours!</span>
                </div>
              </div>
            </div>

            <div className="pc2-actions">
              <button className="pc2-btn" type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
                {open ? 'Hide the picture' : 'See our flagship'}
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M3 7.5h8M7.5 4l3.5 3.5L7.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button type="button" className="pc2-link" onClick={() => openEnquiry({ source: 'About — Icon Realty' })}>Book a Site Visit</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
