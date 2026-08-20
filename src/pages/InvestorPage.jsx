import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';
import EditorialSplit from '../components/EditorialSplit';
import InfoGrid from '../components/InfoGrid';
import TrustModule from '../components/TrustModule';
import LeadForm from '../components/LeadForm';
import MediaFigure from '../components/MediaFigure';
import Reveal from '../components/Reveal';
import StickyMobileCTA from '../components/StickyMobileCTA';
import Breadcrumbs from '../components/Breadcrumbs';
import Seo from '../seo/Seo';
import { breadcrumbSchema, webPageSchema } from '../seo/schema';
import { LEAD_INTENTS } from '../services/leads';
import { waMessage } from '../services/whatsapp';
import { projectsByStatus } from '../data/projects';
import {
  INVESTOR_INTRO, WHY_ICON, OPPORTUNITY_TYPES, DUE_DILIGENCE,
  MARKET_NOTES, CONSULTATION, DISCLAIMER, INVESTOR_MEDIA,
} from '../data/investor';
import { CORRIDORS } from '../data/indore';
import './InvestorPage.css';

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Investor Corner', path: '/investors' },
];

export default function InvestorPage() {
  const ongoing = projectsByStatus('trending').slice(0, 4);

  return (
    <>
      <Seo
        title="Investor Corner — plotted land investment in Indore"
        description="Evaluate plotted land in Indore with Icon Realty: growth corridors, what to verify before you buy, and an investment consultation with a developer who has delivered here for two decades."
        path="/investors"
        image={INVESTOR_MEDIA.hero.src}
        jsonLd={[
          breadcrumbSchema(TRAIL),
          webPageSchema('WebPage', {
            name: 'Investor Corner',
            description: 'Investment information, growth corridors and consultation booking for Icon Realty projects in Indore.',
            path: '/investors',
          }),
        ]}
      />

      <PageHero
        eyebrow="Investor corner"
        title={['Land you can', 'actually inspect.']}
        lede={INVESTOR_INTRO}
        media={{ src: INVESTOR_MEDIA.hero.src, credit: INVESTOR_MEDIA.hero.credit }}
      />

      <Breadcrumbs trail={TRAIL} />

      {/* ---------- WHY ICON ---------- */}
      <section className="inv-section">
        <div className="container">
          <EditorialSplit
            eyebrow="Why Icon Realty"
            title="Nine communities you can visit before you buy the tenth."
            body="The most useful thing an investor can do in Indore is walk a development we finished five years ago. The road widths, the drainage, the tree cover and the way the layout has aged tell you more than any brochure will."
            items={WHY_ICON}
            media={{ src: INVESTOR_MEDIA.track.src, credit: INVESTOR_MEDIA.track.credit }}
            ratio="4 / 5"
            actions={<Link to="/projects" className="cta cta--ghost">See the delivered projects</Link>}
          />
        </div>
      </section>

      {/* ---------- OPPORTUNITY TYPES ---------- */}
      <section className="inv-section inv-section--alt">
        <div className="container">
          <SectionHeading
            eyebrow="Approaches"
            title="Four ways people hold plotted land."
            lede="Descriptive, not prescriptive — which of these fits depends on your horizon and your reasons, and it is worth deciding before you look at a single plot."
          />
          <InfoGrid items={OPPORTUNITY_TYPES} variant="media" columns={4} ratio="4 / 3" />
        </div>
      </section>

      {/* ---------- WHY INDORE (short, links out) ---------- */}
      <section className="inv-section">
        <div className="container">
          <SectionHeading
            eyebrow="The market"
            title="Indore, in three observations."
          />
          <InfoGrid items={MARKET_NOTES} variant="text" columns={3} numbered />

          <div className="inv-corridors">
            <Reveal as="h3" className="inv-corridors__title">Growth corridors</Reveal>
            <ul className="inv-corridors__list">
              {CORRIDORS.map((c, i) => (
                <Reveal as="li" key={c.name} delay={Math.min(i, 6) * 0.04} y={18}>
                  <span className="inv-corridors__name">{c.name}</span>
                  <span className="inv-corridors__body">{c.body}</span>
                </Reveal>
              ))}
            </ul>
            <Reveal className="inv-corridors__action" delay={0.2}>
              <Link to="/why-indore" className="cta cta--ghost">Read the full Why Indore brief</Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- DUE DILIGENCE ---------- */}
      <section className="inv-section inv-section--alt">
        <div className="container">
          <EditorialSplit
            eyebrow="Due diligence"
            title="What to check — including on us."
            body="If a developer is uncomfortable with any item on this list, that is the finding. We publish our layouts openly for the same reason."
            items={DUE_DILIGENCE}
            media={{ src: INVESTOR_MEDIA.diligence.src, credit: INVESTOR_MEDIA.diligence.credit }}
            ratio="4 / 5"
            flip
          />
        </div>
      </section>

      {/* ---------- PROJECT OPPORTUNITIES ---------- */}
      {ongoing.length > 0 && (
        <section className="inv-section">
          <div className="container">
            <SectionHeading
              eyebrow="Currently selling"
              title="Projects open for investment."
              lede="Plot sizes, layouts and galleries are all viewable without a form."
            />
            <div className="inv-projects">
              {ongoing.map((p, i) => (
                <Reveal key={p.slug} delay={Math.min(i, 4) * 0.05}>
                  <Link to={`/projects/${p.slug}`} className="inv-project">
                    <MediaFigure src={p.thumbnail || p.hero_image} alt={`${p.name} — ${p.location}`} ratio="4 / 5" />
                    <span className="inv-project__name">{p.name}</span>
                    <span className="inv-project__meta">{p.location}</span>
                    {p.plot_sizes && <span className="inv-project__plots">{p.plot_sizes}</span>}
                  </Link>
                </Reveal>
              ))}
            </div>
            <Reveal className="inv-projects__action" delay={0.2}>
              <Link to="/projects" className="cta cta--ghost">All projects</Link>
            </Reveal>
          </div>
        </section>
      )}

      <TrustModule
        eyebrow="Track record"
        heading="Two decades. One city. One standard."
        lede="Every figure below is one Icon Realty has published. Nothing here is modelled or projected."
        media={{ src: '/images/ruchi-lifescapes/gallery-4.jpg', credit: 'Ruchi Lifescapes, Jhalaria — delivered' }}
        className="inv-section--alt"
      />

      {/* ---------- CONSULTATION ---------- */}
      <section className="inv-consult" id="consultation">
        <div className="container inv-consult__grid">
          <div className="inv-consult__copy">
            <Reveal as="span" className="eyebrow inv-consult__eyebrow">{CONSULTATION.eyebrow}</Reveal>
            <Reveal as="h2" className="display inv-consult__heading" delay={0.05}>
              {CONSULTATION.heading}
            </Reveal>
            <Reveal as="p" className="inv-consult__lede" delay={0.1}>{CONSULTATION.hint}</Reveal>
            <Reveal className="inv-consult__aside" delay={0.15}>
              <MediaFigure
                src="/images/labham-city/photo-4.jpg"
                credit="Labham City, Super Corridor"
                ratio="16 / 10"
              />
            </Reveal>
          </div>

          <Reveal className="inv-consult__form" delay={0.15}>
            <LeadForm
              intent={LEAD_INTENTS.INVESTOR}
              source="Investor Corner — consultation"
              eyebrow="Book a slot"
              heading="Schedule an investment consultation."
              /* Name and phone are the only required fields; date, time and
                 range are optional and asked once, not across three steps. */
              fields={['name', 'phone', 'email', 'preferredDate', 'preferredTime', 'budget', 'message']}
              submitLabel={CONSULTATION.submitLabel}
              successMessage={CONSULTATION.success}
            />
          </Reveal>
        </div>
      </section>

      <section className="inv-disclaimer">
        <div className="container">
          <p>{DISCLAIMER}</p>
        </div>
      </section>

      <StickyMobileCTA
        intent={LEAD_INTENTS.INVESTOR}
        enquiryLabel="Consult"
        heading="Schedule an investment consultation."
        message={waMessage.investor()}
      />
    </>
  );
}
