import type { Metadata } from 'next';
import { buildSeoMetadata } from '@/lib/seo';

export const metadata: Metadata = buildSeoMetadata({
  title: 'AI Automation Services | Magic Lab',
  description:
    'AI workflow automation, data intelligence, AI SEO/GEO, and team training services for businesses in New Zealand and Australia.',
  path: '/services',
  keywords: [
    'AI automation services',
    'AI workflow automation',
    'AI SEO GEO',
    'data intelligence',
    'AI training New Zealand',
  ],
});

const serviceGroups = [
  {
    title: 'AI Workflow Automation',
    description:
      'We map repeated business work, connect your existing tools, and build governed AI workflows with human review points where the risk is high.',
    items: ['Inbox and document automation', 'CRM and lead handoff', 'Internal reporting workflows', 'Approval and audit trails'],
  },
  {
    title: 'Data Intelligence Systems',
    description:
      'We turn scattered business, market, and public data into structured operating knowledge that teams can search, score, and act on.',
    items: ['Data collection pipelines', 'Market and competitor monitoring', 'Dashboards and scoring models', 'RAG knowledge layers'],
  },
  {
    title: 'AI SEO / GEO Growth Systems',
    description:
      'We build search architecture for both Google and AI answer engines, then connect content, website structure, and operational proof.',
    items: ['Keyword and intent mapping', 'Technical SEO foundations', 'AI visibility / GEO strategy', 'Content operating systems'],
  },
  {
    title: 'AI Training and Adoption',
    description:
      'We train founders, managers, and operators to use AI in daily work without losing quality control, privacy discipline, or team accountability.',
    items: ['Role-based AI playbooks', 'Prompt and workflow training', 'Safety and review standards', 'Team adoption workshops'],
  },
];

export default function ServicesPage() {
  return (
    <div className="py-32 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI Automation Services for Real Business Operations
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Magic Lab designs the automation layer between your people, data, tools, and decisions,
            so AI can move from experiments into daily execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {serviceGroups.map((service) => (
            <section key={service.title} className="bg-gray-800 p-8 rounded-xl">
              <h2 className="text-2xl font-semibold text-white mb-4">{service.title}</h2>
              <p className="text-gray-300 leading-7 mb-5">{service.description}</p>
              <ul className="space-y-2 text-gray-300">
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="bg-gray-800/60 border border-gray-700 rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Who this is for
          </h2>
          <p className="text-gray-300 leading-7">
            We work best with founders and teams that already have real business workflows,
            customer conversations, documents, spreadsheets, or market signals, but need a practical
            AI system to collect, reason, act, and improve without creating another disconnected tool.
          </p>
        </section>
        </div>
      </div>
  );
}
