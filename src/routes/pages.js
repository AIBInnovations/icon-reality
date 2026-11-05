import { createElement, lazy } from 'react';

const loaders = {
  home: () => import('../pages/HomePage'),
  about: () => import('../pages/AboutPage'),
  projects: () => import('../pages/ProjectsPage'),
  project: () => import('../pages/ProjectDetailPage'),
  contact: () => import('../pages/ContactPage'),
  whyIndore: () => import('../pages/WhyIndorePage'),
  investors: () => import('../pages/InvestorPage'),
  nri: () => import('../pages/NriPage'),
  partners: () => import('../pages/ChannelPartnersPage'),
  blog: () => import('../pages/BlogIndexPage'),
  post: () => import('../pages/BlogPostPage'),
  notFound: () => import('../pages/NotFoundPage'),
};
const modules = new Map();
const pending = new Map();

function loadPage(key) {
  if (!pending.has(key)) {
    pending.set(key, loaders[key]().then((module) => {
      modules.set(key, module);
      return module;
    }).catch((error) => {
      pending.delete(key);
      throw error;
    }));
  }
  return pending.get(key);
}

export function pageComponent(key) {
  const LazyPage = lazy(() => loadPage(key));
  return function Page(props) {
    // The first URL is loaded before React mounts, so it renders synchronously
    // instead of committing an empty Suspense fallback over the static HTML.
    return createElement(modules.get(key)?.default || LazyPage, props);
  };
}

export function preloadInitialPage(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  const keys = {
    '/': 'home', '/about': 'about', '/projects': 'projects',
    '/contact': 'contact', '/why-indore': 'whyIndore',
    '/investors': 'investors', '/nri': 'nri',
    '/channel-partners': 'partners', '/blog': 'blog',
  };
  const key = keys[path] || (/^\/projects\/[^/]+$/.test(path) ? 'project'
    : /^\/blog\/[^/]+$/.test(path) ? 'post' : 'notFound');
  return loadPage(key);
}
