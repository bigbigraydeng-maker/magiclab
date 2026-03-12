const Process = () => {
  const steps = [
    {
      title: 'Strategy',
      description: 'Understand business goals'
    },
    {
      title: 'System Design',
      description: 'Website and SEO architecture'
    },
    {
      title: 'Build',
      description: 'Launch fast website'
    },
    {
      title: 'Growth',
      description: 'SEO and AI marketing'
    }
  ];

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our Process
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We follow a systematic approach to deliver results for your business.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;