/**
 * Selector for everything a user can Tab to. Shared by every modal/overlay on
 * the site (enquiry modal, plan viewer, gallery lightbox) so they all trap
 * focus against the same definition.
 *
 * `:not([disabled])` and the negative-tabindex filter matter: a disabled submit
 * button or a decorative tabindex="-1" wrapper must not become a trap boundary.
 */
export const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');
