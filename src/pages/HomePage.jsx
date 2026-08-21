import { useState, useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '../components/Hero';
import TrustSection from '../components/TrustSection';
import DisplayHeading from '../components/DisplayHeading';
import ServicesGrid from '../components/ServicesGrid';
import AboutPostcard from '../components/AboutPostcard';
import ForBuyers from '../components/ForBuyers';
import PillarsCards from '../components/PillarsCards';
import FeaturedProjects from '../components/FeaturedProjects';
import ProjectsCarousel from '../components/ProjectsCarousel';
import Testimonials from '../components/Testimonials';
import CompletedProjects from '../components/CompletedProjects';
import AudiencePaths from '../components/AudiencePaths';
import FinalCTA from '../components/FinalCTA';
import Seo from '../seo/Seo';
import { realEstateAgentSchema } from '../seo/schema';

// The rest of the home page carries ~6 MB of section photography. While the
// loading screen is up, every byte of it competes with the hero frames the
// visitor is actually waiting on — on a 4 Mbps connection that roughly doubled
// the time to reveal. So the sections below the hero mount once the hero is
// ready (read.md §86, "no unnecessary asset preloading").
//
// The cap is the safety valve: content must not be gated on a 62 MB image
// sequence for a crawler, or for a visitor whose frames are failing to load.
// Whichever comes first wins. It is set above the measured reveal time on a
// 4 Mbps connection, so in practice only a broken load ever trips it.
const DEFER_SECTIONS_CAP_MS = 12000;

export default function HomePage() {
  const [heroReady, setHeroReady] = useState(false);
  // The cap fires on its own timer; the hero being ready is the normal path.
  // Derived rather than stored, so there is no state to keep in sync.
  const [capReached, setCapReached] = useState(false);
  const showRest = heroReady || capReached;
  // The static #initial-loader (index.html) covers the very first load and is the
  // ONLY loader shown during the hero-frame preload — no React loader on top, so
  // it never looks like it loads twice. On client-side nav, RouteTransition's
  // loader covers the change (frames are already cached, so the hero is instant).
  const staticLoader = useRef(
    typeof document !== 'undefined' ? document.getElementById('initial-loader') : null
  );

  const setStaticLoaderProgress = (progress) => {
    const el = staticLoader.current;
    if (!el) return;

    const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);
    const number = el.querySelector('#initial-loader-percent');

    if (number) number.textContent = `${pct}%`;
  };

  // Safety net: never let the loader hang forever if frames fail to load on a
  // very slow connection. 45s is generous for the full ~62MB frame sequence.
  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 45000);
    return () => clearTimeout(t);
  }, []);

  // Safety valve only — the hero normally reveals long before this fires.
  useEffect(() => {
    const t = setTimeout(() => setCapReached(true), DEFER_SECTIONS_CAP_MS);
    return () => clearTimeout(t);
  }, []);

  // The page grew by a dozen sections; the hero's pin and every section's
  // reveal trigger were measured against the shorter document.
  useEffect(() => {
    if (!showRest) return undefined;
    const t = setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => clearTimeout(t);
  }, [showRest]);

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
      <Seo
        title={null}
        description="Icon Realty has designed and marketed residential plotted developments in Indore since 2004, 20+ years, 15+ landmark projects, 4,500+ happy families and plots from 600 to 20,000 sq ft."
        path="/"
        jsonLd={realEstateAgentSchema()}
      />

      <Hero
        onProgress={setStaticLoaderProgress}
        onReady={() => {
          setStaticLoaderProgress(1);
          setHeroReady(true);
        }}
      />
      {showRest && (
        <>
          <DisplayHeading />
          <ServicesGrid />
          <AboutPostcard />
          <PillarsCards />
          <TrustSection />
          {/* The three the client wants led with, then everything currently
              selling, then everything delivered (change.md #5, #7). */}
          <FeaturedProjects />
          <ProjectsCarousel />
          <CompletedProjects />
          {/* Door into the expanded architecture — Why Indore, Investors, NRI,
              Channel Partners. Placed after the portfolio so a first-time
              visitor has seen the work before being asked which they are. */}
          <AudiencePaths />
          <Testimonials />
          <ForBuyers />
          <FinalCTA />
        </>
      )}
    </>
  );
}
