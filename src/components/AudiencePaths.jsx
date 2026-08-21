import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import MediaFigure from './MediaFigure';
import './AudiencePaths.css';

/**
 * The homepage's door into the new sections.
 *
 * Four audiences, four routes. Without this the Why Indore / Investor / NRI /
 * Channel Partner pages would only be reachable from the header, which on a
 * phone means behind a hamburger — the new information architecture has to be
 * visible on the page a first-time visitor actually lands on.
 *
 * Photography is Icon Realty's own project work, captioned with the project it
 * shows, in keeping with every other image-led section on the site.
 */
const PATHS = [
  {
    eyebrow: 'The city',
    title: 'Why Indore',
    body: 'Infrastructure, employment and the corridors that are actually being built.',
    to: '/why-indore',
    image: '/images/labham-city/photo-2.jpg',
    credit: 'Labham City, Super Corridor',
  },
  {
    eyebrow: 'For investors',
    title: 'Investor Corner',
    body: 'How to evaluate plotted land here, and what to verify before you buy it.',
    to: '/investors',
    image: '/images/oscar-billionaire/gallery-1.jpg',
    credit: 'Oscar Billionaire, Bicholi Hapsi',
  },
  {
    eyebrow: 'For NRI buyers',
    title: 'NRI Corner',
    body: 'Buying process, legal and RERA, taxation, home loans, virtual tours and POA.',
    to: '/nri',
    image: '/images/oscar/photos/photo-4.jpg',
    credit: 'Oscar Palace, Indore–Nagpur Highway',
  },
  {
    eyebrow: 'For partners',
    title: 'Channel Partners',
    body: 'Sixteen developments, current inventory, and support that shows up on site.',
    to: '/channel-partners',
    image: '/images/oscar-fort/gallery-6.jpg',
    credit: 'Oscar Fort, Bicholi Mardana',
  },
];

export default function AudiencePaths() {
  return (
    <section className="audience-paths">
      <div className="container">
        <div className="audience-paths__head">
          <Reveal as="span" className="eyebrow audience-paths__eyebrow">Where to next</Reveal>
          <Reveal as="h2" className="display audience-paths__heading" delay={0.05}>
            Four ways in.
          </Reveal>
          <Reveal as="p" className="audience-paths__lede" delay={0.1}>
            Whether you are buying a home, placing capital, buying from abroad or selling
            for us, there is a section written for you.
          </Reveal>
        </div>

        <div className="audience-paths__grid">
          {PATHS.map((path, i) => (
            <Reveal key={path.to} delay={Math.min(i, 4) * 0.06}>
              <Link to={path.to} className="audience-path">
                <MediaFigure src={path.image} credit={path.credit} alt={path.title} ratio="4 / 5" />
                <span className="audience-path__eyebrow">{path.eyebrow}</span>
                <h3 className="audience-path__title">{path.title}</h3>
                <p className="audience-path__body">{path.body}</p>
                <span className="audience-path__cta">
                  Explore
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
  );
}
