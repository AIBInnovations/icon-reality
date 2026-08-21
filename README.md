# Icon Realty

Marketing and lead-generation site for **Icon Realty**, a plotted-development
builder in Indore, Madhya Pradesh. Seventeen projects, an investor section, an
NRI section and a channel-partner programme, in front of a Vercel serverless
function that pushes every enquiry to a CRM and an inbox.

Live: <https://iconrealty.homes>

---

## Stack

| | |
| --- | --- |
| Framework | React 19, JavaScript only — **no TypeScript** |
| Build | Vite 8 |
| Routing | React Router 7, every route lazily loaded |
| Motion | GSAP + ScrollTrigger, Lenis for smooth scroll |
| Styling | One CSS file per component. **No Tailwind, no CSS framework** |
| Backend | Vercel serverless functions in `api/` |
| Hosting | Vercel, SPA rewrites via `vercel.json` |

There is no state library, no component library and no CSS-in-JS. Keep it that
way unless there is a concrete reason not to.

## Local setup

```sh
npm install
npm run dev        # http://localhost:5173
```

`npm run dev` also mounts the real `api/contact.js` handler on the dev server
(see `vercelApiDev` in `vite.config.js`), so enquiry forms work locally exactly
as they do in production — provided the mail credentials below are set.

```sh
npm run build      # production build into dist/
npm run preview    # serve the production build
npm run lint       # eslint
```

## Environment variables

Create `.env.local` (git-ignored). None are required to render the site; the
enquiry form falls back to the CRM alone if mail is not configured.

| Variable | Used by | Purpose |
| --- | --- | --- |
| `GMAIL_USER` | `api/contact.js` | Gmail account enquiries are sent from |
| `GMAIL_APP_PASS` | `api/contact.js` | Gmail app password (not the login password) |
| `MAIL_TO` | `api/contact.js` | Comma-separated recipients; defaults to the two Icon Realty inboxes |
| `CRM_*` | `api/_crm.js` | Sell Xpert account identifiers; sane defaults are baked in |
| `VITE_SITE_URL` | `src/seo/site.js` | Canonical origin. Defaults to the production domain |
| `VITE_GA_ID` | `src/analytics/Analytics.jsx` | GA4 measurement id. Production has a hard-coded default; dev sends nothing |
| `VITE_GSC_VERIFICATION` | `plugins/seo-assets.js` | Google Search Console meta token |

## Routing

Routes live in `src/App.jsx`. All are lazily loaded behind one `<Suspense>`.

```
/                               home
/about                          about (192-frame canvas sequence)
/projects                       index, filterable via ?status=
/projects/:slug                 project detail
/contact

/why-indore                     the city: infrastructure, employment, corridors
/investors                      investor corner + consultation booking

/nri                            NRI corner — ONE page, six sections, each with
                                its own layout and an id you can link to:
                                  #buying-process · #legal-rera · #taxation
                                  #home-loans · #virtual-tours · #power-of-attorney
/nri/:topic                     → redirects to /nri#<topic> (unknown topic 404s)

/channel-partners               partner programme — ONE page, six sections:
                                  #why-icon · #benefits · #portfolio
                                  #journey · #commission-support · #register
/channel-partners/why-icon              ┐
/channel-partners/commission-support    ├ → redirect to the matching anchor
/channel-partners/register              ┘

*                               real 404 (NotFoundPage), never a home-page fallback
```

`src/data/nav.js` is the single description of the information architecture. The
header mega-menu, the mobile drawer and the footer columns all read it, so they
cannot drift apart. Adding a route means adding it there and to
`src/seo/routes.js` (which generates `sitemap.xml` at build time).

Nav entries whose target is a section rather than a page carry a `#anchor` in
their `to`. `RouteTransition` does the scrolling, so those links work from any
other route as well as from the page itself; `allNavPaths()` and the sitemap
skip them, because an anchor is not a separate URL.

## Content architecture

Presentation and content are separate. Page components contain no copy blocks.

```
src/data/
  projects.js         17 projects — the single source of project content
  projectFaqs.js      FAQs derived from a project's own fields
  company.js          trust stats, story, values, leadership, milestones
  indore.js           Why Indore
  investor.js         Investor Corner
  nri.js              NRI corner — intro + all six sections
  channelPartners.js  partner programme, journey, registration steps
  contact.js          every phone number, email and address on the site
  nav.js              the information architecture
```

### The rule about data

**Never invent real-estate facts.** No RERA numbers, prices, possession dates,
appreciation percentages, commission rates, bank partnerships, awards or
construction percentages that Icon Realty has not published. Where the data does
not exist, the field is `null` or an empty array and the component hides its
section — every section in `src/components/` is written to do that. There are
several deliberate empty arrays (`AWARDS`, `PRICE_HISTORY`, `BANK_PARTNERS`);
they are empty on purpose, not unfinished.

The `projects.js` header documents the full optional field set.

## Animation architecture

> **Read this before touching anything with motion.**

