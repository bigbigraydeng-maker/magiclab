# HiBiz — 变更日志

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)。
版本号遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

---

## [0.3.0] - 开发中

### 规划中

- 混合编译器（Rule + LLM），`CompiledIntentV2`
- 表单生成引擎（字段池 + LLM 选取）
- 模块动态选择（`module_selection`）
- Copy Generator 按需生成

---

## [0.2.0] - 2026-04-05

### 新增

- **模板预设系统**：`src/data/template-presets.ts`，6 个行业场景预设（房产 3 + 移民 3）
- **快捷入口**：`/app/projects/new?preset=re_open_home` 等 URL 直达
- **商家联系信息**：`microsites.merchant_profile` 字段，Contact 区块覆盖
- **房产推广字段**：HTTPS 图片 URL 进 hero、TradeMe 粘贴链接
- **打印海报**：`/app/projects/[id]/poster` 页面
- **Hero 草稿快编**：不改图，上线需再 Publish
- **提交记录页**：`/app/projects/[id]/leads`
- **留资风控**：蜜罐字段 + `check_lead_rate_limit`（每表单 80/小时、同 IP 哈希 10/10 分钟）

### 数据库迁移

- `20260405120000_merchant_profile.sql` — `merchant_profile` JSONB 列 + 更新 `microsites_published` 视图

### 决策

- 明确**不提供**房源 listing 抓取/API，手动输入为主

---

## [0.1.0] - 2026-04-04

### 新增

- **认证**：Supabase Magic Link 登录 + `/auth/callback`
- **深链保留**：未登录访问时 `next` 参数保留完整路径（含 `?preview=1`）
- **项目管理**：列表 / 新建 / 详情
- **意图编译**：Rule-based 编译器 `compiler@0.2.0-rule`，支持双行业 8 场景
- **文案生成**：OpenAI `gpt-4o-mini` 生成 `GeneratedCopyV1`（hero, offer, faq, about, contact, form_section）
- **模型装配**：`assembleRenderModel` → `RenderModelV1`（7 模块固定顺序）
- **表单预设**：`buildFormPreset` 按 industry + scene 返回字段列表
- **草稿预览**：`?preview=1` 参数 + 独立 `/preview` redirect
- **发布流程**：`published_model` + `published_at` + 表单 `active` + 项目 `published`
- **公开微站**：`/site/[slug]` 路由
- **独立表单**：`/forms/[public_slug]` 路由
- **匿名提交**：Server Action 校验 + RLS 匿名写策略

### 数据库迁移

- `20260404120000_hibiz_public_rls.sql` — 公开读 + 匿名写 RLS 策略
- `20260404200000_hibiz_lead_rate_limit_fn.sql` — `check_lead_rate_limit` 数据库函数

### 技术决策

- 选择 Server Actions 而非 Edge Functions 处理表单提交（简化部署）
- 选择 Rule-based 编译器作为 MVP（零 API 成本，确定性高）
- OpenAI `gpt-4o-mini` 作为默认模型（成本/质量平衡）
