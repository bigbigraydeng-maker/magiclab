/* eslint-disable @next/next/no-img-element */

const VisualBand = () => {
  return (
    <section className="brand-section py-24">
      <div className="container mx-auto px-4">
        <div className="image-panel min-h-[460px] rounded-[36px]">
          <img
            src="/images/brand/unsplash-liquid-metal.jpg"
            alt="Liquid metal wave texture representing AI data flow"
            className="h-full min-h-[460px] w-full object-cover"
          />
          <div className="absolute inset-0 z-10 flex items-end">
            <div className="max-w-3xl p-7 md:p-12">
              <p className="section-kicker text-aqua">Visual System</p>
              <h2 className="modern-heading mt-4 text-4xl md:text-6xl leading-tight text-white">
                A sharper technology language for automation, data, and future-facing teams.
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisualBand;
