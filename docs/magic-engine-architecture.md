# Magic Engine — 架构设计 & Claude Code 开发 Brief

> 版本：v1.0 | 日期：2026-04-25 | 状态：交付 Code 开发

---

## 三个选型问题的答案

### 1. Vercel vs Render → 用 Render

| | Vercel | Render |
|--|--------|--------|
| 适合场景 | 纯前端、静态站 | 全栈应用、后端 API、定时任务 |
| 数据库 | 需外接 | 内置 Postgres + Redis |
| 定价模式 | 按用量（容易超支）| 固定月费（可预测）|
| Next.js 支持 | ✅ 原生优化 | ✅ 完全支持 |
| 后台任务 | ❌ 无（Serverless 15s 限制）| ✅ 支持长任务 |
| 与 CTS 一致 | ❌ | ✅ 已有账号和配置 |

**结论：Magic Engine 有大量后台 API 任务（视频生成、SEMrush 批量调用），Vercel Serverless 会超时，Render 是正确选择。**

---

### 2. Hailuo vs Seedance 2.0 → 用 Seedance 2.0

| | Hailuo 02 | Seedance 2.0 (Atlas Cloud) |
|--|-----------|--------------------------|
| 价格 | ~$0.045/秒 | **$0.022/秒** ← 最便宜 |
| 分辨率 | 768p | 720p / 1080p |
| API 质量 | 简单易用 | 完整控制，多模态输入 |
| 质量 | 好 | **更好**（ByteDance 出品）|

**6秒视频成本对比：**
- Hailuo：$0.27
- Seedance 2.0：**$0.13** ← 便宜一半

**结论：Seedance 2.0 via Atlas Cloud，价格低质量高，首选。**

---

### 3. 图片 API → ModelsLab $29/月 无限量

| 方案 | 价格 | 说明 |
|------|------|------|
| DALL-E 3 | $0.040/张 | 贵，适合偶发 |
| Flux Schnell | $0.003/张 | 便宜，质量一般 |
| **ModelsLab** | **$29/月无限量** | 10,000+ 模型含 Flux，最划算 |

**结论：ModelsLab $29/月套餐，打包进运营成本，随便用。**

---

## 最终技术栈

```
Magic Engine Tech Stack

前端 / 后端
  Next.js 14 (App Router) + TypeScript
  部署：Render（与 CTS 同一账号）

数据层
  Supabase（数据库 + Storage）

数据输入
  SEMrush MCP Server     关键词 / 竞品 / Gap 分析
  Supadata API           视频转录（TikTok/YT/FB/IG）

AI 内容生成
  Claude API             内容改写 / 分析 / 文案
  ModelsLab API          图片生成（$29/月无限）
  Seedance 2.0 API       视频生成（$0.022/秒，Atlas Cloud）
  HeyGen API             数字人 Avatar 视频

审核 & 发布
  Airtable               人工审核界面（关键词 + 内容日历）
  Zapier                 自动化触发器（双向同步）
  Publer                 社媒排期发布

基础设施
  Supabase Storage       视觉素材存储
  Supabase Edge Functions 异步任务（视频生成轮询）
```

---

## 项目结构

```
magic-lab/
└── magic-engine/                    ← 新建 Next.js 项目
    ├── src/
    │   ├── app/
    │   │   ├── api/
    │   │   │   ├── semrush/
    │   │   │   │   ├── keyword-overview/route.ts
    │   │   │   │   ├── related-keywords/route.ts
    │   │   │   │   ├── competitor-keywords/route.ts
    │   │   │   │   └── keyword-gap/route.ts
    │   │   │   ├── content/
    │   │   │   │   ├── route-a/route.ts      # SEO → Social
    │   │   │   │   ├── route-b/route.ts      # Viral video rewrite
    │   │   │   │   └── route-c/route.ts      # Master Brief driven
    │   │   │   ├── visual/
    │   │   │   │   ├── image/route.ts        # ModelsLab
    │   │   │   │   ├── video/route.ts        # Seedance 2.0
    │   │   │   │   └── avatar/route.ts       # HeyGen
    │   │   │   ├── transcript/route.ts       # Supadata
    │   │   │   ├── airtable/
    │   │   │   │   ├── sync-keywords/route.ts
    │   │   │   │   └── sync-content/route.ts
    │   │   │   └── webhooks/
    │   │   │       ├── airtable-approved/route.ts
    │   │   │       └── publer-published/route.ts
    │   │   └── dashboard/
    │   │       ├── page.tsx
    │   │       └── clients/[id]/page.tsx
    │   ├── lib/
    │   │   ├── semrush/client.ts
    │   │   ├── supadata/client.ts
    │   │   ├── visual/
    │   │   │   ├── modelslab.ts
    │   │   │   ├── seedance.ts
    │   │   │   └── heygen.ts
    │   │   ├── airtable/client.ts
    │   │   ├── publer/client.ts
    │   │   ├── supabase/client.ts
    │   │   └── scoring/opportunity-score.ts
    │   └── types/
    │       ├── keyword.ts
    │       ├── content.ts
    │       ├── visual.ts
    │       └── client.ts
    ├── supabase/
    │   └── migrations/
    │       ├── 001_clients.sql
    │       ├── 002_keywords.sql
    │       ├── 003_content_posts.sql
    │       ├── 004_visual_assets.sql
    │       └── 005_master_briefs.sql
    └── docs/                         ← 已有 spec 文档
```

