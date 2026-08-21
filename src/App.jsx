import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { useLenis } from './hooks/useLenis';
import Header from './components/Header';
import Footer from './components/Footer';
import RouteTransition from './components/RouteTransition';
import QuickDock from './components/QuickDock';
import Analytics from './analytics/Analytics';
import { EnquiryProvider } from './enquiry/EnquiryProvider';
import { NRI_TOPICS_BY_SLUG } from './data/nri';

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
// The NRI Corner and the Channel Partner programme are ONE page each. Their
// former sub-routes are sections of those pages now, and the old URLs redirect
// onto the matching anchor — see the redirect routes below.
const NriPage = lazy(() => import('./pages/NriPage'));
const ChannelPartnersPage = lazy(() => import('./pages/ChannelPartnersPage'));

/**
 * /nri/<topic> → /nri#<topic>.
 *
 * The six topic routes became six sections of the NRI page. Existing links,
 * bookmarks and anything already indexed keep working; an unknown topic still
 * renders the real 404 rather than dumping the visitor at the top of /nri.
 */
function NriTopicRedirect() {
  const { topic } = useParams();
  if (!NRI_TOPICS_BY_SLUG[topic]) return <NotFoundPage />;
  return <Navigate to={`/nri#${topic}`} replace />;
}

/**
 * Re-keying on pathname restarts the fade-in animation for each page. It sits
 * INSIDE <Suspense> on purpose: keying the boundary itself would tear it down
 * on every navigation and flash the fallback while the route chunk loads.
 *
 * Keyed on pathname, NOT on the full location — an in-page #section link must
 * not remount the page it is scrolling within.
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

                {/* One page. buying-process, legal-rera, taxation, home-loans,
                    virtual-tours and power-of-attorney are sections of it. */}
                <Route path="/nri" element={<NriPage />} />
                <Route path="/nri/:topic" element={<NriTopicRedirect />} />

                {/* Likewise: why-icon, commission-support and register are
                    sections of /channel-partners, not routes. */}
                <Route path="/channel-partners" element={<ChannelPartnersPage />} />
                <Route path="/channel-partners/why-icon" element={<Navigate to="/channel-partners#why-icon" replace />} />
                <Route path="/channel-partners/commission-support" element={<Navigate to="/channel-partners#commission-support" replace />} />
                <Route path="/channel-partners/register" element={<Navigate to="/channel-partners#register" replace />} />

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
