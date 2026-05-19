import { projects } from '../data/projects';

const Clients = () => {
  return (
    <section className="waterline border-y border-white/10 bg-primary py-14">
      <div className="container mx-auto px-4">
        <p className="text-center text-mist text-xs font-bold uppercase tracking-[0.28em] mb-8">
          Systems and ventures across New Zealand, Australia, and Asia-Pacific
        </p>
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="client-card px-6 py-3 rounded-lg"
            >
              <p className="text-silver font-semibold text-sm whitespace-nowrap">
                {project.client}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;