---

## 数据库：新增两张核心表

（`clients` 和 `keywords` 表已在 spec-supabase-schema.md 定义）

### Table: `content_posts`（内容日历）

```sql
create table public.content_posts (
  id                  uuid primary key default uuid_generate_v4(),
  client_id           uuid not null references public.clients(id) on delete cascade,

  -- 内容信息
  title               text not null,
  route               text not null,            -- route_a / route_b / route_c
  platforms           text[] not null,          -- ['facebook','tiktok','instagram']
  script              text,                     -- 视频脚本
  caption             text,                     -- 发布文案
  hashtags            text[],                   -- 标签数组

  -- AI 生成参数
  visual_brief        text,                     -- 给图片/视频生成的提示词
  revision_notes      text,                     -- 修改备注（触发重新生成）

  -- 来源追踪
  source_keyword_id   uuid references public.keywords(id),   -- Route A
  source_video_url    text,                     -- Route B 爆款视频 URL
  source_brief_id     uuid references public.master_briefs(id), -- Route C

  -- 状态
  status              text not null default 'draft',
  -- draft / approved / scheduled / published / rejected

  -- 发布信息
  scheduled_at        timestamptz,
  published_at        timestamptz,
  publer_post_id      text,                     -- Publer 回填

  -- 时间戳
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
```

---

### Table: `visual_assets`（视觉素材）

```sql
create table public.visual_assets (
  id                  uuid primary key default uuid_generate_v4(),
  post_id             uuid not null references public.content_posts(id) on delete cascade,
  client_id           uuid not null references public.clients(id),

  -- 素材信息
  asset_type          text not null,            -- image / video / avatar_video
  provider            text not null,            -- modelslab / seedance / heygen
  prompt_used         text,                     -- 实际使用的生成提示词
  variant             smallint default 1,       -- 1 或 2（每次生成2个变体）

  -- 文件信息
  storage_url         text,                     -- Supabase Storage URL
  provider_url        text,                     -- 第三方原始 URL（备用）
  file_size_kb        integer,
  duration_seconds    numeric(5,1),             -- 视频时长（秒）
  resolution          text,                     -- 720p / 1080p / 1024x1024

  -- 状态
  generation_status   text default 'pending',   -- pending / generating / ready / failed
  is_selected         boolean default false,    -- 人工选定的版本

  -- 成本记录
  cost_usd            numeric(6,4),             -- 本次生成费用

  created_at          timestamptz not null default now()
);
```

---

### Table: `master_briefs`（客户品牌底座）

```sql
create table public.master_briefs (
  id                  uuid primary key default uuid_generate_v4(),
  client_id           uuid not null references public.clients(id) on delete cascade,
  version             smallint not null default 1,
  is_active           boolean default true,

  -- 品牌基础
  brand_name          text not null,
  tagline             text,
  website             text,

  -- 目标客群
  primary_audience    text,
  pain_points         text[],
  buying_trigger      text,

  -- 产品列表
  products            jsonb,
  -- [{ name, description, price_range, season, usp }]

  -- 品牌语气
  tone                text,
  voice_examples      text[],
  avoid_words         text[],

  -- 内容规则
  content_topics      text[],
  content_avoid       text[],
  platforms           text[],
  post_frequency      text,

  -- 视觉风格
  visual_style        text,
  color_palette       text[],
  image_preference    text,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
```

---

## 开发阶段计划（交给 Claude Code）

### Phase 1：项目基础 + 数据库（Week 1）

**目标：** 跑通基础框架，所有表建好，API 路由骨架搭好

**任务清单：**
```
□ 初始化 Next.js 14 项目（magic-engine）
□ 配置 TypeScript + ESLint + Tailwind
□ 接入 Supabase（复用现有项目）
□ 执行所有 migration（5张表）
□ 建立 API 路由骨架（空 handler，返回 { ok: true }）
□ 配置环境变量模板（.env.example）
□ 部署到 Render（确认构建通过）
```

**环境变量：**
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SEMRUSH_API_KEY=
SUPADATA_API_KEY=
MODELSLAB_API_KEY=
ATLAS_CLOUD_API_KEY=        # Seedance 2.0
HEYGEN_API_KEY=
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
PUBLER_API_KEY=
INTERNAL_SERVICE_TOKEN=     # 内部 API 鉴权
```

---

### Phase 2：SEMrush 集成（Week 2）

**目标：** 4个关键词工具跑通，数据写入 Supabase

**任务清单：**
```
□ 封装 SEMrush MCP client（lib/semrush/client.ts）
□ POST /api/semrush/keyword-overview
□ POST /api/semrush/related-keywords
□ POST /api/semrush/competitor-keywords
□ POST /api/semrush/keyword-gap
□ 实现 opportunity_score 计算逻辑
□ 实现 recommended_page_type 判断逻辑
□ 批量 upsert 到 Supabase keywords 表
□ 单元测试（mock SEMrush 响应）
```

---

### Phase 3：Route B — 爆款视频改写（Week 3）

**目标：** 输入视频 URL，输出完整内容包

**任务清单：**
```
□ 封装 Supadata client（lib/supadata/client.ts）
□ POST /api/transcript（URL → 转录文本 + 元数据）
□ 实现视频7维度分析（lib/content/video-analyzer.ts）
  - hook / format / emotion / structure / pacing / cta / core_message
