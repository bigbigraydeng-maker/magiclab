import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CaseStudyDetail from '@/components/CaseStudyDetail';
import JsonLd from '@/components/JsonLd';
import { caseStudies, caseStudiesBySlug } from '@/data/caseStudies';
import { absoluteUrl, buildSeoMetadata } from '@/lib/seo';

type CaseStudyPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return caseStudies.map((caseStudy) => ({
    slug: caseStudy.slug,
  }));
}

export function generateMetadata({ params }: CaseStudyPageProps): Metadata {
  const caseStudy = caseStudiesBySlug[params.slug];

  if (!caseStudy) {
    return {};
  }

  return buildSeoMetadata({
    title: `${caseStudy.client} Case Study | Magic Lab`,
    description: caseStudy.description,
    path: `/work/${caseStudy.slug}`,
    keywords: caseStudy.keywords,
  });
}

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  const caseStudy = caseStudiesBySlug[params.slug];

  if (!caseStudy) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: caseStudy.title,
    description: caseStudy.description,
    image: absoluteUrl(caseStudy.image),
    mainEntityOfPage: absoluteUrl(`/work/${caseStudy.slug}`),
    publisher: {
      '@type': 'Organization',
      name: 'Magic Lab',
      url: absoluteUrl('/'),
    },
    about: caseStudy.keywords,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <CaseStudyDetail caseStudy={caseStudy} />
    </>
  );
}
