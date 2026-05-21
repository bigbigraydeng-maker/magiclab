import type { Metadata } from 'next';
import SeoPillarPage from '@/components/SeoPillarPage';
import { seoPillarPages } from '@/data/seoPillarPages';
import { buildSeoMetadata } from '@/lib/seo';

const page = seoPillarPages.seoGeo;

export const metadata: Metadata = buildSeoMetadata({
  title: page.metadata.title,
  description: page.metadata.description,
  path: page.metadata.path,
  keywords: page.keywords,
});

export default function AiSeoGeoGrowthSystemsPage() {
  return <SeoPillarPage page={page} />;
}
