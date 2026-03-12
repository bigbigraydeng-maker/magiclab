import ServiceCard from './ServiceCard';

const Services = () => {
  const services = [
    {
      title: 'Website Systems',
      description: [
        'Fast websites',
        'SEO-ready architecture',
        'Mobile optimized',
        'High performance'
      ]
    },
    {
      title: 'SEO / GEO Optimization',
      description: [
        'Google search optimization',
        'AI search visibility',
        'Local SEO infrastructure',
        'Content strategy'
      ]
    },
    {
      title: 'AI Marketing Systems',
      description: [
        'Lead capture automation',
        'AI assistants',
        'Marketing workflow automation',
        'Data-driven marketing'
      ]
    }
  ];

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our Services
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We provide comprehensive AI marketing infrastructure to help your business grow online.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;