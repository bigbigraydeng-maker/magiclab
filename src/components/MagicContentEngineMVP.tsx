'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';

type SourceType = '邮件' | '图片/截图' | '音频/视频' | 'AI 对话' | 'Claude Code/Codex' | 'GitHub' | '其他';
type RiskLevel = '低' | '中' | '高';
type ToneMode = '创始人手记' | '专业复盘' | 'X短句' | '小红书日记';

type SourceItem = {
  id: string;
  type: SourceType;
  title: string;
  content: string;
  createdAt: string;
  imageDataUrl?: string;
  imageName?: string;
};

type Opportunity = {
  id: string;
  title: string;
  angle: string;
  sourceIds: string[];
  sourceNames: string[];
  sourceContent: string;
  sourceType: SourceType;
  platforms: string[];
  risk: RiskLevel;
  privacyNote: string;
};

type Draft = {
  id: string;
  platform: string;
  title: string;
  body: string;
  sourceName: string;
  risk: RiskLevel;
};

type ContentPack = {
  opportunities: Opportunity[];
  drafts: Draft[];
  generatedAt: string;
};

type ContentDna = {
  voice: string;
  pillars: string;
  privacy: string;
  learning: string[];
};

type FormState = {
  type: SourceType;
  title: string;
  content: string;
  imageDataUrl: string;
  imageName: string;
};

const sourceTypes: SourceType[] = ['邮件', '图片/截图', '音频/视频', 'AI 对话', 'Claude Code/Codex', 'GitHub', '其他'];
const toneModes: ToneMode[] = ['创始人手记', '专业复盘', 'X短句', '小红书日记'];

const platformRules = [
  {
    name: '小红书',
    weekly: '2 篇',
    role: '生活化、图文感、真实故事、情绪共鸣',
  },
  {
    name: 'LinkedIn',
    weekly: '2 条',
    role: '专业观点、创始人思考、产品和商业判断',
  },
  {
    name: 'Threads',
    weekly: '3-5 条',
    role: '短观点、连续想法、轻讨论',
  },
  {
    name: 'X',
    weekly: '3-5 条',
    role: 'sharp 观察、build in public、单点表达',
  },
  {
    name: 'Facebook',
    weekly: '2 条',
    role: '个人状态、关系型表达、真实近况',
  },
  {
    name: 'Instagram',
    weekly: '2-3 条',
    role: '图片优先、短 caption、轻反思',
  },
];

const defaultDna: ContentDna = {
  voice: '真实、直接、有 founder 视角。避免太营销、太鸡汤、太像 AI。',
  pillars: 'AI 自动化、Magic Engine、个人品牌、builder 过程、数字员工、真实生活素材。',
  privacy: '客户名、家庭细节、具体商业数据、私人照片和敏感对话默认不进入可发布文案。',
  learning: ['偏好从真实事件切入，再提炼产品或商业洞察。'],
};

const sampleSources: SourceItem[] = [
  {
    id: 'sample-ai',
    type: 'AI 对话',
    title: 'AI 应该像长期员工一样学习用户',
    content:
      '今天讨论 Magic Content Engine 时，我意识到很多 AI 工具的问题是太依赖用户主动投喂。真正有价值的是系统能从邮件、相册、代码记录和对话里自动发现内容机会，并且越来越懂一个人。',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-code',
    type: 'Claude Code/Codex',
    title: '从 PRD 到 MVP 的产品取舍',
    content:
      '今晚决定先做一个手动 Magic Inbox，而不是一开始接所有 connector。原因是最重要的验证不是技术连接，而是它能否从真实素材里提炼出用户愿意发布的内容。',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-email',
    type: '邮件',
    title: '客户真正需要的是执行，不只是建议',
    content:
      '邮件里反复出现一个信号：客户不是缺工具，而是缺持续执行。Magic Engine 的机会是把数据、内容、SEO、社媒和反馈变成一个可以运转的执行系统。',
    createdAt: new Date().toISOString(),
  },
];

const emptyForm: FormState = {
  type: 'AI 对话',
  title: '',
  content: '',
  imageDataUrl: '',
  imageName: '',
};

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function detectRisk(content: string): RiskLevel {
  const highRiskWords = ['电话', '地址', '孩子', '护照', '合同', '银行', '医疗', '身份证', '报价', '机密'];
  const mediumRiskWords = ['客户', '公司名', '项目金额', '家庭', '私信', '邮件', '会议'];

  if (highRiskWords.some((word) => content.includes(word))) {
    return '高';
  }

  if (mediumRiskWords.some((word) => content.includes(word))) {
    return '中';
  }

  return '低';
}

