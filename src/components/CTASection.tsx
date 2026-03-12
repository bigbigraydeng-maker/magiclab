import Link from 'next/link';

const CTASection = () => {
  return (
    <section className="py-16 gradient-bg">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to grow your business with AI marketing?
          </h2>
          <Link
            href="/contact"
            className="btn-primary px-8 py-3 rounded-lg font-semibold text-white inline-block"
          >
            Book a Free Consultation
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;