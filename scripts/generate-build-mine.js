const fs = require('fs');
const path = require('path');

const defaultLogDir = 'C:\\Users\\Zhong\\Documents\\Claude Big Ray\\magic-engine\\Second-Brain\\Claude-Code-Logs';
const logDir = process.env.BUILD_MINE_LOG_DIR || defaultLogDir;
const outputPath = path.join(process.cwd(), 'src', 'data', 'buildMineEntries.ts');
const forceEmpty = process.argv.includes('--force-empty');

function readMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Build Mine log directory not found: ${dir}`);
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => path.join(dir, file));
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return {};
  }

  return match[1].split(/\r?\n/).reduce((data, line) => {
    const separator = line.indexOf(':');
    if (separator === -1) {
      return data;
    }

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    data[key] = value;
    return data;
  }, {});
}

function section(content, heading) {
  const regex = new RegExp(`##\\s+${heading}[\\s\\S]*?(?=\\n##\\s+\\d+\\.|$)`);
  const match = content.match(regex);
  return match ? match[0] : '';
}

function numberedSectionBody(content, number) {
  const regex = new RegExp(`##\\s+${number}\\.\\s+[\\s\\S]*?(?=\\n##\\s+\\d+\\.|$)`);
  const match = content.match(regex);
  if (!match) {
    return '';
  }

  return match[0].split(/\r?\n/).slice(1).join('\n').trim();
}

function stripMarkdown(text) {
  return text
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstSentence(text, fallback) {
  const clean = stripMarkdown(text);
  if (!clean) {
    return fallback;
  }

  const sentence = clean.split(/[。.!?]\s/)[0];
  return sentence.length > 180 ? `${sentence.slice(0, 177)}...` : sentence;
}

function extractDate(file, frontmatter) {
  if (frontmatter.date) {
    return frontmatter.date;
  }

  const filenameDate = path.basename(file).match(/(\d{4}-\d{2}-\d{2})/);
  return filenameDate ? filenameDate[1] : new Date().toISOString().slice(0, 10);
}

function extractCommits(content) {
  if (
    content.includes('GitHub commit：无') ||
    content.includes('GitHub commit: 无') ||
    content.includes('未生成 commit') ||
    /GitHub commit[：:]\s*无/i.test(content)
  ) {
    return 0;
  }

  const match =
    content.match(/今天共\s*(\d+)\s*个\s*commit/i) ||
    content.match(/total(?:ly)?\s*(\d+)\s*commits?/i) ||
    content.match(/commits?[：:]\s*(\d+)/i);
  return match ? Number(match[1]) : 0;
}

function extractGems(content) {
  const material = numberedSectionBody(content, 5);
  if (!material) {
    return [];
  }

  return material
    .split(/###\s+素材\s+\d+/)
    .slice(1)
    .map((block) => {
      const type = block.match(/类型\*\*：(.+)/)?.[1]?.trim() || 'build note';
      const hook = block.match(/一句话钩子\*\*：(.+)/)?.[1]?.trim() || '';
      const platform = block.match(/适合平台\*\*：(.+)/)?.[1]?.trim() || '';
      return {
        type: stripMarkdown(type),
        title: stripMarkdown(hook),
        platform: stripMarkdown(platform),
      };
    })
    .filter((gem) => gem.title)
    .slice(0, 4);
}

function extractTags(content) {
  const checks = [
    ['GitHub', /github|pull request|pr\b|commit/i],
    ['SEO', /seo|search|ranking/i],
    ['GEO', /geo|ai visibility|answer engine/i],
    ['Security', /token|encrypt|crypto|aes|security/i],
    ['Data', /data|pipeline|scraping|dataforseo/i],
    ['UI', /ui|workbench|dashboard|panel|component/i],
    ['Automation', /automation|workflow|orchestrator|agent/i],
    ['Content Engine', /content|blog|article|publish/i],
  ];

  return checks.filter(([, regex]) => regex.test(content)).map(([tag]) => tag).slice(0, 5);
}

function extractEntry(file) {
  const content = fs.readFileSync(file, 'utf8');
  const frontmatter = parseFrontmatter(content);

  if (frontmatter.public_ready === 'false' || frontmatter.content_ready !== 'true') {
    return null;
  }

  const completed = numberedSectionBody(content, 2);
  const goal = numberedSectionBody(content, 1);
  const problems = numberedSectionBody(content, 4);
  const commits = extractCommits(content);
  const gems = extractGems(content);
  const bulletCount = (completed.match(/^\s*-\s+/gm) || []).length;
  const intensity = Math.min(100, 22 + commits * 5 + bulletCount * 4 + gems.length * 8);
  const date = extractDate(file, frontmatter);
  const project = frontmatter.project || 'Magic Lab';

  return {
    date,
    project,
    source: frontmatter.source || 'Claude Code / Codex',
    title: gems[0]?.title || firstSentence(goal, `${project} daily build progress`),
    summary: firstSentence(goal, 'A real build session was converted into public-safe product progress.'),
    publicNote: firstSentence(problems, 'The private work log was distilled into public-safe product learning.'),
    commits,
    artifacts: Math.max(1, bulletCount + gems.length),
    intensity,
    tags: extractTags(content),
    gems,
  };
}

function writeOutput(entries) {
  const sorted = entries.sort((a, b) => b.date.localeCompare(a.date));
  const output = `export type BuildMineEntry = {
  date: string;
  project: string;
  source: string;
  title: string;
  summary: string;
  publicNote: string;
  commits: number;
  artifacts: number;
  intensity: number;
  tags: string[];
  gems: {
    type: string;
    title: string;
    platform: string;
  }[];
};

export const buildMineEntries: BuildMineEntry[] = ${JSON.stringify(sorted, null, 2)};
`;

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, output, 'utf8');
}

const entries = readMarkdownFiles(logDir).map(extractEntry).filter(Boolean);

if (!entries.length && fs.existsSync(outputPath) && !forceEmpty) {
  console.log(`Build Mine kept existing data because no public-ready entries were found in ${logDir}`);
  process.exit(0);
}

writeOutput(entries);

console.log(`Build Mine generated ${entries.length} entries from ${logDir}`);
