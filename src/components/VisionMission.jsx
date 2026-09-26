import Reveal from './Reveal';
import { VISION, VISION_DETAIL, MISSION, MISSION_DETAIL, VALUES } from '../data/company';
import './VisionMission.css';

/*
 * Line icons for the values, named from company.js VALUES[].icon.
 * Drawings from Lucide (lucide.dev, ISC licence), inlined so the four the page
 * needs do not bring a whole icon package with them.
 */
const ICONS = {
  handshake: (
    <>
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
      <path d="m21 3 1 11h-2" />
      <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
      <path d="M3 4h8" />
    </>
  ),
  award: (
    <>
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
      <circle cx="12" cy="8" r="6" />
    </>
  ),
  lightbulb: (
    <>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </>
  ),
  landmark: (
    <>
      <path d="M3 22h18" />
      <path d="M6 18v-7M10 18v-7M14 18v-7M18 18v-7" />
      <path d="M12 2 20 7H4z" />
    </>
  ),
};

/**
 * The vision and mission cards, then the core values beneath them.
 *
 * Shared by the About page and the home page, so the site can only ever state
 * one purpose: the copy lives in company.js. Each page wraps this in its own
 * section and container and sets its own padding and band colour.
 */
export default function VisionMission() {
  const statements = [
    { k: 'Vision', text: VISION, detail: VISION_DETAIL, tone: 'vision' },
    { k: 'Mission', text: MISSION, detail: MISSION_DETAIL, tone: 'mission' },
  ];

  return (
    <>
      <div className="vm__grid">
        {statements.map((s, i) => (
          <Reveal key={s.k} className={`vm__card vm__card--${s.tone}`} delay={i * 0.08}>
            <span className="vm__tag">{s.k}</span>
            <p className="vm__statement">{s.text}</p>
            {s.detail && <p className="vm__detail">{s.detail}</p>}
          </Reveal>
        ))}
      </div>

      <div className="vm__values">
        <Reveal as="h3" className="vm__values-title">Our core values</Reveal>
        <div className="vm__values-grid">
          {VALUES.map((x, i) => (
            <Reveal key={x.k} className="vm__value" delay={i * 0.06}>
              {ICONS[x.icon] && (
                <span className="vm__value-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
                    strokeLinecap="round" strokeLinejoin="round">
                    {ICONS[x.icon]}
                  </svg>
                </span>
              )}
              <span className="vm__value-k">{x.k}</span>
              <span className="vm__value-v">{x.v}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
