import { useEffect, useState } from 'react';

/**
 * AVIF delivery for the places `<picture>` cannot reach.
 *
 * `scripts/build-avif.sh` writes an `.avif` twin beside every raster asset in
 * `public/`. Ordinary images negotiate the format themselves through
 * `<Picture>` (components/Picture.jsx). Two things cannot:
 *
 *  - the scroll-scrubbed canvas sequences, which build frames with
 *    `new Image()` and draw them to a canvas
 *  - a `<video poster>`, which takes one URL and offers no fallback
 *
 * Both have to pick a format themselves, so this module answers "can this
 * browser decode AVIF?" once and shares the answer.
 *
 * The probe is a 1x1 AVIF as a data URI: no network, no measurable time. It
 * starts at module load rather than on first call, so by the time anything
 * asks, the answer is normally already in hand — which is why `avifSupportSync`
 * can usually give it during the first render, before a wrong-format request
 * has been issued.
 *
 * Note it must be a DECODE test. `canvas.toDataURL('image/avif')` tests
 * whether the browser can ENCODE AVIF, which Chrome cannot, and would report
 * false for a browser that reads AVIF perfectly well.
 */
const PROBE =
  'data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAG1pZjFhdmlmbWlhZgAAANZtZXRhAAAAAAAAACFoZGxyAAA' +
  'AAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAAA5waXRtAAAAAAABAAAAImlsb2MAAAAAREAAAQABAAAAAAD6AAEAAAAAA' +
  'AAAHgAAACNpaW5mAAAAAAABAAAAFWluZmUCAAAAAAEAAGF2MDEAAAAAVmlwcnAAAAA4aXBjbwAAAAxhdjFDgUBsAAA' +
  'AABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwwMDAAAABZpcG1hAAAAAAAAAAEAAQOBAgMAAAAmbWRhdBIAC' +
  'ghYAAY0BDQbhDIQGYAVVVVEAACwE3ch6pvIrA==';

const RASTER = /\.(jpe?g|png|webp)(\?.*)?$/i;

/**
 * The `.avif` path for a local raster asset, or null when there will not be
 * one: remote hosts, data URIs, SVGs and anything already AVIF.
 */
export function avifTwin(src) {
  if (typeof src !== 'string' || !src) return null;
  if (/^[a-z]+:/i.test(src) || src.startsWith('//')) return null;   // http(s):, data:, blob:
  if (!RASTER.test(src)) return null;
  // Keep any cache-busting query on the end, where it was.
  const [path, query] = src.split('?');
  return `${path.replace(/\.[^.]+$/, '.avif')}${query ? `?${query}` : ''}`;
}

let resolved = null;   // null until the probe answers, then true/false

const supported = typeof window === 'undefined'
  ? Promise.resolve(false)
  : new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.width === 1 && img.height === 1);
    img.onerror = () => resolve(false);
    img.src = PROBE;
  });

supported.then((v) => { resolved = v; });

/** Resolves true when the browser can decode AVIF. Safe to call repeatedly. */
export function avifSupported() {
  return supported;
}

/** true / false once known, null while the probe is still in flight. */
export function avifSupportSync() {
  return resolved;
}

/**
 * The best URL for `src` in this browser, for attributes that cannot fall
 * back on their own — `<video poster>` above all.
 *
 * Returns null while support is still unknown. Callers must leave the
 * attribute off until then: rendering the original first and swapping it
 * afterwards would fetch both files, which is the opposite of the point.
 * In practice the probe has already settled by first render, because the
 * route chunk takes far longer to arrive than a data URI takes to decode.
 */
export function useAvifSrc(src) {
  const [ok, setOk] = useState(avifSupportSync);

  useEffect(() => {
    if (ok !== null) return undefined;
    let live = true;
    supported.then((v) => { if (live) setOk(v); });
    return () => { live = false; };
  }, [ok]);

  if (ok === null) return null;
  return (ok && avifTwin(src)) || src;
}
