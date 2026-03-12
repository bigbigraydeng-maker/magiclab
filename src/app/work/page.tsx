import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work | Magic Lab',
  description: 'Our case studies show how weve helped businesses grow with AI marketing infrastructure.',
};

export default function WorkPage() {
  const cases = [
    {
      client: 'China Travel Service NZ',
      description: 'Tour company website with SEO infrastructure and lead capture system.',
      services: ['Website Development', 'SEO Optimization', 'Lead Capture'],
      results: 'Increased organic traffic by 40% and lead conversion by 25%.'
    },
    {
      client: 'Compass Property',
      description: 'AI property analysis platform with data infrastructure and AI insights.',
      services: ['AI Development', 'Data Infrastructure', 'Analytics'],
      results: 'Improved property analysis accuracy by 35% and client satisfaction by 40%.'
    },
    {
      client: 'Warm Voyage',
      description: 'Luxury travel website with SEO architecture and conversion optimization.',
      services: ['Website Development', 'SEO Optimization', 'Conversion Optimization'],
      results: 'Increased booking conversions by 30% and organic traffic by 50%.'
    }
  ];

  return (
    <div className="py-32 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Work
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            See how we've helped businesses grow with our AI marketing infrastructure.
          </p>
        </div>

        <div className="space-y-12">
          {cases.map((caseStudy, index) => (
            <div key={index} className="bg-gray-800 p-8 rounded-xl">
              <h2 className="text-2xl font-semibold text-white mb-4">
                {caseStudy.client}
              </h2>
              <p className="text-gray-300 mb-4">
                {caseStudy.description}
              </p>
              <div className="mb-4">
                <h3 className="text-white font-medium mb-2">Services Provided:</h3>
                <ul className="flex flex-wrap gap-2">
                  {caseStudy.services.map((service, i) => (
                    <li key={i} className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Results:</h3>
                <p className="text-gray-300">
                  {caseStudy.results}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}