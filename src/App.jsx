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
