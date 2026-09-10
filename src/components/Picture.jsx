import { avifTwin } from '../utils/avif';

/**
 * A drop-in `<img>` that serves AVIF where the browser supports it.
 *
 * `scripts/build-avif.sh` writes an `.avif` twin beside every raster asset in
 * `public/` (photographs, artwork and both canvas frame sequences). This
 * renders the pair as a `<picture>`, so a modern browser takes the AVIF and
 * everything else falls through to the original file untouched. Across the
 * site that is ~183 MB of imagery down to ~74 MB with no visible difference:
 * the originals stay in the repo and stay the source of truth.
 *
 * Usage is identical to `<img>` — every attribute, including `ref`, `onLoad`,
 * `onError`, `className`, `loading` and `decoding`, lands on the `<img>`:
 *
 *   <Picture src="/images/foo.jpg" alt="..." loading="lazy" />
 *
 * `picture { display: contents }` in index.css keeps the wrapper out of the
 * layout tree, so existing CSS that targets `.thing img` or positions the
 * image absolutely behaves exactly as it did before the swap.
 */
export default function Picture({ src, sources, ...rest }) {
  const avif = avifTwin(src);
  if (!avif) return <img src={src} {...rest} />;

  return (
    <picture>
      <source type="image/avif" srcSet={avif} />
      {sources}
      <img src={src} {...rest} />
    </picture>
  );
}
