import type { Metadata } from 'next';
import { Cinzel, Montserrat } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { buildSeoMetadata, organizationJsonLd, siteConfig, websiteJsonLd } from '@/lib/seo';

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
  metadataBase: new URL(siteConfig.url),
  ...buildSeoMetadata({
    title: 'Magic Lab | AI Automation Infrastructure for ANZ Business',
    description: siteConfig.description,
    keywords: [
      'AI automation agency',
      'AI workflow automation',
      'AI infrastructure',
      'Magic Engine',
      'data intelligence',
      'AI training',
      'New Zealand',
      'Australia',
    ],
  }),
  authors: [{ name: 'Magic Lab' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${cinzel.variable} ${montserrat.variable}`}>
        <JsonLd data={[organizationJsonLd, websiteJsonLd]} />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
