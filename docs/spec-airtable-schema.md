# Spec：Airtable 审核视图 Schema

> 交给 Code 执行 | 版本：v1.0 | 日期：2026-04-25

---

## 概述

Airtable 是**人工审核层**，客户（或 Magic Lab 运营）在这里决定哪些关键词进入 Page Factory。

客户不知道底层是 Supabase 或 SEMrush，只看到一个"关键词审核表"。

数据流向：
```
Supabase keywords（status=new）
    → Zapier 自动同步到 Airtable
    → 人工审核，改状态为 approved / rejected
    → Zapier webhook 回写 Supabase
    → approved 自动触发 Page Factory
```

---

## Airtable Base 结构

**Base 名称：** `Magic Lab — [客户名] SEO Hub`（每个客户一个 Base）

**Tables：**
1. `Keywords`（主审核表）
2. `Pages`（Page Factory 输出，只读）
3. `Config`（客户配置，内部用）

---

## Table 1：Keywords（主表）

### 字段定义

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `Keyword` | Single line text | 关键词（主字段）|
| `Status` | Single select | 审核状态（见下方选项）|
| `Opportunity Score` | Number（小数1位）| 0-100，系统计算，越高越优先 |
| `Volume` | Number（整数）| 月搜索量 |
| `KD` | Number（整数）| 关键词难度 0-100 |
| `CPC (USD)` | Currency | 每次点击费用 |
| `Intent` | Single select | 搜索意图 |
| `Trend` | Long text | 趋势描述（如 "↑ 稳定增长"）|
| `Source` | Single select | 数据来源 |
| `Competitor Source` | Single line text | 来源竞品域名（gap 词填写）|
| `Recommended Page Type` | Single select | 建议页面类型 |
| `Notes` | Long text | 审核备注（人工填写）|
| `Supabase ID` | Single line text | 对应 Supabase keywords.id（用于回写）|
| `Created At` | Date | 数据创建时间 |
| `Status Updated At` | Date | 状态最后更新时间 |

---

### Status 选项（Single Select 颜色）

| 选项 | 颜色 | 说明 |
|------|------|------|
| `New` | 灰色 | 刚从 SEMrush 同步，未审核 |
| `Reviewed` | 蓝色 | 已查看，待决策 |
| `Approved` | 绿色 | 确认生成页面 → 触发 Page Factory |
| `Rejected` | 红色 | 不做此关键词 |
| `Page Created` | 紫色 | 页面已生成（系统自动回填）|
| `Published` | 深绿色 | 已上线（系统自动回填）|

---

### Intent 选项

| 选项 | 颜色 |
|------|------|
| `Transactional` | 深绿（高价值）|
| `Commercial` | 绿色 |
| `Informational` | 黄色 |
| `Navigational` | 灰色 |

---

### Source 选项

| 选项 | 说明 |
|------|------|
| `SEMrush Batch` | 批量关键词概览 |
| `SEMrush Related` | 相关关键词扩展 |
| `SEMrush Gap` | 竞品差距分析 |

---

### Recommended Page Type 选项

| 选项 | 说明 |
|------|------|
| `Hub` | 目的地/话题总页 |
| `Guide` | 深度指南文章 |
| `Landing` | 商业转化落地页 |
| `FAQ` | 问答页 |

---

## Table 1：Keywords — 视图设计

### 视图 1：「待审核」（默认视图）

**筛选条件：** Status = New 或 Reviewed
**排序：** Opportunity Score 降序
**隐藏字段：** Supabase ID、Created At、Status Updated At
**用途：** 日常审核工作台

---

### 视图 2：「已批准」

**筛选条件：** Status = Approved 或 Page Created
**排序：** Status Updated At 降序
**用途：** 跟踪 Page Factory 进度

---

### 视图 3：「机会词（高分）」

**筛选条件：** Opportunity Score ≥ 70 AND Status = New
**排序：** Opportunity Score 降序
**用途：** 快速找到最高优先级词

---

### 视图 4：「竞品差距词」

**筛选条件：** Source = SEMrush Gap AND Status = New
**排序：** Opportunity Score 降序
**用途：** 专门审核竞品差距机会

---

## Table 2：Pages（只读）

Page Factory 生成页面后，自动同步到这里供客户查看进度。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `Title` | Single line text | 页面标题 |
| `Slug` | URL | 页面路径 |
| `Page Type` | Single select | hub/guide/landing/faq |
| `Status` | Single select | Draft / Review / Published |
| `Source Keyword` | Link to Keywords | 关联的关键词记录 |
| `Published URL` | URL | 上线后的完整 URL |
| `Published At` | Date | 上线时间 |

---

## Zapier 自动化说明（Code 实现参考）

### Automation 1：Supabase → Airtable 同步（新关键词）

**触发：** Supabase `keywords` 表新增记录（status = new）
**动作：** 在 Airtable Keywords 表新增一行
**字段映射：**
```
Airtable Keyword          ← Supabase keyword
Airtable Status           ← "New"
Airtable Opportunity Score ← Supabase opportunity_score
Airtable Volume           ← Supabase volume
Airtable KD               ← Supabase kd
Airtable CPC (USD)        ← Supabase cpc
Airtable Intent           ← Supabase intent（首字母大写）
Airtable Source           ← Supabase source（转换显示名）
Airtable Competitor Source ← Supabase competitor_source
Airtable Recommended Page Type ← Supabase recommended_page_type
Airtable Supabase ID      ← Supabase id
Airtable Created At       ← Supabase created_at
```

---

### Automation 2：Airtable → Supabase 回写（状态变更）

**触发：** Airtable Keywords 表 Status 字段变更
**条件：** 新 Status = Approved 或 Rejected
**动作：** 调用 Supabase REST API 更新对应记录

```
PATCH /rest/v1/keywords?id=eq.{Supabase ID}
{
  "status": "approved",              // 或 "rejected"
  "status_updated_at": "{now}",
  "status_updated_by": "airtable"
}
```

---

### Automation 3：Approved → Page Factory 触发

**触发：** Supabase `keywords` 表 status 变为 `approved`（由 Supabase Trigger 监听）
**动作：** 调用 Page Factory webhook，传入：
```json
{
  "keyword_id": "uuid",
  "keyword": "china tours new zealand",
  "page_type": "landing",
  "client_id": "uuid",
  "opportunity_score": 78.5
}
```

---

## 注意事项

1. **每个客户独立 Airtable Base** — 客户之间数据隔离
2. **客户只有 Keywords 和 Pages 两个表的权限** — Config 表 Magic Lab 内部持有
3. **Supabase ID 字段不展示给客户** — 在客户视图中隐藏此列
4. **审核操作只有 Status 字段可改** — 其余字段锁定（Airtable 字段权限设置）
5. **Zapier 用 Magic Lab 的账号连接** — 不需要客户授权 Zapier
