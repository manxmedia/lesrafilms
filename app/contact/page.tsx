'use client';

import { FormEvent, useState } from 'react';
import { contact } from '@/lib';

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError('');

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Unable to send enquiry.');

      form.reset();
      setStatus('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send enquiry.');
      setStatus('error');
    }
  }

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">Get in touch</div>
          <h1>Let's make your <span className="gold">story</span>.</h1>
          <p>Tell us what you are planning and we will help shape the right photography or videography coverage.</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <div className="card contact-box">
            <div className="eyebrow">Lesra Films</div>
            <h2 style={{ font: '500 2.4rem Georgia,serif', margin: '12px 0 28px' }}>Waterfalls, Harare</h2>

            <div className="contact-row">
              <div>☎</div>
              <div><strong>Phone</strong><span><a href={`tel:${contact.tel}`}>{contact.phone}</a></span></div>
            </div>
            <div className="contact-row">
              <div>✉</div>
              <div><strong>Email</strong><span><a href={`mailto:${contact.email}`}>{contact.email}</a></span></div>
            </div>
            <div className="contact-row">
              <div>💬</div>
              <div><strong>Whatsapp</strong><span><a href={contact.whatsappUrl} target="_blank" rel="noreferrer"> +263 77 340 0195</a></span></div>
            </div>

            <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginTop: 25 }}>
              Available for weddings, corporate work, events, portraits, family sessions, fashion, sports, documentaries and creative productions.
            </p>
          </div>

          <div className="card contact-box">
            <form onSubmit={submit}>
              <div className="field"><label>Your name</label><input name="name" required placeholder="Full name" /></div>
              <div className="field"><label>Your email</label><input type="email" name="email" required placeholder="you@example.com" /></div>
              <div className="field"><label>Phone number</label><input name="phone" required placeholder="+263…" /></div>
              <div className="field">
                <label>Service</label>
                <select name="service" defaultValue="Photography">
                  <option>Photography</option>
                  <option>Videography</option>
                  <option>Photography & Videography</option>
                  <option>Corporate / Brand</option>
                  <option>Wedding / Party</option>
                  <option>Event</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="field"><label>Preferred date / timing</label><input name="date" placeholder="e.g. 12 December 2026" /></div>
              <div className="field"><label>Project details</label><textarea name="message" required placeholder="Tell us about the project, location, number of people and what you need." /></div>
              <button className="btn" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending enquiry…' : 'Send enquiry by email →'}
              </button>
              {status === 'sent' && <div className="success">Thank you. Your enquiry has been sent to Lesra Films and a confirmation has been emailed to you.</div>}
              {status === 'error' && <div className="error">{error}</div>}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
