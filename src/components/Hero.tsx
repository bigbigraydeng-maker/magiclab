import Link from 'next/link';

const stackColumns = [
  {
    label: 'Inputs',
    title: 'Business signals',
    items: ['Leads', 'Documents', 'Market data', 'Team requests'],
  },
  {
    label: 'Engine',
    title: 'Magic Engine',
    items: ['AI agents', 'Workflow rules', 'Data pipelines', 'Review gates'],
  },
  {
    label: 'Outputs',
    title: 'Operational action',
    items: ['Reports', 'CRM updates', 'Alerts', 'Completed tasks'],
  },
];

const Hero = () => {
  return (
    <section className="gradient-hero pt-28 pb-20">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid min-h-[620px] items-center gap-12 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="max-w-3xl">
            <div className="tech-chip mb-7 inline-flex items-center gap-3 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-silver">
              <span className="h-2 w-2 rounded-full bg-aqua live-dot" />
              AI automation infrastructure for ANZ business
            </div>

            <h1 className="hero-title text-5xl md:text-6xl xl:text-7xl leading-[0.95] text-white">
              We turn everyday business work into AI-powered systems.
            </h1>

            <p className="mt-7 max-w-2xl text-base md:text-xl leading-8 text-silver/82">
              Magic Lab designs the automation layer between your people, data, tools, and
              decisions, so AI can support real operations instead of sitting in a separate chat box.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="btn-primary rounded-full px-8 py-4 text-center font-bold"
              >
                Book Strategy Call
              </Link>
              <Link
                href="/magic-network"
                className="btn-secondary rounded-full px-8 py-4 text-center font-bold"
              >
                See Magic Engine
              </Link>
            </div>
          </div>

          <div className="app-window rounded-[30px] p-5 md:p-6">
            <div className="relative z-10">
              <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-mist">System Blueprint</p>
                  <h2 className="mt-2 text-2xl font-extrabold text-white">How Magic Engine works</h2>
                </div>
                <span className="rounded-full bg-aqua/15 px-3 py-1 text-xs font-bold text-aqua">
                  Live architecture
                </span>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {stackColumns.map((column, index) => (
                  <div key={column.label} className="screen-card rounded-3xl p-5">
                    <div className="mb-5 flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-[0.22em] text-aqua">
                        {column.label}
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.07] text-xs font-black text-silver">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-white">{column.title}</h3>
                    <div className="mt-5 space-y-3">
                      {column.items.map((item) => (
                        <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-bold text-silver">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-3xl border border-aqua/20 bg-aqua/[0.08] p-5">
                <div className="grid gap-4 md:grid-cols-[0.7fr_1.3fr] md:items-center">
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-aqua">
                    Result
                  </p>
                  <p className="text-lg font-extrabold leading-7 text-white">
                    A governed AI workflow your team can understand, operate, and improve.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
