import { renderToString } from 'react-dom/server';
import { StaticRouter, Routes, Route } from 'react-router-dom';
import { SeoContext } from './context';
import { EnquiryProvider } from '../enquiry/EnquiryProvider';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import ProjectsPage from '../pages/ProjectsPage';
import ProjectDetailPage from '../pages/ProjectDetailPage';
import ContactPage from '../pages/ContactPage';
import WhyIndorePage from '../pages/WhyIndorePage';
import InvestorPage from '../pages/InvestorPage';
import NriPage from '../pages/NriPage';
import ChannelPartnersPage from '../pages/ChannelPartnersPage';

// Render existing components, never a separate crawler-only copy of the site.
// Effects and animations stay browser-only; createRoot takes over as before.
export function renderPage(path) {
  let metadata;
  const body = renderToString(
    <SeoContext.Provider value={(value) => { metadata = value; }}>
      <StaticRouter location={path}>
        <EnquiryProvider>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:slug" element={<ProjectDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/why-indore" element={<WhyIndorePage />} />
              <Route path="/investors" element={<InvestorPage />} />
              <Route path="/nri" element={<NriPage />} />
              <Route path="/channel-partners" element={<ChannelPartnersPage />} />
            </Routes>
          </main>
          <Footer />
        </EnquiryProvider>
      </StaticRouter>
    </SeoContext.Provider>
  );
  if (!metadata || metadata.path !== path) throw new Error(`Missing SEO metadata for ${path}`);
  return { body, metadata };
}
