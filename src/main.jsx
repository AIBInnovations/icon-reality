import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { preloadInitialPage } from './routes/pages'

// StrictMode disabled — GSAP ScrollTrigger pinning conflicts with strict-mode's
// double-mount (causes "removeChild" errors). No effect on production behavior.
async function mount() {
  // Keep the generated content in the DOM while the initial route downloads.
  // Later navigations still load only their own route chunks.
  await preloadInitialPage(window.location.pathname)
  createRoot(document.getElementById('root')).render(<App />)

  // Keep the existing homepage reveal; remove the cover after mount on
  // other pages, once their route code is ready to render.
  requestAnimationFrame(() => {
    if (window.location.pathname !== '/') {
      document.getElementById('initial-loader')?.remove()
    }
  });
}

mount().catch((error) => {
  // A failed route download must leave the readable static page intact.
  console.error('Could not start the interactive page:', error)
  document.getElementById('initial-loader')?.remove()
})
