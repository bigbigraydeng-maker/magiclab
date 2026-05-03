# Magic Engine 架构详解

## 核心架构图

```
┌─────────────────────────────────────────────────────────────┐
│                    Magic Engine 数据流                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Airtable                  Supabase              Magic Engine │
│  (策划层)                 (执行层)                   (UI)      │
│                                                               │
│  ┌──────────┐            ┌─────────────┐      ┌───────────┐ │
│  │ Social   │   Sync     │ content_    │      │ Content   │ │
│  │ Calendar ├───────────>│ posts       │─────>│ Workbench │ │
│  │ (Status) │  (手动)    │             │      │           │ │
│  └──────────┘            └─────────────┘      └───────────┘ │
│       △                        │                     │       │
│       │                        │                     │       │
│       │                   创建/修改                编辑      │
│       │                        │                     │       │
│       │    ┌──────────────────────────────┐        │       │
│       │    │ 生成资产                      │        │       │
│       │    │ (Image/Video)                │        │       │
│       │    │ ↓                            │        │       │
│       │    │ Publer 发布                  │        │       │
│       │    │ (Post ID 写回)               │        │       │
│       │    └──────────────────────────────┘        │       │
│       │                                            │       │
│       └────────── 写回 (Image_URL, Post_ID) ──────┘       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 设计原则

### 单一数据源 (System of Record)
- **Supabase = 真实数据源**
- Airtable = 可选输入源 + 结果展示（非必须依赖）
- Magic Engine UI = 主要操作界面（可完全绕过 Airtable 独立运行）

### 同步方向（严禁双向实时）
1. **Airtable → Supabase**（按需）
   - 手动点击 Sync 按钮触发
   - 或未来定时 Cron（每日）
   - 单向流，不冲突

2. **Supabase → Airtable**（操作完立即写回）
   - 修改帖子后自动同步
   - 生成图片/视频后写回 Image_URL
   - 发布到 Publer 后写回 Post_ID
   - 异步执行，失败静默处理（不影响主流程）

## Supabase 数据库表

### `clients` 表
```sql
id (uuid)
name (text)
airtable_base_id (text)           ← Airtable base ID
airtable_content_table_id (text)  ← 新表 ID (CTS T061)
created_at (timestamp)
```

### `content_posts` 表（核心）
```sql
id (uuid)
client_id (uuid) → clients.id
title (text)                   ← Headline_EN
caption (text)                 ← Caption_EN
script (text)                  ← Video_Text_Overlay
hashtags (text[])              ← 数组
visual_brief (text)            ← LoveArt_Prompt_EN
platforms (text[])             ← [facebook, instagram, ...]
status (text)                  ← draft|approved|scheduled|published
scheduled_at (timestamp)       ← Date + Time_NZST
format (text)                  ← reel|video|feed|image|story
ratio (text)                   ← 宽高比
route (text)                   ← route_a|route_b|route_c
airtable_record_id (text)      ← nullable，用于双向关联
source_video_url (text)        ← 视频源 URL
created_at (timestamp)
updated_at (timestamp)
```

### `visual_assets` 表
```sql
id (uuid)
post_id (uuid) → content_posts.id
asset_type (text)              ← image|video
generation_status (text)       ← pending|generating|ready|failed
storage_url (text)             ← 生成后的 URL
provider_job_id (text)         ← Atlas Cloud 的 job ID
cost_usd (numeric)             ← 生成成本
error_message (text)           ← 失败原因
created_at (timestamp)
```

### `keywords` 表
```sql
id (uuid)
client_id (uuid) → clients.id
keyword (text)
search_volume (integer)
difficulty (text)
airtable_record_id (text)
created_at (timestamp)
```

## 技术栈详解

| 层 | 技术 | 说明 |
|-----|------|------|
| **前端** | Next.js 14 App Router | 使用 App Router（不是 Pages Router） |
| | React 18.2 + TypeScript | 组件化 |
| | Tailwind CSS 3.4 | 样式 |
| **后端** | Next.js API Routes | /app/api/* 下的路由处理器 |
| **数据库** | Supabase (PostgreSQL) | 完全管理的 Postgres |
| | | 内置 Auth、Storage、Realtime |
| **AI 图片** | Atlas Cloud WaveSpeed Flux-dev | 调用 API 生成 |
| **AI 视频** | Atlas Cloud Seedance 2.0 | 调用 API 生成 |
| **内容生成** | OpenAI GPT-4o-mini | 题目→Caption、Hashtags |
| **关键词** | SEMrush API | 搜索量、难度数据 |
| **协作导入** | Airtable REST API | 拉取/推送记录 |
| **社媒发布** | Publer API v1 | 调度到 FB、IG、TikTok |
| **部署** | Render | 自动部署（推送触发） |

## 关键概念速记

- **airtable_record_id**: Airtable 中的记录 ID，用于关联 Supabase 记录
- **乐观更新 (Optimistic Update)**: UI 先变，再调 API（visuals/page.tsx 表格编辑）
- **filterByFormula**: Airtable 查询语言，只拉 Status="ready" 的记录
- **mapNewTableFields()**: 核心转换函数，将 Airtable 字段映射到 Supabase
- **写回失败静默处理**: `.catch()` 不影响主流程，仅记录日志
- **System of Record**: Supabase 是单一数据源，避免冲突
