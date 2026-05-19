import type { Metadata } from 'next';
import { Cinzel, Montserrat } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '500', '600', '700'],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://magiclab.nz'),
  title: 'Magic Lab | AI Automation Infrastructure',
  description:
    'Magic Lab builds AI automation infrastructure, data intelligence systems, and team training for businesses across New Zealand and Australia.',
  keywords: ['AI automation', 'AI infrastructure', 'Magic Engine', 'data intelligence', 'AI training', 'New Zealand', 'Australia'],
  authors: [{ name: 'Magic Lab' }],
  openGraph: {
    title: 'Magic Lab | AI Automation Infrastructure',
    description:
      'AI automation infrastructure, data intelligence systems, and team training for ANZ businesses.',
    url: 'https://magiclab.nz',
    siteName: 'Magic Lab',
    images: [
      {
        url: 'https://magiclab.nz/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Magic Lab',
      },
    ],
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${cinzel.variable} ${montserrat.variable}`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
