import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import SectionRail from '../components/SectionRail';
import MediaFigure from '../components/MediaFigure';
import LeadForm from '../components/LeadForm';
import CtaBand from '../components/CtaBand';
import Reveal from '../components/Reveal';
import StickyMobileCTA from '../components/StickyMobileCTA';
import Breadcrumbs from '../components/Breadcrumbs';
import Seo from '../seo/Seo';
import { breadcrumbSchema, webPageSchema } from '../seo/schema';
import { scrollToSection } from '../utils/scrollTo';
import { waMessage } from '../services/whatsapp';
import { LEAD_INTENTS } from '../services/leads';
import { projectsList } from '../data/projects';
import {
  CP_INTRO, CP_MEDIA, WHY_PARTNER, PARTNER_BENEFITS, PARTNER_JOURNEY,
  COMMISSION_STATEMENT, COMMISSION_NOTES, SUPPORT_STRUCTURE,
  REGISTRATION_STEPS, REGISTRATION_NOTE,
} from '../data/channelPartners';
import './ChannelPartnersPage.css';

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Channel Partners', path: '/channel-partners' },
];

/**
 * The Channel Partner programme — ONE page.
 *
 * Why Icon, Commission & Support and Registration used to be three routes
 * hanging off this one. They are sections now, with ids matching their old
 * paths (#why-icon, #commission-support, #register) so the header dropdown and
 * every existing link still land in the right place; App.jsx redirects the old
 * URLs onto those anchors.
 *
 * As with the NRI page, no two sections share a layout: the case is an
 * alternating editorial ladder, the benefits a dark typographic index, the
 * portfolio an edge-to-edge scroller, the journey a stepped track, commercial
 * terms a sand plate plus a ruled table, and registration a two-column desk.
 */

const SECTIONS = [
  { id: 'why-icon', label: 'Why Partner With Icon' },
  { id: 'benefits', label: 'Partner Benefits' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'journey', label: 'The Journey' },
  { id: 'commission-support', label: 'Commission & Support' },
  { id: 'register', label: 'Register' },
];

const jumpToRegister = (e) => {
  e.preventDefault();
  scrollToSection('register');
};

function SectionHead({ index, eyebrow, title, intro, tone = 'light' }) {
  return (
    <div className={`cpx-head cpx-head--${tone}`}>
      <Reveal className="cpx-head__meta">
        <span className="cpx-head__index" aria-hidden>{String(index).padStart(2, '0')}</span>
        <span className="cpx-head__rule" aria-hidden />
        <span className="cpx-head__eyebrow">{eyebrow}</span>
      </Reveal>
      <Reveal as="h2" className="cpx-head__title" delay={0.05}>{title}</Reveal>
      {intro && <Reveal as="p" className="cpx-head__intro" delay={0.1}>{intro}</Reveal>}
    </div>
  );
}

