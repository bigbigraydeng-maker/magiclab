import Hero from '@/components/Hero';
import Clients from '@/components/Clients';
import Services from '@/components/Services';
import ProductProof from '@/components/ProductProof';
import VisualBand from '@/components/VisualBand';
import CaseStudies from '@/components/CaseStudies';
import Process from '@/components/Process';
import Insights from '@/components/Insights';
import CTASection from '@/components/CTASection';

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
