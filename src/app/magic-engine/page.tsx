import type { Metadata } from 'next';
import MagicEngineLanding from '@/components/MagicEngineLanding';
import { buildSeoMetadata } from '@/lib/seo';

export const metadata: Metadata = buildSeoMetadata({
  title: 'Magic Engine | AI Digital Execution Engine',
  description:
    "Magic Engine is Magic Lab's AI digital execution engine for SEO, GEO, social media, ads, reputation, and competitor intelligence.",
  path: '/magic-engine',
  keywords: [
    'AI digital execution engine',
    'AI SEO engine',
    'AI GEO engine',
    'AI content automation',
    'Magic Engine',
  ],
});

export default function MagicEnginePage() {
  return <MagicEngineLanding />;
}
