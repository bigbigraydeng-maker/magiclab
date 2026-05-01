# Phase 8 — 客户陪跑工作流完善 实施计划

## P8.1 客户接入向导（5 分钟新客户建档）

### 目标
设计一个 3 步骤的客户快速上线流程，让新客户在 5 分钟内完成基础配置，仿 SEOPro 风格。

### 3-Step Onboarding Flow

#### Step 1: 基础信息（Basic Setup）
- 字段：
  - 客户名称（Customer Name）
  - 官网域名（Website Domain）
  - 目标市场（Target Market）：下拉选 AU / NZ / Other
- 验证：
  - 名称必填
  - 域名格式验证（可选，可为空）
  - 市场必选
- 后端保存：`clients` 表
  ```sql
  INSERT INTO clients (name, domain, semrush_db, plan_tier, monthly_quota)
  VALUES ($1, $2, $3, 'starter', 1000)
  ```

#### Step 2: Content Workspace 集成（内容协作）
- 选项 A：连接现有 Airtable Base
  - 字段：Airtable Base ID
  - 验证：调用 Airtable API 验证 base 存在
  - 保存到 `clients.airtable_base_id`
- 选项 B：使用内置默认工作区（暂无需实现，显示"Coming Soon"）
- 前进条件：任选一个选项（必填）

#### Step 3: 关键词数据库 + 配额（Keyword Setup）
- 字段：
  - SEMrush 数据库国家（Keyword Database）：AU / NZ / US / GB / CA
  - 月度生成配额（Monthly Quota）：默认 1000，可调整到 500-5000
- 默认值：
  - 如 Step 1 选了 AU，自动选中 AU
  - 如 Step 1 选了 NZ，自动选中 NZ
  - 如 Step 1 选了 Other，default AU
- 保存到 `clients` 表
  ```sql
  UPDATE clients 
  SET semrush_db = $1, monthly_quota = $2
  WHERE id = $3
  ```

### UI 组件结构

```
src/app/dashboard/clients/onboarding/
├── page.tsx                    # 主向导页，管理步骤导航
├── components/
│   ├── StepIndicator.tsx      # 进度条（Step 1/2/3）
│   ├── Step1BasicInfo.tsx     # Step 1 表单
│   ├── Step2Workspace.tsx     # Step 2 表单
│   ├── Step3Keywords.tsx      # Step 3 表单
│   └── OnboardingLayout.tsx   # 统一布局框架
```

### API 增强

#### POST /api/clients/onboarding
新建 onboarding 专用端点，支持多步骤创建：

```typescript
// 步骤 1：创建空客户
POST /api/clients/onboarding
{
  "step": 1,
  "name": "CTS Tours",
  "domain": "ctstours.co.nz",
  "target_market": "nz"
}
→ { client_id: "uuid", step: 1 }

// 步骤 2：关联 Airtable
POST /api/clients/onboarding
{
  "step": 2,
  "client_id": "uuid",
  "airtable_base_id": "appXXX",
  "airtable_content_table_id": "tblYYY"  // 可选，API 自动查询
}
→ { client_id: "uuid", step: 2, status: "verified" }

// 步骤 3：完成配置
POST /api/clients/onboarding
{
  "step": 3,
  "client_id": "uuid",
  "semrush_db": "nz",
  "monthly_quota": 1200
}
→ { client_id: "uuid", status: "complete", redirect_to: "/dashboard/clients/uuid" }
```

#### GET /api/clients/[id]/onboarding-status
查询客户的 onboarding 完成度：
```typescript
→ {
  client_id: "uuid",
  step1_complete: true,
  step2_complete: false,  // 还未关联 Airtable
  step3_complete: false,
  can_use_dashboard: false  // 所有步骤完成后才能用
}
```

### 数据库修改

#### clients 表增加字段（可选）
```sql
ALTER TABLE clients ADD COLUMN onboarding_completed_at TIMESTAMPTZ;
```

### 验收标准

- [ ] 3-step 向导 UI 完成，支持前后导航
- [ ] Step 1：名称 + 域名 + 市场国家 必填验证
- [ ] Step 2：Airtable Base ID 验证（调用 API 确认存在）
- [ ] Step 3：SEMrush 国家/配额设置，完成后自动跳转主 Dashboard
- [ ] 新建端点 `/api/clients/onboarding` 支持 3 个步骤
- [ ] 从 Dashboard 首页可快速新增客户（"New Client" 按钮 → /onboarding）
- [ ] 所有步骤完成后，新客户自动在客户列表中出现
- [ ] 错误处理：Airtable base 不存在时清晰提示，允许重试

### 关键决策

1. **数据持久化时机**：
   - ✅ 选择：每步完成立即保存到数据库（不用 draft 状态）
   - 原因：简化逻辑，避免未完成的孤立记录

2. **Airtable 验证**：
   - ✅ 选择：API 端点调用 Airtable API 验证 base 存在
   - 原因：及早发现错误，UX 更好

3. **默认配置**：
   - plan_tier：始终 'starter'（2026 只有一个 tier）
   - semrush_db：跟随 target_market（AU→au, NZ→nz）
   - monthly_quota：默认 1000（可调整）

4. **完成后重定向**：
   - Step 3 完成 → 自动跳转 `/dashboard/clients/{client_id}`
   - 不停留在 onboarding 页面

---

## P8.2–P8.5 概览（待详细规划）

### P8.2: PDF 月报导出 + 邮件发送
- 依赖：AI Visibility Tracker 完整数据（Phase 7.1）
- 任务：生成 PDF 报告 + 邮件模板 + 定时发送

### P8.3: 站点权威度追踪
- 新增数据库表 `site_authority_metrics`
- 集成 SEMrush API（Domain Authority）或 Ahrefs API（可选）
- Monthly cron 任务

### P8.4: 客户 Portal
- 新建 `/portal/[client_id]` 隔离路由
- 客户只能看自己的数据
- 简化版 Dashboard（只读）

### P8.5: Dashboard 简单鉴权
- 密码保护或 Magic Link
- 暂不实现用户系统（成本高）
- 建议 Magic Link（一次性邮件链接）

---

## 开发顺序

1. **P8.1**（本周完成）
   - UI 组件设计
   - API 端点实现
   - 集成测试

2. **P8.2**（下周）
   - 依赖 Phase 7.1 数据完整

3. **P8.3–P8.5**（后续）

