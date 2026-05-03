# Spec：Supabase Keywords 表 Schema

> 交给 Code 执行 | 版本：v1.0 | 日期：2026-04-25

---

## 概述

Magic Lab 的关键词数据全部存储在 Supabase。
每条关键词来自 SEMrush，经 Opportunity Score 评分后，推送 Airtable 审核。
`approved` 状态触发 Page Factory。

---

## 表结构：`keywords`

```sql
-- 启用 UUID 扩展（如尚未启用）
create extension if not exists "uuid-ossp";

-- 主表
create table public.keywords (
  id                  uuid primary key default uuid_generate_v4(),
  client_id           uuid not null references public.clients(id) on delete cascade,

  -- 核心关键词数据（来自 SEMrush）
  keyword             text not null,
  volume              integer,                        -- 月搜索量
  kd                  smallint,                       -- 关键词难度 0-100
  cpc                 numeric(6, 2),                  -- 每次点击费用（USD）
  intent              text,                           -- informational / commercial / transactional / navigational
  trend               jsonb,                          -- 12个月趋势 [{month, volume}, ...]

  -- 来源追踪
  source              text not null,                  -- semrush_batch / semrush_related / semrush_gap
  competitor_source   text,                           -- 来源竞品域名（gap 分析时填写）
  semrush_db          text default 'au',              -- SEMrush 数据库地区（au=澳洲/NZ）

  -- Magic Lab 评分
  opportunity_score   numeric(5, 2),                  -- 0-100，系统计算
  recommended_page_type text,                         -- hub / guide / landing / faq

  -- 状态流转
  status              text not null default 'new',    -- new/reviewed/approved/rejected/page_created/published
  status_updated_at   timestamptz,
  status_updated_by   text,                           -- airtable sync 或 system

  -- Page Factory 关联
  page_id             uuid references public.pages(id), -- 生成后关联页面

  -- 时间戳
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- 状态枚举约束
alter table public.keywords
  add constraint keywords_status_check
  check (status in ('new','reviewed','approved','rejected','page_created','published'));

-- intent 枚举约束
alter table public.keywords
  add constraint keywords_intent_check
  check (intent in ('informational','commercial','transactional','navigational') or intent is null);

-- 来源枚举约束
alter table public.keywords
  add constraint keywords_source_check
  check (source in ('semrush_batch','semrush_related','semrush_gap'));
```

---

## 索引

```sql
-- 按客户 + 状态查询（最常用）
create index idx_keywords_client_status
  on public.keywords(client_id, status);

-- 按 opportunity_score 排序（Page Factory 优先级）
create index idx_keywords_score
  on public.keywords(client_id, opportunity_score desc)
  where status = 'approved';

-- 关键词去重查询
create index idx_keywords_keyword_client
  on public.keywords(client_id, keyword);

-- 状态更新时间（审核日志）
create index idx_keywords_status_updated
  on public.keywords(status_updated_at desc);
```

---

## updated_at 自动更新触发器

```sql
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger keywords_updated_at
  before update on public.keywords
  for each row execute function public.handle_updated_at();
```

---

## RLS（Row Level Security）

```sql
-- 启用 RLS
alter table public.keywords enable row level security;

-- Magic Lab 内部 service role 可读写所有
create policy "service_role_full_access" on public.keywords
  for all
  to service_role
  using (true)
  with check (true);

-- 客户只能读自己的数据（如未来开放客户登录）
create policy "client_read_own" on public.keywords
  for select
  to authenticated
  using (client_id = (select client_id from public.profiles where id = auth.uid()));
```

---

## 辅助表：`clients`

```sql
create table public.clients (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  domain          text,                    -- 客户网站域名
  semrush_db      text default 'au',       -- 默认 SEMrush 地区数据库
  monthly_quota   integer default 5000,    -- 每月关键词配额
  plan_tier       text default 'starter',  -- starter / growth / enterprise
  created_at      timestamptz not null default now()
);
```

---

## 辅助表：`pages`（Page Factory 输出）

```sql
create table public.pages (
  id                uuid primary key default uuid_generate_v4(),
  client_id         uuid not null references public.clients(id) on delete cascade,
  keyword_id        uuid references public.keywords(id),
  title             text not null,
  slug              text not null,
  page_type         text,                  -- hub / guide / landing / faq
  status            text default 'draft',  -- draft / review / published
  content           jsonb,                 -- 生成的页面内容结构
  meta_description  text,
  created_at        timestamptz not null default now(),
  published_at      timestamptz
);
```

---

## Opportunity Score 计算函数

```sql
create or replace function public.calculate_opportunity_score(
  p_volume    integer,
  p_kd        smallint,
  p_cpc       numeric,
  p_intent    text,
  p_is_gap    boolean default false
)
returns numeric as $$
declare
  volume_score  numeric;
  kd_score      numeric;
  cpc_score     numeric;
  intent_score  numeric;
  gap_bonus     numeric;
begin
  -- 搜索量评分（log scale，上限 10000+）
  volume_score := least(100, (log(greatest(p_volume, 1)) / log(10000)) * 100);

  -- 低难度评分（KD 越低越好）
  kd_score := greatest(0, 100 - p_kd);

  -- CPC 评分（上限 $10）
  cpc_score := least(100, (p_cpc / 10.0) * 100);

  -- 意图评分
  intent_score := case p_intent
    when 'transactional' then 100
    when 'commercial'    then 80
    when 'navigational'  then 30
    when 'informational' then 20
    else 10
  end;

  -- 竞品差距加分
  gap_bonus := case when p_is_gap then 100 else 0 end;

  -- 加权合计
  return round(
    (volume_score  * 0.30) +
    (intent_score  * 0.30) +
    (cpc_score     * 0.20) +
    (kd_score      * 0.15) +
    (gap_bonus     * 0.05),
    2
  );
end;
$$ language plpgsql immutable;
```

---

## 数据写入示例（供 Code 参考）

```typescript
// 写入单条关键词
const { data, error } = await supabase
  .from('keywords')
  .insert({
    client_id: 'xxx',
    keyword: 'china tours new zealand',
    volume: 1900,
    kd: 24,
    cpc: 3.50,
    intent: 'commercial',
    trend: [...],
    source: 'semrush_batch',
    semrush_db: 'au',
    opportunity_score: 78.5,
    recommended_page_type: 'landing',
    status: 'new'
  });
```

---

## 注意事项

1. **去重逻辑**：同一 `client_id` + `keyword` 组合，用 `upsert` 避免重复写入
2. **批量写入**：SEMrush 批量拉取最多 100 个关键词，用 `insert` 批量写入 Supabase
3. **status 只在 Airtable 审核后由 Zapier webhook 更新**，不允许前端直接改 status
4. **page_id 关联**：Page Factory 生成页面后回填，不在关键词写入时设置
