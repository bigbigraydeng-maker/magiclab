import Link from 'next/link';
import type { SeoPillarPage as SeoPillarPageData } from '@/data/seoPillarPages';

type SeoPillarPageProps = {
  page: SeoPillarPageData;
};

const SeoPillarPage = ({ page }: SeoPillarPageProps) => {
  return (
    <div className="bg-gray-950 text-white">
      <section className="gradient-hero pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <p className="section-kicker">{page.eyebrow}</p>
            <h1 className="hero-title mt-5 text-5xl md:text-6xl leading-tight text-white">
              {page.title}
            </h1>
            <p className="mt-7 max-w-3xl text-lg md:text-xl leading-8 text-silver/85">
              {page.description}
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link href="/contact" className="btn-primary rounded-full px-8 py-4 text-center font-bold">
                {page.primaryCta}
              </Link>
              <Link
                href={page.secondaryCta.includes('ANZ') ? '/ai-workflow-automation' : '/magic-engine'}
                className="btn-secondary rounded-full px-8 py-4 text-center font-bold"
              >
                {page.secondaryCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="brand-section py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <aside className="screen-card rounded-3xl p-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-aqua">
                Search Intent
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {page.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-silver"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </aside>

            <div>
              <p className="text-lg leading-8 text-mist">{page.intro}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="photo-section py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-6">
            {page.sections.map((section) => (
              <section key={section.title} className="app-window rounded-[28px] p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">{section.title}</h2>
                <p className="mt-4 max-w-4xl text-base leading-8 text-mist">{section.body}</p>
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {section.points.map((point) => (
                    <div key={point} className="screen-card rounded-2xl p-4 text-sm font-semibold leading-6 text-silver">
                      {point}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="brand-section py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 max-w-3xl">
            <p className="section-kicker">Use Cases</p>
            <h2 className="modern-heading mt-4 text-3xl md:text-5xl text-white">
              Practical work this system can handle.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {page.useCases.map((useCase) => (
              <article key={useCase.title} className="screen-card rounded-3xl p-6">
                <h3 className="text-xl font-extrabold text-white">{useCase.title}</h3>
                <p className="mt-4 text-sm leading-7 text-mist">{useCase.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="photo-section py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <section className="app-window rounded-[28px] p-7 md:p-9">
              <p className="section-kicker">Proof</p>
              <h2 className="mt-4 text-3xl font-extrabold text-white">{page.proof.title}</h2>
              <p className="mt-5 text-base leading-8 text-mist">{page.proof.body}</p>
            </section>
            <section className="app-window rounded-[28px] p-7 md:p-9">
              <p className="section-kicker">Best Fit</p>
              <h2 className="mt-4 text-3xl font-extrabold text-white">This is a fit when...</h2>
              <ul className="mt-6 space-y-3 text-mist">
                {page.fit.map((item) => (
                  <li key={item} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 leading-7">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SeoPillarPage;
