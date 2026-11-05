# Icon Realty SEO audit and fixes

Reviewed 5 November 2026 against the three supplied PDFs and the repository. Document recommendations were treated as evidence to verify, not instructions to execute.

## Why the reports disagree

| Report | Reported score | What the evidence shows |
| --- | --- | --- |
| SEOmator | 85; Lighthouse SEO 100 | Found only 38 words, no H1 and the loading logo as the LCP candidate. This is consistent with inspecting the loading state before the lazy homepage and deferred sections finish rendering. Its phone-number “keyword stuffing” warning is not useful evidence of stuffing. |
| Zadro | 70; desktop speed 98, mobile 93 | Flags headings and images but the PDF does not expose the expanded details. Its speed results do not support a blanket performance failure. |
| Semrush free checker | 23 | Combines on-page, technical, off-page and social factors. Reports unavailable DOM metrics and missing social profiles that SEOmator detects. Its score is not directly comparable with SEOmator or Lighthouse. |

The source already has a homepage H1, mobile viewport, responsive CSS, social links, image alt attributes, font `display=swap`, robots, sitemap and structured data. Most non-blog URLs previously returned an empty React root with homepage metadata. The homepage also waits for the hero before mounting its lower sections. These are real crawlability weaknesses even though the completed browser page contains the content.

Google recommends static or server rendering because some crawlers cannot run JavaScript: [JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).

## Implemented

- Generate static HTML for all 38 sitemap URLs. Non-blog pages use the existing React components and their existing SEO props; blog pages retain their established block renderer. Headings, project content and internal links are available without waiting for JavaScript or video. The browser keeps its existing mounting, hero timing, layouts and animation behavior.
- Every generated page receives its own title, description, canonical, social metadata and page-specific schema instead of falling back to the homepage canonical.
- Shorten and unify the homepage title and description across static HTML, runtime tags and social cards. No visible marketing copy changed.
- Mark prerendered page-specific JSON-LD for replacement on navigation, preventing a blog's schema from remaining on a different page.
- Preserve preview `noindex` after JavaScript runs. Previously the runtime SEO component could overwrite the build's noindex.
- Stop putting the build date in sitemap `lastmod` for unchanged pages. Keep actual publication/modification dates supplied by the blog data.
- Add explicit `noopener` alongside existing `noreferrer` on new-tab links.
- Add frame and permissions response headers. No restrictive content security policy was introduced that could break inline scripts, analytics or embedded media.
- Allow the static content to be read with JavaScript disabled by hiding the initial loader and releasing the mobile scroll lock in `noscript`.
- Add `npm run check:seo` to validate generated SEO artifacts. Ignore macOS `._*` filesystem metadata in ESLint.

## Verified or left for separate work

- Live homepage response uses HTTP/2 and gzip (`curl --compressed`): the missing compression warning is not reproduced. Vercel controls transport/compression; adding a fake response header would not optimize it.
- Google Fonts already includes `display=swap` and preconnects. No additional font preloads were added just to satisfy a heuristic.
- All 38 generated pages have alt attributes on their images. Decorative images deliberately retain empty alt text.
- Existing Instagram, Facebook and YouTube links remain. No unverified LinkedIn/X profiles were invented.
- Domain authority, backlinks and keyword visibility are external signals, not code defects. No backlink removal or disavow was performed on the strength of these reports.
- No meta keywords added: [Google does not use them for ranking](https://developers.google.com/search/docs/crawling-indexing/special-tags).
- No new legal policies, author credentials, dates, business claims or visible content were invented to satisfy generic homepage E-E-A-T checks. Article metadata remains tied to the existing post data.
- Scores, search rankings, field Core Web Vitals and indexing must be reassessed after deployment; local checks do not prove improvements to these measurements.

## Validation

- Production build passed; all 38 pages passed `npm run check:seo`: one H1, title, description and canonical, correct robots, sitemap coverage, image alt attributes and valid JSON-LD.
- Preview build passed; all 38 pages passed `node scripts/check-seo.mjs /tmp/icon-seo-preview --noindex`.
- Chrome checked `/`, `/about`, `/projects`, `/projects/oscar-palace`, `/contact`, `/blog` and a blog post at widths 390 and 1440: one H1, correct canonicals, no page errors and no horizontal overflow. Blog-to-About client navigation removed BlogPosting schema correctly. Homepage screenshot visually inspected.
- Targeted ESLint passed for the SEO changes. Full lint has five pre-existing errors (four unused ScrollTrigger imports and ServicesGrid's synchronous state update in an effect), plus the existing Hero hook dependency warning. These were verified against HEAD and left outside this change.

The first changes were pushed in commit `75afe5b`; build-loader cleanup followed
in `2fdfd9d`. A subsequent live check confirmed the new HTML and metadata were
being served, but also found a startup regression: React cleared the static page
before the first route chunk was ready, then the homepage hid its lower sections
until the decorative hero loaded. The static-only checks above did not detect it.

## Follow-up: continuous content during startup

- Preload only the initial URL's route module before mounting React. Existing
  generated HTML remains in the DOM while the module downloads. Other routes
  remain code split. A failed initial module leaves the static page readable.
- Mount homepage text and links immediately. Existing below-fold images retain
  native lazy loading, and HomeBlog still waits for hero readiness. Keep the
  hero montage, loading-cover animation, section order and visual styles.
- Refresh ScrollTrigger after initial mounting and hero readiness.
- Add `scripts/check-loading.mjs` as a browser regression check. It samples the
  DOM every 20 ms through startup and requires one H1, at least 300 words and
  project links, including delayed route JS, broken video and failed route JS.
  It also tests About with a delayed route module. The normal loader must leave.
- Local checks passed: more than 300 samples per scenario, with at least 1,504
  homepage words and 1,076 About words throughout the observed loading window.
  These are minimum observations, not complete-page word counts or new SEO scores.

Run the optional browser check with Playwright installed and a running preview:
`node scripts/check-loading.mjs`. `SEO_TEST_URL` selects the URL,
`CHROME_PATH` selects an installed Chrome executable, and `PLAYWRIGHT_MODULE`
can select an existing Playwright module installation.

No updated third-party SEO score or Search Console indexing result is claimed.
