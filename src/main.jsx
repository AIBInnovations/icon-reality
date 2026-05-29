import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// StrictMode disabled — GSAP ScrollTrigger pinning conflicts with strict-mode's
// double-mount (causes "removeChild" errors). No effect on production behavior.
createRoot(document.getElementById('root')).render(<App />)

// Remove the static initial loader from index.html once React has rendered.
// We wait one frame after mount so the React PageLoader is in the DOM and
// covers the same area — no flash gap between handoff.
requestAnimationFrame(() => {
  const el = document.getElementById('initial-loader');
  if (el) el.remove();
});
