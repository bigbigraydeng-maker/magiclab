import Link from 'next/link';
import BlogCard from './BlogCard';

const Insights = () => {
  const articles = [
    { title: 'How ANZ Teams Should Prepare for AI Workflow Automation', tag: 'Automation' },
    { title: 'From Dashboards to Decision Systems: What Data Intelligence Needs', tag: 'Data Intelligence' },
    { title: 'Training Operators to Work With AI Agents Safely', tag: 'AI Academy' },
  ];

  return (
    <section className="brand-section py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="section-kicker">Insights</p>
          <h2 className="modern-heading mt-4 text-3xl md:text-5xl text-white mb-5">
            Thinking for teams building with AI.
          </h2>
          <p className="text-mist max-w-2xl mx-auto leading-8">
            Practical notes on automation architecture, data intelligence, and AI adoption for
            businesses operating in New Zealand and Australia.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <BlogCard key={index} title={article.title} tag={article.tag} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/insights"
            className="btn-secondary px-8 py-3 rounded-lg font-semibold inline-block"
          >
            View All Insights
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Insights;
