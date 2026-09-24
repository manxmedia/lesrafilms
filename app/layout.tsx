import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Lesra Films | Photography & Videography',
  description:
    'Lesra Films is a Zimbabwe-based photography and videography studio creating timeless visual stories for weddings, events, brands, families and more.',
  metadataBase: new URL('https://lesrafilms.com'),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}