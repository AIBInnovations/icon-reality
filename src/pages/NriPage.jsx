import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import MediaFigure from '../components/MediaFigure';
import Disclosure from '../components/Disclosure';
import TrustModule from '../components/TrustModule';
import CtaBand from '../components/CtaBand';
import Reveal from '../components/Reveal';
import StickyMobileCTA from '../components/StickyMobileCTA';
import Breadcrumbs from '../components/Breadcrumbs';
import Seo from '../seo/Seo';
import { breadcrumbSchema, webPageSchema } from '../seo/schema';
import { scrollToSection } from '../utils/scrollTo';
import { LEAD_INTENTS } from '../services/leads';
import { waMessage } from '../services/whatsapp';
import {
  NRI_INTRO, NRI_TOPICS_BY_SLUG, NRI_ASSURANCES, NRI_MEDIA, NRI_DESK,
} from '../data/nri';
import './NriPage.css';

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'NRI Corner', path: '/nri' },
];

/**
 * The NRI Corner — ONE page.
 *
 * It used to be a hub plus six topic routes. The six topics are now six
 * sections of this document, each with an `id` matching its old slug, so the
 * header dropdown (/nri#taxation), the jump rail and every existing inbound
 * link land in the same place. /nri/<slug> redirects here — see App.jsx.
 *
 * Every section is deliberately laid out differently. Six identical
 * photo-and-two-columns blocks stacked on one page reads as a document dump;
 * the point of merging them was to make one continuous piece of editorial, so
 * the process is a dark staircase, the legal section a dossier with a sticky
 * plate, taxation a four-column ledger, loans a set of cards riding over a
 * wide image, virtual tours a call viewport, and the POA section a sheet of
 * ruled paper. Shared rhythm (the numbered section heads), different form.
 */

const T = NRI_TOPICS_BY_SLUG;

/** Roman numerals for the taxation ledger — four columns, nothing more. */
const ROMAN = ['I', 'II', 'III', 'IV'];

/** The shared section opener: index, rule, title, intro. Tone flips on dark. */
/**
 * The shared section opener.
 *
 * `split` sets the title and the intro side by side instead of stacked. On a
 * page this long the stacked version cost roughly a screen of height per
 * section before a reader reached any actual content; side by side it reads as
 * one editorial spread and the sections stop feeling padded out.
 */
function SectionHead({ index, eyebrow, title, intro, tone = 'light', split = false }) {
  return (
    <div className={`nrix-head nrix-head--${tone} ${split ? 'nrix-head--split' : ''}`}>
      <Reveal className="nrix-head__meta">
        <span className="nrix-head__index" aria-hidden>{String(index).padStart(2, '0')}</span>
        <span className="nrix-head__rule" aria-hidden />
        <span className="nrix-head__eyebrow">{eyebrow}</span>
      </Reveal>
      <Reveal as="h2" className="nrix-head__title" delay={0.05}>{title}</Reveal>
      {intro && <Reveal as="p" className="nrix-head__intro" delay={0.1}>{intro}</Reveal>}
    </div>
  );
}

/** The enquiry band lives at the bottom of the page, not on a route of its own. */
const jumpToForm = (e) => {
  e.preventDefault();
  scrollToSection('enquire');
};