□ 实现 Master Brief 注入逻辑
□ POST /api/content/route-b
  - 输入：video_url + client_id
  - 调用：Supadata → 分析 → Claude API 改写
  - 输出：Content Package（script + caption + hashtags + visual_brief）
□ 生成2个变体
□ 写入 Supabase content_posts 表
```

---

### Phase 4：视觉生成（Week 4）

**目标：** 根据 visual_brief 自动生成图片和视频

**任务清单：**
```
□ 封装 ModelsLab client（lib/visual/modelslab.ts）
□ 封装 Seedance 2.0 client（lib/visual/seedance.ts）
  - 支持异步轮询（视频生成需要 30-120 秒）
  - 用 Supabase Edge Function 做后台轮询
□ 封装 HeyGen client（lib/visual/heygen.ts）
  - Avatar 视频生成
  - 支持脚本输入 → 数字人朗读
□ POST /api/visual/image（ModelsLab）
□ POST /api/visual/video（Seedance 2.0）
□ POST /api/visual/avatar（HeyGen）
□ 生成完成后：
  - 上传到 Supabase Storage
  - 写入 visual_assets 表（generation_status = ready）
  - 更新 content_posts 关联
□ 支持 revision_notes 触发重新生成
```

---

### Phase 5：Routes A & C（Week 5）

**任务清单：**
```
□ POST /api/content/route-a
  - 输入：keyword_id（已 published 的 SEO 页面）
  - 输出：社媒内容包（3种角度）
□ POST /api/content/route-c
  - 输入：brief_id + campaign_description
  - 输出：一周内容计划（7条帖子）
□ Master Brief CRUD API（create / read / update）
□ 内容批量生成支持（一次触发多条）
```

---

### Phase 6：Airtable 双向同步（Week 6）

**任务清单：**
```
□ 封装 Airtable client（lib/airtable/client.ts）
□ POST /api/airtable/sync-keywords
  - Supabase keywords(status=new) → Airtable Keywords 表
□ POST /api/airtable/sync-content
  - Supabase content_posts(status=draft) → Airtable Content 表
□ POST /api/webhooks/airtable-approved
  - Zapier 调用 → Supabase status 更新为 approved
  - 触发：视觉生成 + Publer 推送
□ Zapier 配置说明（文档，不是代码）
```

---

### Phase 7：Publer 集成 + Dashboard（Week 7-8）

**任务清单：**
```
□ 封装 Publer client（lib/publer/client.ts）
  - 创建帖子（附图片/视频 URL）
  - 设置发布时间
□ approved 状态自动推送 Publer
□ POST /api/webhooks/publer-published
  - Publer 发布完成后回调
  - 更新 Supabase status = published + published_at
□ 基础 Dashboard（Next.js 页面）
  - 客户列表
  - 每个客户的内容状态概览
  - 月度用量统计（API 调用次数 / 视频生成成本）
```

---

## HeyGen 数字人 — 使用场景说明

HeyGen 用于生成"数字人讲解"类视频，适合：
- 产品介绍（替代真人出镜）
- 旅游目的地推介
- 节日营销内容

**工作流：**
```
Route B / C 生成脚本
    ↓
POST /api/visual/avatar
  输入：{ script, avatar_id, voice_id, client_id }
    ↓
HeyGen API 生成数字人视频
    ↓
轮询完成 → 上传 Supabase Storage
    ↓
Airtable 展示 → 人工审核 → Publer 发布
```

客户可以上传自己的形象作为 Avatar（HeyGen 支持自定义），Magic Lab 也可以维护一套通用的商务 Avatar 供客户选用。

---

## Phase 1 启动 Checklist（Code 第一天做）

```bash
# 1. 初始化项目
cd magic-lab
npx create-next-app@latest magic-engine --typescript --tailwind --app

# 2. 安装核心依赖
cd magic-engine
npm install @supabase/supabase-js @airtable/airtable axios

# 3. 建立文件结构（按上面的目录树）

# 4. 执行 Supabase migrations（参考 spec-supabase-schema.md）

# 5. 跑通第一个 API
curl -X POST http://localhost:3000/api/semrush/keyword-overview \
  -H "Content-Type: application/json" \
  -d '{"keywords":["china tours"],"client_id":"test"}'
```

---

## 参考文档

- `docs/PRD-semrush-integration.md` — SEMrush 完整 PRD
- `docs/spec-supabase-schema.md` — 数据库 Schema（含 SQL）
- `docs/spec-airtable-schema.md` — Airtable 结构和字段
- `docs/spec-semrush-api.md` — SEMrush 4个 API 详细接口文档
