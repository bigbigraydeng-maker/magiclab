'use client';

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';

type Language = 'zh' | 'en';
type Status = 'idle' | 'submitting' | 'success' | 'error';

const executionLanes = [
  {
    zh: ['SEO', '生成内容 → 自动发布到客户网站'],
    en: ['SEO', 'Generate content and publish it to client websites.'],
  },
  {
    zh: ['AI 可见度 (GEO)', '构建 AI 推荐信号 → 注入网站'],
    en: ['AI Visibility (GEO)', 'Build AI recommendation signals and inject them into the website.'],
  },
  {
    zh: ['社交媒体', '创作 → 全平台一键发布'],
    en: ['Social Media', 'Create once, publish across channels.'],
  },
  {
    zh: ['付费广告', '诊断 → 自动修复'],
    en: ['Paid Ads', 'Diagnose performance issues and trigger repairs.'],
  },
  {
    zh: ['口碑声誉', '监控评价 → 自动回复'],
    en: ['Reputation', 'Monitor reviews and automate response workflows.'],
  },
  {
    zh: ['竞品情报', '侦测对手 → 触发反制'],
    en: ['Competitor Intelligence', 'Detect competitor moves and trigger counter-actions.'],
  },
];

const marketRows = [
  ['Australia + New Zealand', '~100k businesses', '$600M SAM'],
  ['Southeast Asia', '~1M businesses', '$6B SAM'],
  ['Middle East', '~500k businesses', '$3B SAM'],
];

const traction = [
  {
    zh: '平台已在生产环境运行',
    en: 'Platform already running in production',
  },
  {
    zh: '首位企业客户：CTS Tours（新西兰高端旅游）',
    en: 'First enterprise client: CTS Tours, premium travel in New Zealand',
  },
  {
    zh: '核心模块：SEO / GEO / 社媒 / AI 追踪 / 广告诊断',
    en: 'Core modules: SEO, GEO, social media, AI tracking, ad diagnostics',
  },
  {
    zh: '独家飞轮归因系统已运行',
    en: 'Proprietary flywheel attribution system is live',
  },
  {
    zh: '路线图：网站连接器 / 口碑引擎 / 竞情智能',
    en: 'Roadmap: website connector, reputation engine, competitive intelligence',
  },
];

const interestOptions = {
  zh: [
    '登记为潜在投资人',
    '想看一次产品演示',
    '想约创始人聊一聊',
    '寻找合作 / BD 机会',
    '其他',
  ],
  en: [
    'Register as a potential investor',
    'Request a product demo',
    'Speak with the founder',
    'Explore partnership / BD',
    'Other',
  ],
};

