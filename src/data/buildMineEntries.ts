export type BuildMineEntry = {
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

export const buildMineEntries: BuildMineEntry[] = [
  {
    "date": "2026-05-21",
    "project": "Magiclab",
    "source": "Claude Code / Codex",
    "title": "AI 工具不能停在「给建议」，要做到「替你改」。",
    "summary": "打通 Magic Engine 从「给建议的工具」到「替你改网站的引擎」之间最后一公里 —— 完成 Phase 12.H：GitHub CMS 执行闭环。具体两条线：博客生成完直接推 GitHub PR，SEO 诊断后一键 Fix 推 PR。客户 merge 完，网站就上线。",
    "publicNote": "- Jina URL encoding bug：之前对 URL 做了一次额外的 encodeURIComponent，导致 Jina 抓不到页面。今天移除，加 fallback",
    "commits": 11,
    "artifacts": 23,
    "intensity": 100,
    "tags": [
      "GitHub",
      "SEO",
      "GEO",
      "Security",
      "Data"
    ],
    "gems": [
      {
        "type": "founder insight",
        "title": "AI 工具不能停在「给建议」，要做到「替你改」。",
        "platform": "LinkedIn / X"
      },
      {
        "type": "builder 过程",
        "title": "原生 fetch 200 行，吊打 octokit 200KB。",
        "platform": "X / Threads"
      },
      {
        "type": "产品判断",
        "title": "客户的 GitHub token 加密时，我多花了半天单测，不后悔。",
        "platform": "LinkedIn"
      },
      {
        "type": "短观点",
        "title": "好的 UI pattern 是用来抄自己的，不是用来发明的。",
        "platform": "X / 小红书"
      }
    ]
  }
];
