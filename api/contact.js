import nodemailer from 'nodemailer';
import { pushLead } from './_crm.js';

// Vercel serverless function: every website enquiry goes to two places —
//   1. the Sell Xpert CRM as a lead
//   2. Icon Realty's inbox as an email
// Both are attempted; one failing never blocks the other, and the visitor only
// sees an error if BOTH fail (otherwise the lead is safely captured somewhere).
//
// Mail credentials come from env vars (Vercel dashboard → Settings →
// Environment Variables): GMAIL_USER, GMAIL_APP_PASS, and optionally MAIL_TO.
// CRM identifiers live in ./_crm.js.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    name, phone, email, message, source, project,
    // intent-specific fields — every lead form on the site funnels through
    // src/services/leads.js, which sends whichever of these its journey asked
    // for. All optional; anything absent is simply omitted downstream.
    intent, city, country, budget, preferredDate, preferredTime, preferredMode,
    company, reraNumber, experience, businessType, preferredProjects, preferredAreas,
  } = req.body || {};

  // Email is deliberately NOT required: high-intent forms (site visit, price
  // request, brochure gate) ask for name + phone only, because every extra
  // field costs conversions. The CRM stores a null email fine.
  if (!name || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Fields the CRM has no column for still have to reach a human, so they are
  // appended to the remarks/notes rather than dropped.
  const details = [
    intent && `Intent: ${intent}`,
    preferredDate && `Preferred date: ${preferredDate}`,
    preferredTime && `Preferred time: ${preferredTime}`,
    preferredMode && `Preferred mode: ${preferredMode}`,
    country && `Country: ${country}`,
    company && `Company: ${company}`,
    reraNumber && `RERA number: ${reraNumber}`,
    experience && `Experience: ${experience}`,
    businessType && `Business type: ${businessType}`,
    preferredProjects && `Preferred projects: ${preferredProjects}`,
    preferredAreas && `Preferred areas: ${preferredAreas}`,
  ].filter(Boolean);

  const notes = [message, details.join('\n')].filter(Boolean).join('\n\n');

  // ---------- 1. CRM ----------
  const crm = pushLead({
    name, phone, email, message: notes, source, project,
    ...(city ? { city } : {}),
    budget,
    interestedIn: preferredProjects || project,
    companyName: company,
    nextFollowupDate: preferredDate,
  });

  // ---------- 2. email ----------
  const mail = (async () => {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASS;
    if (!user || !pass) throw new Error('Mail service not configured');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });

    const to = process.env.MAIL_TO || 'iconrealty02@gmail.com, iconrealty2@icloud.com';
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));

    const context = [
      source && `Form: ${source}`,
      project && `Project: ${project}`,
      ...details,
    ].filter(Boolean).join('\n');

    return transporter.sendMail({
      from: `"Icon Realty Website" <${user}>`,
      to,
      ...(email ? { replyTo: email } : {}),
      subject: `${source || 'Website enquiry'} — ${name}`,
      text:
        `Name: ${name}\nPhone: ${phone}\n` +
        (email ? `Email: ${email}\n` : '') +
        (context ? `${context}\n` : '') +
        `\n${message || '(no message)'}`,
      html: `
        <h2 style="margin:0 0 12px">New enquiry from the website</h2>
        <p><b>Name:</b> ${esc(name)}<br/>
        <b>Phone:</b> ${esc(phone)}${email ? `<br/><b>Email:</b> ${esc(email)}` : ''}</p>
        ${context ? `<p style="color:#666;font-size:13px;white-space:pre-wrap">${esc(context)}</p>` : ''}
        <p style="white-space:pre-wrap">${esc(message || '(no message)')}</p>
      `,
    });
  })();

  const [crmResult, mailResult] = await Promise.allSettled([crm, mail]);

  const crmOk = crmResult.status === 'fulfilled' && crmResult.value.ok;
  const mailOk = mailResult.status === 'fulfilled';

  if (!crmOk) {
    console.error('CRM lead push failed:',
      crmResult.status === 'rejected' ? crmResult.reason : crmResult.value);
  }
  if (!mailOk) {
    console.error('sendMail failed:', mailResult.reason);
  }

  // As long as one channel captured the lead, the visitor gets a success state.
  if (crmOk || mailOk) {
    return res.status(200).json({ ok: true, crm: crmOk, mail: mailOk });
  }

  return res.status(502).json({ error: 'Failed to send', crm: false, mail: false });
}
