import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useAvifSrc } from '../utils/avif';
import './Hero.css';
import './HeroMontage.css';

/**
 * The home hero: a montage of short clips from every project film on Icon
 * Realty's YouTube channel, looping behind the headline. It stands in for the
 * scroll-scrubbed frame sequence (Hero.jsx), which is kept and can be switched
 * back in HomePage.jsx.
 *
 * The films are built by scripts/build-hero-montage.py: sixteen clips, a new one
 * fully on screen every CLIP_STEP seconds, crossfading into each other and back
 * round to the first so the loop has no seam. Each visit opens on a random
 * clip. Every clip start is a keyframe, so that seek is instant.
 *
 * Only the film: no controls, no timeline. It is decoration, so it is hidden
 * from assistive technology; the headline carries the meaning.
 */
const DIR = '/video/hero';
// /video is served immutable for a year (vercel.json): bump this whenever the
// films are rebuilt, or returning visitors keep the old cut.
const ASSET_REV = 1;
const CLIP_COUNT = 16;   // keep in step with CLIPS in scripts/build-hero-montage.py
const CLIP_STEP = 2.5;   // CLIP - FADE there
// Past this the page is revealed on the poster rather than kept waiting on a
// slow line; the film fades in behind the headline whenever it is ready.
const READY_CAP_MS = 4000;
const AV1 = 'video/mp4; codecs="av01.0.08M.08"';

function montageAllowed() {
  if (typeof window === 'undefined') return false;
  // A looping film is exactly the motion reduced-motion asks us not to start.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  // Same rule the frame sequence followed: Save-Data and 2G get the still.
  const c = navigator.connection;
  if (c && (c.saveData || /2g$/.test(c.effectiveType || ''))) return false;
  return true;
}

const av1Playable = () =>
  typeof document !== 'undefined' && document.createElement('video').canPlayType(AV1) === 'probably';

export default function HeroMontage({ onReady, onProgress }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [allowed] = useState(montageAllowed);
  const [av1] = useState(av1Playable);
  // A still has nothing to wait for; a film is ready once it has a frame up.
  const [ready, setReady] = useState(!allowed);
  // Portrait screens get a film cut for them rather than a landscape one
  // cropped to a sliver by object-fit.
  const portrait = useMediaQuery('(max-aspect-ratio: 1/1)');

  const name = portrait ? 'montage-portrait' : 'montage';
  const src = allowed ? `${DIR}/${name}${av1 ? '-av1' : ''}.mp4?v=${ASSET_REV}` : undefined;
  const poster = useAvifSrc(`${DIR}/${portrait ? 'poster-portrait' : 'poster'}.jpg?v=${ASSET_REV}`);

  // Hold the page loader until the first frame is on screen (or the cap).
  useEffect(() => {
    if (!allowed) {
      onProgress && onProgress(1);
      onReady && onReady();
      return undefined;
    }

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setReady(true);
      onProgress && onProgress(1);
      onReady && onReady();
    };
    const cap = setTimeout(finish, READY_CAP_MS);
    const video = videoRef.current;
    if (!video) return () => clearTimeout(cap);

    onProgress && onProgress(0.2);
    const onMeta = () => onProgress && onProgress(0.6);
    video.addEventListener('loadedmetadata', onMeta);
    video.addEventListener('playing', finish);
    video.addEventListener('canplay', finish);
    video.addEventListener('error', finish);

    return () => {
      clearTimeout(cap);
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('playing', finish);
      video.removeEventListener('canplay', finish);
      video.removeEventListener('error', finish);
    };
    // once: the loader only ever waits for the first film
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Open each film (first load, or a turn of the device) on a random clip.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return undefined;
    const start = () => {
      const k = Math.floor(Math.random() * CLIP_COUNT);
      if (k) video.currentTime = k * CLIP_STEP;
      // React sets `muted` as a property only; say it outright before asking
      // to play, since autoplay is only allowed for a muted film.
      video.muted = true;
      video.play().catch(() => {});
    };
    if (video.readyState >= 1) start();
    else video.addEventListener('loadedmetadata', start, { once: true });
    return () => video.removeEventListener('loadedmetadata', start);
  }, [src]);

  // Stop decoding while the hero is scrolled away; pick up again on return.
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || !src) return undefined;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0 });
    io.observe(section);
    return () => io.disconnect();
  }, [src]);

  return (
    <section ref={sectionRef} className={`hero hero--montage${ready ? ' is-ready' : ''}`} id="top">
      <div className="hero__sticky">
        <div className="hero__inner">
          <video
            key={src || 'still'}
            ref={videoRef}
            className="hero-montage__video"
            src={src}
            poster={poster || undefined}
            autoPlay={Boolean(src)}
            muted
            loop
            playsInline
            preload={src ? 'auto' : 'none'}
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
            tabIndex={-1}
          />
          <div className="hero__veil" />

          <div className="hero__copy container">
            <div className="hero__copy-clip">
              <div className="hero__copy-inner hero-montage__copy">
                {/* Two lines on wide screens, "Twenty years of / addresses that
                    last."; three on phones, "Twenty years / of addresses /
                    that last.", where the two-line break left "of" alone on a
                    line. HeroMontage.css switches between them. */}
                <h1 className="display hero__headline">
                  <span className="hero-montage__hl">Twenty years </span>
                  <span className="hero-montage__hl">of<br className="hero-montage__hl-break" /> addresses </span>
                  <span className="hero-montage__hl">that last.</span>
                </h1>
                <p className="hero__sub">
                  Icon Realty. Designing and marketing residential plotted developments in Indore since 2004.
                </p>
              </div>
            </div>
          </div>

          <div className="hero__scroll-cue" aria-hidden>
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
