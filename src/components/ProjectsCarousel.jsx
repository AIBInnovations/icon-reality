import { useState } from 'react';
import Reveal from './Reveal';
import './ProjectsCarousel.css';

// Each card shows the project's own real render (the only videos available are
// Oscar Palace footage, so images keep every card matched to its project).
const projects = [
  { name: 'OSCAR PALACE',      meta: 'Indore–Nagpur Hwy · Royal estate', src: '/images/projects/oscar-palace-gate.jpg' },
  { name: 'OSCAR FORT',        meta: 'Bicholi Mardana · Royal estate',   src: '/images/projects/oscar-fort.webp' },
  { name: 'OSCAR BILLIONAIRE', meta: 'Bicholi Hapsi · Premium plots',    src: '/images/projects/oscar-billionaire.png' },
  { name: 'SAATVIK VIHAR',     meta: 'Manglia · Family living',          src: '/images/projects/saatvik-vihar.jpg' },
  { name: 'SIDDHAYATAN',       meta: 'Manglia · Community-first',        src: '/images/projects/siddhayatan.jpg' },
];

export default function ProjectsCarousel() {
  const [active, setActive] = useState(2); // start with the middle card

  const prev = () => setActive((p) => (p - 1 + projects.length) % projects.length);
  const next = () => setActive((p) => (p + 1) % projects.length);

  return (
    <section className="carousel" id="views">
      <div className="carousel__shell">
        <div className="container carousel__head">
          <Reveal as="span" className="eyebrow carousel__eyebrow">Trending Now</Reveal>
          <Reveal as="h2" className="display carousel__title" delay={0.05}>
            Projects shaping<br/>the skyline.
          </Reveal>
          <Reveal as="p" className="carousel__lede" delay={0.1}>
            Five flagship developments across Indore — each one a quiet, considered statement. Pick a project to take a closer look.
          </Reveal>
        </div>

        <div className="carousel__accordion">
          {projects.map((p, i) => (
            <button
              key={p.name}
              className={`carousel__card ${i === active ? 'is-active' : ''}`}
              onClick={() => setActive(i)}
              aria-label={`Show ${p.name}`}
            >
              <img src={p.src} alt={p.name} loading="lazy" />
              <div className="carousel__card-veil" />
              <div className="carousel__card-caption">
                <span className="carousel__card-label">{p.name}</span>
                <span className="carousel__card-meta">{p.meta}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="container carousel__controls">
          <div className="carousel__counter">
            <span className="is-current">{String(active + 1).padStart(2, '0')}</span>
            <span className="carousel__counter-sep" />
            <span>{String(projects.length).padStart(2, '0')}</span>
          </div>
          <div className="carousel__buttons">
            <button onClick={prev} aria-label="Previous">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="is-primary" onClick={next} aria-label="Next">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
