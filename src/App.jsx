import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useLenis } from './hooks/useLenis';
import Header from './components/Header';
import Footer from './components/Footer';
import RouteTransition from './components/RouteTransition';
import QuickDock from './components/QuickDock';
import Analytics from './analytics/Analytics';
import { EnquiryProvider } from './enquiry/EnquiryProvider';

// code-split each route so the user never downloads About/Projects JS until they navigate there
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Business sections. Each is its own chunk for the same reason the originals
// are: a homebuyer never downloads the channel-partner JS.
const WhyIndorePage = lazy(() => import('./pages/WhyIndorePage'));
const InvestorPage = lazy(() => import('./pages/InvestorPage'));
const NriPage = lazy(() => import('./pages/NriPage'));
// One component behind all six /nri/* topics — see data/nri.js
const NriTopicPage = lazy(() => import('./pages/NriTopicPage'));
const ChannelPartnersPage = lazy(() => import('./pages/ChannelPartnersPage'));
const PartnerWhyIconPage = lazy(() => import('./pages/PartnerWhyIconPage'));
const PartnerCommissionPage = lazy(() => import('./pages/PartnerCommissionPage'));
const PartnerRegisterPage = lazy(() => import('./pages/PartnerRegisterPage'));

/**
 * Re-keying on pathname restarts the fade-in animation for each page. It sits
 * INSIDE <Suspense> on purpose: keying the boundary itself would tear it down
 * on every navigation and flash the fallback while the route chunk loads.
 */
function PageFade({ children }) {
  const { pathname } = useLocation();
  return <div className="page-fade" key={pathname}>{children}</div>;
}

export default function App() {
  useLenis();

  return (
    <BrowserRouter>
      <EnquiryProvider>
        <Analytics />
        <Header />
        <RouteTransition />
        <main>
          {/* fallback is null, not a loader: React Router v7 runs navigations
              through startTransition, so the current page stays on screen while
              the next route's chunk loads instead of flashing a cover */}
          <Suspense fallback={null}>
            <PageFade>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:slug" element={<ProjectDetailPage />} />
                <Route path="/contact" element={<ContactPage />} />

                <Route path="/why-indore" element={<WhyIndorePage />} />
                <Route path="/investors" element={<InvestorPage />} />

                <Route path="/nri" element={<NriPage />} />
                {/* /nri/buying-process, /legal-rera, /taxation, /home-loans,
                    /virtual-tours, /power-of-attorney — one route, six topics,
                    driven by data/nri.js. An unknown topic renders the 404. */}
                <Route path="/nri/:topic" element={<NriTopicPage />} />

                <Route path="/channel-partners" element={<ChannelPartnersPage />} />
                <Route path="/channel-partners/why-icon" element={<PartnerWhyIconPage />} />
                <Route path="/channel-partners/commission-support" element={<PartnerCommissionPage />} />
                <Route path="/channel-partners/register" element={<PartnerRegisterPage />} />

                {/* a real 404, not the home page — see NotFoundPage */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </PageFade>
          </Suspense>
        </main>
        <Footer />
        <QuickDock />
      </EnquiryProvider>
    </BrowserRouter>
  );
}
