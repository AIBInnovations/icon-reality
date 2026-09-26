import Reveal from './Reveal';
import { VISION, VISION_DETAIL, MISSION, MISSION_DETAIL, VALUES } from '../data/company';
import './VisionMission.css';

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
              <span className="vm__value-k">{x.k}</span>
              <span className="vm__value-v">{x.v}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
