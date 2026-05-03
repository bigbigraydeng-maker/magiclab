# Spec：SEMrush MCP 封装 API

> 交给 Code 实现 | 版本：v1.0 | 日期：2026-04-25

---

## 概述

Magic Lab 封装 SEMrush MCP Server 的 4 个核心工具，对外暴露为内部 REST API。

所有 SEMrush 调用由 Magic Lab 后端发起，API Key 存储在环境变量，不暴露给客户。

**接入方式：** SEMrush MCP Server（官方）
**文档：** https://developer.semrush.com/api/introduction/semrush-mcp/
**地区数据库：** `au`（覆盖澳洲 + 新西兰搜索数据）
**Rate Limit：** 10 requests/second

---

## 环境变量

```env
SEMRUSH_API_KEY=your_api_key_here
SEMRUSH_DB=au
```

---

## 内部 API 端点

所有端点前缀：`/api/semrush/`
认证：Magic Lab 内部 service token（Header: `X-Service-Token`）

---

## API 1：批量关键词概览

**端点：** `POST /api/semrush/keyword-overview`

**对应 SEMrush 工具：** Batch Keyword Overview

**用途：** 输入关键词列表，返回每个词的核心 SEO 数据

### 请求

```typescript
interface KeywordOverviewRequest {
  keywords: string[];      // 最多 100 个关键词
  client_id: string;       // 关联客户
  db?: string;             // 默认 'au'
}
```

```json
// 示例
{
  "keywords": ["china tours new zealand", "beijing travel package", "great wall tour"],
  "client_id": "uuid-xxx",
  "db": "au"
}
```

### 响应

```typescript
interface KeywordOverviewResponse {
  success: boolean;
  data: KeywordData[];
  units_consumed: number;
  saved_count: number;       // 写入 Supabase 的记录数
}

interface KeywordData {
  keyword: string;
  volume: number;
  kd: number;
  cpc: number;
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  trend: TrendPoint[];       // [{month: '2025-04', volume: 1900}, ...]
  opportunity_score: number;
  recommended_page_type: string;
  status: 'new';
}
```

```json
// 示例响应
{
  "success": true,
  "data": [
    {
      "keyword": "china tours new zealand",
      "volume": 1900,
      "kd": 24,
      "cpc": 3.50,
      "intent": "commercial",
      "trend": [...],
      "opportunity_score": 78.5,
      "recommended_page_type": "landing"
    }
  ],
  "units_consumed": 30,
  "saved_count": 3
}
```

### 内部逻辑

```
1. 校验 keywords 数量 ≤ 100
2. 调用 SEMrush MCP: batch_keyword_overview(keywords, db)
3. 对每个关键词计算 opportunity_score（用 Supabase 函数）
4. 判断 recommended_page_type（规则见下方）
5. 批量 upsert 到 Supabase keywords 表（source = 'semrush_batch'）
6. 返回结果
```

### page_type 判断规则

```typescript
function recommendPageType(keyword: string, intent: string, volume: number): string {
  // 包含目的地词 + 高商业意图 → landing
  if (['tour', 'package', 'trip', 'travel'].some(w => keyword.includes(w))
      && ['commercial', 'transactional'].includes(intent)) {
    return 'landing';
  }
  // 包含 "best", "guide", "how" → guide
  if (['best', 'guide', 'how', 'tips', 'things to do'].some(w => keyword.includes(w))) {
    return 'guide';
  }
  // 高搜索量目的地词 → hub
  if (volume > 1000 && ['beijing', 'shanghai', 'china', 'xian'].some(w => keyword.includes(w))) {
    return 'hub';
  }
  // 问句 → faq
  if (['what', 'when', 'why', 'is', 'can', 'do i'].some(w => keyword.startsWith(w))) {
    return 'faq';
  }
  return 'guide'; // 默认
}
```

---

## API 2：相关关键词扩展

**端点：** `POST /api/semrush/related-keywords`

**对应 SEMrush 工具：** Related Keywords / Keyword Magic

**用途：** 输入 1 个 seed keyword，扩展出完整相关词列表

### 请求

```typescript
interface RelatedKeywordsRequest {
  seed_keyword: string;
  client_id: string;
  limit?: number;          // 默认 50，最多 100
  min_volume?: number;     // 默认 100（过滤低流量词）
  max_kd?: number;         // 默认 60（过滤高难度词）
  db?: string;
}
```

```json
{
  "seed_keyword": "china tours",
  "client_id": "uuid-xxx",
  "limit": 50,
  "min_volume": 100,
  "max_kd": 50
}
```

### 响应

```typescript
interface RelatedKeywordsResponse {
  success: boolean;
  seed_keyword: string;
  data: KeywordData[];
  units_consumed: number;
  saved_count: number;
}
```

### 内部逻辑

```
1. 调用 SEMrush MCP: get_related_keywords(seed_keyword, db)
2. 过滤：volume >= min_volume AND kd <= max_kd
3. 计算 opportunity_score
4. 批量 upsert 到 Supabase（source = 'semrush_related'）
5. 返回结果
```

