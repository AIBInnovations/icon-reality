import nodemailer from 'nodemailer';

// Vercel serverless function: emails contact-form submissions to Icon Realty.
// Credentials come from env vars (Vercel dashboard → Settings → Environment
// Variables): GMAIL_USER, GMAIL_APP_PASS, and optionally MAIL_TO.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, email, message } = req.body || {};
  if (!name || !phone || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASS;
  if (!user || !pass) {
    return res.status(500).json({ error: 'Mail service not configured' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  const to = process.env.MAIL_TO || 'iconrealty02@gmail.com, iconrealty2@icloud.com';
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  try {
    await transporter.sendMail({
      from: `"Icon Realty Website" <${user}>`,
      to,
      replyTo: email,
      subject: `Site visit request — ${name}`,
      text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\n${message || '(no message)'}`,
      html: `
        <h2 style="margin:0 0 12px">New enquiry from the website</h2>
        <p><b>Name:</b> ${esc(name)}<br/>
        <b>Phone:</b> ${esc(phone)}<br/>
        <b>Email:</b> ${esc(email)}</p>
        <p style="white-space:pre-wrap">${esc(message || '(no message)')}</p>
      `,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('sendMail failed:', err);
    return res.status(502).json({ error: 'Failed to send' });
  }
}
