# CLAUDE.md — working rules for this repository

Context for AI assistants and new developers. Read `README.md` for the tour;
this file is the list of things that will break the site if you get them wrong.

---

## 1. Do not enable StrictMode

`src/main.jsx` renders without `<React.StrictMode>`, deliberately. Strict mode
double-mounts effects, which breaks GSAP ScrollTrigger pinning and produces
`Failed to execute 'removeChild' on 'Node'` on route changes. This is not an
oversight and it is not a bug to fix.

## 2. Do not replace or duplicate Lenis

There is exactly one Lenis instance, created in `src/hooks/useLenis.js`, driven
by the GSAP ticker, exposed as `window.lenis`.

* Do not create a second instance.
* Do not add a competing `requestAnimationFrame` loop.
* Do not call `window.scrollTo()` in a way that fights it — `RouteTransition`
  already handles scroll reset on navigation.
* Anything that scrolls internally (the nav drawer, modal cards, the plan
  viewer) needs `data-lenis-prevent`, or Lenis eats the gesture.

## 3. Do not casually alter the frame-sequence architecture

Two scroll-scrubbed canvas sequences are the site's signature:

* `src/components/Hero.jsx` — 476 frames, `public/frames`
* `src/pages/AboutPage.jsx` — 192 frames, `public/about-frames`

They are not videos, they must not become videos, and they must not become
carousels. Performance work on them is welcome; replacing them is not.

The home sequence loads progressively (probe → sized bootstrap → reveal →
background stream). If you change `BOOTSTRAP_FRAMES`, `REVEAL_BUDGET_MS` or the
fallback logic in `draw()`, re-measure on a throttled connection before and
after. Bump `ASSET_REV` in either file if the frames are re-exported.

The home page defers everything below the hero until the hero is ready. If you
mount content late anywhere, call `ScrollTrigger.refresh()` afterwards.

## 4. Keep project data centralised

`src/data/projects.js` is the single source of project content. Never hardcode a
project's name, location, plot sizes, amenities or images into a page component.
The same applies to the other data files — `company.js`, `indore.js`,
`investor.js`, `nri.js`, `channelPartners.js`, `contact.js`, `nav.js`.

Adding a navigation entry means editing `src/data/nav.js` (header, drawer and
footer all read it) and `src/seo/routes.js` (sitemap).

## 5. Never invent real-estate facts

This is the rule that matters most, and it is a legal exposure, not a style
preference. Do not write, generate or "fill in":

RERA registration numbers · prices · unit availability · plot dimensions ·
possession dates · appreciation percentages · commission rates · bank
partnerships · awards · years of experience · sq ft developed · number of
families · construction progress percentages · testimonials · government
infrastructure completion dates.

If the data does not exist, use `null` or an empty array. Every section
component hides itself when its data is missing — that behaviour is intentional
and must be preserved when you add new ones.

Several arrays are deliberately empty and are **not** unfinished work:
`AWARDS`, `PRESS`, `FOUNDER_MESSAGE`, `BANK_PARTNERS` (`company.js`),
`PRICE_HISTORY` (`indore.js`). Fill them only from client-supplied, verifiable
material.

Related: no fake urgency ("3 people viewing now", "12 units left"), and no
guaranteed-return language on the investor or NRI pages. Those pages carry
explicit disclaimers — leave them in place.

## 6. Preserve the visual tokens

Global tokens live in `src/index.css`:

```
--bg      #F6F2EC   warm cream
--bg-2    #EFE8DD   section band
--ink     #141414   near-black type
--sand    #D9BD96
--peach   #F2B68F   primary CTA
--charcoal #1F1F22  dark shells
--gutter  clamp(20px, 5vw, 96px), collapsing to 8px below 720px
```

Fonts: Outfit (display and body), Cinzel, Caveat, Special Elite.

