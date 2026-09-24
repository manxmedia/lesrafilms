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
         <p><a href={`tel:${contact.tel}`}>{contact.phone}</a><br/><a href={`mailto:${contact.email}`}>{contact.email}</a><br/><a href={contact.youtube} target="_blank" rel="noreferrer">YouTube Channel</a></p>
         <div className="socials"><a className="social" href={contact.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">▶</a><a className="social" href={`mailto:${contact.email}`} aria-label="Email">✉</a><a className="social" href={`tel:${contact.tel}`} aria-label="Call Lesra Films">☎</a></div>
       </div>
     </div>
     <div className="copyright">© 2026 <a href="https://www.manxmedia.co.za" target="_blank" rel="noopener noreferrer">Manx Host</a></div>
   </div>
 </footer>
}
