import Link from 'next/link';
import ServiceCard from '@/components/ServiceCard';
import { services, contact } from '@/lib';

export default function Home(){
 const featured=[['/projects/photos/Kids%20Photography/1.png','Kids'],['/projects/photos/Weddings/1.png','Weddings'],['/projects/photos/Birthday%20Photography/1.png','Birthdays'],['/projects/photos/Sports%20Photography/1.png','Sports']];
 return <>
  <main>
   <section className="hero"><div className="container hero-inner">
    <div><div className="eyebrow">Photography · Videography · Storytelling</div><h1>We capture the <span>moments</span> you never want to forget.</h1><p>Lesra Films is a southern African media company creating polished photography and cinematic video for people, brands, celebrations and real-life stories.</p><div className="hero-actions"><a className="btn" href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer">Book a Session</a><Link className="btn ghost" href="/gallery">Explore Our Work</Link></div></div>
    <div className="hero-showcase">{featured.map(([src,label])=><img key={src} src={src} alt={`${label} photography by Lesra Films`}/>)}</div>
   </div></section>
   <section className="section"><div className="container"><div className="section-head"><div><div className="eyebrow">What we do</div><h2>One studio. Every story.</h2></div><p>From a quiet family portrait to a fast-moving sports event, we bring a considered eye, professional direction and a strong finish to every project.</p></div><div className="grid services-grid">{services.slice(0,6).map(s=><ServiceCard key={s.title}{...s}/>)}</div><div style={{marginTop:24}}><Link className="btn ghost" href="/services">View all services →</Link></div></div></section>
   <section className="section" style={{background:'#080808'}}><div className="container split"><div><div className="eyebrow">Our approach</div><div className="story">For the <span>kind of heart</span>, creative of spirit.</div><p className="story-copy">Our aim is to capture the emotions, moments, details and ambience of your day — allowing you to relive it. We work across photography and film with a documentary instinct and a polished editorial finish.</p><Link className="btn" href="/contact">Tell us about your project</Link></div><img className="feature-image" src="/projects/photos/Events/1.png" alt="Lesra Films event photography portfolio"/></div></section>
   <section className="section"><div className="container"><div className="section-head"><div><div className="eyebrow">Selected visual stories</div><h2>Photography, beautifully framed.</h2></div><Link className="btn ghost" href="/gallery">Open Gallery</Link></div><div className="mosaic"><img src="/projects/photos/Weddings/2.png" alt="Wedding photography"/><img src="/projects/photos/Kids%20Photography/2.png" alt="Kids photography"/><img src="/projects/photos/Birthday%20Photography/1.png" alt="Birthday photography"/><img src="/projects/photos/Sports%20Photography/1.png" alt="Sports photography"/></div></div></section>
   <section className="section" style={{paddingTop:20}}><div className="container"><div className="cta"><div><div className="eyebrow">Ready when you are</div><h2>Let's create something worth keeping.</h2><p>Call, email or send a project enquiry. Lesra Films is based in Waterfalls, Harare, Zimbabwe.</p></div><Link className="btn" href="/contact">Contact Lesra Films →</Link></div></div></section>
  </main>
 </>
}
