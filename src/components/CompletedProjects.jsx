import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import './CompletedProjects.css';

// The ten Icon Realty landmarks across Indore — names, locations and order per
// the client's brief. Most use real project renders; Dream Victoria & Victoria
// Park use their official brand logos (the genuine site has no photo for them),
// shown as clean brand tiles. Singapore Business Park (LIG Square) still needs a
// photo from the client — neutral placeholder for now.
const landmarks = [
  { slug: 'oscar-palace',            name: 'Oscar Palace',            location: 'Hingonia, Indore',        image: '/images/oscar/entrance/entrance-1.jpg' },
  { slug: 'oscar-fort',              name: 'Oscar Fort',              location: 'Bicholi Mardana, Indore', image: '/images/oscar-fort/thumb.jpg' },
  { slug: 'oscar-billionaire',       name: 'Oscar Billionaire',       location: 'Bicholi Hapsi, Indore',   image: '/images/oscar-billionaire/gallery-1.jpg' },
  { slug: 'eden-garden',             name: 'Eden Garden',             location: 'Ambamoliya, Indore',      image: '/images/projects/eden-garden.jpg' },
  { slug: 'saatvik-vihar',           name: 'Saatvik Vihar',           location: 'Manglia, Indore',         image: '/images/projects/saatvik-vihar.jpg' },
  { slug: 'siddhayatan',             name: 'Siddhayatan',             location: 'Manglia, Indore',         image: '/images/siddhayatan/hero.jpg' },
  { slug: 'labham-city',             name: 'Labham City',             location: 'Super Corridor, Indore',  image: '/images/labham-city/photo-1.jpg' },
  { slug: 'dream-victoria',          name: 'Dream Victoria',          location: 'Super Corridor, Indore',  image: '/images/projects/dream-victoria.jpg', brand: true },
  { slug: 'victoria-park',           name: 'Victoria Park',           location: 'Super Corridor, Indore',  image: '/images/projects/victoria-park.jpg', brand: true },
  { slug: 'singapore-business-park', name: 'Singapore Business Park', location: 'LIG Square, Indore',      image: '/images/singapore-business-park/thumb.jpg' },
  { slug: 'iit-greens',              name: 'IIT Greens',              location: 'Simrol, Indore',          image: '/images/projects/iit-greens.jpg' },
];

export default function CompletedProjects() {
  return (
    <section className="completed" id="completed">
      <img className="completed__art" src="/images/oscar/landmarks-art.png" alt="" aria-hidden="true" />
      <div className="container completed__head">
        <Reveal as="span" className="eyebrow completed__eyebrow">The Icon Realty portfolio</Reveal>
        <Reveal as="h2" className="display completed__title" delay={0.05}>
          Eleven landmarks.<br/>Thousands of homes.
        </Reveal>
        <Reveal as="p" className="completed__lede" delay={0.1}>
          Icon Realty has shaped landmarks right across Indore — from Oscar Palace
          to IIT Greens — places where families now live, gardens have grown, and roads quietly fill
          with the rhythm of everyday life.
        </Reveal>
      </div>

      <div className="container">
        <div className="completed__grid">
          {landmarks.map((p) => (
            <div key={p.slug}>
              <Link to={`/projects/${p.slug}`} className="completed__card">
                <div className={`completed__media${p.brand ? ' completed__media--brand' : ''}`}>
                  <img src={p.image} alt={`${p.name} — ${p.location}`} loading="lazy" />
                  <span className="completed__badge">Icon Realty</span>
                </div>
                <div className="completed__body">
                  <h3 className="completed__name">{p.name}</h3>
                  <span className="completed__location">{p.location}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
