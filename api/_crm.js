// Sell Xpert CRM lead push.
//
// Filename is underscore-prefixed so Vercel treats it as a helper module and
// not as its own serverless endpoint.
//
// The four account identifiers below are constant for Icon Realty. They are
// sent twice, exactly as the CRM expects: base64-encoded in the `?p=` query
// string AND repeated in the JSON body. Both are derived from this one object
// so they can never drift apart. Each can be overridden with an env var if the
// account ever changes, without touching code.

// Read env per call rather than at module load: the module is cached by the
// runtime, so capturing env at import time would freeze whatever was set on the
// very first cold start and ignore later changes.
const config = () => ({
  account: {
    user_id: Number(process.env.CRM_USER_ID ?? 1),
    company_id: Number(process.env.CRM_COMPANY_ID ?? 1),
    client_key: process.env.CRM_CLIENT_KEY ?? '010C34B1-C824-4BFC-A142-4C1400CECCA9',
    client_id: Number(process.env.CRM_CLIENT_ID ?? 2098),
  },
  endpoint: process.env.CRM_WEBHOOK_URL ?? 'https://webhook.surya11.com/api/Website',
  // don't let a slow/hanging CRM hold the serverless function open
  timeoutMs: Number(process.env.CRM_TIMEOUT_MS ?? 10000),
});

/** "+91 94259 42510" → "9425942510" — the CRM wants a bare 10-digit number. */
function normalisePhone(value) {
  const digits = String(value ?? '').replace(/\D/g, '');
  if (digits.length > 10 && digits.startsWith('91')) return digits.slice(-10);
  return digits.slice(-10) || digits;
}

/** Empty strings become null so the CRM stores a blank, not "". */
const orNull = (v) => {
  const s = typeof v === 'string' ? v.trim() : v;
  return s === '' || s === undefined ? null : s;
};

/**
 * Push one website enquiry into the CRM as a lead.
 * Never throws — returns a result object so the caller can log it and carry on.
 */
export async function pushLead({
  name,
  phone,
  whatsapp,
  email,
  message,
  source = 'Website',
  project,
  city = 'Indore',
  // Optional fields the CRM already has columns for. The website only started
  // collecting these with the investor / NRI / channel-partner journeys, so
  // every one is optional and normalises to null when absent.
  budget,
  interestedIn,
  companyName,
  nextFollowupDate,
} = {}) {
  const { account, endpoint, timeoutMs } = config();

  const url = `${endpoint}?p=${encodeURIComponent(
    Buffer.from(JSON.stringify(account)).toString('base64')
  )}`;

  const payload = {
    CustomerName: orNull(name),
    MobileNo: normalisePhone(phone),
    WhatsappNo: normalisePhone(whatsapp || phone),
    EmailId: orNull(email),
    Remarks: orNull(message),
    receiver_email: null,
    source_name: 'Website',
    sub_source_name: orNull(source),
    project_name: orNull(project),
    AssignToId: 1,
    lead_description: orNull(message),
    broker: null,
    broker_phone: null,
    budget_upto: orNull(budget),
    interested_in: orNull(interestedIn),
    remark_1: null,
    remark_2: null,
    inquiry_status: 'New',
    followup_remark: null,
    next_followup_date: orNull(nextFollowupDate),
    city_name: orNull(city),
    company_name: orNull(companyName),
    size_info: null,
    resident_category_text: null,
    ref1_name: null,
    ref1_phone: null,
    ref2_name: null,
    ref2_phone: null,
    ...account,
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(timeoutMs),
    });

    const text = await res.text();
    let body;
    try { body = JSON.parse(text); } catch { body = text; }

    // The CRM answers 200 with {"StatusCode":200,"Message":"Success"} — a
    // transport-level 200 alone isn't proof the lead was stored.
    const ok = res.ok && (body?.StatusCode === undefined || body.StatusCode === 200);
    return { ok, status: res.status, body };
  } catch (err) {
    return { ok: false, status: 0, error: err?.name === 'TimeoutError' ? 'timeout' : String(err) };
  }
}
