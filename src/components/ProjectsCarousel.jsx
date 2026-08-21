import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Reveal from './Reveal';
import { projectsList } from '../data/projects';
import { useMediaQuery } from '../hooks/useMediaQuery';
import './ProjectsCarousel.css';

const projects = projectsList
  .filter((project) => project.status === 'trending')
  .map((project) => ({
    name: project.name.toUpperCase(),
    slug: project.slug,
    meta: `${project.location.replace(/, Indore$/, '')} · ${project.plot_sizes || project.total_area}`,
    src: project.thumbnail || project.hero_image,
  }));

export default function ProjectsCarousel() {
  // Open on the first card — Oscar Palace, the flagship — rather than whatever
  // happens to sit in the middle of the trending list.
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  // On phones the accordion is laid out as a 2-up grid (see the CSS) — every
  // card is already open, so there is nothing to expand and a tap should go
  // straight to the project.
  const isGrid = useMediaQuery('(max-width: 720px)');

  const prev = () => setActive((p) => (p - 1 + projects.length) % projects.length);
  const next = () => setActive((p) => (p + 1) % projects.length);

  // First tap on a card expands it; tapping the already-open card opens its page.
  const handleCard = (i) => {
    if (isGrid || i === active) navigate(`/projects/${projects[i].slug}`);
    else setActive(i);
  };

  return (
    <section className="carousel" id="views">
      <div className="carousel__shell">
        <div className="container carousel__head">
          <Reveal as="span" className="eyebrow carousel__eyebrow">Currently selling</Reveal>
          <Reveal as="h2" className="display carousel__title" delay={0.05}>
            Projects shaping<br/>the skyline.
          </Reveal>
          <Reveal as="p" className="carousel__lede" delay={0.1}>
            {projects.length} developments open across Indore right now, each one a quiet, considered
            statement. Pick a project to take a closer look.
          </Reveal>
        </div>

        <div className="carousel__accordion">
          {projects.map((p, i) => (
            <button
              key={p.name}
              className={`carousel__card ${i === active ? 'is-active' : ''}`}
              onClick={() => handleCard(i)}
              aria-label={isGrid || i === active ? `Open ${p.name} project page` : `Show ${p.name}`}
            >
              <img src={p.src} alt={p.name} loading="lazy" />
              <div className="carousel__card-veil" />
              <div className="carousel__card-caption">
                <span className="carousel__card-label">{p.name}</span>
                <span className="carousel__card-meta">{p.meta}</span>
                <span className="carousel__card-open">View project →</span>
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