---

## API 3：竞品域名有机关键词

**端点：** `POST /api/semrush/competitor-keywords`

**对应 SEMrush 工具：** Get Domain Organic Search Keywords

**用途：** 获取竞品域名正在排名的关键词，了解竞品流量来源

### 请求

```typescript
interface CompetitorKeywordsRequest {
  competitor_domains: string[];   // 最多 4 个竞品域名
  client_id: string;
  limit?: number;                 // 每个域名返回数量，默认 50
  min_volume?: number;            // 默认 100
  db?: string;
}
```

```json
{
  "competitor_domains": ["wendywutours.co.nz", "intrepidtravel.com"],
  "client_id": "uuid-xxx",
  "limit": 50
}
```

### 响应

```typescript
interface CompetitorKeywordsResponse {
  success: boolean;
  data: {
    domain: string;
    keywords: (KeywordData & { position: number })[];
  }[];
  total_keywords: number;
  units_consumed: number;
  saved_count: number;
}
```

### 内部逻辑

```
1. 对每个 competitor_domain 调用 SEMrush MCP: get_domain_organic_keywords(domain, db)
2. 合并结果，去重
3. 计算 opportunity_score（competitor_source = domain）
4. 批量 upsert 到 Supabase（source = 'semrush_batch'，competitor_source = domain）
5. 返回分域名的结果
```

---

## API 4：关键词差距分析

**端点：** `POST /api/semrush/keyword-gap`

**对应 SEMrush 工具：** Compare Domains / Keyword Gap

**用途：** 找到竞品有排名、但客户网站没有覆盖的关键词（最高价值机会词）

### 请求

```typescript
interface KeywordGapRequest {
  client_domain: string;          // 客户自己的域名
  competitor_domains: string[];   // 1-4 个竞品域名
  client_id: string;
  limit?: number;                 // 默认 100
  min_volume?: number;            // 默认 100
  max_kd?: number;                // 默认 60
  db?: string;
}
```

```json
{
  "client_domain": "ctstours.co.nz",
  "competitor_domains": ["wendywutours.co.nz", "intrepidtravel.com"],
  "client_id": "uuid-xxx",
  "limit": 100,
  "min_volume": 200
}
```

### 响应

```typescript
interface KeywordGapResponse {
  success: boolean;
  data: (KeywordData & {
    competitor_ranks: { domain: string; position: number }[];
    is_gap: true;                 // 标记为差距词
  })[];
  units_consumed: number;
  saved_count: number;
}
```

### 内部逻辑

```
1. 调用 SEMrush MCP: compare_domains(client_domain, competitor_domains, db)
2. 筛选：客户域名无排名 AND 至少一个竞品有排名
3. 过滤 volume / kd 阈值
4. 计算 opportunity_score（is_gap=true，加 gap_bonus）
5. 批量 upsert 到 Supabase（source = 'semrush_gap'）
6. 返回结果
```

---

## 错误处理

```typescript
// 统一错误响应格式
interface ErrorResponse {
  success: false;
  error: string;
  code: ErrorCode;
}

enum ErrorCode {
  SEMRUSH_API_ERROR    = 'SEMRUSH_API_ERROR',    // SEMrush 调用失败
  QUOTA_EXCEEDED       = 'QUOTA_EXCEEDED',        // units 不足
  INVALID_INPUT        = 'INVALID_INPUT',          // 参数错误
  SUPABASE_ERROR       = 'SUPABASE_ERROR',         // 数据库写入失败
  RATE_LIMITED         = 'RATE_LIMITED',           // 触发 SEMrush rate limit
}
```

### 处理策略

| 错误类型 | 处理方式 |
|---------|---------|
| SEMrush rate limit | 指数退避重试（最多 3 次，间隔 1s/2s/4s）|
| Units 不足 | 返回 QUOTA_EXCEEDED，不写入 Supabase |
| 单个关键词无数据 | 跳过该词，继续处理其余词 |
| Supabase 写入失败 | 记录日志，返回已处理的数据 |

---

## Units 使用监控

```typescript
// 每次 API 调用后记录 units 消耗
interface UsageLog {
  client_id: string;
  api_endpoint: string;
  units_consumed: number;
  keywords_count: number;
  called_at: timestamptz;
}
```

建议在 Supabase 新增 `semrush_usage_logs` 表，方便：
- 统计每个客户的 units 消耗
- 预警：月度用量接近 50,000 时通知 Magic Lab
- 计费：按 units 消耗向客户收费

---

## 开发建议

1. **先用 SEMrush API Test Tool 验证 endpoint**：https://developer.semrush.com/api/
2. **本地开发用 mock 数据**，不消耗真实 units
3. **生产环境每次调用必须记录 usage_log**
4. **不要在前端直接调用** SEMrush API，所有调用必须经过 Magic Lab 后端
5. **API Key 只在后端 .env 中**，绝不出现在前端代码或 git 提交中
