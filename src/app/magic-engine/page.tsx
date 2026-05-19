import type { Metadata } from 'next';
import MagicEngineLanding from '@/components/MagicEngineLanding';

export const metadata: Metadata = {
  title: 'Magic Engine | AI Digital Execution Engine',
  description:
    'Magic Engine is Magic Lab’s bilingual AI digital execution engine for SMB SEO, GEO, social media, ads, reputation, and competitor intelligence.',
};

export default function MagicEnginePage() {
  return <MagicEngineLanding />;
}
