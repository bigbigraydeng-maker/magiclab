import Link from 'next/link';

const engineLayers = [
  {
    title: 'Workflow Intelligence',
    copy: 'Map business processes into automated flows with clear handoffs, approvals, and measurable outputs.',
  },
  {
    title: 'AI Agent Layer',
    copy: 'Deploy role-specific agents for research, intake, reporting, content, operations, and decision support.',
  },
  {
    title: 'Data Infrastructure',
    copy: 'Connect internal records, websites, documents, market feeds, and third-party sources into usable intelligence.',
  },
  {
    title: 'Human Control',
    copy: 'Keep teams in charge with review gates, permissions, audit trails, and operating playbooks.',
  },
];

const useCases = [
  'Lead intake and qualification',
  'Market and competitor monitoring',
  'Document processing and summarisation',
  'Customer support knowledge systems',
  'Sales and marketing workflow automation',
  'Management reporting and alerts',
];

const proofPoints = [
  { value: '13+', label: 'data source patterns' },
  { value: '4', label: 'product systems powered' },
  { value: 'ANZ', label: 'built for local operators' },
];

export default function MagicEnginePage() {
  return (
    <>
      <section className="gradient-hero pt-32 pb-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid min-h-[560px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="tech-chip mb-7 inline-flex items-center gap-3 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-silver">
                <span className="h-2 w-2 rounded-full bg-aqua live-dot" />
                Magic Lab Core Platform
              </div>
              <h1 className="hero-title text-5xl md:text-7xl leading-[0.95] text-white">
                Magic Engine turns business work into AI systems.
              </h1>
              <p className="mt-7 max-w-2xl text-base md:text-xl leading-8 text-silver/82">
                A practical automation architecture for companies that need AI agents, data
                pipelines, workflow controls, and team adoption working together inside daily
                operations.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link href="/contact" className="btn-primary rounded-full px-8 py-4 text-center font-bold">
                  Book Strategy Call
                </Link>
                <Link href="/work" className="btn-secondary rounded-full px-8 py-4 text-center font-bold">
                  View Systems
                </Link>
              </div>
            </div>

            <div className="app-window rounded-[28px] p-4 md:p-6">
              <div className="relative z-10 rounded-[22px] border border-white/10 bg-primary/70 p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#ff6b6b]" />
                    <span className="h-3 w-3 rounded-full bg-[#ffd166]" />
                    <span className="h-3 w-3 rounded-full bg-[#8fd7ff]" />
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-mist">
                    Engine Console
                  </span>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {engineLayers.map((layer, index) => (
                    <div key={layer.title} className="screen-card rounded-2xl p-5">
                      <div className="mb-5 flex items-center justify-between">
                        <span className="text-xs font-black text-aqua">0{index + 1}</span>
                        <span className="h-2 w-12 rounded-full bg-gradient-to-r from-aqua to-white/10" />
                      </div>
                      <h2 className="text-xl font-extrabold text-white">{layer.title}</h2>
                      <p className="mt-3 text-sm leading-6 text-mist">{layer.copy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="photo-section py-24">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p className="section-kicker">What It Powers</p>
              <h2 className="modern-heading mt-4 text-4xl md:text-6xl leading-tight text-white">
                One engine for operations, intelligence, and execution.
              </h2>
              <p className="mt-6 text-base leading-8 text-mist">
                Magic Engine is not a single chatbot. It is a system design pattern for connecting
                the tools, data, decisions, and people that keep a business moving.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {useCases.map((useCase) => (
                <div key={useCase} className="screen-card rounded-2xl px-5 py-5 text-base font-bold text-white">
                  {useCase}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="brand-section py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {proofPoints.map((point) => (
              <div key={point.label} className="app-window rounded-[28px] p-8">
                <p className="text-5xl font-black text-white">{point.value}</p>
                <p className="mt-4 text-sm font-bold uppercase tracking-[0.2em] text-mist">{point.label}</p>
              </div>
            ))}
          </div>
          <div className="cta-photo mt-10 rounded-[32px] border border-white/15 p-8 md:p-12">
            <p className="section-kicker text-aqua">Implementation</p>
            <h2 className="modern-heading mt-4 max-w-4xl text-4xl md:text-6xl leading-tight text-white">
              Designed around your workflows, not around a generic AI tool.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-silver">
              We start with a business process, define the control points, connect the data, build
              the automations, and train the people who will run it.
            </p>
            <Link href="/contact" className="btn-primary mt-9 inline-block rounded-full px-10 py-4 font-bold">
              Discuss Magic Engine
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
