import ServiceCard from '@/components/ServiceCard';
import { services } from '@/lib';
export default function Services(){return <main><section className="page-hero"><div className="container"><div className="eyebrow">Services</div><h1>Photography & <span className="gold">Videography</span></h1><p>Professional visual storytelling across celebrations, people, brands, events, lifestyle and film.</p></div></section><section className="section"><div className="container"><div className="grid services-grid">{services.map(s=><ServiceCard key={s.title}{...s}/>)}</div></div></section></main>}
