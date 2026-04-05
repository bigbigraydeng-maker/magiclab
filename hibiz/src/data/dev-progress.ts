/**
 * HiBiz 开发进度数据源 — 改这里即可；Obsidian 备份见 Second-Brain/01-Magiclab/Projects/HiBiz/10-开发进度.md
 */

export type ItemStatus = "done" | "in_progress" | "todo" | "blocked";

export interface ProgressItem {
  id: string;
  label: string;
  status: ItemStatus;
  /** 可选：额外说明（看板上小号字） */
  note?: string;
}

export interface ProgressPhase {
  id: string;
  title: string;
  summary: string;
  items: ProgressItem[];
}

/** 与 Obsidian「最后同步」保持习惯性一致；发布看板前可顺手改日期 */
export const DEV_PROGRESS_LAST_UPDATED = "2026-04-05";

export const DEV_PROGRESS_PHASES: ProgressPhase[] = [
  {
    id: "foundation",
    title: "底座",
    summary: "Supabase、Auth、RLS、Schema",
    items: [
      { id: "db", label: "核心表与迁移（projects / intents / microsites / forms / submissions）", status: "done" },
      { id: "rls-owner", label: "商家数据 RLS（按 user_id / project）", status: "done" },
      { id: "auth", label: "Magic Link + `/auth/callback` + session 刷新", status: "done" },
      { id: "rls-public", label: "公开读已发布微站 + 匿名 inserts submissions（迁移 public_rls）", status: "done" },
    ],
  },
  {
    id: "workbench",
    title: "商家工作台",
    summary: "项目管线、生成、预览",
    items: [
      { id: "projects", label: "项目列表 / 新建 / 详情", status: "done" },
      { id: "compile", label: "规则编译器 + Analyse（intent）", status: "done" },
      { id: "openai", label: "OpenAI 生成 draft_model + 表单预设", status: "done" },
      { id: "preview", label: "草稿预览 `?preview=1` + 登录回跳保留深链", status: "done" },
      { id: "publish-ui", label: "一键发布 / 从草稿更新线上", status: "done" },
    ],
  },
  {
    id: "public",
    title: "发布与公开面",
    summary: "访客可访问的页面",
    items: [
      { id: "site", label: "公开微站 `/site/[slug]`（published_model）", status: "done" },
      { id: "form-standalone", label: "独立表单 `/forms/[public_slug]`", status: "done" },
      { id: "submit", label: "留资 Server Action + 字段校验", status: "done" },
      { id: "seo-meta", label: "公开页 metadata（SEO 基础）", status: "done", note: "沿用模型内 seo 字段" },
    ],
  },
  {
    id: "verticals",
    title: "模板与垂直场景",
    summary: "双行业预设、房产海报、商家联系信息（无 listing 同步）",
    items: [
      { id: "preset-lib", label: "`template-presets.ts` + 新建项目 `?preset=` 填充示例文案", status: "done" },
      {
        id: "merchant-profile",
        label: "`microsites.merchant_profile` + 电话/邮箱/地址 + Contact 区块覆盖",
        status: "done",
        note: "迁移 20260405120000；视图含 merchant_profile",
      },
      {
        id: "re-poster",
        label: "房产：HTTPS 图片 URL、TradeMe 链接、打印海报 `/app/projects/[id]/poster`",
        status: "done",
        note: "不做房源 listing API；直传 Storage 待做",
      },
      { id: "upload-storage", label: "图片直传 Supabase Storage（替代粘贴 URL）", status: "todo" },
    ],
  },
  {
    id: "ops",
    title: "运营与体验",
    summary: "线索、风控、编辑能力",
    items: [
      { id: "inbox", label: "商家后台：线索列表（/app/projects/[id]/leads）", status: "done" },
      {
        id: "rate-limit",
        label: "公开提交：honeypot + RPC 限流（每表单/小时 & 每 IP 十分钟）",
        status: "done",
        note: "迁移 20260404200000；可选环境变量 HIBIZ_LEAD_SALT",
      },
      { id: "notify", label: "新线索邮件或 webhook", status: "todo" },
      {
        id: "content-edit",
        label: "Hero 快编 + 商家资料（含房产图 URL 进 hero）",
        status: "done",
        note: "区块级全量编辑与 Storage 仍待扩展",
      },
      { id: "observability", label: "日志与产品事件（与规格 06 对齐）", status: "todo" },
    ],
  },
];

export function itemWeight(s: ItemStatus): number {
  switch (s) {
    case "done":
      return 1;
    case "in_progress":
      return 0.55;
    case "blocked":
      return 0;
    default:
      return 0;
  }
}

export function phaseCompletion(items: ProgressItem[]): { pct: number; done: number; total: number } {
  const total = items.length;
  if (total === 0) {
    return { pct: 0, done: 0, total: 0 };
  }
  const sum = items.reduce((acc, i) => acc + itemWeight(i.status), 0);
  const done = items.filter((i) => i.status === "done").length;
  return { pct: Math.round((sum / total) * 100), done, total };
}

export function overallCompletion(phases: ProgressPhase[]): { pct: number; done: number; total: number } {
  const flat = phases.flatMap((p) => p.items);
  return phaseCompletion(flat);
}
