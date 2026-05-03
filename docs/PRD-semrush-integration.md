# PRD 更新：SEMrush 集成 & Magic Lab 产品封装层

> 版本：v0.2 | 日期：2026-04-25 | 状态：草稿

---

## 4.5 SEMrush 数据集成层

### 定位

SEMrush 是 Magic Lab 的**数据引擎**，不对客户可见。

客户看到的是 Magic Lab 的三个产品模块，底层由 SEMrush MCP Server 驱动。

```
客户界面（Magic Lab UI）
    └── Keyword Discovery   →  SEMrush Tool #1 + #2
    └── Competitor Intel    →  SEMrush Tool #3
    └── Gap Opportunities   →  SEMrush Tool #4
```

---

### 技术方案

**接入方式：** SEMrush 官方 MCP Server（REST + MCP 协议均支持）

**API Key：** 由 Magic Lab 持有，不暴露给客户

**单位配额：** 当前套餐含 50,000 units/月，B2B 成本打包进客户套餐定价

**费率参考：**
| 操作类型 | 消耗 | 50,000 units 可做 |
|---------|------|-----------------|
| 关键词概览（实时，批量100个） | 10 units/行 | ~5,000 个关键词 |
| 相关关键词扩展 | 10 units/行 | ~5,000 条 |
| 竞品域名关键词 | 10 units/行 | ~5,000 条 |
| Keyword Gap 对比 | 10 units/行 | ~5,000 条 |

---

### 核心工具（仅用 4 个）

Magic Lab 只封装以下 4 个 SEMrush 核心工具，其余 73 个工具暂不使用：

#### Tool 1：批量关键词概览
**SEMrush 端点：** `Batch Keyword Overview`
**单次最多：** 100 个关键词
**返回字段：**
- keyword
- search_volume
- keyword_difficulty（KD）
- cpc
- intent（informational / commercial / transactional / navigational）
- trend（12个月趋势）

**Magic Lab 产品模块：** Keyword Discovery → 关键词评分与筛选

---

#### Tool 2：相关关键词扩展
**SEMrush 端点：** `Related Keywords / Keyword Magic`
**输入：** 1 个 seed keyword
**返回：** 扩展关键词列表（含 volume、KD、intent）
**用途：** 从客户输入的少量种子词，扩展出完整 Keyword Map

**Magic Lab 产品模块：** Keyword Discovery → 关键词地图生成

---

#### Tool 3：竞品域名有机关键词
**SEMrush 端点：** `Get Domain Organic Search Keywords`
**输入：** 竞品域名（如 wendywutours.co.nz）
**返回：** 该域名正在排名的关键词列表（含 position、volume、KD）
**用途：** 了解竞品流量来源，发现客户尚未覆盖的关键词

**Magic Lab 产品模块：** Competitor Intel → 竞品关键词分析

---

#### Tool 4：关键词差距分析
**SEMrush 端点：** `Compare Domains / Keyword Gap`
**输入：** 客户域名 vs 最多 4 个竞品域名
**返回：** 竞品有排名、客户没有的关键词列表
**用途：** 直接产出"机会关键词列表"，输入 Page Factory

**Magic Lab 产品模块：** Gap Opportunities → 机会词优先级排序

---

### 数据字段标准

每条关键词进入系统后，统一存储以下字段（Supabase `keywords` 表）：

```
keyword                 -- 关键词
volume                  -- 月搜索量
kd                      -- 关键词难度（0-100）
cpc                     -- 每次点击费用（USD）
intent                  -- 搜索意图
trend                   -- 趋势数据（JSON 数组）
source                  -- 数据来源（semrush_batch / semrush_related / semrush_gap）
competitor_source       -- 来源竞品域名（如有）
opportunity_score       -- 综合机会评分（系统计算）
recommended_page_type   -- 建议页面类型（hub / guide / landing）
status                  -- 关键词状态
created_at              -- 创建时间
client_id               -- 所属客户
```

---

### 关键词状态流转

```
new → reviewed → approved → page_created → published
               ↘ rejected
```

| 状态 | 触发方 | 说明 |
|------|--------|------|
| new | 系统自动 | SEMrush 数据拉取后 |
| reviewed | Airtable 人工标记 | 已查看，待决策 |
| approved | Airtable 人工标记 | 确认生成页面 |
| rejected | Airtable 人工标记 | 不做此关键词 |
| page_created | Page Factory 自动 | 页面已生成 |
| published | 部署系统自动 | 已上线 |

