import { Link, useParams } from 'react-router-dom';
import PageHero from '../components/PageHero';
import ProcessSteps from '../components/ProcessSteps';
import MediaFigure from '../components/MediaFigure';
import LeadForm from '../components/LeadForm';
import Reveal from '../components/Reveal';
import StickyMobileCTA from '../components/StickyMobileCTA';
import Breadcrumbs from '../components/Breadcrumbs';
import NotFoundPage from './NotFoundPage';
import Seo from '../seo/Seo';
import { breadcrumbSchema, webPageSchema } from '../seo/schema';
import { LEAD_INTENTS } from '../services/leads';
import { waMessage } from '../services/whatsapp';
import { NRI_TOPICS, NRI_TOPICS_BY_SLUG } from '../data/nri';
import './NriTopicPage.css';

/**
 * One component behind all six /nri/* routes.
 *
 * Everything a topic shows — steps, sections, notes, disclaimers, its CTA
 * wording — comes from data/nri.js, so adding a seventh topic is a data change
 * and needs no new page, no new route file and no new CSS (read.md §8).
 *
 * An unknown slug renders the real 404 rather than an empty topic shell.
 */
export default function NriTopicPage() {
  const { topic: slug } = useParams();
  const topic = NRI_TOPICS_BY_SLUG[slug];

  if (!topic) return <NotFoundPage />;

  const trail = [
    { name: 'Home', path: '/' },
    { name: 'NRI Corner', path: '/nri' },
    { name: topic.nav, path: `/nri/${topic.slug}` },
  ];

  const others = NRI_TOPICS.filter((t) => t.slug !== topic.slug);

  // "Virtual tour" leads are a different journey from general NRI assistance,
  // so the form's intent follows the topic rather than being NRI for all six.
  const intent = topic.slug === 'virtual-tours'
    ? LEAD_INTENTS.VIRTUAL_TOUR
    : LEAD_INTENTS.NRI;

  const waText = topic.slug === 'virtual-tours' ? waMessage.virtualTour() : waMessage.nri();

  return (
    <>
      <Seo
        title={`${topic.title} — NRI Corner`}
        description={topic.summary}
        path={`/nri/${topic.slug}`}
        image={topic.hero?.src}
        jsonLd={[
          breadcrumbSchema(trail),
          webPageSchema('WebPage', {
            name: topic.title,
            description: topic.summary,
            path: `/nri/${topic.slug}`,
          }),
        ]}
      />

      <PageHero
        eyebrow="NRI corner"
        title={topic.title.split(' ').length > 4
          ? [topic.title.split(' ').slice(0, Math.ceil(topic.title.split(' ').length / 2)).join(' '),
             topic.title.split(' ').slice(Math.ceil(topic.title.split(' ').length / 2)).join(' ')]
          : [topic.title]}
        lede={topic.intro}
        media={topic.hero ? { src: topic.hero.src, credit: topic.hero.credit } : undefined}
        align="left"
      />

      <Breadcrumbs trail={trail} />

      {/* ---------- STEPS (buying process) ---------- */}
      {topic.steps?.length > 0 && (
        <section className="nri-topic-section">
          <div className="container">
            <Reveal as="h2" className="display nri-topic-section__heading">
              The path, end to end.
            </Reveal>
            <ProcessSteps steps={topic.steps} className="nri-topic-section__steps" />
          </div>
        </section>
      )}

      {/* ---------- SECTIONS ---------- */}
      {topic.sections?.length > 0 && (
        <section className="nri-topic-section nri-topic-section--alt">
          <div className="container nri-topic-body">
            {topic.sections.map((section, i) => (
              <Reveal key={section.title} className="nri-topic-block" delay={Math.min(i, 4) * 0.05}>
                <h2 className="nri-topic-block__title">{section.title}</h2>
                <ul className="nri-topic-block__list">
                  {section.items.map((item) => (
                    <li key={item}>
                      <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden>
                        <path d="M3 9L7 13L15 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ---------- NOTE / DISCLAIMER ---------- */}
      {(topic.note || topic.disclaimer) && (
        <section className="nri-topic-note">
          <div className="container">
            {topic.note && (
              <Reveal as="p" className="nri-topic-note__body">{topic.note}</Reveal>
            )}
            {topic.disclaimer && (
              <Reveal as="p" className="nri-topic-note__disclaimer" delay={0.05}>
                {topic.disclaimer}
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* ---------- CTA FORM ---------- */}
      <section className="nri-topic-cta" id="enquire">
        <div className="container nri-topic-cta__grid">
          <div className="nri-topic-cta__copy">
            <Reveal as="span" className="eyebrow nri-topic-cta__eyebrow">NRI desk</Reveal>
            <Reveal as="h2" className="display nri-topic-cta__heading" delay={0.05}>
              {topic.ctaHeading}
            </Reveal>
            <Reveal as="p" className="nri-topic-cta__lede" delay={0.1}>{topic.ctaBody}</Reveal>

            <Reveal className="nri-topic-cta__links" delay={0.15}>
              <span className="nri-topic-cta__links-k">Other NRI topics</span>
              <ul>
                {others.map((t) => (
                  <li key={t.slug}>
                    <Link to={`/nri/${t.slug}`}>{t.nav}</Link>
                  </li>
                ))}
              </ul>
            </Reveal>

            {topic.hero && (
              <Reveal className="nri-topic-cta__media" delay={0.2}>
                <MediaFigure src={topic.hero.src} credit={topic.hero.credit} ratio="16 / 10" />
              </Reveal>
            )}
          </div>

          <Reveal className="nri-topic-cta__form" delay={0.15}>
            <LeadForm
              intent={intent}
              source={`NRI — ${topic.nav}`}
              eyebrow="Get in touch"
              heading={topic.ctaLabel || 'Speak with NRI assistance.'}
              fields={['name', 'phone', 'email', 'country', 'preferredDate', 'preferredTime', 'message']}
              submitLabel={topic.ctaLabel || 'Request a call'}
              successMessage="Thank you — our NRI desk will be in touch at the time you selected."
            />
          </Reveal>
        </div>
      </section>

      <StickyMobileCTA
        intent={intent}
        enquiryLabel="NRI Desk"
        heading={topic.ctaLabel || 'Speak with NRI assistance.'}
        message={waText}
      />
    </>
  );
}
