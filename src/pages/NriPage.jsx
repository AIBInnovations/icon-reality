import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';
import EditorialSplit from '../components/EditorialSplit';
import MediaFigure from '../components/MediaFigure';
import TrustModule from '../components/TrustModule';
import CtaBand from '../components/CtaBand';
import Reveal from '../components/Reveal';
import StickyMobileCTA from '../components/StickyMobileCTA';
import Breadcrumbs from '../components/Breadcrumbs';
import Seo from '../seo/Seo';
import { breadcrumbSchema, webPageSchema } from '../seo/schema';
import { LEAD_INTENTS } from '../services/leads';
import { waMessage } from '../services/whatsapp';
import { NRI_INTRO, NRI_TOPICS, NRI_ASSURANCES, NRI_MEDIA, NRI_DESK } from '../data/nri';
import './NriPage.css';

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'NRI Corner', path: '/nri' },
];

export default function NriPage() {
  return (
    <>
      <Seo
        title="NRI Corner — buying property in Indore from abroad"
        description="Buying process, legal & RERA support, taxation, home loans, virtual tours and power of attorney guidance for NRI buyers, from Icon Realty in Indore."
        path="/nri"
        image={NRI_MEDIA.hero.src}
        jsonLd={[
          breadcrumbSchema(TRAIL),
          webPageSchema('WebPage', {
            name: 'NRI Corner',
            description: 'Support for non-resident Indian buyers purchasing plotted property in Indore.',
            path: '/nri',
          }),
        ]}
      />

      <PageHero
        eyebrow="NRI corner"
        title={['Buy from', 'anywhere.']}
        lede={NRI_INTRO}
        media={{ src: NRI_MEDIA.hero.src, credit: NRI_MEDIA.hero.credit }}
      />

      <Breadcrumbs trail={TRAIL} />

      {/* ---------- ASSURANCES ---------- */}
      <section className="nri-section">
        <div className="container">
          <EditorialSplit
            eyebrow="How we work with NRI buyers"
            title="One person, your time zone, the whole way through."
            body="The distance problem in an overseas purchase is not the property — it is that every question needs someone standing on the site or at the sub-registrar. That is the job our NRI desk does."
            items={NRI_ASSURANCES}
            media={{ src: NRI_MEDIA.support.src, credit: NRI_MEDIA.support.credit }}
            ratio="4 / 5"
            flip
          />
        </div>
      </section>

      {/* ---------- TOPIC HUB ---------- */}
      <section className="nri-section nri-section--alt" id="topics">
        <div className="container">
          <SectionHeading
            eyebrow="Six things to work through"
            title="Start wherever your question is."
            lede="Each of these is a page of its own — written as general information, with the limits of that information stated on the page rather than buried."
          />

          <div className="nri-topics">
            {NRI_TOPICS.map((topic, i) => (
              <Reveal key={topic.slug} delay={Math.min(i, 6) * 0.05}>
                <Link to={`/nri/${topic.slug}`} className="nri-topic">
                  <MediaFigure
                    src={topic.hero?.src}
                    credit={topic.hero?.credit}
                    alt={topic.title}
                    ratio="16 / 10"
                  />
                  <span className="nri-topic__num" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="nri-topic__title">{topic.title}</h3>
                  <p className="nri-topic__summary">{topic.summary}</p>
                  <span className="nri-topic__cta">
                    Read more
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
                      <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <TrustModule
        eyebrow="Who you're buying from"
        heading="A developer you can check on, from anywhere."
        lede="Nine delivered communities in Indore, all of which a friend or relative in the city can visit on your behalf this weekend."
        variant="compact"
        action={<Link to="/projects" className="cta cta--ghost">See the projects</Link>}
      />

      <section className="nri-desk">
        <div className="container">
          <p className="nri-desk__note">{NRI_DESK.note}</p>
        </div>
      </section>

      <CtaBand
        eyebrow="NRI desk"
        heading="Speak with NRI assistance."
        body="Tell us where you are and when suits. We'll call at a reasonable hour in your zone."
        primaryLabel="Speak With NRI Desk"
        secondary="whatsapp"
        whatsappMessage={waMessage.nri()}
        image={NRI_MEDIA.hero.src}
        enquiry={{
          intent: LEAD_INTENTS.NRI,
          source: 'NRI Corner — desk',
          eyebrow: 'NRI desk',
          heading: 'Speak with NRI assistance.',
          fields: ['name', 'phone', 'email', 'country', 'preferredDate', 'preferredTime', 'message'],
          submitLabel: 'Request a call',
          successMessage: "Thank you — our NRI desk will be in touch at the time you selected.",
        }}
      />

      <StickyMobileCTA
        intent={LEAD_INTENTS.NRI}
        enquiryLabel="NRI Desk"
        heading="Speak with NRI assistance."
        message={waMessage.nri()}
      />
    </>
  );
}
