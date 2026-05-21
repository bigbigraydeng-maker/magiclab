import type { Metadata } from 'next';

const siteUrl = 'https://magiclab.nz';

export const siteConfig = {
  name: 'Magic Lab',
  url: siteUrl,
  description:
    'Magic Lab builds AI automation infrastructure, data intelligence systems, and team training for businesses across New Zealand and Australia.',
  ogImage: '/images/brand/magic-lab-logo-underwater-wide.jpg',
  email: 'grace.gu@magiclab.nz',
  phone: '+61499451794',
};

export const publicRoutes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/ai-workflow-automation', priority: '0.9', changefreq: 'monthly' },
  { path: '/nz/ai-workflow-automation', priority: '0.9', changefreq: 'monthly' },
  { path: '/au/ai-workflow-automation', priority: '0.9', changefreq: 'monthly' },
  { path: '/ai-seo-geo-growth-systems', priority: '0.9', changefreq: 'monthly' },
  { path: '/services', priority: '0.9', changefreq: 'monthly' },
  { path: '/magic-engine', priority: '0.9', changefreq: 'monthly' },
  { path: '/magic-engine/build-mine', priority: '0.8', changefreq: 'weekly' },
  { path: '/work', priority: '0.8', changefreq: 'monthly' },
  { path: '/work/aucompass', priority: '0.75', changefreq: 'monthly' },
  { path: '/work/stockqueen', priority: '0.75', changefreq: 'monthly' },
  { path: '/work/yellow-book', priority: '0.75', changefreq: 'monthly' },
  { path: '/work/car-scout', priority: '0.75', changefreq: 'monthly' },
  { path: '/work/warm-voyage', priority: '0.75', changefreq: 'monthly' },
  { path: '/insights', priority: '0.7', changefreq: 'weekly' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
];

export const hiddenRoutes = ['/magic-content-engine', '/agency-dashboard', '/proposals/'];

export function absoluteUrl(path = '/') {
  return `${siteUrl}${path === '/' ? '' : path}`;
}

type SeoMetadataInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  languages?: Record<string, string>;
};

export function buildSeoMetadata({
  title,
  description,
  path = '/',
  keywords = [],
  languages,
}: SeoMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(siteConfig.ogImage);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
      ...(languages ? { languages } : {}),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: 'Magic Lab AI automation infrastructure',
        },
      ],
      locale: 'en_NZ',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url,
  logo: absoluteUrl('/images/brand/magic-lab-logo.jpg'),
  email: siteConfig.email,
  telephone: siteConfig.phone,
  areaServed: ['New Zealand', 'Australia'],
  knowsAbout: [
    'AI automation',
    'workflow automation',
    'data intelligence',
    'AI SEO',
    'AI training',
  ],
};

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  url: siteConfig.url,
  inLanguage: 'en-NZ',
};
