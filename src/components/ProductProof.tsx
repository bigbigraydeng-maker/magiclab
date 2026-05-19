/* eslint-disable @next/next/no-img-element */

const products = [
  {
    name: 'StockQueen',
    label: 'AI Quant Intelligence',
    image: '/images/projects/stockqueen.jpg',
    copy: 'Market scoring, regime detection, and portfolio rotation logic built into a product-grade decision system.',
    metric: '1,500+ stocks scanned weekly',
  },
  {
    name: 'Yellowbook',
    label: 'Social Sentiment Intelligence',
    image: '/images/projects/yellowbook.png',
    copy: 'Multi-source public mood tracking for news, social platforms, institutions, and civic signals.',
    metric: '5k-20k data points daily',
  },
  {
    name: 'Magic Lab Academy',
    label: 'AI Training for Teams',
    image: '/images/brand/unsplash-blue-wave.jpg',
    copy: 'Hands-on AI adoption programs for founders, managers, operators, and teams moving from tools to workflows.',
    metric: 'Workflow-first training',
  },
];

const ProductProof = () => {
  return (
    <section className="section-alt py-24">
      <div className="container mx-auto px-4">
        <div className="mb-14 grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <p className="section-kicker">Product Proof</p>
          <h2 className="modern-heading max-w-5xl text-4xl md:text-6xl leading-[1.02] text-white">
            Big systems, real interfaces, live business use cases.
          </h2>
        </div>

        <div className="space-y-8">
          {products.map((product, index) => (
            <article
              key={product.name}
              className={`grid gap-6 lg:grid-cols-[1.24fr_0.76fr] lg:items-stretch ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}
            >
              <div className={`image-panel min-h-[360px] rounded-[28px] ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <img
                  src={product.image}
                  alt={`${product.name} product visual`}
                  className="h-full min-h-[360px] w-full object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-aqua">{product.label}</p>
                    <h3 className="mt-2 text-4xl md:text-6xl font-extrabold text-white">{product.name}</h3>
                  </div>
                  <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                    {product.metric}
                  </span>
                </div>
              </div>

              <div className={`app-window rounded-[28px] p-6 md:p-8 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <span className="inline-flex rounded-full bg-aqua/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-aqua">
                      0{index + 1} / Built by Magic Lab
                    </span>
                    <h4 className="mt-8 text-3xl font-extrabold leading-tight text-white">
                      {product.copy}
                    </h4>
                  </div>
                  <div className="mt-10 grid grid-cols-2 gap-3">
                    {['Data layer', 'AI logic', 'Workflow UX', 'Team adoption'].map((item) => (
                      <div key={item} className="screen-card rounded-2xl px-4 py-3 text-sm font-bold text-silver">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductProof;
