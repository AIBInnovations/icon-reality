import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { seoAssets } from './plugins/seo-assets.js'

// Vite doesn't run Vercel's /api functions, so `npm run dev` 404s on
// /api/contact and every enquiry form shows "Something went wrong".
// This mounts the real handler on the dev server with a Vercel-shaped
// req/res, so local dev behaves like production. Dev only — on Vercel the
// platform serves api/ itself.
function vercelApiDev() {
  return {
    name: 'vercel-api-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/contact', (req, res) => {
        let raw = ''
        req.on('data', (chunk) => { raw += chunk })
        req.on('end', async () => {
          try { req.body = raw ? JSON.parse(raw) : {} } catch { req.body = {} }

          res.status = (code) => { res.statusCode = code; return res }
          res.json = (obj) => {
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify(obj))
          }

          try {
            // ssrLoadModule so edits to api/contact.js apply without a restart
            const mod = await server.ssrLoadModule('/api/contact.js')
            await mod.default(req, res)
          } catch (err) {
            server.config.logger.error(`[api/contact] ${err?.stack || err}`)
            if (!res.headersSent) res.status(500).json({ error: 'Handler failed' })
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // api/contact.js reads process.env.GMAIL_USER / GMAIL_APP_PASS / MAIL_TO.
  // Load every var from .env* (not just VITE_-prefixed) into process.env so the
  // dev handler above has credentials. This does NOT expose them to the client
  // bundle — that is governed separately by envPrefix, which stays at VITE_.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  // Only the real production deployment may be indexed. Vercel sets
  // VERCEL_ENV to 'production' | 'preview' | 'development', so preview
  // deployments and any local build get robots.txt Disallow + noindex.
  const vercelEnv = process.env.VERCEL_ENV
  const indexable = vercelEnv ? vercelEnv === 'production' : mode === 'production'

  return {
    plugins: [react(), vercelApiDev(), seoAssets({ indexable })],
  }
})