**No em dashes in copy.** The site's voice uses a colon where the second half
expands the first, a comma for an aside, and a full stop where the clause can
stand alone. `grep -R "—" src/data` should stay empty of content strings;
en dashes in place names (Indore–Nagpur Highway, Rau–Pithampur) are correct and
stay.

New pages must look like they were always part of this site: editorial,
architectural, warm, image-led. Not dashboard cards, not blue corporate UI, not
a real-estate portal grid, not a SaaS landing page. Reuse the shared components
before writing new ones:

```
PageHero · SectionHeading · EditorialSplit · InfoGrid · MediaFigure
ProcessSteps · CtaBand · TrustModule · LeadForm · ImageViewer
```

Two routes are deliberately the exception to "reuse before you write":
`/nri` and `/channel-partners` are single long pages built from six sections
each, and **every section has its own layout on purpose** — a dark staircase, a
dossier, a ledger, a scroller, and so on. Do not "tidy" them back into repeated
`InfoGrid` blocks; the variety is the design. What they do share is the numbered
section head (`.nrix-head` / `.cpx-head`), which is the rhythm that keeps them
reading as one document.

Where either page rules columns apart with a hairline (`.nrix-ribbon`,
`.nrix-ledger`), the rule gets **equal air on both sides** and the outermost
column stays flush with the `.container` edge — see the note at the top of
`NriPage.css`. Text touching a divider is the fastest way to make an editorial
grid look broken.

Each section's `id` is a public anchor — `nav.js` links to `/nri#taxation`,
`RouteTransition` scrolls to it, and the old `/nri/<topic>` and
`/channel-partners/<page>` URLs redirect onto it. Renaming an id breaks the
navigation, the redirects and any inbound link, so treat ids as URLs.

`--gutter` collapses to 8px on mobile so every section edge lines up. Do not add
one-off 16px/24px outer margins to individual components — if the spacing system
needs to change, change it centrally.

**Everything lines up with the same column.** `.container` is
`max-width: var(--maxw)` with `padding-inline: var(--gutter)`. The header bar
and the projects carousel are matched to it explicitly (they are not
`.container` elements), so a standalone pixel width in either will show up as a
misaligned edge on wide screens. Sections framed with a 14px outer padding
(FinalCTA, the hero banner, the carousel shell) subtract that 14px from both the
cap and the gutter — see `.carousel__accordion`.

## 7. Run responsive checks after any GSAP or layout change

The breakpoints that matter: **320, 360, 375, 390, 414, 430, 768, 1024, 1280,
1440, 1920**. The desktop navigation itself has breakpoints at 1240, 1130 and
1000 — check those too after touching the header.

The site is verified to have **no horizontal scroll at any of them**. The usual
cause of a regression is a grid track written as `1fr` instead of
`minmax(0, 1fr)` — a plain `1fr` floors at the content's min-content width, and
one non-wrapping line then pushes the whole page sideways.

The real test is not `scrollWidth`; `body` has `overflow-x: hidden`, which masks
it. Test whether the page actually scrolls:

```js
window.scrollTo(400, 0); const bad = window.scrollX > 0; window.scrollTo(0, 0);
```

Also re-check: no broken GSAP pins, no console errors, modals still trap focus
and close on Escape, and every interactive target is at least 44×44px.

## 8. The header

* The wordmark is **absolutely centred**, not a grid track. `1fr auto 1fr`
  floors each side track at its content's min-content width, so the heavier
  side (the one with the CTA) pushed the logo off centre.
* Navigation is split either side of it — `side: 'left' | 'right'` in
  `src/data/nav.js` decides which group an entry joins *and* which edge its
  mega-menu is anchored to.
* Each mega-menu lives **inside its own `.site-header__nav-item`**, so it opens
  under its trigger. Because of that, any `.site-header__nav a` rule must be
  scoped with `>` or it will also style every link inside the panels.
* Panel contents render on first open (`primedMenus`), because a hidden panel's
  `<img>` is still downloaded — that was ~1.2 MB on every page load.
