const steps = [
  {
    title: 'Discover',
    description: 'Map the business process, data sources, users, risks, and the work AI should not touch.',
  },
  {
    title: 'Architect',
    description: 'Design the Magic Engine workflow: agents, rules, integrations, dashboards, and review gates.',
  },
  {
    title: 'Automate',
    description: 'Build and connect the system with measurable outputs, permission controls, and team handoffs.',
  },
  {
    title: 'Scale',
    description: 'Train the team, monitor performance, and expand the automation layer across more operations.',
  },
];

const Process = () => {
  return (
    <section className="section-alt py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="section-kicker">How We Build</p>
          <h2 className="modern-heading mt-4 text-3xl md:text-5xl text-white">
            From scattered workflow to operating intelligence.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {steps.map((step, index) => (
            <div key={step.title} className="relative screen-card rounded-[24px] p-6">
              <div className="mb-8 flex items-center justify-between">
                <span className="text-4xl font-black text-white/25">0{index + 1}</span>
                <span className="spark scale-75" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">{step.title}</h3>
              <p className="mt-4 text-sm leading-7 text-mist">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
