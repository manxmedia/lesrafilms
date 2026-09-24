import Link from 'next/link';
import { contact } from '@/lib';


export default function Footer(){
 return <footer className="footer">
   <div className="container">
     <div className="footer-brand-row">
       <Link href="/" aria-label="Lesra Films home" className="footer-logo-link">
         <img className="footer-logo" src="/brand/lesra-films-logo.png" alt="Lesra Films" />
       </Link>
       <div className="footer-tagline">Photography · Videography · Storytelling</div>
     </div>
     <div className="gold-line" />
     <div className="footer-grid">
       <div>
         <div className="eyebrow">Lesra Films</div>
         <h3 style={{fontFamily:'Georgia,serif',fontWeight:500,fontSize:'2rem',margin:'10px 0'}}>Stories worth remembering.</h3>
         <p>Photography and videography crafted with emotion, detail and a timeless visual language.</p>
       </div>
       <div>
         <h4>Explore</h4>
         <p><Link href="/services">Services</Link><br/><Link href="/gallery">Photo Projects</Link><br/><Link href="/reels">Video Reels</Link><br/><Link href="/contact">Contact</Link></p>
       </div>
       <div>
         <h4>Contact</h4>
         <p><a href={`tel:${contact.tel}`}> ☎ {contact.phone}</a><br/><a href={`mailto:${contact.email}`}> ✉ {contact.email}</a></p>
         <div className="socials">

{/* YouTube */}
<a
  className="social"
  href={contact.youtube}
  target="_blank"
  rel="noopener noreferrer"
  aria-label="YouTube"
>
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z"
    />
  </svg>
</a>

{/* Facebook */}
<a
  className="social"
  href={contact.facebook}
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Facebook"
>
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1C0 18.1 4.4 23 10.1 24v-8.4H7.1v-3.5h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.3h3.4l-.5 3.5h-2.9V24C19.6 23 24 18.1 24 12.1Z"
    />
  </svg>
</a>

{/* Instagram */}
<a
  className="social"
  href={contact.instagram}
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Instagram"
>
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M7.1 0h9.8A7.1 7.1 0 0 1 24 7.1v9.8a7.1 7.1 0 0 1-7.1 7.1H7.1A7.1 7.1 0 0 1 0 16.9V7.1A7.1 7.1 0 0 1 7.1 0Zm-.2 2.4A4.5 4.5 0 0 0 2.4 7v10A4.5 4.5 0 0 0 7 21.6h10a4.5 4.5 0 0 0 4.6-4.6V7A4.5 4.5 0 0 0 17 2.4H6.9ZM18.3 4.2a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8ZM12 6a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0 2.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Z"
    />
  </svg>
</a>

{/* TikTok */}
<a
  className="social"
  href={contact.tiktok}
  target="_blank"
  rel="noopener noreferrer"
  aria-label="TikTok"
>
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M19.59 6.69a4.83 4.83 0 0 1-3.77-3.77A4.83 4.83 0 0 1 15.67 0H12v14.33a2.89 2.89 0 1 1-2-2.74V8a6.5 6.5 0 1 0 6.5 6.5V8.74a8.5 8.5 0 0 0 5 1.63V6.72a4.84 4.84 0 0 1-1.91-.03Z"
    />
  </svg>
</a>

</div>
         </div>
     </div>
     <div className="copyright">© 2026 All Rights Reserved. <a href="https://www.manxmedia.co.za" target="_blank" rel="noopener noreferrer">Manx Media (Pty) Ltd</a></div>
   </div>
 </footer>
}
