import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import PageLoader from '../components/PageLoader';
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

  // Safety net: never let the loader hang if the hero never signals ready
  // (e.g. a very slow connection). 12s gives the frame sequence ample time.
  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 12000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {!heroReady && <PageLoader />}
      <Hero onReady={() => setHeroReady(true)} />
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
