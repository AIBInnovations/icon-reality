import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import LeadForm from '../components/LeadForm';
import MediaFigure from '../components/MediaFigure';
import ProcessSteps from '../components/ProcessSteps';
import Reveal from '../components/Reveal';
import Breadcrumbs from '../components/Breadcrumbs';
import Seo from '../seo/Seo';
import { breadcrumbSchema, webPageSchema } from '../seo/schema';
import { LEAD_INTENTS } from '../services/leads';
import {
  REGISTRATION_STEPS, REGISTRATION_NOTE, PARTNER_JOURNEY, CP_MEDIA,
} from '../data/channelPartners';
import './ChannelPartnersPage.css';
import './PartnerRegisterPage.css';

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Channel Partners', path: '/channel-partners' },
  { name: 'Register', path: '/channel-partners/register' },
];

/**
 * The channel-partner registration.
 *
 * Deliberately NOT the buyer contact form (read.md §43): a partner submits
 * business details a homebuyer never would, and the lead lands in the CRM with
 * a channel-partner intent so it is routed to the right desk. Three steps of
 * progressive disclosure — four fields at a time — rather than one wall of
 * twelve inputs.
 */
export default function PartnerRegisterPage() {
  return (
    <>
      <Seo
        title="Channel partner registration — Icon Realty, Indore"
        description="Register as an Icon Realty channel partner. Four fields to start; business details and project focus follow. Verification, onboarding and project access after that."
        path="/channel-partners/register"
        image={CP_MEDIA.hero.src}
        jsonLd={[
          breadcrumbSchema(TRAIL),
          webPageSchema('WebPage', {
            name: 'Channel Partner Registration',
            description: 'Registration form for channel partners selling Icon Realty projects in Indore.',
            path: '/channel-partners/register',
          }),
        ]}
      />

      <PageHero
        eyebrow="Channel partners"
        title={['Register as', 'a partner.']}
        lede="Three short steps. Only the first is required to reach us — the rest exists so we can brief you on the right part of the portfolio when we call."
        align="left"
      />

      <Breadcrumbs trail={TRAIL} />

      <section className="pr-section">
        <div className="container pr-grid">
          <Reveal className="pr-form">
            <LeadForm
              intent={LEAD_INTENTS.CHANNEL_PARTNER}
              source="Channel partner registration"
              eyebrow="Registration"
              heading="Tell us about your business."
              steps={REGISTRATION_STEPS}
              submitLabel="Submit registration"
              successMessage="Thank you — your registration has been received. Our partner team will verify your details and be in touch to complete onboarding."
            />
            <p className="pr-form__note">{REGISTRATION_NOTE}</p>
          </Reveal>

          <aside className="pr-aside">
            <Reveal className="pr-aside__media">
              <MediaFigure src={CP_MEDIA.hero.src} credit={CP_MEDIA.hero.credit} ratio="4 / 3" />
            </Reveal>

            <Reveal className="pr-aside__block" delay={0.05}>
              <h2 className="pr-aside__title">What happens next</h2>
              <ProcessSteps steps={PARTNER_JOURNEY.slice(0, 4)} className="pr-aside__steps" />
            </Reveal>

            <Reveal className="pr-aside__links" delay={0.1}>
              <Link to="/channel-partners/why-icon">Why partner with Icon</Link>
              <Link to="/channel-partners/commission-support">Commission & support</Link>
              <Link to="/projects">The project portfolio</Link>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
