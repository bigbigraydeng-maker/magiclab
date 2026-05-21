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
    "date": "2026-05-22",
    "project": "Magiclab",
    "source": "Claude Code / Codex",
    "title": "开工前先花 10 分钟修 git，比硬上敲 5 个 commit 更值得。",
    "summary": "开工前先把昨晚遗留的 git 元数据截断问题修干净，让 git status / commit / push 全链路恢复正常 —— 这件事不做完，今天后面任何代码改动都没法落盘。",
    "publicNote": "- 已知遗留（昨日带过来）：5-21 日报里登记的 prod chinatravel 仓库 PR merge → 网站上线 端到端验证还没跑过 - 已知遗留：shared Claude client 还有几个老路由没迁 - 已知遗留：6 维健康快照 API 返回的 dimension_name 字段是英文，待枚举化 - 悬念（今日新出）：还不知道是什么...",
    "commits": 0,
    "artifacts": 9,
    "intensity": 70,
    "tags": [
      "GitHub",
      "UI",
      "Content Engine"
    ],
    "gems": [
      {
        "type": "builder 过程",
        "title": "开工前先花 10 分钟修 git，比硬上敲 5 个 commit 更值得。",
        "platform": "X / Threads"
      },
      {
        "type": "产品判断",
        "title": "把 .git/ 放进同步盘，是 2026 年最常见的开发者隐形地雷。",
        "platform": "X / LinkedIn"
      },
      {
        "type": "founder insight",
        "title": "凌晨 3 点开工，第一件事不是写功能，是把环境扫干净。",
        "platform": "X / Threads / LinkedIn"
      }
    ]
  },
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
