import assert from 'node:assert/strict';

// Optional browser regression check. Install Playwright in the environment, or
// point PLAYWRIGHT_MODULE at an existing installation's entry module.
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
});
const base = process.env.SEO_TEST_URL || 'http://127.0.0.1:4173';

async function check({ name, path = '/', slow = false, fail = false, width = 1440 }) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  if (slow || fail) {
    await page.route(/\/assets\/(HomePage|AboutPage)-[^/]+\.js$/, async (route) => {
      if (fail) return route.abort();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return route.continue();
    });
    // Broken decorative media must not gate readable text and internal links.
    await page.route(/\/video\/hero\/.*\.mp4/, (route) => route.abort());
  }
  await page.addInitScript(() => {
    window.loadingSamples = [];
    document.addEventListener('DOMContentLoaded', () => {
      const sample = () => {
        const main = document.querySelector('main');
        window.loadingSamples.push({
          h1: main?.querySelectorAll('h1').length || 0,
          words: (main?.innerText || '').split(/\s+/).filter(Boolean).length,
          projects: main?.querySelectorAll('a[href^="/projects/"]').length || 0,
        });
      };
      sample();
      window.loadingTimer = setInterval(sample, 20);
    }, { once: true });
  });
  await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6500);
  const result = await page.evaluate(() => {
    clearInterval(window.loadingTimer);
    return {
      samples: window.loadingSamples,
      loader: !!document.querySelector('#initial-loader'),
      canonical: document.querySelector('link[rel="canonical"]')?.href,
    };
  });
  assert.ok(result.samples.length > 50, `${name}: insufficient observations`);
  for (const sample of result.samples) {
    assert.equal(sample.h1, 1, `${name}: heading disappeared during startup`);
    assert.ok(sample.words >= 300, `${name}: content shrank to ${sample.words} words`);
    if (path === '/') assert.ok(sample.projects > 0, `${name}: project links disappeared`);
  }
  assert.equal(result.loader, false, `${name}: initial cover remained stuck`);
  assert.deepEqual(errors, [], `${name}: browser errors`);
  console.log(`${name}: PASS, ${result.samples.length} samples, minimum ${Math.min(...result.samples.map((s) => s.words))} words, one H1 throughout`);
  await page.close();
}

try {
  await Promise.all([
    check({ name: 'Homepage' }),
    check({ name: 'Mobile, delayed JS and failed video', slow: true, width: 390 }),
    check({ name: 'Failed homepage JS: static content survives', fail: true }),
    check({ name: 'About with delayed JS', path: '/about', slow: true }),
  ]);
} finally {
  await browser.close();
}
