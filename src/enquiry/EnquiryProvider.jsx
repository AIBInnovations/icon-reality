import { useCallback, useState } from 'react';
import EnquiryModal from '../components/EnquiryModal';
import { EnquiryContext } from './enquiryContext';

/**
 * App-wide enquiry modal. One <EnquiryModal> is mounted here; every "Book a
 * Site Visit" / enquiry CTA anywhere on the site calls openEnquiry() to open it,
 * so there is exactly one form and one modal, opened from many places.
 *
 *   const { openEnquiry } = useEnquiry();   // from ./enquiryContext
 *   <button onClick={() => openEnquiry({ source: 'Footer', project: 'Oscar Palace' })}>
 *
 * openEnquiry accepts the same props EnquiryForm takes (source, project,
 * eyebrow, heading); all are optional and fall back to sensible defaults.
 */
export function EnquiryProvider({ children }) {
  // null = closed; an object = open, carrying that opening's form props
  const [config, setConfig] = useState(null);

  const openEnquiry = useCallback((opts = {}) => setConfig(opts), []);
  const closeEnquiry = useCallback(() => setConfig(null), []);

  return (
    <EnquiryContext.Provider value={{ openEnquiry, closeEnquiry }}>
      {children}
      <EnquiryModal
        open={config !== null}
        onClose={closeEnquiry}
        idPrefix="enq"
        headingId="enquiry-modal-title"
        eyebrow={config?.eyebrow || 'Send a request'}
        heading={config?.heading || 'Book a site visit.'}
        source={config?.source || 'Website'}
        project={config?.project}
      />
    </EnquiryContext.Provider>
  );
}