const copy = {
  zh: {
    badge: 'AI 执行引擎 · 澳新 / 东南亚 / 中东中小企业赛道',
    title: 'Magic Engine 魔法引擎',
    subtitle: '为中小企业打造的 AI 数字执行引擎',
    intro:
      'Magic Engine 不是又一个数字营销工具。它不只扫描、分析、建议，而是真正替企业执行 SEO、AI 可见度、社交媒体、广告、口碑和竞品情报。',
    cta: '登记 / 预约演示',
    secondary: '查看六大执行维度',
    problemTitle: '问题',
    problemKicker: 'The Problem',
    problem:
      '中小企业每年花数千美元买数字营销工具，工具只告诉他们“该做什么”，不告诉他们“该怎么做”。SEO 报告无人阅读、AI 可见度漏洞无人修复、竞争对手的动作无人回应。普通中小企业同时在用 6+ 个互不相通的平台，依然跑不赢竞争。',
    lanesTitle: '六大维度同时执行',
    lanesIntro:
      '一个平台，六条战线，全部交付执行。Magic Engine 把建议变成工作流，把数据变成动作。',
    modelTitle: '商业模式',
    freeTitle: '免费层',
    freeCopy:
      '自动化审计报告。任何企业或竞争对手都可生成。无门槛、无销售电话，为规模化获取数据而设计。',
    vipTitle: 'VIP 层',
    vipCopy:
      '主推 $2,500–$3,000 / 月。派驻专属 FDE 工程师，嵌入客户运营，全权代管六大维度。不是订阅服务，是一支 AI 驱动的外部数字团队。',
    marketTitle: '市场机会',
    marketIntro: '服务可获市场总计 $9.6B+，从澳新切入，再复制到东南亚和中东。',
    moatTitle: '扩展护城河',
    moat:
      '核心 AI 引擎是一块通用接线板。进入新市场只需接入本地数据源并组建本地 BD 团队。每位客户都贡献独家的“行业 × 平台 × AI 可见度归因”数据集，客户越多越精准，竞争对手买不到。',
    whyTitle: '为什么是现在',
    why: [
      ['AI 搜索正取代 Google', '企业没有 GEO 可见度方法论，Magic Engine 是第一个搭出来的执行系统。'],
      ['中小企业养不起团队', '但出得起 $2,500/月，换一整支全托管 AI 团队。'],
      ['澳新市场没人占', '没有平台用本地数据吃下这块，先发者赢数据护城河。'],
    ],
    tractionTitle: '当前进展',
    comparableTitle: '同赛道市场对标',
    comparable:
      '同赛道的中小企业数字执行平台，已经通过公开融资与并购新闻给市场定了价位参考。此处只作为对标参考，不代表 Magic Engine 自身估值。',
    formTitle: '让我们保持联系',
    formIntro:
      '我们目前不在融资窗口。但未来 12 个月内会启动种子轮。如果你对这个赛道感兴趣，欢迎登记为潜在投资人，到时候第一时间同步。',
    name: '姓名',
    email: '邮箱',
    company: '机构 / 公司',
    interest: '方向',
    message: '留言',
    submit: '提交到 Magic Lab',
    success:
      '已收到，谢谢！我们会在融资启动时第一时间同步给您。也可以邮件直达 bigbigraydeng@gmail.com。',
    error: '提交失败。请稍后重试，或直接邮件联系 bigbigraydeng@gmail.com。',
    footer: 'Magic Engine · 创立于 2025 年 · 奥克兰 / 悉尼',
  },
  en: {
    badge: 'AI execution engine · ANZ / Southeast Asia / Middle East SMB market',
    title: 'Magic Engine',
    subtitle: 'An AI digital execution engine built for small and mid-sized businesses.',
    intro:
      'Magic Engine is not another marketing dashboard. It does not stop at scanning, analysing, or recommending. It executes SEO, AI visibility, social, paid media, reputation, and competitor intelligence for operators.',
    cta: 'Register / Request demo',
    secondary: 'Explore execution lanes',
    problemTitle: 'The Problem',
    problemKicker: 'Problem',
    problem:
      'SMBs spend thousands of dollars every year on digital marketing tools. Those tools tell them what to do, but not how to do it. SEO reports go unread, AI visibility gaps stay unfixed, and competitor moves go unanswered. A typical SMB uses 6+ disconnected platforms and still cannot move fast enough.',
    lanesTitle: 'Six execution lanes, one engine',
    lanesIntro:
      'One platform, six fronts, all delivered as execution. Magic Engine turns recommendations into workflows and data into action.',
    modelTitle: 'Business Model',
    freeTitle: 'Free Layer',
    freeCopy:
      'Automated audit reports for any business or competitor. No gate, no sales call, designed for scaled market data acquisition.',
    vipTitle: 'VIP Layer',
    vipCopy:
      'Core offer at $2,500–$3,000 per month. A dedicated FDE is embedded into the client operation and manages all six dimensions. This is not a subscription. It is an AI-powered external digital team.',
    marketTitle: 'Market Opportunity',
    marketIntro: 'A $9.6B+ serviceable market, starting in ANZ and expanding into Southeast Asia and the Middle East.',
    moatTitle: 'The Moat',
    moat:
      'The core AI engine is a universal switchboard. To enter a new market, we connect local data sources and build a local BD team. Every client contributes a proprietary “industry × platform × AI visibility attribution” dataset. The more customers we serve, the more precise the engine becomes.',
    whyTitle: 'Why Now',
    why: [
      ['AI search is replacing Google', 'Businesses lack a GEO visibility methodology. Magic Engine turns it into an execution system.'],
      ['SMBs cannot hire full teams', 'But they can afford $2,500/month for a fully managed AI execution team.'],
      ['ANZ is still open', 'No platform has captured the category with local data. The first mover earns the data moat.'],
    ],
    tractionTitle: 'Traction',
    comparableTitle: 'Market Comparables',
    comparable:
      'Comparable SMB digital execution platforms have already set market reference points through public financing and acquisition news. These references are for category context only and do not imply Magic Engine valuation.',
    formTitle: 'Keep in touch',
    formIntro:
      'We are not in an active fundraising window today. Over the next 12 months, we expect to open a seed round. If this category is interesting to you, register now and we will keep you in the first update group.',
    name: 'Name',
    email: 'Email',
    company: 'Organisation / Company',
    interest: 'Interest',
    message: 'Message',
    submit: 'Send to Magic Lab',
    success:
      'Received, thank you. We will keep you updated when fundraising starts. You can also email bigbigraydeng@gmail.com directly.',
    error: 'Something went wrong. Please try again later or email bigbigraydeng@gmail.com directly.',
    footer: 'Magic Engine · Founded in 2025 · Auckland / Sydney',
  },
};

