import { useState } from 'react';
import Reveal from './Reveal';
import ImageViewer from './ImageViewer';
import { trackFloorPlanView, trackMasterPlanView } from '../analytics/events';
import './PlanViewer.css';

/**
 * Floor-plan / master-plan viewer.
 *
 * The rule this component exists to enforce: a plan is never a thumbnail inside
 * a card (read.md §15, §16). The selected plan is rendered large and legible in
 * place, a configuration selector switches between plans, and one tap opens the
 * fullscreen ImageViewer with zoom, pan and pinch.
 *
 * Nothing here is behind a form — a buyer can inspect every plan without giving
 * us a phone number. The lead capture on this page is the brochure, not the
 * layout.
 *
 * `plans`: [{ src, label, note }]. A single-plan project (a master layout with
 * no variants) simply gets no selector.
 */
export default function PlanViewer({
  plans = [],
  eyebrow = 'Layouts',
  heading = 'Floor plans.',
  lede,
  kind = 'floor',          // 'floor' | 'master' — only affects the analytics event
  projectName,
  className = '',
  id,
}) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState({});

  // Drop plans whose image 404s so the selector can never point at a blank
  // frame (read.md §76).
  const available = plans.filter((p, i) => p?.src && !failed[i]);
  if (!available.length) return null;

  const plan = plans[active]?.src && !failed[active] ? plans[active] : available[0];
  const activeIndex = plans.indexOf(plan);

  const track = (p) => {
    const fn = kind === 'master' ? trackMasterPlanView : trackFloorPlanView;
    fn(projectName, p?.label || p?.src);
  };

  const openViewer = () => { track(plan); setOpen(true); };

  return (
    <section className={`plan-viewer ${className}`} id={id}>
      <div className="container">
        <div className="plan-viewer__head">
          {eyebrow && <Reveal as="span" className="eyebrow plan-viewer__eyebrow">{eyebrow}</Reveal>}
          <Reveal as="h2" className="display plan-viewer__heading" delay={0.05}>{heading}</Reveal>
          {lede && <Reveal as="p" className="plan-viewer__lede" delay={0.1}>{lede}</Reveal>}
        </div>

        {plans.length > 1 && (
          <Reveal className="plan-viewer__selector" delay={0.1}>
            <div className="plan-viewer__chips" role="tablist" aria-label="Choose a plan">
              {plans.map((p, i) => (
                failed[i] ? null : (
                  <button
                    type="button"
                    key={p.label || p.src}
                    role="tab"
                    aria-selected={i === activeIndex}
                    className={`plan-viewer__chip ${i === activeIndex ? 'is-active' : ''}`}
                    onClick={() => { setActive(i); track(p); }}
                  >
                    {p.label || `Plan ${i + 1}`}
                  </button>
                )
              ))}
            </div>
          </Reveal>
        )}

        <Reveal className="plan-viewer__stage" delay={0.12}>
          {/* A real button, not a div with onClick — it is keyboard reachable
              and announces itself as the control that opens the viewer. */}
          <button
            type="button"
            className="plan-viewer__open"
            onClick={openViewer}
            aria-label={`Open ${plan.label || heading} full screen`}
          >
            <img
              src={plan.src}
              alt={`${projectName ? `${projectName}: ` : ''}${plan.label || heading}`}
              loading="lazy"
              decoding="async"
              onError={() => setFailed((f) => ({ ...f, [activeIndex]: true }))}
            />
            <span className="plan-viewer__zoom-hint">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6"/>
                <path d="M11 8.5v5M8.5 11h5M16 16l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              Tap to zoom
            </span>
          </button>
        </Reveal>

        {plan.note && <p className="plan-viewer__note">{plan.note}</p>}

        <p className="plan-viewer__disclaimer">
          Plans are indicative and shown for reference. Dimensions and the final approved layout
          are confirmed in the project documentation at the time of booking.
        </p>
      </div>

      {open && (
        <ImageViewer
          images={plans.filter((_, i) => !failed[i]).map((p) => ({
            src: p.src,
            label: p.label,
            alt: `${projectName ? `${projectName}: ` : ''}${p.label || heading}`,
          }))}
          index={Math.max(0, available.indexOf(plan))}
          onIndexChange={(i) => setActive(plans.indexOf(available[i]))}
          onClose={() => setOpen(false)}
          title={`${projectName || ''} ${heading}`.trim()}
        />
      )}
    </section>
  );
}