function privacyNoteFor(risk: RiskLevel) {
  if (risk === '高') {
    return '包含潜在敏感信息，发布前必须匿名化并人工确认。';
  }

  if (risk === '中') {
    return '可能涉及工作或私人上下文，建议去掉具体名字和可识别细节。';
  }

  return '暂未发现明显敏感信息，仍建议发布前快速检查。';
}

function platformsForType(type: SourceType) {
  if (type === '图片/截图' || type === '音频/视频') {
    return ['小红书', 'Instagram', 'Facebook'];
  }

  if (type === 'Claude Code/Codex' || type === 'GitHub') {
    return ['LinkedIn', 'X', 'Threads'];
  }

  if (type === '邮件') {
    return ['LinkedIn', 'Facebook', '小红书'];
  }

  return ['LinkedIn', 'Threads', 'X'];
}

function trimText(text: string, length: number) {
  const compact = text.replace(/\s+/g, ' ').trim();
  return compact.length > length ? `${compact.slice(0, length)}...` : compact;
}

function extractStructuredLine(text: string, label: string) {
  const match = text.match(new RegExp(`^${label}：(.+)$`, 'm'));
  return match?.[1]?.trim() || '';
}

function sourceDetailsFromOpportunity(opportunity: Opportunity) {
  const type = extractStructuredLine(opportunity.sourceContent, '类型');
  const detail = extractStructuredLine(opportunity.sourceContent, '展开');
  const platforms = extractStructuredLine(opportunity.sourceContent, '适合平台');
  const risk = extractStructuredLine(opportunity.sourceContent, '隐私风险');
  const fallback = opportunity.angle.replace(/^把这段 builder 过程转成一个产品判断：/, '').replace(/^从.+：/, '');

  return {
    hook: opportunity.title.replace(/[。.]$/, ''),
    type: type || opportunity.sourceType,
    detail: detail || fallback,
    platforms,
    risk,
  };
}

function toneInstruction(toneMode: ToneMode) {
  if (toneMode === '专业复盘') {
    return '写法要求：清楚、克制、像创始人做产品复盘，不要口号。';
  }

  if (toneMode === 'X短句') {
    return '写法要求：句子短一点，只保留一个判断，不铺垫。';
  }

  if (toneMode === '小红书日记') {
    return '写法要求：像当天真实记录，先讲发生了什么，再讲感受。';
  }

  return '写法要求：像创始人手记，有具体取舍，有一点个人判断。';
}

function extractFrontmatterValue(markdown: string, key: string) {
  const match = markdown.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return match?.[1]?.trim() || '';
}

function extractDailyLogField(block: string, label: string) {
  const pattern = new RegExp(`-\\s*\\*\\*${label}\\*\\*\\s*[：:]\\s*([\\s\\S]*?)(?=\\n-\\s*\\*\\*|\\n###\\s*素材|$)`);
  return block.match(pattern)?.[1]?.trim() || '';
}

