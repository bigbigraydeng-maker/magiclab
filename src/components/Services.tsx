import ServiceCard from './ServiceCard';

const capabilities = [
  'Private workflow automation',
  'Agentic task orchestration',
  'Human-in-the-loop review',
  'Operational reporting layers',
];

const services = [
  {
    icon: '01',
    title: 'Enterprise Automation',
    href: '/ai-workflow-automation',
    description: [
      'Replace repeated admin work with governed AI workflows',
      'Connect CRM, spreadsheets, websites, documents, and inboxes',
      'Design reliable handoff points between AI and human teams',
    ],
  },
  {
    icon: '02',
    title: 'Data Intelligence',
    href: '/services',
    description: [
      'Collect and structure business, market, and public data',
      'Build dashboards, scoring engines, and decision systems',
      'Turn scattered signals into searchable operating knowledge',
    ],
  },
  {
    icon: '03',
    title: 'AI Training',
    href: '/services',
    description: [
      'Train teams to use AI safely in real business workflows',
      'Create custom playbooks for managers, operators, and founders',
      'Move adoption from experimentation into daily execution',
    ],
  },
];

const Services = () => {
  return (
    <section className="photo-section py-24">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
          <div>
            <p className="section-kicker">Magic Engine</p>
            <h2 className="modern-heading mt-4 text-3xl md:text-5xl leading-tight text-white">
              The automation layer behind modern business operations.
            </h2>
            <p className="mt-6 text-base leading-8 text-mist">
              Magic Engine is the architecture we use to turn business processes into connected
              AI systems: agents, data pipelines, workflow rules, and team controls designed for
              companies operating across New Zealand and Australia.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {capabilities.map((item) => (
                <div key={item} className="tech-chip rounded-full px-4 py-3 text-sm font-semibold text-silver">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="app-window rounded-[28px] p-5 md:p-7">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="screen-card rounded-2xl p-5">
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-mist">Input</p>
                <p className="mt-3 text-sm leading-6 text-silver">Documents, messages, leads, market data, internal records</p>
              </div>
              <div className="screen-card rounded-2xl p-5">
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-mist">Reasoning</p>
                <p className="mt-3 text-sm leading-6 text-silver">AI agents, rules, scoring models, retrieval, review gates</p>
              </div>
              <div className="screen-card rounded-2xl p-5">
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-mist">Action</p>
                <p className="mt-3 text-sm leading-6 text-silver">Reports, alerts, CRM updates, booking flows, task creation</p>
              </div>
              <div className="screen-card rounded-2xl p-5">
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-mist">Control</p>
                <p className="mt-3 text-sm leading-6 text-silver">Permissions, audit trails, approval steps, operating playbooks</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <p className="section-kicker">Solutions</p>
          <h2 className="modern-heading mt-4 text-3xl md:text-5xl text-white">
            Built for teams that need AI to work inside the business.
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
              href={service.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
