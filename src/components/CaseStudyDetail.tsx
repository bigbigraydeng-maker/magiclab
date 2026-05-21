/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import type { CaseStudy } from '@/data/caseStudies';

type CaseStudyDetailProps = {
  caseStudy: CaseStudy;
};

const CaseStudyDetail = ({ caseStudy }: CaseStudyDetailProps) => {
  return (
    <div className="bg-gray-950 text-white">
      <section className="gradient-hero pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="section-kicker">{caseStudy.category}</p>
              <h1 className="hero-title mt-5 text-5xl md:text-6xl leading-tight text-white">
                {caseStudy.title}
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-silver/85">
                {caseStudy.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-aqua/25 bg-aqua/10 px-4 py-2 text-sm font-bold text-aqua">
                  {caseStudy.region}
                </span>
                {caseStudy.services.map((service) => (
                  <span
                    key={service}
                    className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-silver"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30">
              <img
                src={caseStudy.image}
                alt={`${caseStudy.client} case study visual`}
                className="h-full min-h-[320px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="brand-section py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <aside className="screen-card rounded-3xl p-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-aqua">
                SEO Proof Signals
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {caseStudy.keywords.map((keyword) => (
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
              <p className="text-xl leading-9 text-mist">{caseStudy.summary}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="photo-section py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="app-window rounded-[28px] p-7 md:p-9">
              <p className="section-kicker">Challenge</p>
              <h2 className="mt-4 text-3xl font-extrabold text-white">The operating problem</h2>
              <p className="mt-5 text-base leading-8 text-mist">{caseStudy.challenge}</p>
            </section>
            <section className="app-window rounded-[28px] p-7 md:p-9">
              <p className="section-kicker">Approach</p>
              <h2 className="mt-4 text-3xl font-extrabold text-white">How Magic Lab approached it</h2>
              <ul className="mt-6 space-y-3">
                {caseStudy.approach.map((item) => (
                  <li key={item} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-mist">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </section>

      <section className="brand-section py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 max-w-3xl">
            <p className="section-kicker">System Design</p>
            <h2 className="modern-heading mt-4 text-3xl md:text-5xl text-white">
              The system behind the result.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {caseStudy.system.map((item) => (
              <article key={item.title} className="screen-card rounded-3xl p-6">
                <h3 className="text-xl font-extrabold text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-mist">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="photo-section py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <section className="app-window rounded-[28px] p-7 md:p-9">
              <p className="section-kicker">Outcomes</p>
              <h2 className="mt-4 text-3xl font-extrabold text-white">What the system made possible</h2>
              <ul className="mt-6 space-y-3">
                {caseStudy.outcomes.map((outcome) => (
                  <li key={outcome} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 leading-7 text-mist">
                    {outcome}
                  </li>
                ))}
              </ul>
            </section>
            <section className="app-window rounded-[28px] p-7 md:p-9">
              <p className="section-kicker">Why it matters</p>
              <h2 className="mt-4 text-3xl font-extrabold text-white">SEO and trust value</h2>
              <p className="mt-5 text-base leading-8 text-mist">{caseStudy.seoValue}</p>
              <Link href="/work" className="btn-secondary mt-8 inline-block rounded-full px-8 py-3 font-bold">
                Back to all work
              </Link>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudyDetail;
