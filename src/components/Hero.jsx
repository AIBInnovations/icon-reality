import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

const FRAME_COUNT = 476;
const frameUrl = (i) => `/frames/f${String(i + 1).padStart(3, '0')}.jpg`;

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

      const img0 = stateRef.current.images[i0];
      const img1 = stateRef.current.images[i1];
      if (!img0 || !img0.complete || !img0.naturalWidth) return;
      stateRef.current.lastF = fIdx;

      const p0 = placeImage(img0);
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, cw, ch);
      ctx.globalAlpha = 1;
      ctx.drawImage(img0, p0.x, p0.y, p0.w, p0.h);

      if (img1 && img1.complete && img1.naturalWidth && i1 !== i0 && t > 0) {
        ctx.globalAlpha = t;
        ctx.drawImage(img1, p0.x, p0.y, p0.w, p0.h);
        ctx.globalAlpha = 1;
      }
    };

    // ---- preload ALL frames in parallel, and only reveal the hero once every
    // frame is in memory. The PageLoader stays up for the whole load, so the
    // hero never paints a partial / "preview" state to the user.
    const images = [];
    let loaded = 0;
    let lastPct = -1;
    let resolveAll;
    const allLoaded = new Promise((res) => { resolveAll = res; });
    const bump = () => {
      loaded++;
      const frac = loaded / FRAME_COUNT;
      const pct = Math.floor(frac * 100);
      if (pct !== lastPct) { // throttle progress reports to ~1 per percent
        lastPct = pct;
        onProgress && onProgress(frac);
      }
      if (loaded >= FRAME_COUNT) resolveAll();
    };
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.onload = bump;
      img.onerror = bump;
      img.src = frameUrl(i);
      images.push(img);
    }
    stateRef.current.images = images;

    resize();
    window.addEventListener('resize', resize);

    let gsapCtx = null;

    allLoaded.then(() => {
      if (!mounted) return;
      // Paint the first frame BEFORE signalling ready, so when the PageLoader
      // lifts the hero is already showing — fully loaded, no preview/flash.
      resize();
      draw(stateRef.current.progress);
      onReady && onReady();

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
                An address that rises,<br/>to your standard.
              </h1>
              <p className="hero__sub">
                A premium residential project on the Indore–Nagpur Highway.
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
