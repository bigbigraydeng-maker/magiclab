import { absoluteUrl } from '@/lib/seo';

export type SeoPillarPage = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  keywords: string[];
  metadata: {
    title: string;
    description: string;
    path: string;
    languages?: Record<string, string>;
  };
  intro: string;
  sections: {
    title: string;
    body: string;
    points: string[];
  }[];
  useCases: {
    title: string;
    description: string;
  }[];
  proof: {
    title: string;
    body: string;
  };
  fit: string[];
};

export const workflowLanguages = {
  'en-NZ': absoluteUrl('/nz/ai-workflow-automation'),
  'en-AU': absoluteUrl('/au/ai-workflow-automation'),
  'x-default': absoluteUrl('/ai-workflow-automation'),
};

export const seoPillarPages: Record<string, SeoPillarPage> = {
  anzWorkflow: {
    slug: '/ai-workflow-automation',
    eyebrow: 'AI Workflow Automation',
    title: 'AI Workflow Automation for New Zealand and Australia Businesses',
    description:
      'Turn everyday business work into governed AI workflows that collect information, reason over it, create outputs, and keep people in control.',
    primaryCta: 'Book an Automation Strategy Call',
    secondaryCta: 'See Magic Engine',
    keywords: [
      'AI workflow automation',
      'AI automation agency',
      'AI automation consultant',
      'business process automation with AI',
    ],
    metadata: {
      title: 'AI Workflow Automation for ANZ Businesses | Magic Lab',
      description:
        'Magic Lab builds AI workflow automation systems for businesses in New Zealand and Australia, connecting people, data, tools, and decisions.',
      path: '/ai-workflow-automation',
      languages: workflowLanguages,
    },
    intro:
      'Most teams are not short of AI tools. They are short of a reliable execution layer between their inboxes, spreadsheets, documents, CRMs, websites, and daily decisions. Magic Lab designs that layer for businesses operating across New Zealand and Australia.',
    sections: [
      {
        title: 'What AI workflow automation means in practice',
        body:
          'AI workflow automation is not a chatbot sitting beside the business. It is a connected operating system that reads real inputs, applies business rules, drafts or completes work, and hands risky decisions back to people for review.',
        points: [
          'Capture signals from email, forms, documents, websites, CRM, and spreadsheets',
          'Use AI agents and rules to classify, summarize, score, draft, and route work',
          'Keep approval gates for sensitive, financial, legal, or customer-facing actions',
          'Turn repeated work into systems that can be monitored and improved',
        ],
      },
      {
        title: 'Why ChatGPT alone does not create automation',
        body:
          'ChatGPT is powerful, but teams still waste time copying context in and out of separate tools. Automation begins when AI can work with your existing business sources, understand the workflow, remember preferences, and produce outputs in the format your team needs.',
        points: [
          'Less manual copy-paste between tools',
          'More consistent outputs across people and departments',
          'Clear handoff between AI suggestions and human decisions',
          'A feedback loop that improves the workflow over time',
        ],
      },
      {
        title: 'How Magic Lab builds the system',
        body:
          'We start with the real work, not the technology stack. Then we design the smallest reliable workflow that can be used by the team, measured, reviewed, and expanded.',
        points: [
          'Workflow diagnosis and automation opportunity map',
          'Data source and integration design',
          'AI agent instructions, review gates, and output templates',
          'Team playbooks, measurement, and iteration rhythm',
        ],
      },
    ],
    useCases: [
      {
        title: 'Lead response and follow-up',
        description:
          'Capture enquiries, summarize customer context, draft replies, score intent, and create next actions for sales or operations teams.',
      },
      {
        title: 'Reporting and market intelligence',
        description:
          'Collect signals from public sources, internal records, and market data, then generate recurring reports that people can trust.',
      },
      {
        title: 'Content and SEO operations',
        description:
          'Transform emails, project notes, images, and daily work into structured content drafts for Google, AI search, and social channels.',
      },
    ],
    proof: {
      title: 'Built from real operating systems',
      body:
        'Magic Lab work includes AI property analysis, quantitative decision systems, sentiment intelligence, pricing engines, SEO architecture, and booking conversion systems. The common pattern is simple: scattered business inputs become structured execution.',
    },
    fit: [
      'You already have real workflows, customers, documents, or data sources',
      'Your team repeats the same admin, reporting, content, or lead tasks every week',
      'You want AI inside the business process, not another isolated software login',
      'You need review, control, and practical adoption instead of hype',
    ],
  },
  nzWorkflow: {
    slug: '/nz/ai-workflow-automation',
    eyebrow: 'New Zealand AI Automation',
    title: 'AI Workflow Automation for New Zealand Businesses',
    description:
      'Practical AI automation systems for New Zealand service businesses, operators, agencies, and lean teams that need better execution without adding headcount.',
    primaryCta: 'Talk About a NZ Workflow',
    secondaryCta: 'View ANZ Overview',
    keywords: [
      'AI automation agency New Zealand',
      'AI workflow automation Auckland',
      'AI automation consultant NZ',
      'AI systems for small business NZ',
    ],
    metadata: {
      title: 'AI Workflow Automation New Zealand | Magic Lab',
      description:
        'Magic Lab builds AI workflow automation systems for New Zealand businesses, including service teams, local operators, and NZ Chinese business communities.',
      path: '/nz/ai-workflow-automation',
      languages: workflowLanguages,
    },
    intro:
      'New Zealand businesses often run with lean teams, practical budgets, and a high need for trust. The best AI automation work here is not oversized enterprise transformation. It is focused workflow improvement that saves time, protects quality, and helps small teams move faster.',
    sections: [
      {
        title: 'Where New Zealand teams feel the pressure',
        body:
          'Local businesses often have strong customer relationships but fragmented operations behind the scenes. Enquiries arrive through email, website forms, phone notes, social channels, spreadsheets, and staff memory.',
        points: [
          'Slow response to new leads or customer enquiries',
          'Manual reporting across spreadsheets and inboxes',
          'Repeated explanation work for customers, partners, and staff',
          'Content and SEO work that depends too heavily on the founder',
        ],
      },
      {
        title: 'AI automation use cases for NZ operators',
        body:
          'The first wins usually come from everyday work: customer intake, qualification, follow-up, weekly reporting, internal knowledge search, and content production from real business activity.',
        points: [
          'Tourism and local service booking workflows',
          'Property, migration, education, and advisory lead systems',
          'Internal knowledge bases for small teams',
          'SEO and content engines built from real customer questions',
        ],
      },
      {
        title: 'How Magic Lab localizes the approach',
        body:
          'We design for the reality of New Zealand businesses: smaller teams, founder-led operations, bilingual communities, and the need for practical systems that can be maintained without a large IT department.',
        points: [
          'Lean automation roadmaps',
          'Human approval for customer-facing outputs',
          'English and Chinese market awareness where relevant',
          'Systems that support Auckland, regional NZ, and cross-border work',
        ],
      },
    ],
    useCases: [
      {
        title: 'Local service enquiry automation',
        description:
          'Summarize enquiries, identify urgency, prepare replies, and create follow-up tasks without losing the human tone customers expect.',
      },
      {
        title: 'NZ market and competitor monitoring',
        description:
          'Track public signals, customer questions, competitor pages, and industry changes, then turn them into weekly operator-ready reports.',
      },
      {
        title: 'Founder-led content systems',
        description:
          'Use email, project notes, screenshots, and customer conversations to create credible SEO and social content without sounding generic.',
      },
    ],
    proof: {
      title: 'Relevant NZ project patterns',
      body:
        'Magic Lab has worked on New Zealand-facing systems across tourism, property, public sentiment, SEO architecture, and local business operations. These projects create reusable patterns for practical AI workflow automation.',
    },
    fit: [
      'You are a New Zealand service business or local operator',
      'You have more leads, admin, reports, or content work than your current team can comfortably handle',
      'You want AI to support a lean team without damaging trust',
      'You operate across English and Chinese customer contexts',
    ],
  },
  auWorkflow: {
    slug: '/au/ai-workflow-automation',
    eyebrow: 'Australia AI Automation',
    title: 'AI Workflow Automation for Australian Businesses',
    description:
      'AI workflow automation for Australian service businesses, agencies, property teams, education providers, and growing multi-location operators.',
    primaryCta: 'Talk About an AU Workflow',
    secondaryCta: 'View ANZ Overview',
    keywords: [
      'AI automation agency Australia',
      'AI workflow automation Brisbane',
      'AI automation consultant Australia',
      'AI automation for small business Australia',
    ],
    metadata: {
      title: 'AI Workflow Automation Australia | Magic Lab',
      description:
        'Magic Lab builds AI workflow automation systems for Australian businesses, with practical execution systems for growing teams and service operators.',
      path: '/au/ai-workflow-automation',
      languages: workflowLanguages,
    },
    intro:
      'Australian businesses often face a different scale problem: more locations, more enquiries, more competition, and more pressure to respond quickly. AI workflow automation can help teams turn scattered demand into repeatable execution.',
    sections: [
      {
        title: 'Where Australian teams can gain leverage',
        body:
          'For Australian service businesses and agencies, the opportunity is often speed and consistency. The faster a team can understand context, respond well, and route work correctly, the more value they keep.',
        points: [
          'High-volume lead intake and qualification',
          'Multi-location operations and reporting',
          'Property, migration, education, and local service workflows',
          'Content systems for competitive local search markets',
        ],
      },
      {
        title: 'AI automation use cases for Australian SMEs',
        body:
          'The strongest use cases connect customer communication, internal knowledge, market data, and follow-up actions into one controlled workflow.',
        points: [
          'Lead scoring and first-response drafting',
          'Weekly management reporting from business data',
          'Local SEO and content production from real work',
          'Competitor and market signal monitoring',
        ],
      },
      {
        title: 'How Magic Lab supports Australian growth',
        body:
          'We design systems that help growing teams standardize execution while preserving human review. That matters when AI outputs affect customers, brand, compliance, or commercial decisions.',
        points: [
          'Workflow mapping for service teams and agencies',
          'AI agents with approval gates and audit-friendly outputs',
          'Content and SEO systems built for local discovery',
          'Training so teams can operate the system confidently',
        ],
      },
    ],
    useCases: [
      {
        title: 'Brisbane and Australia-wide lead response',
        description:
          'Create faster intake, clearer customer summaries, and more consistent follow-up for service teams handling busy enquiry channels.',
      },
      {
        title: 'Management reporting automation',
        description:
          'Turn spreadsheets, sales notes, website data, and team updates into recurring operating reports for founders and managers.',
      },
      {
        title: 'AI SEO and local content execution',
        description:
          'Build content systems that use real business proof, local search intent, and customer questions instead of generic AI articles.',
      },
    ],
    proof: {
      title: 'Designed for growing operator-led teams',
      body:
        'Magic Lab combines AI development, data infrastructure, SEO systems, and automation architecture. That makes the work especially useful for Australian teams that need execution capacity without creating another disconnected software stack.',
    },
    fit: [
      'You are an Australian SME, agency, property team, education provider, or local service operator',
      'You need faster lead response and more consistent follow-up',
      'You want AI workflows that your team can review and improve',
      'You are building across Australia and New Zealand markets',
    ],
  },
  seoGeo: {
    slug: '/ai-seo-geo-growth-systems',
    eyebrow: 'AI SEO / GEO',
    title: 'AI SEO and GEO Growth Systems',
    description:
      'Build search visibility for Google and AI answer engines with real business proof, structured content, technical SEO, and repeatable content operations.',
    primaryCta: 'Build an AI Search Strategy',
    secondaryCta: 'Explore Magic Engine',
    keywords: [
      'AI SEO agency',
      'GEO optimization',
      'AI search visibility',
      'AI content automation',
      'SEO and GEO strategy',
    ],
    metadata: {
      title: 'AI SEO and GEO Growth Systems | Magic Lab',
      description:
        'Magic Lab builds AI SEO and GEO growth systems that help businesses become visible in Google, AI answer engines, and social discovery channels.',
      path: '/ai-seo-geo-growth-systems',
    },
    intro:
      'Search is no longer only a list of blue links. Customers discover businesses through Google, AI answer engines, social platforms, and recommendations. Magic Lab helps companies build the content and technical infrastructure needed to be understood, cited, and trusted.',
    sections: [
      {
        title: 'SEO and GEO work best when they share the same source of truth',
        body:
          'Traditional SEO focuses on pages, keywords, links, and technical health. GEO focuses on whether AI answer engines can understand your entity, expertise, services, proof, and relevance. The strongest system does both.',
        points: [
          'Clear service pages that match commercial search intent',
          'Structured case studies that prove experience',
          'FAQ and article content that answers real customer questions',
          'Technical signals such as canonical URLs, sitemap, schema, and clean metadata',
        ],
      },
      {
        title: 'Why real business material beats generic AI content',
        body:
          'AI can draft quickly, but search visibility is built on useful, specific, trustworthy material. Emails, project notes, customer questions, screenshots, sales calls, and daily work are often the best raw material.',
        points: [
          'Founder opinions become thought leadership',
          'Project updates become case studies and articles',
          'Customer questions become FAQ and search pages',
          'Operational lessons become LinkedIn and social content',
        ],
      },
      {
        title: 'How Magic Content Engine fits in',
        body:
          'Magic Content Engine is the internal workflow we use to turn authentic business signals into platform-ready drafts. It is not meant to replace judgment. It gives the team better raw material, structure, and iteration speed.',
        points: [
          'Collect real inputs from work, email, images, notes, and project logs',
          'Extract content-ready angles and proof points',
          'Generate SEO, LinkedIn, Xiaohongshu, Threads, X, Facebook, and Instagram drafts',
          'Improve tone through feedback and user modeling',
        ],
      },
    ],
    useCases: [
      {
        title: 'SEO pillar pages',
        description:
          'Build commercial pages that match high-intent searches and explain services clearly enough for both humans and search engines.',
      },
      {
        title: 'GEO-ready knowledge assets',
        description:
          'Create structured explanations, case studies, and entity signals that make it easier for AI answer engines to understand the business.',
      },
      {
        title: 'Weekly content operations',
        description:
          'Turn daily business activity into a steady publishing rhythm without relying on generic AI-generated posts.',
      },
    ],
    proof: {
      title: 'A growth system, not a content pile',
      body:
        'The goal is not to publish more for its own sake. The goal is to create a connected system where website pages, case studies, articles, social posts, and internal proof all reinforce the same market position.',
    },
    fit: [
      'You want to be found in both Google and AI answer engines',
      'You have real business activity but no repeatable content system',
      'Your current SEO content sounds generic or disconnected from operations',
      'You need English-first SEO with optional Chinese social distribution',
    ],
  },
};