* **StrictMode is deliberately disabled** in `src/main.jsx`. Strict mode's double
  mount breaks ScrollTrigger pinning (`removeChild` errors). Do not re-enable it.
* **One Lenis instance**, created in `src/hooks/useLenis.js` and exposed as
  `window.lenis`. It is driven by the GSAP ticker. Do not create a second
  instance and do not start a competing `requestAnimationFrame` loop.
* **Scope every animation** in `gsap.context()` and `ctx.revert()` on unmount.
  Route changes unmount pinned sections; without the revert, GSAP's `pinSpacer`
  is left in the DOM and React throws.
* **Do not call `window.scrollTo` to fight Lenis.** `RouteTransition` already
  resets scroll on navigation, through Lenis.
* Any element that scrolls internally (drawer, modal card, plan viewer) needs
  `data-lenis-prevent`, or Lenis swallows the gesture.
* After content mounts late (the home page defers its sections — see below),
  call `ScrollTrigger.refresh()`.

### The frame sequences

Two scroll-scrubbed canvas sequences, and they are the site's signature:

* home — **476 frames** in `public/frames`, `src/components/Hero.jsx`
* about — **192 frames** in `public/about-frames`, `src/pages/AboutPage.jsx`

Neither is a video and neither should become one. The home sequence loads
progressively: a probe measures the connection, sizes a bootstrap batch to fit a
~2.5s budget, reveals, then streams the remainder in order at low priority.
`draw()` falls back to the nearest earlier loaded frame, so the sequence slows
under a fast scroll but never blanks. Bump `ASSET_REV` in both files if the
frames are ever re-exported, or browsers will serve stale copies.

The home page also defers everything below the hero until the hero is ready
(cap: 12s). Without it, ~6 MB of section photography competes with the frames
behind the loading screen.

## Lead capture

Every form on the site is one component — `src/components/LeadForm.jsx` — with a
different `intent` and field list. Submission goes through
`src/services/leads.js`, which is the only place a lead leaves the browser.

```
LeadForm ──▶ services/leads.js ──▶ POST /api/contact ──┬─▶ Sell Xpert CRM
                                                       └─▶ email
```

`api/contact.js` answers OK if **either** channel succeeded, so a CRM outage
never loses a lead silently. Only `name` and `phone` are required — high-intent
forms ask for exactly those two.

Intents (`LEAD_INTENTS`): general-enquiry, price-request, brochure-download,
site-visit, virtual-tour, investor-consultation, nri-assistance, channel-partner,
callback. Each maps to a GA4 event and to the CRM's `sub_source_name`.

Contact details come from `src/data/contact.js`. Every phone number renders as
`tel:` and every WhatsApp link as a real `wa.me` URL built by
`src/services/whatsapp.js` — never a JS click handler.

## Analytics

`src/analytics/Analytics.jsx` loads GA4 and sends one `page_view` per route.
A single delegated listener turns every `tel:`, `mailto:`, `wa.me`, Maps and
`.pdf` link on the site into an event automatically — do **not** also fire those
manually or they double-count. Everything else goes through
`src/analytics/events.js`.

## SEO

`<Seo>` (`src/seo/Seo.jsx`) upserts title, description, canonical, robots, Open
Graph, Twitter and JSON-LD per route — upserts, so a navigation can never leave
two canonicals behind. Site-wide Organization/WebSite JSON-LD and OG defaults are
injected as static markup at build time by `plugins/seo-assets.js`, along with
`sitemap.xml` and `robots.txt`. Preview deployments are automatically `noindex`.

## Asset directories

```
public/frames/         476 home hero frames        60 MB
public/about-frames/   192 about frames            14 MB
public/video/          8 project walkthroughs     417 MB  ← see the audit
public/images/         project photography        108 MB
public/downloads/      brochures (PDF)             52 MB
```

**Read `docs/asset-audit.md` before deleting anything.** Frame sequences and the
project flank artwork are referenced through template literals, so a filename
search will wrongly report them as orphans.

## Known performance concerns

1. **`public/video` is 417 MB** — individual walkthroughs are 69–89 MB. Mobile
   no longer autoplays them (poster + tap to play, `preload="none"`), but the
   files themselves need re-encoding. Commands are in `docs/asset-audit.md`.
2. **Two brochures are 16 MB and 20 MB.** They sit behind the brochure gate, so
   they only download for a lead, but they should be optimised.
3. **The home frame sequence is 60 MB.** Progressive loading brought the reveal
   on a 4 Mbps connection from ~28s to ~8s; a half-resolution mobile set would
   be the next real win, and needs a re-export from the client.
4. **`src/App.css`** is leftover Vite boilerplate. Nothing imports it.

## Deployment

Vercel, from the default branch. `vercel.json` handles SPA rewrites and cache
headers; `api/` is deployed as serverless functions automatically. Set the mail
and CRM environment variables in the Vercel dashboard — a preview deployment
without them still renders, and still reaches the CRM.