export default function MagicEngineLanding() {
  const [language, setLanguage] = useState<Language>('zh');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const t = copy[language];
  const options = interestOptions[language];

  const defaultInterest = useMemo(() => options[0], [options]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setError('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      language,
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      company: String(formData.get('company') || ''),
      interest: String(formData.get('interest') || defaultInterest),
      message: String(formData.get('message') || ''),
      website: String(formData.get('website') || ''),
    };

    try {
      const response = await fetch('/api/magic-engine-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
      setError(t.error);
    }
  }

  return (
    <>
      <section className="gradient-hero pt-32 pb-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid min-h-[660px] gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className="mb-7 flex flex-wrap items-center gap-3">
                <span className="tech-chip inline-flex items-center gap-3 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-silver">
                  <span className="h-2 w-2 rounded-full bg-aqua live-dot" />
                  {t.badge}
                </span>
                <div className="rounded-full border border-white/15 bg-white/[0.04] p-1">
                  {(['zh', 'en'] as Language[]).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setLanguage(item)}
                      className={`rounded-full px-4 py-2 text-xs font-black uppercase transition ${
                        language === item ? 'bg-white text-primary' : 'text-silver hover:text-white'
                      }`}
                    >
                      {item === 'zh' ? '中文' : 'English'}
                    </button>
                  ))}
                </div>
              </div>

              <h1 className="hero-title max-w-4xl text-5xl md:text-7xl xl:text-8xl leading-[0.9] text-white">
                {t.title}
              </h1>
              <p className="mt-6 text-2xl font-extrabold text-aqua">{t.subtitle}</p>
              <p className="mt-6 max-w-2xl text-base md:text-xl leading-8 text-silver/86">{t.intro}</p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a href="#magic-engine-interest" className="btn-primary rounded-full px-8 py-4 text-center font-bold">
                  {t.cta}
                </a>
                <a href="#execution-lanes" className="btn-secondary rounded-full px-8 py-4 text-center font-bold">
                  {t.secondary}
                </a>
              </div>
            </div>

            <div className="app-window rounded-[32px] p-5 md:p-7">
              <div className="relative z-10 rounded-[26px] border border-white/10 bg-primary/72 p-5 md:p-7">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#ff6b6b]" />
                    <span className="h-3 w-3 rounded-full bg-[#ffd166]" />
                    <span className="h-3 w-3 rounded-full bg-[#8fd7ff]" />
                  </div>
                  <span className="rounded-full border border-aqua/20 bg-aqua/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-aqua">
                    Live execution map
                  </span>
                </div>
                <div className="mt-7 grid gap-4">
                  {executionLanes.slice(0, 4).map((lane, index) => (
                    <div key={lane.en[0]} className="screen-card rounded-2xl p-5">
                      <div className="flex items-start justify-between gap-5">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.22em] text-aqua">
                            0{index + 1}
                          </p>
                          <h2 className="mt-2 text-xl font-extrabold text-white">{lane[language][0]}</h2>
                        </div>
                        <span className="h-2 w-20 rounded-full bg-gradient-to-r from-aqua to-white/5" />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-mist">{lane[language][1]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="brand-section py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div>
              <p className="section-kicker">{t.problemKicker}</p>
              <h2 className="modern-heading mt-4 text-4xl md:text-6xl leading-tight text-white">
                {t.problemTitle}
              </h2>
            </div>
            <p className="max-w-4xl text-xl leading-10 text-silver/88">{t.problem}</p>
          </div>
        </div>
      </section>

      <section id="execution-lanes" className="photo-section py-24">
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-12 max-w-3xl">
            <p className="section-kicker">Execution</p>
            <h2 className="modern-heading mt-4 text-4xl md:text-6xl leading-tight text-white">
              {t.lanesTitle}
            </h2>
            <p className="mt-6 text-base leading-8 text-mist">{t.lanesIntro}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {executionLanes.map((lane, index) => (
              <div key={lane.en[0]} className="app-window rounded-[26px] p-6">
                <div className="relative z-10">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-aqua">0{index + 1}</p>
                  <h3 className="mt-5 text-2xl font-extrabold text-white">{lane[language][0]}</h3>
                  <p className="mt-4 text-sm leading-7 text-mist">{lane[language][1]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-alt py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {[['Free', t.freeTitle, t.freeCopy], ['VIP', t.vipTitle, t.vipCopy]].map((card) => (
              <div key={card[0]} className="crystal-panel rounded-[30px] p-8 md:p-10">
                <div className="relative z-10">
                  <p className="section-kicker">{t.modelTitle}</p>
                  <h3 className="modern-heading mt-4 text-4xl text-white">{card[1]}</h3>
                  <p className="mt-5 text-base leading-8 text-silver/86">{card[2]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="brand-section py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
            <div>
              <p className="section-kicker">SAM</p>
              <h2 className="modern-heading mt-4 text-4xl md:text-6xl leading-tight text-white">
                {t.marketTitle}
              </h2>
              <p className="mt-6 text-base leading-8 text-mist">{t.marketIntro}</p>
            </div>
            <div className="grid gap-4">
              {marketRows.map((row) => (
                <div key={row[0]} className="screen-card grid gap-4 rounded-2xl p-5 text-white md:grid-cols-3">
                  <strong>{row[0]}</strong>
                  <span className="text-mist">{row[1]}</span>
                  <span className="font-black text-aqua">{row[2]}</span>
                </div>
              ))}
              <div className="rounded-3xl border border-aqua/20 bg-aqua/[0.08] p-6">
                <p className="text-4xl font-black text-white">$9.6B+</p>
                <p className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-aqua">Total serviceable market</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-photo py-24">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="app-window rounded-[30px] p-8 md:p-10">
              <div className="relative z-10">
                <p className="section-kicker">Moat</p>
                <h2 className="modern-heading mt-4 text-4xl md:text-5xl leading-tight text-white">
                  {t.moatTitle}
                </h2>
                <p className="mt-6 text-base leading-8 text-silver/88">{t.moat}</p>
              </div>
            </div>
            <div className="app-window rounded-[30px] p-8 md:p-10">
              <div className="relative z-10">
                <p className="section-kicker">Why Now</p>
                <h2 className="modern-heading mt-4 text-4xl md:text-5xl leading-tight text-white">
                  {t.whyTitle}
                </h2>
                <div className="mt-7 space-y-4">
                  {t.why.map((item, index) => (
                    <div key={item[0]} className="screen-card rounded-2xl p-5">
                      <p className="text-xs font-black text-aqua">0{index + 1}</p>
                      <h3 className="mt-2 text-xl font-extrabold text-white">{item[0]}</h3>
                      <p className="mt-2 text-sm leading-6 text-mist">{item[1]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="brand-section py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="section-kicker">Traction</p>
              <h2 className="modern-heading mt-4 text-4xl md:text-6xl leading-tight text-white">
                {t.tractionTitle}
              </h2>
              <div className="mt-8 space-y-4">
                {traction.map((item) => (
                  <div key={item.en} className="screen-card rounded-2xl px-5 py-4 font-bold text-white">
                    {item[language]}
                  </div>
                ))}
              </div>
            </div>
            <div className="crystal-panel rounded-[30px] p-8 md:p-10">
              <div className="relative z-10">
                <p className="section-kicker">Comparables</p>
                <h2 className="modern-heading mt-4 text-4xl md:text-5xl leading-tight text-white">
                  {t.comparableTitle}
                </h2>
                <p className="mt-6 text-base leading-8 text-silver/88">{t.comparable}</p>
                <Link href="/work" className="btn-secondary mt-8 inline-block rounded-full px-8 py-4 font-bold">
                  {language === 'zh' ? '查看 Magic Lab 产品生态' : 'View Magic Lab ecosystem'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="magic-engine-interest" className="section-alt py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
            <div>
              <p className="section-kicker">Keep in touch</p>
              <h2 className="modern-heading mt-4 text-4xl md:text-6xl leading-tight text-white">
                {t.formTitle}
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-mist">{t.formIntro}</p>
              <p className="mt-10 text-sm font-bold uppercase tracking-[0.2em] text-silver/70">
                {t.footer}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="app-window rounded-[30px] p-6 md:p-8">
              <div className="relative z-10 grid gap-5">
                <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-bold text-silver">
                    {t.name} *
                    <input
                      required
                      name="name"
                      className="rounded-2xl border border-white/15 bg-primary/75 px-4 py-4 text-white outline-none transition focus:border-aqua"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-silver">
                    {t.email} *
                    <input
                      required
                      type="email"
                      name="email"
                      className="rounded-2xl border border-white/15 bg-primary/75 px-4 py-4 text-white outline-none transition focus:border-aqua"
                    />
                  </label>
                </div>
                <label className="grid gap-2 text-sm font-bold text-silver">
                  {t.company}
                  <input
                    name="company"
                    className="rounded-2xl border border-white/15 bg-primary/75 px-4 py-4 text-white outline-none transition focus:border-aqua"
                  />
                </label>
                <label className="grid gap-2 text-sm font-bold text-silver">
                  {t.interest} *
                  <select
                    required
                    name="interest"
                    defaultValue={defaultInterest}
                    className="rounded-2xl border border-white/15 bg-primary/75 px-4 py-4 text-white outline-none transition focus:border-aqua"
                  >
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold text-silver">
                  {t.message}
                  <textarea
                    name="message"
                    rows={5}
                    className="rounded-2xl border border-white/15 bg-primary/75 px-4 py-4 text-white outline-none transition focus:border-aqua"
                  />
                </label>
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-primary rounded-full px-8 py-4 text-center font-bold disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'submitting' ? 'Sending...' : t.submit}
                </button>
                {status === 'success' && <p className="rounded-2xl bg-aqua/10 p-4 text-sm font-bold text-aqua">{t.success}</p>}
                {status === 'error' && <p className="rounded-2xl bg-red-500/10 p-4 text-sm font-bold text-red-200">{error}</p>}
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