function parseClaudeDailyLog(markdown: string): SourceItem[] {
  const ready = extractFrontmatterValue(markdown, 'content_ready');
  if (ready && ready !== 'true') {
    return [];
  }

  const project = extractFrontmatterValue(markdown, 'project') || '未知项目';
  const date = extractFrontmatterValue(markdown, 'date') || new Date().toISOString().slice(0, 10);
  const sectionMatch = markdown.match(/##\s*5[.、]?\s*可以转成内容的素材([\s\S]*?)(?=\n##\s*6[.、]?\s*不能公开的内容|$)/);
  const contentSection = sectionMatch?.[1] || '';
  const blocks = contentSection
    .split(/(?=###\s*素材\s*\d+)/)
    .map((block) => block.trim())
    .filter((block) => block.includes('**一句话钩子**') || block.includes('**展开说明**'));

  return blocks.map((block, index) => {
    const type = extractDailyLogField(block, '类型') || 'builder 过程';
    const hook = extractDailyLogField(block, '一句话钩子') || `Claude 日报素材 ${index + 1}`;
    const detail = extractDailyLogField(block, '展开说明');
    const platforms = extractDailyLogField(block, '适合平台');
    const risk = extractDailyLogField(block, '隐私风险') || '未标注';

    return {
      id: createId('claude-log'),
      type: 'Claude Code/Codex',
      title: hook.replace(/[。.]$/, ''),
      content: [`项目：${project}`, `日期：${date}`, `类型：${type}`, `展开：${detail}`, `适合平台：${platforms}`, `隐私风险：${risk}`]
        .filter(Boolean)
        .join('\n'),
      createdAt: new Date().toISOString(),
    };
  });
}

function titleFromSource(source: SourceItem) {
  if (source.title.trim()) {
    return source.title.trim();
  }

  if (source.imageName) {
    return `图片素材：${source.imageName}`;
  }

  return trimText(source.content, 24) || '一个值得发布的真实观察';
}

function angleFromSource(source: SourceItem) {
  const structuredDetail = extractStructuredLine(source.content, '展开');
  if (structuredDetail) {
    return structuredDetail;
  }

  const base = trimText(source.content, 90);

  if (source.type === 'Claude Code/Codex' || source.type === 'GitHub') {
    return `今天的 builder 记录里有一个具体取舍：${base}`;
  }

  if (source.type === '邮件') {
    return `从沟通里提炼客户需求或市场洞察：${base}`;
  }

  if (source.type === '图片/截图' || source.type === '音频/视频') {
    return `从真实场景切入，再提炼一个可以共鸣的观点：${base || source.imageName || '这张图片记录了一个值得展开的瞬间'}`;
  }

  return `从真实想法切入，提炼一个可以公开表达的观点：${base}`;
}

function draftForPlatform(platform: string, opportunity: Opportunity, dna: ContentDna, toneMode: ToneMode) {
  const source = opportunity.sourceNames[0] || '本周素材';
  const details = sourceDetailsFromOpportunity(opportunity);
  const detail = trimText(details.detail, platform === 'LinkedIn' ? 280 : 190);
  const plainHook = details.hook;
  const privacyLine = details.risk ? `隐私标记：${details.risk}` : `隐私标记：${opportunity.risk}`;
  const voiceNote = dna.voice.includes('真实') ? '我尽量保留原始判断，不把它包装成金句。' : '';
  const toneLine = toneInstruction(toneMode);

  if (toneMode === 'X短句') {
    return `${plainHook}\n\n${trimText(detail, 120)}\n\n${platform === 'LinkedIn' ? '这个点不大，但很真实。' : '小决定，也会慢慢拉开产品差距。'}`;
  }

  if (platform === '小红书') {
    const opening = toneMode === '小红书日记' ? '今天收工前想记一个小片段。' : `今天这个点我想先记下来：${plainHook}`;
    return `${opening}\n\n不是那种想了很久的“大观点”，就是今天做东西时碰到的一个真实取舍。\n\n${detail}\n\n这种内容我反而觉得值得发。因为它不是先想一个标题，再去找例子；而是今天真的做了、卡了、取舍了，然后自然长出来一个判断。\n\n来源：${source}\n${privacyLine}`;
  }

  if (platform === 'LinkedIn') {
    return `今天做 ${source} 时，有一个小决定让我停了一下：\n\n${plainHook}\n\n背景是这样：${detail}\n\n这类细节通常不会出现在产品介绍里，但它很影响产品最后像不像一个能交付的系统。\n\n我现在对 AI 产品的判断也越来越偏向这一点：少一点“看起来很聪明”的演示，多一点能进入真实工作流的闭环。\n\n${voiceNote}\n${toneLine}`;
  }

  if (platform === 'Threads') {
    return `今天的一个 build note：\n\n${plainHook}\n\n${detail}\n\n我喜欢这种素材，因为它不是观点先行，而是从一次具体取舍里长出来的。`;
  }

  if (platform === 'X') {
    return `${plainHook}\n\n${trimText(detail, 120)}\n\n很多产品差距，其实就藏在这种“不太显眼但不能省”的地方。`;
  }

  if (platform === 'Facebook') {
    return `今天收工前留个记录。\n\n${plainHook}\n\n${detail}\n\n这类东西平时很容易被当成“只是工程细节”，但我越来越觉得，真正的产品感就是从这些细节里磨出来的。`;
  }

  return `${plainHook}\n\n${trimText(detail, 150)}\n\n今天的一个真实 build 片段。\n\n#MagicEngine #AI自动化 #BuildInPublic`;
}

function buildPack(sources: SourceItem[], dna: ContentDna, toneMode: ToneMode): ContentPack {
  const selectedSources = sources.length > 0 ? sources.slice(0, 3) : sampleSources;
  const opportunities = selectedSources.map((source) => {
    const risk = detectRisk(source.content);

    return {
      id: createId('opp'),
      title: titleFromSource(source),
      angle: angleFromSource(source),
      sourceIds: [source.id],
      sourceNames: [source.title || source.type],
      sourceContent: source.content,
      sourceType: source.type,
      platforms: platformsForType(source.type),
      risk,
      privacyNote: privacyNoteFor(risk),
    };
  });

  const drafts = platformRules.map((platform, index) => {
    const opportunity =
      opportunities.find((item) => item.platforms.includes(platform.name)) || opportunities[index % opportunities.length];

    return {
      id: createId('draft'),
      platform: platform.name,
      title: `${platform.name}｜${opportunity.title}`,
      body: draftForPlatform(platform.name, opportunity, dna, toneMode),
      sourceName: opportunity.sourceNames.join(' + '),
      risk: opportunity.risk,
    };
  });

  return {
    opportunities,
    drafts,
    generatedAt: new Date().toISOString(),
  };
}

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function MagicContentEngineMVP() {
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [dna, setDna] = useState<ContentDna>(defaultDna);
  const [pack, setPack] = useState<ContentPack | null>(null);
  const [copiedId, setCopiedId] = useState('');
  const [toneMode, setToneMode] = useState<ToneMode>('创始人手记');
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setSources(readStorage<SourceItem[]>('magic-content-engine:sources', []));
    setDna(readStorage<ContentDna>('magic-content-engine:dna', defaultDna));
    setPack(readStorage<ContentPack | null>('magic-content-engine:pack', null));
    setToneMode(readStorage<ToneMode>('magic-content-engine:tone-mode', '创始人手记'));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    window.localStorage.setItem('magic-content-engine:sources', JSON.stringify(sources));
    window.localStorage.setItem('magic-content-engine:dna', JSON.stringify(dna));
    window.localStorage.setItem('magic-content-engine:pack', JSON.stringify(pack));
    window.localStorage.setItem('magic-content-engine:tone-mode', JSON.stringify(toneMode));
  }, [dna, loaded, pack, sources, toneMode]);

  const weeklyStats = useMemo(() => {
    const highRisk = pack?.drafts.filter((draft) => draft.risk === '高').length || 0;

    return [
      ['素材', `${sources.length} 条`],
      ['草稿', `${pack?.drafts.length || 0} 条`],
      ['高风险', `${highRisk} 条`],
    ];
  }, [pack, sources.length]);

  function addSource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim() && !form.content.trim() && !form.imageDataUrl) {
      return;
    }

    if (form.content.includes('content_ready:') && form.content.includes('## 5. 可以转成内容的素材')) {
      const importedSources = parseClaudeDailyLog(form.content);
      if (importedSources.length === 0) {
        window.alert('没有解析到可用素材。请确认日报里 content_ready: true，并且第 5 节包含结构化素材卡。');
        return;
      }

      setSources(importedSources);
      setPack(buildPack(importedSources, dna, toneMode));
      setForm(emptyForm);
      return;
    }

    const nextSource: SourceItem = {
      id: createId('source'),
      type: form.type,
      title: form.title.trim() || form.imageName || `${form.type}素材`,
      content: form.content.trim() || (form.imageName ? `图片文件：${form.imageName}` : ''),
      createdAt: new Date().toISOString(),
      imageDataUrl: form.imageDataUrl || undefined,
      imageName: form.imageName || undefined,
    };

    const nextSources = [nextSource, ...sources];
    setSources(nextSources);
    setPack(buildPack(nextSources, dna, toneMode));
    setForm(emptyForm);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  }

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      window.alert('请上传图片或截图文件。');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        type: '图片/截图',
        title: current.title || file.name.replace(/\.[^.]+$/, ''),
        imageDataUrl: String(reader.result || ''),
        imageName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  }

  function removeFormImage() {
    setForm((current) => ({ ...current, imageDataUrl: '', imageName: '' }));
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  }

  function generatePack() {
    const nextPack = buildPack(sources, dna, toneMode);
    setPack(nextPack);
  }

  function loadSamples() {
    setSources(sampleSources);
    setPack(buildPack(sampleSources, dna, toneMode));
  }

  function importClaudeDailyLog(options: { replace: boolean }) {
    if (!form.content.trim()) {
      window.alert('请先把 Claude Code / Codex 日报全文粘贴到“内容”输入框。');
      return;
    }

    const importedSources = parseClaudeDailyLog(form.content);
    if (importedSources.length === 0) {
      window.alert('没有解析到可用素材。请确认日报里 content_ready: true，并且第 5 节包含结构化素材卡。');
      return;
    }

    setSources((current) => (options.replace ? importedSources : [...importedSources, ...current]));
    if (options.replace) {
      setPack(null);
    }
    setForm(emptyForm);
  }

  function clearWorkspace() {
    if (!window.confirm('确定清空本地素材和生成结果吗？')) {
      return;
    }

    setSources([]);
    setPack(null);
    setCopiedId('');
  }

  function recordFeedback(draft: Draft, feedback: string) {
    const note = `${draft.platform}：${feedback}｜${draft.title}`;
    setDna((current) => ({
      ...current,
      learning: [note, ...current.learning].slice(0, 6),
    }));
  }

  async function copyDraft(draft: Draft) {
    await navigator.clipboard.writeText(`${draft.title}\n\n${draft.body}`);
    setCopiedId(draft.id);
    window.setTimeout(() => setCopiedId(''), 1600);
  }

  return (
    <div className="min-h-screen bg-[#07111d] pt-24 text-silver">
      <section className="border-b border-white/10 px-4 py-10">
        <div className="container mx-auto">
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
            <div>
              <p className="section-kicker">最小版本 v0.1</p>
              <h1 className="hero-title mt-4 max-w-4xl text-4xl leading-tight text-white md:text-6xl">
                Magic Content Engine
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-mist">
                把真实素材放进 Magic Inbox，一键生成每周中文社媒内容包。当前版本先在浏览器本地运行，不自动发布。
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {weeklyStats.map(([label, value]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-aqua">{label}</p>
                  <p className="mt-3 text-2xl font-black text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid border-b border-white/10 lg:grid-cols-[420px_1fr]">
        <aside className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r lg:p-7">
          <div className="sticky top-24">
            <p className="section-kicker">素材入口</p>
            <h2 className="modern-heading mt-3 text-3xl text-white">把素材发给我</h2>
            <p className="mt-3 text-sm leading-7 text-mist">
              你只需要上传图片、截图，或粘贴 Claude 日报、邮件片段、想法记录。解析、分类、生成草稿这些后台会自动处理。
            </p>

            <form onSubmit={addSource} className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-bold text-silver">
                图片 / 截图
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="rounded-lg border border-white/15 bg-[#0b1826] px-4 py-3 text-white file:mr-4 file:rounded-md file:border-0 file:bg-aqua file:px-3 file:py-2 file:text-sm file:font-bold file:text-[#07111d]"
                />
              </label>

              {form.imageDataUrl && (
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.imageDataUrl}
                    alt={form.imageName || '上传的图片素材'}
                    className="max-h-48 w-full rounded-md object-cover"
                  />
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="truncate text-xs text-mist">{form.imageName}</p>
                    <button type="button" onClick={removeFormImage} className="text-xs font-bold text-aqua">
                      移除
                    </button>
                  </div>
                </div>
              )}

              <label className="grid gap-2 text-sm font-bold text-silver">
                内容 / 场景说明
                <textarea
                  value={form.content}
                  onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
                  placeholder="粘贴邮件片段、语音转文字、代码记录、GitHub 摘要；如果是图片，请写：发生了什么、想表达什么、哪些人名/客户名不能公开..."
                  rows={9}
                  className="resize-none rounded-lg border border-white/15 bg-[#0b1826] px-4 py-3 text-white outline-none placeholder:text-mist/45 focus:border-aqua"
                />
              </label>

              <button type="submit" className="btn-primary rounded-lg px-5 py-4 text-sm font-black">
                交给内容员工处理
              </button>

              <details className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <summary className="cursor-pointer text-sm font-black text-silver">高级输入</summary>
                <div className="mt-4 grid gap-4">
                  <label className="grid gap-2 text-sm font-bold text-silver">
                    素材类型
                    <select
                      value={form.type}
                      onChange={(event) => setForm((current) => ({ ...current, type: event.target.value as SourceType }))}
                      className="rounded-lg border border-white/15 bg-[#0b1826] px-4 py-3 text-white outline-none focus:border-aqua"
                    >
                      {sourceTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm font-bold text-silver">
                    标题
                    <input
                      value={form.title}
                      onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                      placeholder="可选：这条素材的标题"
                      className="rounded-lg border border-white/15 bg-[#0b1826] px-4 py-3 text-white outline-none placeholder:text-mist/45 focus:border-aqua"
                    />
                  </label>
                </div>
              </details>
            </form>

            <details className="mt-5 rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <summary className="cursor-pointer text-sm font-black text-white">高级设置</summary>
              <div className="mt-4 grid gap-4">
                <div>
                  <p className="text-sm font-black text-white">口吻模式</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {toneModes.map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setToneMode(mode)}
                        className={`rounded-md border px-3 py-2 text-xs font-bold transition ${
                          toneMode === mode
                            ? 'border-aqua bg-aqua text-[#07111d]'
                            : 'border-white/10 bg-[#07111d] text-silver hover:border-aqua hover:text-white'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={loadSamples} className="btn-secondary rounded-lg px-4 py-3 text-sm font-bold">
                    载入示例
                  </button>
                  <button type="button" onClick={clearWorkspace} className="btn-secondary rounded-lg px-4 py-3 text-sm font-bold">
                    清空本地
                  </button>
                </div>

                <button type="button" onClick={generatePack} className="rounded-lg border border-aqua/30 bg-aqua/10 px-5 py-3 text-sm font-black text-aqua">
                  重新生成内容包
                </button>
              </div>
            </details>
          </div>
        </aside>

        <div className="p-5 lg:p-7">
          <div className="grid gap-5">
            <section>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="section-kicker">后台处理</p>
                  <h2 className="modern-heading mt-3 text-3xl text-white">内容员工状态</h2>
                </div>
                <p className="text-sm leading-6 text-mist">素材会先暂存在当前浏览器。你只负责给素材和确认内容。</p>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-aqua">已接收</p>
                  <p className="mt-3 text-2xl font-black text-white">{sources.length} 条素材</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-aqua">已生成</p>
                  <p className="mt-3 text-2xl font-black text-white">{pack?.drafts.length || 0} 条草稿</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-aqua">默认口吻</p>
                  <p className="mt-3 text-2xl font-black text-white">{toneMode}</p>
                </div>
              </div>

              <details className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <summary className="cursor-pointer text-sm font-black text-silver">查看后台素材和学习记录</summary>
                <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_360px]">
                  <div className="grid gap-3">
                    {sources.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-white/20 bg-white/[0.03] p-6 text-sm leading-7 text-mist">
                        还没有素材。先发图片、截图、日报、邮件片段或想法记录。
                      </div>
                    ) : (
                      sources.map((source) => (
                        <article key={source.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <span className="rounded-md border border-aqua/20 bg-aqua/10 px-2 py-1 text-xs font-bold text-aqua">
                                {source.type}
                              </span>
                              <h3 className="mt-3 text-lg font-black text-white">{source.title}</h3>
                            </div>
                            <span className="text-xs text-mist">{new Date(source.createdAt).toLocaleString('zh-CN')}</span>
                          </div>
                          {source.imageDataUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={source.imageDataUrl}
                              alt={source.title}
                              className="mt-4 max-h-56 w-full rounded-md border border-white/10 object-cover"
                            />
                          )}
                          <p className="mt-3 text-sm leading-7 text-mist">{trimText(source.content, 220)}</p>
                        </article>
                      ))
                    )}
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                    <p className="section-kicker">内容画像</p>
                    <h2 className="modern-heading mt-3 text-2xl text-white">用户模型</h2>
                    <div className="mt-5 grid gap-4">
                      <label className="grid gap-2 text-sm font-bold text-silver">
                        语气
                        <textarea
                          value={dna.voice}
                          onChange={(event) => setDna((current) => ({ ...current, voice: event.target.value }))}
                          rows={3}
                          className="resize-none rounded-lg border border-white/15 bg-[#0b1826] px-4 py-3 text-white outline-none focus:border-aqua"
                        />
                      </label>
                      <label className="grid gap-2 text-sm font-bold text-silver">
                        内容支柱
                        <textarea
                          value={dna.pillars}
                          onChange={(event) => setDna((current) => ({ ...current, pillars: event.target.value }))}
                          rows={3}
                          className="resize-none rounded-lg border border-white/15 bg-[#0b1826] px-4 py-3 text-white outline-none focus:border-aqua"
                        />
                      </label>
                      <label className="grid gap-2 text-sm font-bold text-silver">
                        隐私边界
                        <textarea
                          value={dna.privacy}
                          onChange={(event) => setDna((current) => ({ ...current, privacy: event.target.value }))}
                          rows={3}
                          className="resize-none rounded-lg border border-white/15 bg-[#0b1826] px-4 py-3 text-white outline-none focus:border-aqua"
                        />
                      </label>
                    </div>
                    <div className="mt-5">
                      <p className="text-sm font-black text-white">最近学习到</p>
                      <div className="mt-3 grid gap-2">
                        {dna.learning.map((item) => (
                          <p key={item} className="rounded-md bg-[#07111d] p-3 text-xs leading-6 text-mist">
                            {item}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            </section>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-10">
        <div className="container mx-auto">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="section-kicker">每周内容包</p>
              <h2 className="modern-heading mt-3 text-3xl text-white">本周内容机会</h2>
            </div>
            {pack && <p className="text-sm text-mist">生成时间：{new Date(pack.generatedAt).toLocaleString('zh-CN')}</p>}
          </div>

          {!pack ? (
            <div className="rounded-lg border border-dashed border-white/20 bg-white/[0.03] p-6 text-sm leading-7 text-mist">
              点击“生成本周内容包”后，这里会出现内容机会、来源追踪、平台建议和隐私风险。
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-3">
              {pack.opportunities.map((item) => (
                <article key={item.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-black leading-7 text-white">{item.title}</h3>
                    <span className="rounded-md border border-aqua/20 bg-aqua/10 px-2 py-1 text-xs font-bold text-aqua">
                      {item.risk}风险
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-mist">{item.angle}</p>
                  <div className="mt-5 space-y-3 text-sm">
                    <div>
                      <p className="font-bold text-white">来源</p>
                      <p className="mt-1 text-mist">{item.sourceNames.join(' + ')}</p>
                    </div>
                    <div>
                      <p className="font-bold text-white">适合平台</p>
                      <p className="mt-1 text-mist">{item.platforms.join('、')}</p>
                    </div>
                    <div>
                      <p className="font-bold text-white">隐私提醒</p>
                      <p className="mt-1 text-mist">{item.privacyNote}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="container mx-auto">
          <div className="mb-6">
            <p className="section-kicker">平台草稿</p>
            <h2 className="modern-heading mt-3 text-3xl text-white">平台草稿</h2>
          </div>

          {!pack ? (
            <div className="rounded-lg border border-dashed border-white/20 bg-white/[0.03] p-6 text-sm leading-7 text-mist">
              生成后会出现小红书、LinkedIn、Threads、X、Facebook、Instagram 的中文草稿。
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {pack.drafts.map((draft) => (
                <article key={draft.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className="rounded-md border border-aqua/20 bg-aqua/10 px-2 py-1 text-xs font-bold text-aqua">
                        {draft.platform}
                      </span>
                      <h3 className="mt-3 text-xl font-black text-white">{draft.title}</h3>
                    </div>
                    <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-bold text-mist">{draft.risk}风险</span>
                  </div>

                  <p className="mt-4 whitespace-pre-line text-sm leading-7 text-silver">{draft.body}</p>

                  <div className="mt-5 rounded-md bg-[#07111d] p-3 text-xs leading-6 text-mist">
                    来源追踪：{draft.sourceName}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {['采用', '不像我', '太 AI', '更个人', '更专业'].map((label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => recordFeedback(draft, label)}
                        className="rounded-md border border-white/10 px-3 py-2 text-xs font-bold text-silver transition hover:border-aqua hover:text-white"
                      >
                        {label}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => copyDraft(draft)}
                      className="rounded-md border border-aqua/20 bg-aqua/10 px-3 py-2 text-xs font-bold text-aqua"
                    >
                      {copiedId === draft.id ? '已复制' : '复制草稿'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-10">
        <div className="container mx-auto">
          <p className="section-kicker">平台计划</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {platformRules.map((platform) => (
              <div key={platform.name} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-black text-white">{platform.name}</h3>
                  <span className="text-sm font-bold text-aqua">{platform.weekly}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-mist">{platform.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
