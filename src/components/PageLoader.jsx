import { useEffect, useState } from 'react';
import './PageLoader.css';

export default function PageLoader({ progress, leaving }) {
  // When a real progress value is provided, show a determinate bar + percent so
  // the wait (preloading the full hero sequence) reads as intentional, not stuck.
  const hasProgress = typeof progress === 'number';
  const [fallbackPct, setFallbackPct] = useState(0);

  useEffect(() => {
    if (hasProgress) return undefined;

    const start = performance.now();
    let frame = 0;
    const tick = (now) => {
      const elapsed = now - start;
      setFallbackPct(Math.min(100, Math.round((elapsed / 700) * 100)));
      if (elapsed < 700) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [hasProgress]);

  const pct = hasProgress ? Math.round(Math.min(1, Math.max(0, progress)) * 100) : fallbackPct;

  return (
    <div className={`page-loader ${leaving ? 'is-leaving' : ''}`} role="status" aria-live="polite">
      <div className="page-loader__inner">
        <img src="/icon-logo.png" alt="" className="page-loader__logo" aria-hidden />
        <div className="page-loader__bar">
          <span />
        </div>
        <span className="page-loader__label">LOADING {pct}%</span>
      </div>
    </div>
  );
}
