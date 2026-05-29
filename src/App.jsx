import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useLenis } from './hooks/useLenis';
import Header from './components/Header';
import Footer from './components/Footer';
import PageLoader from './components/PageLoader';
import RouteTransition from './components/RouteTransition';

// code-split each route so the user never downloads About/Projects JS until they navigate there
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));

export default function App() {
  useLenis();

  return (
    <BrowserRouter>
      <Header />
      <RouteTransition />
      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
