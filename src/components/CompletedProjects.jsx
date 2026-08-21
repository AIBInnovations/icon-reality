import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import { projectsList, CATEGORY_LABEL } from '../data/projects';
import './CompletedProjects.css';

/**
 * Delivered projects only (change.md #7).
 *
 * This section used to list the whole portfolio under a "completed" heading,
 * so a project still selling and a project handed over a decade ago looked
 * identical. Now it reads `status` — the ongoing work is the carousel above,
 * and everything here is finished, occupied, and visitable. Marking a project
 * `status: 'completed'` in projects.js is the only step needed to move it.
 *
 * The order is the client's preferred running order; any completed project
 * missing from it still renders, appended in data order, so a new delivery can
 * never silently drop off the home page.
 */
const PREFERRED_ORDER = [
  'victoria-park',
  'singapore-lifestyle-2',
  'singapore-corridor',
  'glamour-hill-city',
  'glamour-highway-city',
  'ruchi-enclave',
  'oscar-billionaire',
];

const completed = projectsList.filter((p) => p.status === 'completed');
const landmarks = [
  ...PREFERRED_ORDER.map((slug) => completed.find((p) => p.slug === slug)).filter(Boolean),
  ...completed.filter((p) => !PREFERRED_ORDER.includes(p.slug)),
];

// Spelled out because the heading reads as prose, not as a dashboard figure.
const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
  'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen', 'twenty'];
const spell = (n) => (WORDS[n] || String(n));
const cap = (w) => w.charAt(0).toUpperCase() + w.slice(1);

export default function CompletedProjects() {
  if (!landmarks.length) return null;

  return (
    <section className="completed" id="completed">
      <div className="container completed__head">
        <Reveal as="span" className="eyebrow completed__eyebrow">Delivered &amp; lived in</Reveal>
        <Reveal as="h2" className="display completed__title" delay={0.05}>
          {cap(spell(landmarks.length))} completed.<br/>Thousands of homes.
        </Reveal>
        <Reveal as="p" className="completed__lede" delay={0.1}>
          These are finished. Handed over, occupied, gardens grown in, roads filled with the
          rhythm of everyday life. You can drive to any of them this weekend and see exactly
          what an Icon Realty address looks like years after the brochure was put away.
        </Reveal>
      </div>

      <div className="container">
        <div className="completed__grid">
          {landmarks.map((p) => (
            <div key={p.slug}>
              <Link to={`/projects/${p.slug}`} className="completed__card">
                <div className="completed__media">
                  <img src={p.thumbnail || p.hero_image} alt={`${p.name}, ${p.location}`} loading="lazy" />
                  <span className="completed__badge">Completed</span>
                  {p.category && (
                    <span className="completed__cat">{CATEGORY_LABEL[p.category]}</span>
                  )}
                </div>
                <div className="completed__body">
                  <h3 className="completed__name">{p.name}</h3>
                  <span className="completed__location">{p.location}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <Reveal className="completed__action" delay={0.15}>
          <Link to="/projects?status=completed" className="cta cta--ghost">
            All completed projects
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
