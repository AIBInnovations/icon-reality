import { useState, useEffect, useRef } from 'react';
import Hero from '../components/Hero';
import TrustSection from '../components/TrustSection';
import DisplayHeading from '../components/DisplayHeading';
import ServicesGrid from '../components/ServicesGrid';
import AboutPostcard from '../components/AboutPostcard';
import ForBuyers from '../components/ForBuyers';
import PillarsCards from '../components/PillarsCards';
import ProjectsCarousel from '../components/ProjectsCarousel';
import Testimonials from '../components/Testimonials';
import CompletedProjects from '../components/CompletedProjects';
import FinalCTA from '../components/FinalCTA';

export default function HomePage() {
  const [heroReady, setHeroReady] = useState(false);
  // The static #initial-loader (index.html) covers the very first load and is the
  // ONLY loader shown during the hero-frame preload — no React loader on top, so
  // it never looks like it loads twice. On client-side nav, RouteTransition's
  // loader covers the change (frames are already cached, so the hero is instant).
  const staticLoader = useRef(
    typeof document !== 'undefined' ? document.getElementById('initial-loader') : null
  );

  // Safety net: never let the loader hang forever if frames fail to load on a
  // very slow connection. 45s is generous for the full ~62MB frame sequence.
  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 45000);
    return () => clearTimeout(t);
  }, []);

  // When the hero is ready, slide the static loader up to reveal it, then remove.
  useEffect(() => {
    if (!heroReady) return;
    const el = staticLoader.current;
    if (!el) return;
    el.classList.add('is-leaving');
    const t = setTimeout(() => { if (el.isConnected) el.remove(); }, 950);
    return () => clearTimeout(t);
  }, [heroReady]);

  return (
    <>
      <Hero
        onReady={() => setHeroReady(true)}
      />
      <DisplayHeading />
      <ServicesGrid />
      <AboutPostcard />
      <PillarsCards />
      <TrustSection />
      <ProjectsCarousel />
      <CompletedProjects />
      <Testimonials />
      <ForBuyers />
      <FinalCTA />
    </>
  );
}
