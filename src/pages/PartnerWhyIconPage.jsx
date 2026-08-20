import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';
import EditorialSplit from '../components/EditorialSplit';
import InfoGrid from '../components/InfoGrid';
import TrustModule from '../components/TrustModule';
import CtaBand from '../components/CtaBand';
import Breadcrumbs from '../components/Breadcrumbs';
import Seo from '../seo/Seo';
import { breadcrumbSchema, webPageSchema } from '../seo/schema';
import { waMessage } from '../services/whatsapp';
import { WHY_PARTNER, PARTNER_BENEFITS, CP_MEDIA } from '../data/channelPartners';
import './ChannelPartnersPage.css';

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Channel Partners', path: '/channel-partners' },
  { name: 'Why Partner With Icon', path: '/channel-partners/why-icon' },
];

export default function PartnerWhyIconPage() {
  return (
    <>
      <Seo
        title="Why partner with Icon Realty — Indore channel partners"
        description="A delivered portfolio your client can visit, a local brand with two decades behind it, range across price and format, and site-visit coordination that shows up."
        path="/channel-partners/why-icon"
        image={CP_MEDIA.portfolio.src}
        jsonLd={[
          breadcrumbSchema(TRAIL),
          webPageSchema('WebPage', {
            name: 'Why Partner With Icon',
            description: 'What Icon Realty offers channel partners selling plotted developments in Indore.',
            path: '/channel-partners/why-icon',
          }),
        ]}
      />

      <PageHero
        eyebrow="Channel partners"
        title={['Why partner', 'with Icon.']}
        lede="Every claim on this page points at something you or your client can go and verify — a delivered community, a published layout, a phone that gets answered."
        media={{ src: CP_MEDIA.portfolio.src, credit: CP_MEDIA.portfolio.credit }}
        align="left"
      />

      <Breadcrumbs trail={TRAIL} />

      <section className="cp-section">
        <div className="container">
          <SectionHeading
            eyebrow="The case"
            title="Four advantages, stated plainly."
          />
          <InfoGrid items={WHY_PARTNER} variant="media" columns={2} ratio="16 / 10" />
        </div>
      </section>

      <section className="cp-section cp-section--alt">
        <div className="container">
          <EditorialSplit
            eyebrow="Day to day"
            title="What you actually get, once you're onboarded."
            body="A named relationship manager rather than a shared inbox, and inventory information current enough that you are never selling a plot that went last week."
            items={PARTNER_BENEFITS.slice(0, 5)}
            media={{ src: CP_MEDIA.support.src, credit: CP_MEDIA.support.credit }}
            ratio="4 / 5"
            flip
            actions={
              <>
                <Link to="/channel-partners/register" className="cta">Register as a Partner</Link>
                <Link to="/channel-partners/commission-support" className="cta cta--ghost">Commission & support</Link>
              </>
            }
          />
        </div>
      </section>

      <TrustModule
        eyebrow="The developer behind it"
        heading="Two decades. One city."
        lede="The figures your client will ask you about, in one place."
        variant="compact"
        action={<Link to="/projects" className="cta cta--ghost">See the portfolio</Link>}
      />

      <CtaBand
        eyebrow="Registration"
        heading="Ready to start?"
        body="Four fields. Business details come after."
        primaryLabel="Register as a Partner"
        to="/channel-partners/register"
        secondary="whatsapp"
        whatsappMessage={waMessage.channelPartner()}
        image={CP_MEDIA.hero.src}
      />
    </>
  );
}
