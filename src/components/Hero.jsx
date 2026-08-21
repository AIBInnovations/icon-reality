import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

const FRAME_COUNT = 476;
// bump ASSET_REV whenever the frame images themselves are re-exported, so
// browsers holding an older copy re-fetch instead of serving it from cache
const ASSET_REV = 2;
const frameUrl = (i) => `/frames/f${String(i + 1).padStart(3, '0')}.jpg?v=${ASSET_REV}`;

// ---------------------------------------------------------------------------
// Progressive frame loading (read.md §57).
//
// The sequence used to block the reveal on all 476 frames (~62 MB) — on a slow
// connection that is a minute of loading screen for an effect the visitor
// hasn't seen yet. Now:
//
//   1. the first BOOTSTRAP_FRAMES load, in order          → loader progress
//   2. the hero reveals as soon as they are in memory     → ~1/5 the wait
//   3. the remaining frames stream in behind it, in order, a few at a time
//
// The visual is unchanged: the hero is pinned for roughly three viewport
// heights, so the bootstrap batch covers the opening of the scrub while the
// rest arrives, and draw() falls back to the nearest earlier frame it has if
// the user out-scrolls the download — the sequence slows, it never blanks.
//
// The bootstrap batch is sized from the visitor's ACTUAL measured throughput,
// not guessed: a fixed batch that reveals in half a second on office wi-fi is
// half a minute on a phone on 4G. We download a small probe, time it, and then
// take as many further frames as fit inside REVEAL_BUDGET_MS.
const PROBE_FRAMES = 16;
const REVEAL_BUDGET_MS = 2500;
// Floor: enough to cover the first beat of the scrub even on a slow link.
// Ceiling: past this the reveal is being delayed for frames the visitor will
// not reach before the background queue has fetched them anyway.
const MIN_BOOTSTRAP = 24;
const MAX_BOOTSTRAP = 120;
// Kept low on purpose: the browser caps parallel connections anyway, and
// flooding the queue delays the frames the visitor is about to look at.
const BACKGROUND_CONCURRENCY = 6;

