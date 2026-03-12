import Link from 'next/link';
import CaseCard from './CaseCard';

const CaseStudies = () => {
  const cases = [
    {
      client: 'China Travel Service NZ',
      description: [
        'Tour company website',
        'SEO infrastructure',
        'Lead capture system'
      ]
    },
    {
      client: 'Compass Property',
      description: [
        'AI property analysis platform',
        'Data infrastructure',
        'AI insights'
      ]
    },
    {
      client: 'Warm Voyage',
      description: [
        'Luxury travel website',
        'SEO architecture',
        'Conversion optimization'
      ]
    }
  ];

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Case Studies
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            See how we've helped businesses grow with our AI marketing infrastructure.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cases.map((caseStudy, index) => (
            <CaseCard
              key={index}
              client={caseStudy.client}
              description={caseStudy.description}
            />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/work"
            className="btn-secondary px-8 py-3 rounded-lg font-semibold text-white inline-block"
          >
            View All Work
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;