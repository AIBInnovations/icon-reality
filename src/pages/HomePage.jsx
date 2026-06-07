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
  return (
    <>
      <Hero />
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
