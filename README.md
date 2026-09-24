# Lesra Films website — updated

## Changes included
- Removed the duplicate Lesra Films logo from the home-page hero. Logo remains in the header and footer.
- Footer now shows `© 2026 Manx Host` linked to `https://www.manxmedia.co.za`.
- All Book Now / Book a Session buttons use WhatsApp click-to-chat with:
  `Hi! Lesra Films, I have an inquiry`
- Rebuilt the contact form to send server-side email instead of opening the visitor's mail app.
- Contact submissions are sent to `info@lesrafilms.com`.
- A confirmation email is also sent to the client's submitted email address.
- Email template uses Lesra Films black, white and gold styling and places the Lesra Films logo at the top.
- Fixed the `node:fs/promises` client-bundle error by moving filesystem album logic into the server-only `app/albums.ts` module.
- Fixed the Autoprefixer warning by changing `align-items:end` to `align-items:flex-end`.
- Added development Watchpack ignores for Windows protected system files that were producing `EINVAL` scan warnings.
- Added Zoho SMTP configuration placeholders.

## Zoho Mail / production environment variables

Set these in `.env.local` for local development and in Vercel Project Settings > Environment Variables for production:

```env
ZOHO_SMTP_HOST=smtp.zoho.com
ZOHO_SMTP_PORT=465
ZOHO_SMTP_USER=info@lesrafilms.com
ZOHO_SMTP_PASS=YOUR_ZOHO_APP_PASSWORD
ZOHO_SMTP_FROM=info@lesrafilms.com
ZOHO_SMTP_EHLO=lesrafilms.com
```

Use the Zoho app-specific password if Zoho requires one for SMTP authentication. Never commit the real password to Git.

## Local run

```bash
npm install
npm run dev
```

Then test:
- `/`
- `/contact`
- Submit the contact form and verify both the business inbox and client confirmation.
- Test the Book Now button on desktop and mobile.

## Production

After adding the SMTP environment variables to Vercel, redeploy the project. The contact form uses `/api/contact`, so it requires the deployed Next.js server/API runtime; it cannot be a purely static export.