function Tick() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M3 9L7 13L15 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function NriPage() {
  const process = T['buying-process'];
  const legal = T['legal-rera'];
  const tax = T.taxation;
  const loans = T['home-loans'];
  const tours = T['virtual-tours'];
  const poa = T['power-of-attorney'];

  return (
    <>
      <Seo
        title="NRI Corner: buying property in Indore from abroad"
        description="One page for NRI buyers: the buying process, legal & RERA support, taxation, home loans, virtual tours and power of attorney guidance, from Icon Realty in Indore."
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

      {/* ============ THE DESK — intro + assurances ribbon ============ */}
      <section className="nrix-desk">
        <div className="container nrix-desk__grid">
          <div className="nrix-desk__copy">
            <Reveal as="span" className="eyebrow nrix-desk__eyebrow">The NRI desk</Reveal>
            <Reveal as="p" className="nrix-desk__quote" delay={0.05}>
              One person, your time zone, the whole way through.
            </Reveal>
            <Reveal as="p" className="nrix-desk__body" delay={0.1}>
              The distance problem in an overseas purchase is not the property. It is
              that every question needs someone standing on the site or at the
              sub-registrar. That is the job this desk does.
            </Reveal>
          </div>

          <Reveal className="nrix-desk__plate" delay={0.1}>
            <MediaFigure
              src={NRI_MEDIA.support.src}
              credit={NRI_MEDIA.support.credit}
              alt="Icon Realty project photography"
              ratio="4 / 3"
            />
          </Reveal>
        </div>

        <div className="container">
          <ul className="nrix-ribbon">
            {NRI_ASSURANCES.map((a, i) => (
              <Reveal as="li" key={a.k} className="nrix-ribbon__item" delay={Math.min(i, 4) * 0.05}>
                <span className="nrix-ribbon__k">{a.k}</span>
                <span className="nrix-ribbon__v">{a.v}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ 01 — BUYING PROCESS · dark staircase ============ */}
      <section className="nrix-process" id="buying-process">
        <div className="container">
          <SectionHead
            index={1}
            eyebrow="Buying process"
            title={process.title}
            intro={process.intro}
            tone="dark"
            split
          />

          {/* Nine steps, three across: the sequence reads in rows and the
              section is a third of the height a nine-row list would be. */}
          <ol className="nrix-steps">
            {process.steps.map((step, i) => (
              <Reveal
                as="li"
                key={step.title}
                className="nrix-step"
                delay={Math.min(i, 5) * 0.04}
              >
                <span className="nrix-step__num" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                <div className="nrix-step__body">
                  <h3 className="nrix-step__title">{step.title}</h3>
                  <p className="nrix-step__copy">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal className="nrix-process__foot" delay={0.1}>
            <p>{process.ctaBody}</p>
            <a href="#enquire" className="cta cta--ghost nrix-process__cta" onClick={jumpToForm}>
              {process.ctaHeading}
            </a>
          </Reveal>
        </div>
      </section>

      {/* ============ 02 — LEGAL & RERA · dossier ============ */}
      {/* A wide plate across the top, then the two checklists side by side.
          The plate used to be a tall column beside them, which left most of a
          screen of empty cream under it whenever the lists ran longer than the
          photograph — and they always do. */}
      <section className="nrix-legal" id="legal-rera">
        <div className="container">
          <SectionHead index={2} eyebrow="Legal & RERA" title={legal.title} intro={legal.intro} split />

          <Reveal className="nrix-legal__plate">
            <MediaFigure
              src={legal.hero.src}
              credit={legal.hero.credit}
              alt={legal.title}
              ratio="16 / 6"
            />
            <span className="nrix-legal__stamp" aria-hidden>MP&nbsp;RERA</span>
          </Reveal>

          <div className="nrix-legal__cols">
            {legal.sections.map((section, si) => (
              <Reveal key={section.title} className="nrix-legal__block" delay={si * 0.06}>
                <Disclosure
                  title={section.title}
                  titleClassName="nrix-legal__block-title"
                >
                  <ol className="nrix-legal__list">
                    {section.items.map((item, i) => (
                      <li key={item}>
                        <span className="nrix-legal__marker" aria-hidden>
                          {String.fromCharCode(97 + i)}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </Disclosure>
              </Reveal>
            ))}
          </div>

          {legal.note && (
            <Reveal as="p" className="nrix-legal__note" delay={0.1}>
              <span className="nrix-legal__note-tag">Note</span>
              {legal.note}
            </Reveal>
          )}
        </div>
      </section>

      {/* ============ 03 — TAXATION · four-column ledger ============ */}
      <section className="nrix-tax" id="taxation">
        <div className="container">
          <SectionHead index={3} eyebrow="Taxation" title={tax.title} intro={tax.intro} />

          <div className="nrix-ledger">
            {tax.sections.map((section, i) => (
              <Reveal key={section.title} className="nrix-ledger__col" delay={Math.min(i, 4) * 0.06}>
                <Disclosure
                  title={section.title}
                  titleClassName="nrix-ledger__title"
                  prefix={<span className="nrix-ledger__roman" aria-hidden>{ROMAN[i] || i + 1}</span>}
                >
                  <ul className="nrix-ledger__list">
                    {section.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </Disclosure>
              </Reveal>
            ))}
          </div>

          {tax.disclaimer && (
            <Reveal className="nrix-tax__disclaimer" delay={0.1}>
              <span className="nrix-tax__disclaimer-tag">No rates are quoted on this page</span>
              <p>{tax.disclaimer}</p>
            </Reveal>
          )}
        </div>
      </section>

      {/* ============ 04 — HOME LOANS · cards riding a wide image ======= */}
      <section className="nrix-loans" id="home-loans">
        <div className="container">
          <SectionHead index={4} eyebrow="Home loans" title={loans.title} intro={loans.intro} />
        </div>

        <div className="nrix-loans__band">
          <img
            src={loans.hero.src}
            alt=""
            loading="lazy"
            decoding="async"
            className="nrix-loans__bg"
          />
          <span className="nrix-loans__credit">{loans.hero.credit}</span>
        </div>

        <div className="container">
          <div className="nrix-loans__cards">
            {loans.sections.map((section, i) => (
              <Reveal key={section.title} className="nrix-loans__card" delay={Math.min(i, 3) * 0.06}>
                <Disclosure
                  title={section.title}
                  titleClassName="nrix-loans__card-title"
                  prefix={<span className="nrix-loans__card-index" aria-hidden>{String(i + 1).padStart(2, '0')}</span>}
                >
                  <ul className="nrix-loans__card-list">
                    {section.items.map((item) => (
                      <li key={item}><Tick /><span>{item}</span></li>
                    ))}
                  </ul>
                </Disclosure>
              </Reveal>
            ))}
          </div>

          {loans.note && (
            <Reveal as="p" className="nrix-loans__note" delay={0.1}>{loans.note}</Reveal>
          )}
        </div>
      </section>

      {/* ============ 05 — VIRTUAL TOURS · call viewport ============ */}
      <section className="nrix-tours" id="virtual-tours">
        <div className="container">
          <SectionHead
            index={5}
            eyebrow="Virtual tours"
            title={tours.title}
            intro={tours.intro}
            tone="dark"
          />

          <Reveal className="nrix-viewport">
            <span className="nrix-viewport__frame">
              <img src={tours.hero.src} alt={tours.hero.credit} loading="lazy" decoding="async" />
              <span className="nrix-viewport__badge">
                <span className="nrix-viewport__dot" aria-hidden />
                Live from site
              </span>
              <span className="nrix-viewport__caption">{tours.hero.credit}</span>
            </span>
          </Reveal>

          <div className="nrix-tours__cols">
            {tours.sections.map((section, i) => (
              <Reveal key={section.title} className="nrix-tours__col" delay={Math.min(i, 2) * 0.06}>
                <Disclosure
                  title={section.title}
                  titleClassName="nrix-tours__title"
                  prefix={<span className="nrix-tours__num" aria-hidden>{String(i + 1).padStart(2, '0')}</span>}
                >
                  <ul className="nrix-tours__list">
                    {section.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </Disclosure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 06 — POWER OF ATTORNEY · ruled sheet ============ */}
      <section className="nrix-poa" id="power-of-attorney">
        <div className="container">
          <SectionHead index={6} eyebrow="Power of attorney" title={poa.title} intro={poa.intro} />

          <div className="nrix-sheet">
            <div className="nrix-sheet__margin" aria-hidden>
              <MediaFigure src={poa.hero.src} credit={poa.hero.credit} ratio="3 / 4" />
            </div>

            <div className="nrix-sheet__body">
              {poa.sections.map((section, i) => (
                <Reveal key={section.title} className="nrix-sheet__block" delay={Math.min(i, 3) * 0.05}>
                  <Disclosure
                    title={section.title}
                    titleClassName="nrix-sheet__title"
                    prefix={<span className="nrix-sheet__clause" aria-hidden>{`§ ${i + 1}`}</span>}
                  >
                    <ul className="nrix-sheet__list">
                      {section.items.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </Disclosure>
                </Reveal>
              ))}

              {poa.note && (
                <Reveal as="p" className="nrix-sheet__note" delay={0.1}>{poa.note}</Reveal>
              )}
            </div>
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

      <section className="nrix-desknote">
        <div className="container">
          <p className="nrix-desknote__body">{NRI_DESK.note}</p>
        </div>
      </section>

      <div id="enquire">
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
            source: 'NRI Corner: desk',
            eyebrow: 'NRI desk',
            heading: 'Speak with NRI assistance.',
            fields: ['name', 'phone', 'email', 'country', 'preferredDate', 'preferredTime', 'message'],
            submitLabel: 'Request a call',
            successMessage: 'Thank you, our NRI desk will be in touch at the time you selected.',
          }}
        />
      </div>

      <StickyMobileCTA
        intent={LEAD_INTENTS.NRI}
        enquiryLabel="NRI Desk"
        heading="Speak with NRI assistance."
        message={waMessage.nri()}
      />
    </>
  );
}
