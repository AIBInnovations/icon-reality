import './PageLoader.css';

export default function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <div className="page-loader__inner">
        <img src="/icon-logo.png" alt="" className="page-loader__logo" aria-hidden />
        <div className="page-loader__bar">
          <span />
        </div>
        <span className="page-loader__label">LOADING</span>
      </div>
    </div>
  );
}