* The drawer is three columns (nav / contact / picture) and must fit without
  scrolling on desktop. It sheds the picture on phones and on short windows.
* **Six top-level entries is the ceiling.** Six plus the CTA already stop
  fitting before the pill itself has to go (see the 1000px breakpoint in
  `Header.css`). A seventh section belongs in the drawer and the footer, which
  is what `headerBar: false` in `nav.js` does — `/blog` is one. It is still a
  real route, still in `allNavPaths()` and still in the sitemap; it is just not
  a seventh pill.

## 9. Accessibility expectations

* Semantic `<button>` and `<a>` — never a clickable `<div>` where an element
  exists for the job.
* Modals and the fullscreen image viewer: `role="dialog"`, `aria-modal`, focus
  moved in on open, Tab trapped, focus restored to the opener on close, Escape
  closes. `src/utils/focus.js` holds the shared focusable selector.
* Accordions: `aria-expanded` + `aria-controls`, and remember that a CSS
  `display` rule beats the user agent's `[hidden] { display: none }` — you must
  restore it explicitly.
* One `<h1>` per page, no skipped heading levels.
* Forms: visible labels, `inputMode`/`autoComplete` set, errors announced with
  `role="alert"` and wired via `aria-describedby`.
* Respect `prefers-reduced-motion` — counters and reveals already do.

## 10. Lead flows go through one path

```
LeadForm ──▶ src/services/leads.js ──▶ /api/contact ──┬─▶ CRM
                                                      └─▶ email
```

Do not add a second submit path, a second endpoint, or a `fetch` inside a
component. Add an intent to `LEAD_INTENTS` instead. Only `name` and `phone` are
required; do not add fields to a high-intent form without a reason.

Phone numbers are always `tel:` links and WhatsApp is always a real `wa.me`
URL from `src/services/whatsapp.js` — never a JS click handler. The delegated
listener in `src/analytics/Analytics.jsx` already tracks those clicks, so do not
fire `call_click` / `whatsapp_click` / `file_download` manually as well.

## 11. Do not delete assets on a hunch

`public/` is ~650 MB. Frame sequences and the project flank artwork are
referenced through template literals (`` `/images/flanks/${slug}-left.png` ``),
so a filename search reports them as orphans when they are in daily use.

`docs/asset-audit.md` has the full classification, the confirmed-unused
candidates, and the re-encoding commands for the oversized video. Read it first,
and get client confirmation before removing anything.

## 12. The blog is data, not markup

A post lives in `src/data/blog/<slug>.js` as a block model, documented in
`src/data/blog/index.js`. Never write article copy into a component.

Two renderers read that model and must stay in step: `ArticleBody` (browser)
and `src/seo/blogHtml.js` (build-time static HTML). Adding a block type means
adding it to both, or the prerendered page silently drops it.

Heading ids are **generated from the heading text**, never hand-written. They
are public anchors the moment the contents list links to them, so treat them
like the section ids in §6: renaming a heading changes a URL.

The FAQ accordion and the FAQPage JSON-LD both read `post.faqs`; the article
and the BlogPosting JSON-LD both read the same fields. Do not add a second
copy of either, and do not paste raw `<script type="application/ld+json">` from
an SEO brief into a page: build it in `src/seo/schema.js` so it stays tied to
the content it describes.

`metaTitle` and `metaDescription` are supplied by the SEO brief and are used
verbatim through `<Seo exactTitle>`. Do not re-append the brand.

## 13. Before calling a change done

- [ ] `npm run build` passes
- [ ] `npm run lint` shows no **new** errors
- [ ] No console errors on the affected routes
- [ ] No horizontal scroll at the breakpoints in §7
- [ ] Existing routes still work: `/`, `/about`, `/projects`, `/projects/:slug`, `/contact`, `/blog`, `/blog/:slug`
- [ ] Hero and About frame sequences still scrub
- [ ] No invented facts (§5)
