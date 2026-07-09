import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// StrictMode disabled — GSAP ScrollTrigger pinning conflicts with strict-mode's
// double-mount (causes "removeChild" errors). No effect on production behavior.
createRoot(document.getElementById('root')).render(<App />)

// The homepage keeps the static loader up through its hero-frame preload and
// slides it away itself (see HomePage). On every other route there's nothing to
// preload, so remove it as soon as React has painted the page.
requestAnimationFrame(() => {
  if (window.location.pathname !== '/') {
    const el = document.getElementById('initial-loader');
    if (el) el.remove();
  }
});
