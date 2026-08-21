import { useState } from 'react';
import Reveal from './Reveal';
import ImageViewer from './ImageViewer';
import './ConstructionUpdates.css';

/**
 * Dated construction progress.
 *
 * A percentage bar renders ONLY when the update carries a real `progress`
 * value. No project in projects.js currently publishes one, so today this
 * section shows dated updates and photographs without a progress figure —
 * which is the honest state, not a gap to be filled with an estimate
 * (read.md §20, §71).
 *
 * Shape: { date, title, description, images: [], video, progress }
 */
export default function ConstructionUpdates({
  updates = [],
  projectName,
  eyebrow = 'Transparency',
  heading = 'Construction updates.',
  lede,
  className = '',
  id,
}) {
  const [viewer, setViewer] = useState(null); // { images, index }
  if (!updates.length) return null;

  return (
    <section className={`construction ${className}`} id={id}>
      <div className="container">
        <div className="construction__head">
          <Reveal as="span" className="eyebrow construction__eyebrow">{eyebrow}</Reveal>
          <Reveal as="h2" className="display construction__heading" delay={0.05}>{heading}</Reveal>
          {lede && <Reveal as="p" className="construction__lede" delay={0.1}>{lede}</Reveal>}
        </div>

        <ol className="construction__timeline">
          {updates.map((u, i) => {
            const images = (u.images || []).filter(Boolean);
            return (
              <Reveal as="li" key={`${u.date}-${u.title}`} className="construction__entry" delay={Math.min(i, 5) * 0.05}>
                <div className="construction__marker" aria-hidden>
                  <span className="construction__dot" />
                </div>

                <div className="construction__body">
                  <div className="construction__meta">
                    {u.date && <time className="construction__date">{u.date}</time>}
                    {/* Only when the data genuinely carries a number. */}
                    {typeof u.progress === 'number' && (
                      <span className="construction__progress">
                        <span className="construction__progress-track">
                          <span
                            className="construction__progress-fill"
                            style={{ width: `${Math.max(0, Math.min(100, u.progress))}%` }}
                          />
                        </span>
                        <span className="construction__progress-v">{Math.round(u.progress)}%</span>
                      </span>
                    )}
                  </div>

                  {u.title && <h3 className="construction__title">{u.title}</h3>}
                  {u.description && <p className="construction__copy">{u.description}</p>}

                  {images.length > 0 && (
                    <div className="construction__shots">
                      {images.map((src, j) => (
                        <button
                          type="button"
                          key={src}
                          className="construction__shot"
                          onClick={() => setViewer({ images, index: j })}
                          aria-label={`View construction photo ${j + 1} of ${images.length}`}
                        >
                          <img
                            src={src}
                            alt={`${projectName || 'Project'} construction, ${u.date || u.title || `photo ${j + 1}`}`}
                            loading="lazy"
                            decoding="async"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {u.video && (
                    <video
                      className="construction__video"
                      src={u.video}
                      controls
                      preload="none"
                      playsInline
                      poster={images[0]}
                    />
                  )}
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>

      {viewer && (
        <ImageViewer
          images={viewer.images}
          index={viewer.index}
          onIndexChange={(i) => setViewer((v) => ({ ...v, index: i }))}
          onClose={() => setViewer(null)}
          title={projectName ? `${projectName}: construction` : 'Construction'}
        />
      )}
    </section>
  );
}
