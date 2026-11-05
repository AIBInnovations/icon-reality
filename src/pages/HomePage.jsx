import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// The scroll-scrubbed frame sequence is switched off for now, at the client's
// request, in favour of a montage of the project films. Hero.jsx and
// public/frames are untouched: swap these two imports and the two hero
// elements below to bring it back (and restore the preload in index.html).
// import Hero from '../components/Hero';
import HeroMontage from '../components/HeroMontage';
import TrustSection from '../components/TrustSection';
import DisplayHeading from '../components/DisplayHeading';
import ServicesGrid from '../components/ServicesGrid';
import InsideSection from '../components/InsideSection';
import ForBuyers from '../components/ForBuyers';
import PillarsCards from '../components/PillarsCards';
import PurposeSection from '../components/PurposeSection';
import JourneySection from '../components/JourneySection';
import FootprintSection from '../components/FootprintSection';
import FeaturedProjects from '../components/FeaturedProjects';
import ProjectsCarousel from '../components/ProjectsCarousel';
import Testimonials from '../components/Testimonials';
import CompletedProjects from '../components/CompletedProjects';
import AudiencePaths from '../components/AudiencePaths';
import FinalCTA from '../components/FinalCTA';
// Lazy, and only this section: it is the one part of the home page that reads
// the blog data, and that chunk must not be downloading while the hero frame
// sequence still is. It renders below the fold and only once the hero is ready,
// so by the time it is fetched the hero has already been paid for.
const HomeBlog = lazy(() => import('../components/HomeBlog'));
import Seo from '../seo/Seo';
import { realEstateAgentSchema } from '../seo/schema';

// Keep the full page in the DOM while the decorative hero loads. Images below
// the fold already use native lazy loading; only the optional blog chunk waits
// for hero readiness. Content and links must never depend on video playback.
export default function HomePage() {
  const [heroReady, setHeroReady] = useState(false);
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

  // Refresh after the hero reveals as before; the sections now exist from
  // the first render, so crawlers never see a hero-only document.
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => clearTimeout(t);
  }, [heroReady]);

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
        path="/"
        jsonLd={realEstateAgentSchema()}
      />

      {/* <Hero
        onProgress={setStaticLoaderProgress}
        onReady={() => {
          setStaticLoaderProgress(1);
          setHeroReady(true);
        }}
      /> */}
      <HeroMontage
        onProgress={setStaticLoaderProgress}
        onReady={() => {
          setStaticLoaderProgress(1);
          setHeroReady(true);
        }}
      />
      <DisplayHeading />
      <ServicesGrid />
      <InsideSection />
      {/* Who we are, then the three projects the client wants led with
          (change.md #5), ahead of vision & mission, the directors and the
          journey. */}
      <PillarsCards />
      <FeaturedProjects />
      <PurposeSection />
      <TrustSection />
      <JourneySection />
      {/* Everything currently selling, then everything delivered
          (change.md #7), then where all of it stands. */}
      <ProjectsCarousel />
      <CompletedProjects />
      <FootprintSection />
      {/* Door into the expanded architecture — Why Indore, Investors, NRI,
          Channel Partners. Placed after the portfolio so a first-time
          visitor has seen the work before being asked which they are. */}
      <AudiencePaths />
      <Testimonials />
      <ForBuyers />
      {/* fallback is null: the section simply is not there until its chunk
          arrives, rather than reserving a box that then jumps */}
      {heroReady && (
        <Suspense fallback={null}>
          <HomeBlog />
        </Suspense>
      )}
      <FinalCTA />
    </>
  );
}
