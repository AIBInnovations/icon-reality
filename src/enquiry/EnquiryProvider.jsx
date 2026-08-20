import { useCallback, useState } from 'react';
import EnquiryModal from '../components/EnquiryModal';
import { EnquiryContext } from './enquiryContext';
import { trackEnquiryOpen } from '../analytics/events';

/**
 * App-wide enquiry modal. One <EnquiryModal> is mounted here; every "Book a
 * Site Visit" / enquiry CTA anywhere on the site calls openEnquiry() to open it,
 * so there is exactly one form and one modal, opened from many places.
 *
 *   const { openEnquiry } = useEnquiry();   // from ./enquiryContext
 *   <button onClick={() => openEnquiry({ source: 'Footer', project: 'Oscar Palace' })}>
 *
 * openEnquiry accepts the same props EnquiryForm takes (source, project,
 * eyebrow, heading) plus the LeadForm ones that make the modal intent-aware —
 * intent, fields, submitLabel, successMessage, onSuccess. All are optional and
 * fall back to a general enquiry.
 */
export function EnquiryProvider({ children }) {
  // null = closed; an object = open, carrying that opening's form props
  const [config, setConfig] = useState(null);
  // bumped on each open so the modal (and the form inside it) remounts fresh
  const [openCount, setOpenCount] = useState(0);

  const openEnquiry = useCallback((opts = {}) => {
    setConfig(opts);
    setOpenCount((n) => n + 1);
    trackEnquiryOpen(opts.source, opts.project);
  }, []);
  const closeEnquiry = useCallback(() => setConfig(null), []);

  return (
    <EnquiryContext.Provider value={{ openEnquiry, closeEnquiry }}>
      {children}
      <EnquiryModal
        // Remount on every opening so the form starts blank (and out of its
        // "sent" state) rather than showing the previous enquiry's success card.
        key={openCount}
        open={config !== null}
        onClose={closeEnquiry}
        headingId="enquiry-modal-title"
        eyebrow={config?.eyebrow || 'Send a request'}
        heading={config?.heading || 'Book a site visit.'}
        source={config?.source || 'Website'}
        project={config?.project}
        intent={config?.intent}
        fields={config?.fields}
        submitLabel={config?.submitLabel}
        successMessage={config?.successMessage}
        onSuccess={config?.onSuccess}
      />
    </EnquiryContext.Provider>
  );
}