export default function Hero({ onReady, onProgress }) {
  const wrapRef = useRef(null);
  const innerRef = useRef(null);
  const canvasRef = useRef(null);
  const copyClipRef = useRef(null);
  const copyInnerRef = useRef(null);
  const arrowRef = useRef(null);
  const stateRef = useRef({ images: [], lastF: -1, progress: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!canvas || !wrap || !inner) return;
    let mounted = true;

    const ctx = canvas.getContext('2d', { alpha: false });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cw = 0, ch = 0;

    const resize = () => {
      // Mobile browser bars collapsing on scroll fire resize with an unchanged
      // box — setting canvas.width blanks the frame, so skip the reallocation
      // and just repaint.
      if (inner.clientWidth === cw && inner.clientHeight === ch) {
        draw(stateRef.current.progress);
        return;
      }
      cw = inner.clientWidth;
      ch = inner.clientHeight;
      canvas.width = Math.floor(cw * dpr);
      canvas.height = Math.floor(ch * dpr);
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(stateRef.current.progress);
    };

    const placeImage = (img) => {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const s = Math.max(cw / iw, ch / ih);
      const w = iw * s;
      const h = ih * s;
      return { x: (cw - w) / 2, y: (ch - h) / 2, w, h };
    };

    const draw = (progress) => {
      stateRef.current.progress = progress;
      const fIdx = progress * (FRAME_COUNT - 1);
      const i0 = Math.max(0, Math.min(FRAME_COUNT - 1, Math.floor(fIdx)));
      const i1 = Math.max(0, Math.min(FRAME_COUNT - 1, i0 + 1));
      const t = fIdx - i0;

      // Frames stream in behind the reveal, so the exact frame may not have
      // arrived yet. Fall back to the nearest earlier one that has — the
      // sequence holds rather than blanking, and catches up as it downloads.
      const ready = (img) => img && img.complete && img.naturalWidth > 0;
      let base = i0;
      while (base > 0 && !ready(stateRef.current.images[base])) base--;

      const img0 = stateRef.current.images[base];
      const img1 = base === i0 ? stateRef.current.images[i1] : null;
      if (!ready(img0)) return;
      stateRef.current.lastF = fIdx;

      const p0 = placeImage(img0);
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, cw, ch);
      ctx.globalAlpha = 1;
      ctx.drawImage(img0, p0.x, p0.y, p0.w, p0.h);

      if (ready(img1) && i1 !== i0 && t > 0) {
        ctx.globalAlpha = t;
        ctx.drawImage(img1, p0.x, p0.y, p0.w, p0.h);
        ctx.globalAlpha = 1;
      }
    };

    // ---- progressive preload (see the note by BOOTSTRAP_FRAMES) ----
    const images = new Array(FRAME_COUNT);
    stateRef.current.images = images;

    /**
     * Kick off one frame; resolves on load OR error, never rejects.
     *
     * The priority hint matters more than it looks: every section below the
     * hero has lazily-loaded photography, and on a slow link the browser was
     * fetching ~6 MB of it in parallel with the frames the visitor is actually
     * staring at a loading bar for. Bootstrap frames are marked high so they
     * win that race; background frames are marked low so they lose it to
     * anything the visitor has scrolled to.
     */
    const loadFrame = (i, priority = 'auto') => new Promise((res) => {
      const img = new Image();
      img.decoding = 'async';
      img.fetchPriority = priority;
      images[i] = img;
      img.onload = res;
      // a missing frame must not stall the queue behind it
      img.onerror = res;
      img.src = frameUrl(i);
    });

    let bootstrapped = 0;
    let target = MIN_BOOTSTRAP;
    let lastFrac = 0;
    let lastPct = -1;
    const bumpBootstrap = () => {
      bootstrapped++;
      // The target grows once the probe has measured the connection, so clamp
      // the reported fraction to be monotonic — a percentage that counts
      // backwards reads as a stuck loader.
      const frac = Math.max(lastFrac, Math.min(1, bootstrapped / target));
      lastFrac = frac;
      const pct = Math.floor(frac * 100);
      if (pct !== lastPct) { // throttle progress reports to ~1 per percent
        lastPct = pct;
        onProgress && onProgress(frac);
      }
    };

    let cancelBackground = false;
    let bootstrapCount = MIN_BOOTSTRAP;

    // Phase 1 — probe, size the batch to the connection, then load it.
    const bootstrap = (async () => {
      const probeCount = Math.min(PROBE_FRAMES, FRAME_COUNT);
      const t0 = performance.now();
      await Promise.all(
        Array.from({ length: probeCount }, (_, i) => loadFrame(i, 'high').then(bumpBootstrap))
      );
      const elapsed = Math.max(1, performance.now() - t0);

      // Data Saver is an explicit request not to pull 60 MB of imagery; honour
      // it by revealing on the floor batch and streaming the rest quietly.
      const saveData = navigator.connection?.saveData === true;
      const framesPerMs = probeCount / elapsed;
      const affordable = Math.round(framesPerMs * REVEAL_BUDGET_MS);

      bootstrapCount = saveData
        ? MIN_BOOTSTRAP
        : Math.min(FRAME_COUNT, Math.max(MIN_BOOTSTRAP, Math.min(MAX_BOOTSTRAP, probeCount + affordable)));
      target = bootstrapCount;

      if (bootstrapCount > probeCount) {
        await Promise.all(
          Array.from({ length: bootstrapCount - probeCount }, (_, k) =>
            loadFrame(probeCount + k, 'high').then(bumpBootstrap))
        );
      }
      onProgress && onProgress(1);
    })();

    // Phase 2 — everything else, in order, a few at a time, behind the reveal.
    const loadRest = async () => {
      let next = bootstrapCount;
      const worker = async () => {
        while (!cancelBackground && next < FRAME_COUNT) {
          const i = next++;
          await loadFrame(i, 'low');
          // Repaint if the newly-arrived frame is the one the current scroll
          // position actually wants — otherwise the canvas would keep showing
          // the fallback until the next scroll event.
          if (!cancelBackground) {
            const wanted = Math.round(stateRef.current.progress * (FRAME_COUNT - 1));
            if (i === wanted) draw(stateRef.current.progress);
          }
        }
      };
      await Promise.all(
        Array.from({ length: BACKGROUND_CONCURRENCY }, worker)
      );
    };

    resize();
    window.addEventListener('resize', resize);

    let gsapCtx = null;

    bootstrap.then(() => {
      if (!mounted) return;
      // Paint the first frame BEFORE signalling ready, so when the loader lifts
      // the hero is already showing — never a blank canvas.
      resize();
      draw(stateRef.current.progress);
      onReady && onReady();

      // The rest of the sequence downloads from here, behind the visible hero.
      loadRest();

      // gsap.context() scopes the pin + ScrollTriggers, so a single ctx.revert()
      // cleanly unwinds the pinSpacer wrapper GSAP injects. Required for React
      // to remove the <section> on route change without
      // "Failed to execute 'removeChild' on 'Node'" errors.
      gsapCtx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: wrap,
          start: 'top top',
          end: 'bottom bottom', // CSS position:sticky on .hero__sticky handles the visual pin
          scrub: 0.4,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            draw(self.progress);
            const p = self.progress;
            const clip = copyClipRef.current;
            const inner = copyInnerRef.current;
            if (clip && inner) {
              const maxTravel = inner.offsetHeight + 24;
              const t = Math.min(1, p / 0.22);
              const y = -t * maxTravel;
              inner.style.transform = `translate3d(0, ${y}px, 0)`;
            }
            if (arrowRef.current) {
              const ay = -Math.min(1, p / 0.10) * 80;
              arrowRef.current.style.transform = `translate3d(-50%, ${ay}px, 0)`;
              arrowRef.current.style.opacity = Math.max(0, 1 - p / 0.12);
            }
          },
        });
      });

      ScrollTrigger.refresh();
    });

    return () => {
      mounted = false;
      // Stop queueing frames the moment the page unmounts — otherwise a visitor
      // who navigates away during the load keeps ~380 requests in flight.
      cancelBackground = true;
      window.removeEventListener('resize', resize);
      if (gsapCtx) gsapCtx.revert();
    };
  }, []);

  return (
    <section ref={wrapRef} className="hero" id="top">
      <div className="hero__sticky">
      <div ref={innerRef} className="hero__inner">
        <canvas ref={canvasRef} className="hero__canvas" />
        <div className="hero__veil" />

        <div className="hero__copy container">
          <div ref={copyClipRef} className="hero__copy-clip">
            <div ref={copyInnerRef} className="hero__copy-inner">
              <h1 className="display hero__headline">
                Twenty years of<br/>addresses that last.
              </h1>
              <p className="hero__sub">
                Icon Realty — designing and marketing residential plotted developments in Indore since 2004.
              </p>
            </div>
          </div>
        </div>

        <div ref={arrowRef} className="hero__scroll-cue" aria-hidden>
          <span>SCROLL</span>
          <svg width="14" height="34" viewBox="0 0 14 34" fill="none">
            <path d="M7 1V31M7 31L1 25M7 31L13 25" stroke="currentColor" strokeWidth="1.4"/>
          </svg>
        </div>
      </div>
      </div>
    </section>
  );
}