---

### Opportunity Score 计算逻辑

```
Opportunity Score =
  (volume_score × 0.3)       -- 搜索量权重
+ (intent_score × 0.3)       -- 商业意图权重（commercial/transactional 得高分）
+ (cpc_score × 0.2)          -- CPC 权重（有广告主竞价 = 有商业价值）
+ (low_kd_score × 0.15)      -- 低难度权重（KD < 30 得满分）
+ (gap_bonus × 0.05)         -- 竞品差距加分
```

分数范围 0–100，Page Factory 优先处理高分词。

---

## 8. 系统整体流程（更新版）

```
┌─────────────────────────────────────────┐
│           Magic Lab 客户界面             │
│                                         │
│  输入 seed keywords + 竞品域名           │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         SEMrush 数据层（隐藏）           │
│                                         │
│  Tool 1: 批量关键词概览                  │
│  Tool 2: 相关关键词扩展                  │
│  Tool 3: 竞品域名有机关键词              │
│  Tool 4: 关键词差距分析                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         数据清洗 + Opportunity Score     │
│         写入 Supabase keywords 表        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Airtable 人工审核（客户侧）      │
│                                         │
│  状态：new → reviewed → approved/rejected│
└──────────────┬──────────────────────────┘
               │ approved 自动触发
               ▼
┌─────────────────────────────────────────┐
│              Page Factory               │
│                                         │
│  根据 keyword + recommended_page_type   │
│  生成 SEO 页面结构                       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Internal Linking Engine         │
│         建立页面间链接结构               │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│              Lead Engine                │
│         收集询盘，回传 CRM              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         SEO 数据回流                    │
│         Google Search Console → 优化     │
└─────────────────────────────────────────┘
```

---

## 产品定位（更新版）

```
Magic Lab AI SEO Growth Engine
= SEMrush Data Intelligence（4 core tools）
+ AI Page Factory
+ Internal Linking Engine
+ Lead Engine
```

**核心话术：**
> SEMrush 发现机会 → Magic Lab 把机会变成页面和询盘

**对客户说的话：**
> Magic Lab 自动分析你的市场关键词和竞品，找到高价值内容机会，自动生成页面，持续为你带来询盘。

（不提 SEMrush、不提 Zapier、不提 Publer）

---

## Magic Lab 产品界面：3 个模块

### 模块 1：Keyword Discovery（关键词发现）

**用户操作：**
1. 输入 seed keywords（如 "china tours new zealand"）
2. 点击「分析」

**系统动作：**
- 调用 Tool 1：批量拉取关键词数据
- 调用 Tool 2：扩展相关关键词
- 计算 Opportunity Score
- 展示关键词地图（按意图分组、按评分排序）

**输出：** Keyword Map（可导入 Airtable 审核）

---

### 模块 2：Competitor Intel（竞品分析）

**用户操作：**
1. 输入竞品域名（最多 4 个）
2. 点击「分析」

**系统动作：**
- 调用 Tool 3：获取每个竞品的有机关键词
- 与客户自身排名对比

**输出：** 竞品关键词报告（哪些词竞品在排，你没有）

---

### 模块 3：Gap Opportunities（机会词）

**用户操作：**
- 在 Competitor Intel 完成后，一键生成

**系统动作：**
- 调用 Tool 4：Keyword Gap 分析
- 按 Opportunity Score 排序
- 标注 recommended_page_type

**输出：** 机会词优先列表 → 推送 Airtable → 人工审核 → Page Factory

---

## 开发优先级（MVP）

| 优先级 | 模块 | 说明 |
|--------|------|------|
| P0 | SEMrush MCP 接入 | 4 个工具封装为内部 API |
| P0 | Supabase keywords 表 | 数据存储层 |
| P0 | Airtable 审核视图 | 人工审核界面 |
| P1 | Opportunity Score | 评分算法 |
| P1 | Gap Opportunities 模块 | 差距分析 |
| P2 | Keyword Discovery UI | 前端界面 |
| P2 | Competitor Intel UI | 前端界面 |
| P3 | Page Factory 触发 | approved 自动触发 |