export default function ChannelPartnersPage() {
  const portfolio = projectsList.filter((p) => p.thumbnail || p.hero_image).slice(0, 10);

  return (
    <>
      <Seo
        title="Channel Partners — sell Icon Realty projects in Indore"
        description="Partner with Icon Realty: seventeen plotted developments across Indore, a named relationship manager, current inventory, creatives, site-visit support, clear lead attribution and registration — all on one page."
        path="/channel-partners"
        image={CP_MEDIA.hero.src}
        jsonLd={[
          breadcrumbSchema(TRAIL),
          webPageSchema('WebPage', {
            name: 'Channel Partners',
            description: 'Channel partner programme, support structure and registration for Icon Realty, Indore.',
            path: '/channel-partners',
          }),
        ]}
      />

      <PageHero
        eyebrow="Channel partners"
        title={['Sell addresses', 'that get delivered.']}
        lede={CP_INTRO}
        media={{ src: CP_MEDIA.hero.src, credit: CP_MEDIA.hero.credit }}
        actions={
          <>
            <a href="#register" className="cta" onClick={jumpToRegister}>Become a Channel Partner</a>
            <Link to="/projects" className="cta cta--ghost">See the portfolio</Link>
          </>
        }
      />

      <Breadcrumbs trail={TRAIL} />

      <SectionRail items={SECTIONS} label="Partner programme" />

      {/* ================= 01 · WHY ICON — editorial ladder ================= */}
      <section className="cpx-case" id="why-icon">
        <div className="container">
          <SectionHead
            index={1}
            eyebrow="Why partner with Icon"
            title="Four reasons, all of them checkable."
            intro="Nothing on this list depends on you taking our word for it — every claim points at a project you or your client can go and stand in."
          />
        </div>

        <div className="cpx-ladder">
          {WHY_PARTNER.map((item, i) => (
            <Reveal key={item.k} className="cpx-rung" delay={0.04}>
              <div className="container cpx-rung__grid">
                <div className="cpx-rung__media">
                  <MediaFigure
                    src={item.image}
                    credit={item.credit}
                    alt={item.k}
                    ratio="16 / 11"
                  />
                </div>
                <div className="cpx-rung__copy">
                  <span className="cpx-rung__num" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="cpx-rung__title">{item.k}</h3>
                  <p className="cpx-rung__body">{item.v}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= 02 · BENEFITS — dark index ================= */}
      <section className="cpx-benefits" id="benefits">
        <div className="container">
          <SectionHead
            index={2}
            eyebrow="Partner benefits"
            title="Support that shows up on a Sunday."
            intro="Most of what a channel partner needs from a developer is unglamorous: is the plot still available, can someone meet my client at the gate, and where is the deck."
            tone="dark"
          />

          <ol className="cpx-index">
            {PARTNER_BENEFITS.map((b, i) => (
              <Reveal as="li" key={b.k} className="cpx-index__row" delay={Math.min(i, 6) * 0.04}>
                <span className="cpx-index__num" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                <h3 className="cpx-index__k">{b.k}</h3>
                <p className="cpx-index__v">{b.v}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ================= 03 · PORTFOLIO — edge-to-edge scroller ========= */}
      <section className="cpx-portfolio" id="portfolio">
        <div className="container">
          <SectionHead
            index={3}
            eyebrow="Project portfolio"
            title={`${projectsList.length} developments to place a client in.`}
            intro="From 600 sq ft plots to 20,000 sq ft royal-estate plots — across the Super Corridor, the Indore–Nagpur Highway, Bicholi, Manglia, Simrol and Jhalaria."
          />
        </div>

        {/* data-lenis-prevent: this scrolls sideways, and Lenis would otherwise
            eat the gesture (CLAUDE.md §2). */}
        <div className="cpx-track" data-lenis-prevent>
          <ul className="cpx-track__list">
            {portfolio.map((p) => (
              <li key={p.slug} className="cpx-track__item">
                <Link to={`/projects/${p.slug}`} className="cpx-card">
                  <MediaFigure
                    src={p.thumbnail || p.hero_image}
                    alt={`${p.name} — ${p.location}`}
                    ratio="4 / 5"
                  />
                  {p.status && (
                    <span className={`cpx-card__status cpx-card__status--${p.status}`}>
                      {p.status === 'completed' ? 'Delivered' : 'Selling'}
                    </span>
                  )}
                  <span className="cpx-card__name">{p.name}</span>
                  <span className="cpx-card__meta">{p.location}</span>
                </Link>
              </li>
            ))}
            <li className="cpx-track__item cpx-track__item--end">
              <Link to="/projects" className="cpx-card cpx-card--all">
                <span className="cpx-card__all-label">All {projectsList.length} projects</span>
                <svg width="22" height="22" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* ================= 04 · JOURNEY — stepped track ================= */}
      <section className="cpx-journey" id="journey">
        <div className="container">
          <SectionHead
            index={4}
            eyebrow="The partner journey"
            title="Eight steps, in order."
            intro="Attribution is recorded at step five, before the first site visit — which is what stops the conversation at step eight from being an argument."
          />

          <ol className="cpx-stages">
            {PARTNER_JOURNEY.map((step, i) => (
              <Reveal
                as="li"
                key={step.title}
                className={`cpx-stage ${i === 4 ? 'is-marked' : ''}`}
                delay={Math.min(i, 6) * 0.04}
              >
                <span className="cpx-stage__node" aria-hidden>
                  <span className="cpx-stage__dot" />
                </span>
                <span className="cpx-stage__num" aria-hidden>Step {i + 1}</span>
                <h3 className="cpx-stage__title">{step.title}</h3>
                <p className="cpx-stage__body">{step.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ 05 · COMMISSION & SUPPORT — plate + ruled table ===== */}
      <section className="cpx-terms" id="commission-support">
        <div className="container">
          <SectionHead
            index={5}
            eyebrow="Commission & support"
            title="How terms are set, and what comes with them."
            intro="We would rather tell you how terms are set than publish a percentage that turns out not to apply to the project you were about to sell."
          />

          <div className="cpx-terms__grid">
            <Reveal className="cpx-plate">
              <p className="cpx-plate__statement">{COMMISSION_STATEMENT}</p>
              <ul className="cpx-plate__notes">
                {COMMISSION_NOTES.map((note) => <li key={note}>{note}</li>)}
              </ul>
              <a href="#register" className="cta cpx-plate__cta" onClick={jumpToRegister}>
                Register to receive terms
              </a>
            </Reveal>

            <Reveal className="cpx-table" delay={0.08}>
              <div className="cpx-table__head">
                <span>Support structure</span>
                <span>Nine, regardless of project</span>
              </div>
              <dl className="cpx-table__rows">
                {SUPPORT_STRUCTURE.map((s, i) => (
                  <div className="cpx-table__row" key={s.k}>
                    <dt>
                      <span className="cpx-table__num" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                      {s.k}
                    </dt>
                    <dd>{s.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= 06 · REGISTER — the desk ================= */}
      <section className="cpx-register" id="register">
        <div className="container">
          <SectionHead
            index={6}
            eyebrow="Registration"
            title="Register as a partner."
            intro="Three short steps. Only the first is required to reach us — the rest exists so we can brief you on the right part of the portfolio when we call."
          />

          <div className="cpx-register__grid">
            <Reveal className="cpx-register__form">
              <LeadForm
                intent={LEAD_INTENTS.CHANNEL_PARTNER}
                source="Channel partner registration"
                eyebrow="Registration"
                heading="Tell us about your business."
                steps={REGISTRATION_STEPS}
                submitLabel="Submit registration"
                successMessage="Thank you — your registration has been received. Our partner team will verify your details and be in touch to complete onboarding."
              />
              <p className="cpx-register__note">{REGISTRATION_NOTE}</p>
            </Reveal>

            <aside className="cpx-register__aside">
              <Reveal className="cpx-register__media">
                <MediaFigure src={CP_MEDIA.support.src} credit={CP_MEDIA.support.credit} ratio="4 / 3" />
              </Reveal>

              <Reveal className="cpx-next" delay={0.05}>
                <h3 className="cpx-next__title">What happens next</h3>
                <ol className="cpx-next__list">
                  {PARTNER_JOURNEY.slice(0, 4).map((step, i) => (
                    <li key={step.title}>
                      <span aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                      <div>
                        <strong>{step.title}</strong>
                        <p>{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Partner desk"
        heading="Questions before you register?"
        body="Message the partner desk and we'll answer inventory, project and commercial questions directly."
        primaryLabel="Talk to the partner desk"
        secondary="whatsapp"
        whatsappMessage={waMessage.channelPartner()}
        image={CP_MEDIA.portfolio.src}
        enquiry={{
          intent: LEAD_INTENTS.CHANNEL_PARTNER,
          source: 'Channel Partners — desk',
          eyebrow: 'Partner desk',
          heading: 'Talk to the partner desk.',
          fields: ['name', 'phone', 'email', 'city', 'company', 'message'],
          submitLabel: 'Request a call',
          successMessage: 'Thank you — our partner team will be in touch.',
        }}
      />

      <StickyMobileCTA
        intent={LEAD_INTENTS.CHANNEL_PARTNER}
        enquiryLabel="Register"
        heading="Become a channel partner."
        message={waMessage.channelPartner()}
      />
    </>
  );
}
