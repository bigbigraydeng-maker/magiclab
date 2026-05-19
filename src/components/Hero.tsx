/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';

const platformSignals = [
  { label: 'AI agents', value: '42 live tasks' },
  { label: 'Data streams', value: '13 sources' },
  { label: 'Ops saved', value: '186 hrs/mo' },
];

const workflow = [
  'Lead intake',
  'Market signals',
  'AI review',
  'Human approval',
  'Action shipped',
];

const Hero = () => {
  return (
    <section className="gradient-hero pt-28 pb-16">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid min-h-[620px] lg:grid-cols-[0.92fr_1.08fr] gap-10 items-center">
          <div className="max-w-3xl">
            <div className="tech-chip mb-7 inline-flex items-center gap-3 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-silver">
              <span className="h-2 w-2 rounded-full bg-aqua live-dot" />
              Auckland based / ANZ deployed
            </div>

            <h1 className="hero-title text-5xl md:text-6xl xl:text-7xl leading-[0.95] text-white">
              AI systems that move business faster.
            </h1>

            <p className="mt-7 max-w-2xl text-base md:text-xl leading-8 text-silver/82">
              Magic Lab builds automation infrastructure, data intelligence, and team training for
              New Zealand and Australian businesses that want AI inside real operations.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="btn-primary rounded-full px-8 py-4 text-center font-bold"
              >
                Book Strategy Call
              </Link>
              <Link
                href="/work"
                className="btn-secondary rounded-full px-8 py-4 text-center font-bold"
              >
                Explore Systems
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="app-window rounded-[28px] p-4 md:p-5">
              <div className="relative z-10 rounded-[22px] border border-white/10 bg-primary/70 p-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#ff6b6b]" />
                    <span className="h-3 w-3 rounded-full bg-[#ffd166]" />
                    <span className="h-3 w-3 rounded-full bg-[#8fd7ff]" />
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-mist">
                    Magic Engine OS
                  </span>
                </div>

                <div className="grid gap-4 pt-4 lg:grid-cols-[0.7fr_1.3fr]">
                  <div className="space-y-4">
                    {platformSignals.map((signal) => (
                      <div key={signal.label} className="screen-card rounded-2xl p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-mist">{signal.label}</p>
                        <p className="mt-3 text-2xl font-extrabold text-white">{signal.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="screen-card rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-mist">Workflow Map</p>
                        <h2 className="mt-2 text-2xl font-extrabold text-white">From signal to action</h2>
                      </div>
                      <span className="rounded-full bg-aqua/15 px-3 py-1 text-xs font-bold text-aqua">
                        Live
                      </span>
                    </div>

                    <div className="mt-7 space-y-3">
                      {workflow.map((item, index) => (
                        <div key={item} className="flex items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.07] text-xs font-bold text-silver">
                            {index + 1}
                          </span>
                          <div className="h-12 flex-1 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3">
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-sm font-bold text-white">{item}</span>
                              <span className="h-2 w-20 rounded-full bg-gradient-to-r from-aqua/90 to-white/10" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {['StockQueen', 'Yellowbook', 'Academy'].map((product) => (
                    <div key={product} className="screen-card rounded-2xl px-4 py-4">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-mist">Product</p>
                      <p className="mt-2 text-lg font-extrabold text-white">{product}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="image-panel absolute -bottom-12 -left-8 hidden w-56 rounded-3xl lg:block">
              <img src="/images/projects/yellowbook.png" alt="Yellowbook data intelligence interface" className="h-40 w-full object-cover" />
            </div>
            <div className="image-panel absolute -right-5 -top-10 hidden w-48 rounded-3xl lg:block">
              <img src="/images/projects/stockqueen.jpg" alt="StockQueen market intelligence interface" className="h-44 w-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
