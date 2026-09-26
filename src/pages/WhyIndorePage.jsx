import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';
import EditorialSplit from '../components/EditorialSplit';
import InfoGrid from '../components/InfoGrid';
import InfoCarousel from '../components/InfoCarousel';
import MediaFigure from '../components/MediaFigure';
import Reveal from '../components/Reveal';
import CtaBand from '../components/CtaBand';
import Breadcrumbs from '../components/Breadcrumbs';
import Seo from '../seo/Seo';
import { breadcrumbSchema, webPageSchema } from '../seo/schema';
import { LEAD_INTENTS } from '../services/leads';
import { projectsBySlug } from '../data/projects';
import {
  INDORE_INTRO, AT_A_GLANCE, INFRASTRUCTURE, EMPLOYMENT, EMPLOYMENT_NOTE,
  EDUCATION, HEALTHCARE, CORRIDORS, PRICE_HISTORY, PRICE_HISTORY_DISCLAIMER,
  INVESTMENT_DISCLAIMER, INDORE_MEDIA,
} from '../data/indore';
import './WhyIndorePage.css';

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Why Indore', path: '/why-indore' },
];

export default function WhyIndorePage() {
  return (
    <>
      <Seo
        title="Why Indore: infrastructure, employment and growth corridors"
        description="Indore's commercial economy, IIT and IIM campuses, metro construction, the Super Corridor and the Pithampur industrial belt, and the corridors Icon Realty builds on."
        path="/why-indore"
        image={INDORE_MEDIA.hero.src}
        jsonLd={[
          breadcrumbSchema(TRAIL),
          webPageSchema('WebPage', {
            name: 'Why Indore',
            description: "Infrastructure, employment and growth corridors in Indore, and where Icon Realty's projects sit on them.",
            path: '/why-indore',
          }),
        ]}
      />

      <PageHero
        eyebrow="The city"
        title={['Why Indore', 'is the answer.']}
        lede={INDORE_INTRO}
        media={{ src: INDORE_MEDIA.hero.src, credit: INDORE_MEDIA.hero.credit }}
      />

      <Breadcrumbs trail={TRAIL} />

      {/* ---------- AT A GLANCE ---------- */}
      <section className="wi-section wi-glance">
        <div className="container">
          <SectionHeading
            eyebrow="At a glance"
            title="Six things about this city that don't change with the market."
          />
          {/* Carousel rather than a grid: six facts in a 3-up block pushed the
              rest of the page down before the visitor had read any of them. */}
          <InfoCarousel items={AT_A_GLANCE} numbered ariaLabel="Indore at a glance" />
        </div>
      </section>

      {/* ---------- INFRASTRUCTURE ---------- */}
      <section className="wi-section wi-infra">
        <div className="container">
          <SectionHeading
            eyebrow="Infrastructure"
            title="What is built, and what is being built."
            lede="The distinction between operational and under-construction is the whole game when you are choosing a corridor. It is marked on every item below."
          />

          <div className="wi-infra__layout">
            <Reveal className="wi-infra__media">
              <MediaFigure
                src={INDORE_MEDIA.infrastructure.src}
                credit={INDORE_MEDIA.infrastructure.credit}
                ratio="3 / 4"
              />
            </Reveal>
            <div className="wi-infra__list">
              <InfoGrid items={INFRASTRUCTURE} variant="text" columns={2} />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- EMPLOYMENT ---------- */}
      <section className="wi-section wi-work">
        <div className="container">
          <EditorialSplit
            eyebrow="Employment"
            title="Demand that lives here."
            body={EMPLOYMENT_NOTE}
            media={{ src: INDORE_MEDIA.employment.src, credit: INDORE_MEDIA.employment.credit }}
            ratio="4 / 5"
            flip
          />

          <div className="wi-work__grid">
            <InfoGrid items={EMPLOYMENT} variant="text" columns={3} />
          </div>
        </div>
      </section>

      {/* ---------- EDUCATION & HEALTHCARE ---------- */}
      <section className="wi-section wi-institutions">
        <div className="container">
          <SectionHeading
            eyebrow="Institutions"
            title="Education and healthcare, for the region, not just the city."
          />

          <div className="wi-institutions__layout">
            <div className="wi-institutions__cols">
              <div className="wi-institutions__col">
                <h3 className="wi-institutions__title">Education</h3>
                <ul className="wi-institutions__list">
                  {EDUCATION.map((e, i) => (
                    <Reveal as="li" key={e.name} delay={Math.min(i, 6) * 0.04} y={18}>
                      <span className="wi-institutions__name">{e.name}</span>
                      <span className="wi-institutions__note">{e.note}</span>
                    </Reveal>
                  ))}
                </ul>
              </div>

              <div className="wi-institutions__col">
                <h3 className="wi-institutions__title">Healthcare</h3>
                <ul className="wi-institutions__list">
                  {HEALTHCARE.map((h, i) => (
                    <Reveal as="li" key={h.name} delay={Math.min(i, 6) * 0.04} y={18}>
                      <span className="wi-institutions__name">{h.name}</span>
                      <span className="wi-institutions__note">{h.note}</span>
                    </Reveal>
                  ))}
                </ul>
              </div>
            </div>

            <Reveal className="wi-institutions__media">
              <MediaFigure
                src={INDORE_MEDIA.institutions.src}
                credit={INDORE_MEDIA.institutions.credit}
                ratio="4 / 5"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- GROWTH CORRIDORS ---------- */}
      <section className="wi-section wi-corridors">
        <div className="container">
          <SectionHeading
            eyebrow="Growth corridors"
            title="Where we build, and why."
            lede="Six corridors, and the Icon Realty projects that sit on each one. Every photograph below is our own project on that corridor."
          />

          <div className="wi-corridors__grid">
            {CORRIDORS.map((c, i) => {
              const links = c.projects
                .map((slug) => projectsBySlug[slug])
                .filter(Boolean);

              return (
                <Reveal key={c.name} className="wi-corridor" delay={Math.min(i, 5) * 0.05}>
                  <MediaFigure src={c.image} credit={c.credit} alt={c.credit} ratio="16 / 10" />
                  <h3 className="wi-corridor__name">{c.name}</h3>
                  <p className="wi-corridor__body">{c.body}</p>
                  {links.length > 0 && (
                    <ul className="wi-corridor__links">
                      {links.map((p) => (
                        <li key={p.slug}>
                          <Link to={`/projects/${p.slug}`}>
                            {p.name}
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
                              <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- PRICE HISTORY ----------
          Rendered only when data/indore.js holds real, sourced figures. It is
          empty today, so the section is absent rather than showing a chart of
          numbers nobody can stand behind (read.md §29). */}
      {PRICE_HISTORY.length > 0 && (
        <section className="wi-section wi-prices">
          <div className="container">
            <SectionHeading
              eyebrow="Historical trends"
              title="Area price history."
              lede={PRICE_HISTORY_DISCLAIMER}
            />
            <div className="wi-prices__table">
              <table>
                <thead>
                  <tr><th>Area</th><th>Year</th><th>Average price</th><th>Source</th></tr>
                </thead>
                <tbody>
                  {PRICE_HISTORY.map((row, i) => (
                    <tr key={`${row.area}-${row.year}-${i}`}>
                      <td>{row.area}</td>
                      <td>{row.year}</td>
                      <td>{row.averagePrice ? `${row.averagePrice} ${row.unit || ''}`.trim() : ': '}</td>
                      <td>{row.source || ': '}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <section className="wi-disclaimer">
        <div className="container">
          <p>{INVESTMENT_DISCLAIMER}</p>
        </div>
      </section>

      <CtaBand
        eyebrow="Investor desk"
        heading="Talk it through with someone who builds here."
        body="A 20-minute call, corridor by corridor :  including the ones we don't build on."
        primaryLabel="Talk to an Investment Advisor"
        image={INDORE_MEDIA.hero.src}
        enquiry={{
          intent: LEAD_INTENTS.INVESTOR,
          source: 'Why Indore :  advisor',
          eyebrow: 'Investor desk',
          heading: 'Schedule an investment consultation.',
          fields: ['name', 'phone', 'preferredDate', 'preferredTime', 'budget'],
          submitLabel: 'Schedule the consultation',
        }}
      />
    </>
  );
}
