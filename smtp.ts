import nodemailer from 'nodemailer';

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: SendEmailOptions) {
  const host = process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com';
  const port = Number(process.env.ZOHO_SMTP_PORT || 465);
  const secure =
    String(process.env.ZOHO_SMTP_SECURE || 'true').toLowerCase() === 'true';

  const user = process.env.ZOHO_SMTP_USER;
  const pass = process.env.ZOHO_SMTP_PASS;
  const from = process.env.ZOHO_SMTP_FROM || user;

  if (!user || !pass || !from) {
    throw new Error(
      'Zoho SMTP is not configured. Check ZOHO_SMTP_USER, ZOHO_SMTP_PASS and ZOHO_SMTP_FROM.'
    );
  }

  console.log('Connecting to Zoho SMTP:', {
    host,
    port,
    secure,
    user,
    from,
  });

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  // Verify the SMTP connection before attempting to send.
  await transporter.verify();

  console.log('Zoho SMTP connection verified successfully.');

  const result = await transporter.sendMail({
    from: `Lesra Films <${from}>`,
    to,
    replyTo: replyTo || from,
    subject,
    html,
  });

  console.log('Email sent successfully:', {
    messageId: result.messageId,
    response: result.response,
    to,
  });

  return result;
}