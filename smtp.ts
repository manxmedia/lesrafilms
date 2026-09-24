import * as net from 'node:net';
import * as tls from 'node:tls';

type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  secure: boolean;
};

type SmtpSocket = net.Socket | tls.TLSSocket;

function readResponse(socket: SmtpSocket): Promise<string> {
  return new Promise((resolve, reject) => {
    let buffer = '';
    const onData = (chunk: Buffer | string) => {
      buffer += chunk.toString();
      const lines = buffer.split(/\r?\n/).filter(Boolean);
      if (!lines.length) return;
      const last = lines[lines.length - 1];
      if (/^\d{3} /.test(last)) {
        socket.off('data', onData);
        resolve(buffer);
      }
    };
    socket.on('data', onData);
    socket.once('error', reject);
  });
}

async function command(socket: SmtpSocket, value: string, expected: RegExp) {
  socket.write(value + '\r\n');
  const response = await readResponse(socket);
  if (!expected.test(response)) {
    throw new Error(`SMTP error after ${value.split(' ')[0]}: ${response.trim()}`);
  }
}

function dotStuff(value: string) {
  return value.replace(/\r?\n/g, '\r\n').replace(/^\./gm, '..');
}

function connect(config: SmtpConfig): Promise<SmtpSocket> {
  if (config.secure || config.port === 465) {
    return new Promise((resolve, reject) => {
      const socket = tls.connect({
        host: config.host,
        port: config.port,
        servername: config.host,
      });
      socket.once('secureConnect', () => resolve(socket));
      socket.once('error', reject);
    });
  }

  return new Promise((resolve, reject) => {
    const socket = net.connect({ host: config.host, port: config.port });
    socket.once('connect', () => resolve(socket));
    socket.once('error', reject);
  });
}

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const config: SmtpConfig = {
    host: process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com',
    port: Number(process.env.ZOHO_SMTP_PORT || 465),
    user: process.env.ZOHO_SMTP_USER || '',
    pass: process.env.ZOHO_SMTP_PASS || '',
    from: process.env.ZOHO_SMTP_FROM || process.env.ZOHO_SMTP_USER || '',
    secure: String(process.env.ZOHO_SMTP_SECURE || (Number(process.env.ZOHO_SMTP_PORT || 465) === 465)).toLowerCase() === 'true',
  };

  if (!config.user || !config.pass || !config.from) {
    throw new Error('Zoho SMTP is not configured. Set ZOHO_SMTP_USER, ZOHO_SMTP_PASS and ZOHO_SMTP_FROM.');
  }

  let socket = await connect(config);

  try {
    await readResponse(socket);
    await command(socket, `EHLO ${process.env.ZOHO_SMTP_EHLO || 'lesrafilms.co.zw'}`, /^250[ -]/);

    // Zoho port 587 starts as plain SMTP and is upgraded to TLS with STARTTLS.
    if (!config.secure && config.port !== 465) {
      await command(socket, 'STARTTLS', /^220/);

      const upgraded = tls.connect({
        socket: socket as net.Socket,
        servername: config.host,
      });
      await new Promise<void>((resolve, reject) => {
        upgraded.once('secureConnect', resolve);
        upgraded.once('error', reject);
      });
      socket = upgraded;

      await command(socket, `EHLO ${process.env.ZOHO_SMTP_EHLO || 'lesrafilms.co.zw'}`, /^250[ -]/);
    }

    await command(socket, 'AUTH LOGIN', /^334/);
    await command(socket, Buffer.from(config.user).toString('base64'), /^334/);
    await command(socket, Buffer.from(config.pass).toString('base64'), /^235/);
    await command(socket, `MAIL FROM:<${config.from}>`, /^250/);
    await command(socket, `RCPT TO:<${to}>`, /^(250|251)/);
    await command(socket, 'DATA', /^354/);

    const headers = [
      `From: Lesra Films <${config.from}>`,
      `To: ${to}`,
      `Reply-To: ${replyTo || config.from}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=UTF-8',
      'Content-Transfer-Encoding: 8bit',
      '',
      html,
      '.',
    ].join('\r\n');

    socket.write(dotStuff(headers) + '\r\n');
    await readResponse(socket);
    await command(socket, 'QUIT', /^221/);
  } finally {
    socket.end();
  }
}
