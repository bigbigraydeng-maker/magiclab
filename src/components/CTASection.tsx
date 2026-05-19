import Link from 'next/link';

const CTASection = () => {
  return (
    <section className="brand-section py-24">
      <div className="container mx-auto px-4">
        <div className="cta-photo mx-auto max-w-6xl rounded-[32px] border border-white/15 p-8 md:p-14 text-center shadow-[0_36px_100px_rgba(0,0,0,0.38)]">
          <div className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-aqua/25 bg-aqua/10">
            <span className="spark" />
          </div>
          <p className="section-kicker">Create the Future with AI</p>
          <h2 className="modern-heading mx-auto mt-4 max-w-4xl text-4xl md:text-6xl leading-tight text-white">
            Build an automation layer your team can actually run.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-mist">
            Talk with Magic Lab about the workflows, data systems, and training needed to turn AI
            from experiments into daily operating capability.
          </p>
          <Link
            href="/contact"
            className="btn-primary mt-9 inline-block rounded-full px-10 py-4 text-base font-bold"
          >
            Book a Strategy Call
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
