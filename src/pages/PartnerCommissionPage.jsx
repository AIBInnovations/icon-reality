import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';
import InfoGrid from '../components/InfoGrid';
import ProcessSteps from '../components/ProcessSteps';
import MediaFigure from '../components/MediaFigure';
import CtaBand from '../components/CtaBand';
import Reveal from '../components/Reveal';
import Breadcrumbs from '../components/Breadcrumbs';
import Seo from '../seo/Seo';
import { breadcrumbSchema, webPageSchema } from '../seo/schema';
import { waMessage } from '../services/whatsapp';
import {
  COMMISSION_STATEMENT, COMMISSION_NOTES, SUPPORT_STRUCTURE,
  PARTNER_JOURNEY, CP_MEDIA,
} from '../data/channelPartners';
import './ChannelPartnersPage.css';
import './PartnerCommissionPage.css';

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Channel Partners', path: '/channel-partners' },
  { name: 'Commission & Support', path: '/channel-partners/commission-support' },
];

export default function PartnerCommissionPage() {
  return (
    <>
      <Seo
        title="Commission & support structure — Icon Realty channel partners"
        description="How commercial terms work for Icon Realty channel partners, and the support structure that comes with them — relationship manager, inventory, creatives, site-visit support and lead attribution."
        path="/channel-partners/commission-support"
        image={CP_MEDIA.support.src}
        jsonLd={[
          breadcrumbSchema(TRAIL),
          webPageSchema('WebPage', {
            name: 'Commission & Support Structure',
            description: 'Commercial terms and partner support for Icon Realty channel partners.',
            path: '/channel-partners/commission-support',
          }),
        ]}
      />

      <PageHero
        eyebrow="Channel partners"
        title={['Commission', '& support.']}
        lede="We would rather tell you how terms are set than publish a percentage that turns out not to apply to the project you were about to sell."
        align="left"
      />

      <Breadcrumbs trail={TRAIL} />

      {/* ---------- COMMERCIAL TERMS ---------- */}
      <section className="cp-section">
        <div className="container">
          <div className="pc-terms">
            <div className="pc-terms__copy">
              <Reveal as="span" className="eyebrow pc-terms__eyebrow">Commercial terms</Reveal>
              <Reveal as="h2" className="display pc-terms__statement" delay={0.05}>
                {COMMISSION_STATEMENT}
              </Reveal>
              <Reveal className="pc-terms__notes" delay={0.1}>
                <ul>
                  {COMMISSION_NOTES.map((note) => (
                    <li key={note}>
                      <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden>
                        <path d="M3 9L7 13L15 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal className="pc-terms__action" delay={0.15}>
                <Link to="/channel-partners/register" className="cta">Register to receive terms</Link>
              </Reveal>
            </div>

            <Reveal className="pc-terms__media">
              <MediaFigure src={CP_MEDIA.support.src} credit={CP_MEDIA.support.credit} ratio="4 / 5" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- SUPPORT ---------- */}
      <section className="cp-section cp-section--alt">
        <div className="container">
          <SectionHeading
            eyebrow="Support structure"
            title="Nine things you get, regardless of project."
            lede="These do not vary by project or by phase — they are the baseline every verified partner works with."
          />
          <InfoGrid items={SUPPORT_STRUCTURE} variant="text" columns={3} numbered />
        </div>
      </section>

      {/* ---------- WHERE COMMISSION SITS ---------- */}
      <section className="cp-section">
        <div className="container">
          <SectionHeading
            eyebrow="In sequence"
            title="Where commission sits in the process."
            lede="Attribution at registration, terms in writing before you sell, processing after booking."
          />
          <ProcessSteps steps={PARTNER_JOURNEY} />
        </div>
      </section>

      <CtaBand
        eyebrow="Registration"
        heading="Get the terms for your project."
        body="Register, complete verification, and the commercial terms for the projects you want to sell are confirmed in writing."
        primaryLabel="Register as a Partner"
        to="/channel-partners/register"
        secondary="whatsapp"
        whatsappMessage={waMessage.channelPartner()}
        image={CP_MEDIA.portfolio.src}
      />
    </>
  );
}
