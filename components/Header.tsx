'use client';
import { useState } from 'react';
import Link from 'next/link';
import { contact } from '@/lib';

export default function Header(){
 const [open,setOpen]=useState(false);
 const links=[['Home','/'],['Services','/services'],['Gallery','/gallery'],['Video Reels','/reels'],['Contact','/contact']];
 return <header className="header">
   <div className="container nav">
     <Link className="brand" href="/" onClick={()=>setOpen(false)} aria-label="Lesra Films home">
       <img className="brand-logo" src="/brand/lesra-films-logo.png" alt="Lesra Films" />
     </Link>
     <nav className="navlinks" aria-label="Main navigation">
       {links.map(([label,href])=><Link key={href} href={href}>{label}</Link>)}
       <a className="btn nav-book" href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer">Book Now</a>
     </nav>
     <button className="menu" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?'×':'☰'}</button>
     <nav className={`mobile ${open?'open':''}`} aria-label="Mobile navigation">
       {links.map(([label,href])=><Link key={href} href={href} onClick={()=>setOpen(false)}>{label}</Link>)}
       <a className="btn" href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={()=>setOpen(false)}>Book via WhatsApp</a>
     </nav>
   </div>
 </header>
}
