import { createContext, useContext } from 'react';

// Kept in its own (non-component) module so the provider file only exports a
// component — keeps React Fast Refresh happy.
export const EnquiryContext = createContext(null);

/** Access the app-wide enquiry modal: `const { openEnquiry } = useEnquiry();` */
export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error('useEnquiry must be used within <EnquiryProvider>');
  return ctx;
}
