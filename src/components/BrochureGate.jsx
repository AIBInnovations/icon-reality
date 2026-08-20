import { useCallback, useState } from 'react';
import { useEnquiry } from '../enquiry/enquiryContext';
import { LEAD_INTENTS } from '../services/leads';
import { trackBrochureGateOpen, trackBrochureDownload } from '../analytics/events';
import './BrochureGate.css';

/**
 * Brochure download, behind a two-field gate.
 *
 * The gate is deliberately narrow. Floor plans, master layouts and galleries
 * stay completely open — only the brochure and a detailed price sheet are
 * high-intent enough to be worth asking for a name and a phone number
 * (read.md §50).
 *
 * Once given, the answer is remembered for the session, so a visitor who
 * downloads the Oscar Palace brochure and then opens Oscar Fort is not asked
 * again. sessionStorage, not localStorage: it is a courtesy for this visit, not
 * a permanent record kept on the visitor's machine.
 *
 * With no PDF for a project, the same button becomes an honest brochure
 * *request* — the lead still reaches the CRM and the team emails it over.
 */
const STORAGE_KEY = 'ir-brochure-unlocked';

function readUnlocked() {
  try { return sessionStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; }
}
function writeUnlocked() {
  try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch { /* private mode — gate again, no harm */ }
}

export default function BrochureGate({
  projectName,
  brochureUrl,
  label,
  className = 'cta',
  variant,
}) {
  const { openEnquiry } = useEnquiry();
  // Lazy initialiser rather than an effect: the app is client-rendered only
  // (no SSR — see main.jsx), so sessionStorage is available on first render and
  // the gate never flashes before resolving.
  const [unlocked, setUnlocked] = useState(readUnlocked);

  const hasPdf = Boolean(brochureUrl);
  const text = label || (hasPdf ? 'Download Brochure' : 'Request Brochure');

  const download = useCallback(() => {
    if (!brochureUrl) return;
    trackBrochureDownload(projectName, brochureUrl.split('/').pop());
    // A real navigation, so the browser's own download handling applies.
    window.open(brochureUrl, '_blank', 'noopener');
  }, [brochureUrl, projectName]);

  // Already unlocked and there is a file → skip the form entirely.
  if (unlocked && hasPdf) {
    return (
      <a
        href={brochureUrl}
        download
        target="_blank"
        rel="noreferrer"
        className={`${className} brochure-gate__btn`}
        aria-label={`Download the ${projectName} brochure`}
      >
        {text}
      </a>
    );
  }

  const open = () => {
    trackBrochureGateOpen(projectName);
    openEnquiry({
      intent: LEAD_INTENTS.BROCHURE,
      project: projectName,
      source: `Brochure — ${projectName}`,
      eyebrow: 'Brochure',
      heading: hasPdf ? `Get the ${projectName} brochure.` : `Request the ${projectName} brochure.`,
      // Two fields. Anything more and the download is not worth the friction.
      fields: ['name', 'phone'],
      submitLabel: hasPdf ? 'Get the brochure' : 'Request the brochure',
      successMessage: hasPdf
        ? 'Thank you — your brochure is opening now. If it does not, use the download button on the page.'
        : "Thank you — we'll send the brochure across shortly.",
      onSuccess: () => {
        writeUnlocked();
        setUnlocked(true);
        if (hasPdf) {
          // Let the success state paint before the new tab steals focus.
          setTimeout(download, 600);
        }
      },
    });
  };

  return (
    <button
      type="button"
      className={`${className} brochure-gate__btn ${variant ? `brochure-gate__btn--${variant}` : ''}`}
      onClick={open}
      aria-label={hasPdf ? `Download the ${projectName} brochure` : `Request the ${projectName} brochure`}
    >
      {text}
    </button>
  );
}
