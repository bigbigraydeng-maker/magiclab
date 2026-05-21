export type CaseStudy = {
  slug: string;
  client: string;
  category: string;
  title: string;
  description: string;
  image: string;
  region: string;
  services: string[];
  keywords: string[];
  summary: string;
  challenge: string;
  approach: string[];
  system: {
    title: string;
    body: string;
  }[];
  outcomes: string[];
  seoValue: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'aucompass',
    client: 'AUCompass',
    category: 'AI Property Intelligence',
    title: 'AUCompass: AI Property Analysis Platform for the Brisbane Chinese Community',
    description:
      'A Brisbane real estate data platform combining AI property analysis, multi-source data aggregation, and RAG-based intelligent Q&A.',
    image: '/images/projects/aucompass.jpg',
    region: 'Australia / Brisbane',
    services: ['AI Development', 'Data Infrastructure', 'Web Scraping', 'RAG System'],
    keywords: [
      'AI property analysis',
      'real estate data platform',
      'RAG property assistant',
      'Brisbane property intelligence',
    ],
    summary:
      'AUCompass turns fragmented property data into a structured decision system for buyers, investors, and local Chinese community users navigating the Brisbane market.',
    challenge:
      'Property decisions require school zones, flood risk, price history, rental yield, suburb context, and local market knowledge. The problem was not a lack of data. The problem was that the data lived in different places and was hard for normal users to interpret.',
    approach: [
      'Designed a multi-source data model for key Brisbane suburbs',
      'Built AI-powered analysis layers for property, suburb, school, flood, and rental context',
      'Created a RAG-based Q&A experience so users can ask practical property questions',
      'Structured outputs for both data-heavy analysis and plain-language explanation',
    ],
    system: [
      {
        title: 'Data aggregation layer',
        body:
          'Collects and organizes suburb, transaction, school, flood, rental, and development signals into a searchable structure.',
      },
      {
        title: 'AI reasoning layer',
        body:
          'Interprets property and suburb signals into plain-language insights that support faster research and clearer decision making.',
      },
      {
        title: 'Community-facing interface',
        body:
          'Makes complex property intelligence accessible for Chinese-speaking buyers and investors without forcing them to read raw datasets.',
      },
    ],
    outcomes: [
      'Covers 7 key Brisbane suburbs',
      'Combines transaction data, school ratings, flood risk, rental yields, and development insights',
      'Turns scattered real estate signals into a practical AI property research workflow',
    ],
    seoValue:
      'This case supports Magic Lab positioning around AI data intelligence, RAG systems, real estate automation, and Australian market workflow automation.',
  },
  {
    slug: 'stockqueen',
    client: 'StockQueen',
    category: 'Quantitative AI Decision System',
    title: 'StockQueen: AI-Driven Quantitative Rotation System',
    description:
      'A quantitative decision system using a 9-factor scoring engine, weekly stock scanning, and market regime adaptation.',
    image: '/images/projects/stockqueen.jpg',
    region: 'Global / US Market Data',
    services: ['AI Development', 'Quantitative Analysis', 'Data Pipeline', 'Automation'],
    keywords: [
      'AI quantitative trading system',
      'stock scoring engine',
      'market regime automation',
      'financial data pipeline',
    ],
    summary:
      'StockQueen shows how Magic Lab turns complex data logic into a repeatable decision system that can scan, score, compare, and adapt over time.',
    challenge:
      'Manual investment research can become inconsistent and emotionally biased. The challenge was to create a structured system that could evaluate a large stock universe, compare signals, and adapt its logic across different market regimes.',
    approach: [
      'Created a 9-factor scoring engine for stock comparison',
      'Built a weekly scanning workflow across more than 1,500 stocks',
      'Designed market regime logic to adjust strategy behavior',
      'Validated model behavior through walk-forward testing',
    ],
    system: [
      {
        title: 'Signal scoring engine',
        body:
          'Scores stocks across multiple factors so decisions can be compared through a consistent analytical framework.',
      },
      {
        title: 'Automated scan workflow',
        body:
          'Runs recurring scans and portfolio rotation logic, reducing manual research time and standardizing decision inputs.',
      },
      {
        title: 'Regime adaptation',
        body:
          'Adjusts behavior across market conditions so the system is not locked into one static rule set.',
      },
    ],
    outcomes: [
      'Scans 1,500+ stocks weekly',
      'Uses a 9-factor scoring engine',
      'Walk-forward validated with average OOS Sharpe ratio of 3.84 across 5 windows',
      'Improved prior version performance by 107%',
    ],
    seoValue:
      'This case supports Magic Lab credibility in data pipelines, decision automation, AI scoring systems, and high-stakes analytical workflows.',
  },
  {
    slug: 'yellow-book',
    client: 'Yellow Book',
    category: 'Public Sentiment Intelligence',
    title: 'Yellow Book: New Zealand Public Sentiment and Political Mood Index',
    description:
      'A multi-source sentiment intelligence platform tracking public mood through news, Reddit, Parliament, RBNZ, and social media signals.',
    image: '/images/projects/yellowbook.png',
    region: 'New Zealand',
    services: ['AI Development', 'NLP / Sentiment Analysis', 'Data Pipeline', 'Full-Stack Development'],
    keywords: [
      'public sentiment monitoring',
      'AI sentiment analysis',
      'New Zealand mood index',
      'multi-source intelligence platform',
    ],
    summary:
      'Yellow Book demonstrates how AI can turn public data streams into a structured intelligence product for monitoring mood, discourse, and macro signals.',
    challenge:
      'Public sentiment is fragmented across social platforms, media coverage, official institutions, and political discussion. The challenge was to collect and interpret these signals without reducing them to shallow keyword counts.',
    approach: [
      'Collected signals from 13 public and institutional sources',
      'Designed a 4-layer AI analysis architecture',
      'Built real-time scoring for public mood and topic movement',
      'Structured outputs into a usable intelligence dashboard',
    ],
    system: [
      {
        title: 'Multi-source collection',
        body:
          'Aggregates public signals from Reddit, news, Parliament, RBNZ, and social media to create a richer market view.',
      },
      {
        title: 'NLP analysis layer',
        body:
          'Uses AI-assisted sentiment and topic analysis to interpret directional changes in public mood.',
      },
      {
        title: 'Mood index product layer',
        body:
          'Transforms raw signals into a readable index and dashboard for recurring analysis.',
      },
    ],
    outcomes: [
      'Collects data from 13 sources',
      'Processes 5,000-20,000 data points daily',
      'Tracks public mood across social, media, policy, and economic signals',
    ],
    seoValue:
      'This case strengthens Magic Lab positioning around AI market intelligence, public data automation, NLP, and recurring reporting systems.',
  },
  {
    slug: 'car-scout',
    client: 'Car Scout',
    category: 'AI Pricing and Market Data Automation',
    title: 'Car Scout: Japanese Import Vehicle Valuation and Trading Platform',
    description:
      'A vehicle trading and valuation platform using hybrid pricing logic, market scraping, and automated cost calculation.',
    image: '/images/projects/carscout.jpg',
    region: 'New Zealand / Japan Import Market',
    services: ['AI Development', 'Web Scraping', 'Full-Stack Development', 'Data Infrastructure'],
    keywords: [
      'AI car valuation engine',
      'vehicle pricing automation',
      'market data scraping',
      'Japanese import car platform',
    ],
    summary:
      'Car Scout shows how Magic Lab builds pricing systems that combine market data, rules, correction logic, and confidence scoring.',
    challenge:
      'Vehicle valuation depends on model, mileage, condition, import costs, local demand, and comparable listings. Manual pricing is slow and inconsistent, especially when market data changes quickly.',
    approach: [
      'Built a 3-layer hybrid pricing model',
      'Combined rule-based logic, KNN correction, and confidence scoring',
      'Integrated real-time TradeMe market data',
      'Automated cost calculation for import and resale workflows',
    ],
    system: [
      {
        title: 'Market data layer',
        body:
          'Collects and structures comparable listings so valuation is grounded in current market signals.',
      },
      {
        title: 'Hybrid pricing model',
        body:
          'Combines deterministic business rules with data-driven correction and confidence scoring.',
      },
      {
        title: 'Trading workflow support',
        body:
          'Connects valuation, cost calculation, and opportunity assessment into one operator workflow.',
      },
    ],
    outcomes: [
      'Deployed hybrid pricing model for 3 vehicle models',
      'Integrated real-time TradeMe market data',
      'Automated cost calculation for trading decisions',
    ],
    seoValue:
      'This case supports Magic Lab credibility in pricing automation, web scraping, hybrid AI systems, and operator-facing decision workflows.',
  },
  {
    slug: 'warm-voyage',
    client: 'Warm Voyage',
    category: 'Tourism SEO and Booking Operations',
    title: 'Warm Voyage: Premium Auckland Tourism and Chauffeur Operation System',
    description:
      'A bilingual tourism and chauffeur operation system with SEO architecture, booking conversion, and market-positioned content.',
    image: '/images/projects/warmvoyage.jpg',
    region: 'New Zealand / Auckland',
    services: ['Website Development', 'SEO Optimization', 'Conversion Optimization', 'Booking Flow'],
    keywords: [
      'tourism SEO New Zealand',
      'booking conversion system',
      'bilingual tourism website',
      'Auckland chauffeur operation',
    ],
    summary:
      'Warm Voyage demonstrates Magic Lab work at the intersection of SEO, bilingual content, premium positioning, and booking operations.',
    challenge:
      'Premium tourism operators need more than a beautiful website. They need search visibility, trust signals, clear service packaging, and a booking journey that converts high-intent visitors.',
    approach: [
      'Created SEO architecture for New Zealand tourism search intent',
      'Designed bilingual support for Chinese and English audiences',
      'Improved service positioning for premium chauffeur and travel experiences',
      'Optimized the booking flow for conversion and operational clarity',
    ],
    system: [
      {
        title: 'SEO architecture',
        body:
          'Structures pages around real search intent for tourism, chauffeur, and Auckland travel experiences.',
      },
      {
        title: 'Bilingual trust layer',
        body:
          'Supports Chinese-speaking customers while preserving premium English-market positioning.',
      },
      {
        title: 'Conversion workflow',
        body:
          'Guides visitors from service discovery into booking action with clearer packaging and reduced friction.',
      },
    ],
    outcomes: [
      'Increased booking conversions by 30%',
      'Increased organic traffic by 50%',
      'Created a stronger digital operation system for premium travel services',
    ],
    seoValue:
      'This case supports Magic Lab credibility in SEO/GEO, bilingual content systems, service business conversion, and New Zealand tourism operations.',
  },
];

export const caseStudiesBySlug = Object.fromEntries(
  caseStudies.map((caseStudy) => [caseStudy.slug, caseStudy]),
);
