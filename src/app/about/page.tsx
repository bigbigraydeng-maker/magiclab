import type { Metadata } from 'next';
import { buildSeoMetadata } from '@/lib/seo';

export const metadata: Metadata = buildSeoMetadata({
  title: 'About Magic Lab | AI Automation Infrastructure Studio',
  description:
    'Magic Lab is an AI automation infrastructure studio helping ANZ businesses turn workflows, data, and team knowledge into operating systems.',
  path: '/about',
  keywords: ['Magic Lab', 'AI automation studio', 'AI systems builder', 'ANZ business automation'],
});

export default function AboutPage() {
  return (
    <div className="py-32 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About Magic Lab
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We build AI automation infrastructure for modern businesses across New Zealand and Australia.
          </p>
        </div>

        <div className="bg-gray-800 p-8 rounded-xl mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Our Mission
          </h2>
          <p className="text-gray-300 mb-4">
            Magic Lab is dedicated to helping businesses grow online through cutting-edge AI marketing infrastructure.
            We specialize in workflow automation, data intelligence, SEO/GEO systems, and AI-powered operating tools that drive results.
          </p>
          <p className="text-gray-300">
            Our focus is on creating sustainable growth for our clients through data-driven strategies and modern technology.
          </p>
        </div>

        <div className="bg-gray-800 p-8 rounded-xl">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Founder
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="bg-white w-40 h-40 rounded-full flex items-center justify-center">
              <p className="text-gray-800 font-medium">Ray Deng</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Ray Deng</h3>
              <p className="text-gray-300 mb-4">
                AI systems builder and cross-border business strategist.
              </p>
              <p className="text-gray-300">
                With over 10 years of experience in technology and marketing, Ray has helped numerous businesses
                achieve online growth through innovative AI solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
