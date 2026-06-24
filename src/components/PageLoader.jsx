import './PageLoader.css';

export default function PageLoader({ progress }) {
  // When a real progress value is provided, show a determinate bar + percent so
  // the wait (preloading the full hero sequence) reads as intentional, not stuck.
  const hasProgress = typeof progress === 'number';
  const pct = hasProgress ? Math.round(Math.min(1, Math.max(0, progress)) * 100) : 0;

  return (
    <div className="page-loader" role="status" aria-live="polite">
      <div className="page-loader__inner">
        <img src="/icon-logo.png" alt="" className="page-loader__logo" aria-hidden />
        <div className={`page-loader__bar ${hasProgress ? 'is-determinate' : ''}`}>
          <span style={hasProgress ? { width: `${pct}%` } : undefined} />
        </div>
        <span className="page-loader__label">{hasProgress ? `LOADING ${pct}%` : 'LOADING'}</span>
      </div>
    </div>
  );
}
