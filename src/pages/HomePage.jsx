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
  const [loadProgress, setLoadProgress] = useState(0);

  // Safety net: never let the loader hang forever if frames fail to load on a
  // very slow connection. 45s is generous for the full ~62MB frame sequence.
  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 45000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {!heroReady && <PageLoader progress={loadProgress} />}
      <Hero
        onProgress={setLoadProgress}
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
