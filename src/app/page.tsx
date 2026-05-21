import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import Clients from '@/components/Clients';
import Services from '@/components/Services';
import ProductProof from '@/components/ProductProof';
import VisualBand from '@/components/VisualBand';
import CaseStudies from '@/components/CaseStudies';
import Process from '@/components/Process';
import Insights from '@/components/Insights';
import CTASection from '@/components/CTASection';
import { buildSeoMetadata } from '@/lib/seo';

export const metadata: Metadata = buildSeoMetadata({
  title: 'Magic Lab | AI Automation Agency for New Zealand and Australia',
  description:
    'Magic Lab builds AI workflow automation, data intelligence systems, and practical AI training for businesses across New Zealand and Australia.',
  keywords: [
    'AI automation agency New Zealand',
    'AI automation agency Australia',
    'AI workflow automation',
    'AI systems for business',
    'AI automation consultant',
  ],
});

export default function Home() {
  return (
    <>
      <Hero />
      <Clients />
      <Services />
      <ProductProof />
      <VisualBand />
      <CaseStudies />
      <Process />
      <Insights />
      <CTASection />
    </>
  );
}
