import { trackEvent } from './track';

/**
 * Named conversion events, in one place.
 *
 * Components call these helpers instead of writing raw gtag/trackEvent calls,
 * so event names and parameter shapes stay consistent and can be renamed
 * without touching the UI. Submission events live in services/leads.js (fired
 * once, where the lead actually leaves the browser); everything here is an
 * engagement/intent signal.
 *
 * tel:, mailto:, wa.me, Google Maps and .pdf clicks are already captured
 * automatically by the delegated listener in Analytics.jsx — do NOT also fire
 * them here or every one will be counted twice.
 */

export const trackProjectView = (project) =>
  trackEvent('project_view', { project: project?.name, project_slug: project?.slug, status: project?.status });

export const trackEnquiryOpen = (source, project) =>
  trackEvent('enquiry_open', { source, project });

export const trackFloorPlanView = (project, plan) =>
  trackEvent('floor_plan_view', { project, plan });

export const trackMasterPlanView = (project, plan) =>
  trackEvent('master_plan_view', { project, plan });

export const trackGalleryView = (project, category) =>
  trackEvent('gallery_view', { project, category });

export const trackSiteVisitOpen = (project, source) =>
  trackEvent('site_visit_open', { project, source });

export const trackBrochureGateOpen = (project) =>
  trackEvent('brochure_request_open', { project });

export const trackBrochureDownload = (project, file) =>
  trackEvent('brochure_download', { project, file_name: file });

export const trackVideoPlay = (project, title) =>
  trackEvent('video_play', { project, video_title: title });
