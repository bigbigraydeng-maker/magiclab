import Link from 'next/link';
import BlogCard from './BlogCard';

const Insights = () => {
  const articles = [
    'How Travel Companies Should Build Websites in 2026',
    'Why Static Websites Rank Better on Google',
    'AI SEO vs Traditional SEO'
  ];

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Insights
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Latest trends and best practices in AI marketing and website development.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <BlogCard key={index} title={article} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/insights"
            className="btn-secondary px-8 py-3 rounded-lg font-semibold text-white inline-block"
          >
            View All Insights
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Insights;