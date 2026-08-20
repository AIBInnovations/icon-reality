import { trackEvent } from '../analytics/track';

/**
 * The one place a lead leaves the browser.
 *
 * Every form on the site (enquiry, site visit, price request, brochure gate,
 * investor consultation, NRI assistance, channel-partner registration,
 * callback) funnels through submitLead() so the endpoint, the payload shape,
 * the analytics event and the error handling live here — not scattered across
 * a dozen components. Swapping /api/contact for a different CRM later is a
 * one-file change.
 *
 * The backend (api/contact.js) fans the lead out to the Sell Xpert CRM and to
 * Icon Realty's inbox, and answers ok as long as one of the two succeeded.
 */

const ENDPOINT = '/api/contact';

/**
 * Intents double as the analytics dimension and the CRM's sub-source, so the
 * team can see which journey produced a lead. Keep in sync with INTENT_LABELS.
 */
export const LEAD_INTENTS = {
  GENERAL: 'general-enquiry',
  PRICE: 'price-request',
  BROCHURE: 'brochure-download',
  SITE_VISIT: 'site-visit',
  VIRTUAL_TOUR: 'virtual-tour',
  INVESTOR: 'investor-consultation',
  NRI: 'nri-assistance',
  CHANNEL_PARTNER: 'channel-partner',
  CALLBACK: 'callback',
};

/** Human-readable label sent to the CRM as sub_source_name. */
export const INTENT_LABELS = {
  [LEAD_INTENTS.GENERAL]: 'General enquiry',
  [LEAD_INTENTS.PRICE]: 'Price request',
  [LEAD_INTENTS.BROCHURE]: 'Brochure request',
  [LEAD_INTENTS.SITE_VISIT]: 'Site visit',
  [LEAD_INTENTS.VIRTUAL_TOUR]: 'Virtual tour',
  [LEAD_INTENTS.INVESTOR]: 'Investor consultation',
  [LEAD_INTENTS.NRI]: 'NRI assistance',
  [LEAD_INTENTS.CHANNEL_PARTNER]: 'Channel partner registration',
  [LEAD_INTENTS.CALLBACK]: 'Callback request',
};

/** GA4 event fired on a successful submit, per intent. */
const INTENT_EVENTS = {
  [LEAD_INTENTS.GENERAL]: 'enquiry_submit',
  [LEAD_INTENTS.PRICE]: 'price_request',
  [LEAD_INTENTS.BROCHURE]: 'brochure_request',
  [LEAD_INTENTS.SITE_VISIT]: 'site_visit_submit',
  [LEAD_INTENTS.VIRTUAL_TOUR]: 'virtual_tour_submit',
  [LEAD_INTENTS.INVESTOR]: 'investor_consultation',
  [LEAD_INTENTS.NRI]: 'nri_enquiry',
  [LEAD_INTENTS.CHANNEL_PARTNER]: 'channel_partner_registration',
  [LEAD_INTENTS.CALLBACK]: 'callback_schedule',
};

/** Drop empty values so the CRM stores blanks rather than "" / "undefined". */
function clean(obj) {
  const out = {};
  for (const k in obj) {
    const v = obj[k];
    if (v === undefined || v === null || v === '') continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = Array.isArray(v) ? v.join(', ') : v;
  }
  return out;
}

/**
 * @param {object} lead
 * @param {string} lead.name      required
 * @param {string} lead.phone     required
 * @param {string} [lead.email]   optional — high-intent forms ask for two fields only
 * @param {string} [lead.intent]  one of LEAD_INTENTS; defaults to general-enquiry
 * @param {string} [lead.project] project name, for project-scoped forms
 * @param {string} [lead.source]  where on the site the form lives
 * @param {object} [lead.extra]   intent-specific fields (date, time, mode, budget…)
 * @returns {Promise<{ok: boolean}>} resolves ok:true, or throws on failure
 */
export async function submitLead({
  name,
  phone,
  email,
  message,
  intent = LEAD_INTENTS.GENERAL,
  project,
  source,
  extra = {},
} = {}) {
  const payload = clean({
    name,
    phone,
    email,
    message,
    intent,
    project,
    // The CRM shows sub_source_name in the lead list — make it read as the
    // journey ("Site visit — Oscar Palace"), not a bare form id.
    source: source || INTENT_LABELS[intent] || 'Website',
    ...clean(extra),
  });

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    // Surface the real reason: 404 = serverless function not running,
    // 5xx = mail/CRM credentials missing or the upstream is down.
    const detail = await res.text().catch(() => '');
    throw new Error(`${ENDPOINT} responded ${res.status} ${detail}`);
  }

  // GA4 recommended conversion event, plus the intent-specific one so each
  // journey can be measured on its own.
  trackEvent('generate_lead', { intent, project, source: payload.source });
  const evt = INTENT_EVENTS[intent];
  if (evt) trackEvent(evt, { project, source: payload.source });

  return res.json().catch(() => ({ ok: true }));
}
