import { NextResponse } from 'next/server';
import { sendEmail } from '@/smtp';

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' })[char] || char);

const logoUrl = 'https://lesrafilms.co.zw/brand/lesra-films-logo.png';
const gold = '#D8B56A';

function emailTemplate({
  title,
  intro,
  rows,
  message,
}: {
  title: string;
  intro: string;
  rows?: Array<[string, string]>;
  message?: string;
}) {
  const rowHtml = rows?.map(([label, value]) => `
    <tr>
      <td style="padding:10px 0;color:#b9b5aa;font-size:13px;width:145px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:10px 0;color:#ffffff;font-size:14px;vertical-align:top;">${escapeHtml(value).replace(/\n/g, '<br>')}</td>
    </tr>`).join('') || '';

  return `<!doctype html><html><body style="margin:0;background:#050505;color:#fff;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:680px;margin:0 auto;padding:32px 18px;">
    <div style="background:#050505;border:1px solid #3a301f;border-radius:18px;overflow:hidden;">
      <div style="padding:28px 30px;border-bottom:2px solid ${gold};text-align:center;background:#000;">
        <img src="${logoUrl}" alt="Lesra Films" style="display:block;max-width:250px;width:80%;height:auto;margin:0 auto;">
      </div>
      <div style="padding:32px 30px;">
        <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${gold};font-weight:bold;">Lesra Films</div>
        <h1 style="font-family:Georgia,serif;font-size:30px;line-height:1.2;font-weight:500;margin:10px 0 12px;color:#fff;">${escapeHtml(title)}</h1>
        <p style="color:#c9c5bb;line-height:1.7;margin:0 0 22px;">${escapeHtml(intro)}</p>
        ${rows ? `<table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">${rowHtml}</table>` : ''}
        ${message ? `<div style="margin-top:22px;padding:18px;border-left:3px solid ${gold};background:#0d0d0d;color:#fff;line-height:1.7;white-space:normal;">${escapeHtml(message).replace(/\n/g,'<br>')}</div>` : ''}
      </div>
      <div style="padding:18px 30px;background:#000;border-top:1px solid #292929;color:#8e8a82;font-size:12px;text-align:center;">
        Lesra Films · Waterfalls, Harare, Zimbabwe · info@lesrafilms.co.zw
      </div>
    </div>
  </div>
  </body></html>`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const phone = String(body.phone || '').trim();
    const service = String(body.service || '').trim();
    const date = String(body.date || '').trim();
    const message = String(body.message || '').trim();

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: 'Please complete all required fields.' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const subject = `Lesra Films enquiry — ${service || 'General enquiry'}`;

    await sendEmail({
      to: 'info@lesrafilms.co.zw',
      replyTo: email,
      subject,
      html: emailTemplate({
        title: 'New enquiry received',
        intro: `A new website enquiry has been submitted by ${name}.`,
        rows: [
          ['Name', name],
          ['Client email', email],
          ['Phone', phone],
          ['Service', service || 'Not specified'],
          ['Preferred date', date || 'Not specified'],
        ],
        message,
      }),
    });

    await sendEmail({
      to: email,
      subject: 'We received your enquiry — Lesra Films',
      html: emailTemplate({
        title: 'Thank you for contacting Lesra Films',
        intro: `Hi ${name}, we have received your enquiry and will get back to you as soon as possible.`,
        rows: [
          ['Service', service || 'Not specified'],
          ['Preferred date', date || 'Not specified'],
          ['Phone', phone],
        ],
        message: 'Your enquiry has been successfully received. Thank you for choosing Lesra Films.',
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Contact email error:', error);
    return NextResponse.json(
      { error: 'We could not send your enquiry right now. Please try again or contact info@lesrafilms.co.zw directly.' },
      { status: 500 }
    );
  }
}
