import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap { const base='https://lesrafilms.com'; return ['','services','gallery','reels','contact'].map(p=>({url:`${base}/${p}`,lastModified:new Date()})); }
