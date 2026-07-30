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

  const { name, phone, email, message, source, project } = req.body || {};
  if (!name || !phone || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // ---------- 1. CRM ----------
  const crm = pushLead({ name, phone, email, message, source, project });

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

    const context = [source && `Form: ${source}`, project && `Project: ${project}`]
      .filter(Boolean)
      .join('\n');

    return transporter.sendMail({
      from: `"Icon Realty Website" <${user}>`,
      to,
      replyTo: email,
      subject: `Site visit request — ${name}`,
      text:
        `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n` +
        (context ? `${context}\n` : '') +
        `\n${message || '(no message)'}`,
      html: `
        <h2 style="margin:0 0 12px">New enquiry from the website</h2>
        <p><b>Name:</b> ${esc(name)}<br/>
        <b>Phone:</b> ${esc(phone)}<br/>
        <b>Email:</b> ${esc(email)}</p>
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
