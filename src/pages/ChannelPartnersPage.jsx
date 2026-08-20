import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';
import EditorialSplit from '../components/EditorialSplit';
import InfoGrid from '../components/InfoGrid';
import ProcessSteps from '../components/ProcessSteps';
import MediaFigure from '../components/MediaFigure';
import CtaBand from '../components/CtaBand';
import Reveal from '../components/Reveal';
import StickyMobileCTA from '../components/StickyMobileCTA';
import Breadcrumbs from '../components/Breadcrumbs';
import Seo from '../seo/Seo';
import { breadcrumbSchema, webPageSchema } from '../seo/schema';
import { waMessage } from '../services/whatsapp';
import { LEAD_INTENTS } from '../services/leads';
import { projectsList } from '../data/projects';
import {
  CP_INTRO, CP_MEDIA, WHY_PARTNER, PARTNER_BENEFITS,
  PARTNER_JOURNEY, COMMISSION_STATEMENT,
} from '../data/channelPartners';
import './ChannelPartnersPage.css';

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Channel Partners', path: '/channel-partners' },
];

export default function ChannelPartnersPage() {
  const portfolio = projectsList.filter((p) => p.thumbnail || p.hero_image).slice(0, 8);

  return (
    <>
      <Seo
        title="Channel Partners — sell Icon Realty projects in Indore"
        description="Partner with Icon Realty: seventeen plotted developments across Indore, a named relationship manager, current inventory, creatives, site-visit support and clear lead attribution."
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
            <Link to="/channel-partners/register" className="cta">Become a Channel Partner</Link>
            <Link to="/channel-partners/commission-support" className="cta cta--ghost">Commission & support</Link>
          </>
        }
      />

      <Breadcrumbs trail={TRAIL} />

      {/* ---------- WHY PARTNER ---------- */}
      <section className="cp-section">
        <div className="container">
          <SectionHeading
            eyebrow="Why partner with Icon"
            title="Four reasons, all of them checkable."
            lede="Nothing on this list depends on you taking our word for it — every claim points at a project you or your client can go and stand in."
          />
          <InfoGrid items={WHY_PARTNER} variant="media" columns={4} ratio="4 / 3" />
          <Reveal className="cp-section__action" delay={0.2}>
            <Link to="/channel-partners/why-icon" className="cta cta--ghost">The longer answer</Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- BENEFITS ---------- */}
      <section className="cp-section cp-section--alt">
        <div className="container">
          <EditorialSplit
            eyebrow="Partner benefits"
            title="Support that shows up on a Sunday."
            body="Most of what a channel partner needs from a developer is unglamorous: is the plot still available, can someone meet my client at the gate, and where is the deck. That is what this list is."
            media={{ src: CP_MEDIA.support.src, credit: CP_MEDIA.support.credit }}
            ratio="4 / 5"
          />
          <div className="cp-benefits">
            <InfoGrid items={PARTNER_BENEFITS} variant="text" columns={4} />
          </div>
        </div>
      </section>

      {/* ---------- PORTFOLIO ---------- */}
      <section className="cp-section">
        <div className="container">
          <SectionHeading
            eyebrow="Project portfolio"
            title={`${projectsList.length} developments to place a client in.`}
            lede="From 600 sq ft plots to 20,000 sq ft royal-estate plots — across the Super Corridor, the Indore–Nagpur Highway, Bicholi, Manglia, Simrol and Jhalaria."
          />
          <div className="cp-portfolio">
            {portfolio.map((p, i) => (
              <Reveal key={p.slug} delay={Math.min(i, 8) * 0.04}>
                <Link to={`/projects/${p.slug}`} className="cp-portfolio__card">
                  <MediaFigure
                    src={p.thumbnail || p.hero_image}
                    alt={`${p.name} — ${p.location}`}
                    ratio="4 / 5"
                  />
                  <span className="cp-portfolio__name">{p.name}</span>
                  <span className="cp-portfolio__meta">{p.location}</span>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal className="cp-section__action" delay={0.2}>
            <Link to="/projects" className="cta cta--ghost">All projects</Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- JOURNEY ---------- */}
      <section className="cp-section cp-section--alt">
        <div className="container">
          <SectionHeading
            eyebrow="The partner journey"
            title="Eight steps, in order."
            lede="Attribution is recorded at step five, before the first site visit — which is what stops the conversation at step eight from being an argument."
          />
          <ProcessSteps steps={PARTNER_JOURNEY} />

          <Reveal className="cp-commission" delay={0.15}>
            <p className="cp-commission__statement">{COMMISSION_STATEMENT}</p>
            <Link to="/channel-partners/commission-support" className="cta cta--ghost">
              What that covers
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaBand
        eyebrow="Registration"
        heading="Become a channel partner."
        body="Four fields to start. Business details and project focus come after, and only if you want to go further."
        primaryLabel="Register as a Partner"
        to="/channel-partners/register"
        secondary="whatsapp"
        whatsappMessage={waMessage.channelPartner()}
        image={CP_MEDIA.portfolio.src}
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
