import Link from 'next/link';

const Hero = () => {
  return (
    <section className="gradient-bg pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            AI Marketing Infrastructure for Modern Businesses
          </h1>
          <p className="text-xl text-gray-300 mb-10">
            We build fast websites, SEO systems and AI-powered marketing tools that bring you customers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contact"
              className="btn-primary px-8 py-3 rounded-lg font-semibold text-white"
            >
              Book a Strategy Call
            </Link>
            <Link
              href="/work"
              className="btn-secondary px-8 py-3 rounded-lg font-semibold text-white"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;