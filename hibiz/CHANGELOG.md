# HiBiz — 变更日志

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)。
版本号遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

---

## [0.3.0] - 开发中

### 规划中

- **社媒文案 AI 生成**：内容类型模板（Just Listed / Just Sold / Open Home / 市场周报 / 买房贴士）
- **中英双语文案**：AI 生成适配各平台字数的社交媒体文案
- **模板化海报**：HTML-to-image 渲染，支持 1:1 / 4:5 / 9:16 社交媒体尺寸
- **发布包导出**：图片 + 文案打包，长按保存 / `navigator.share` 系统分享
- **Meta Graph API**：Facebook + Instagram 一键发布
- **LinkedIn API**：LinkedIn 发帖集成
- **小红书 / 微信**：生成内容包（图文导出，无官方 API）
- **数据仪表盘**：微站访问量、表单提交数、转化率、UTM 追踪

---

## [0.2.2] - 2026-04-06

### 新增

- **骨架模板系统**：预制骨架 + AI 填肉（`TemplateSkeleton` 类型 + `assembleRenderModelFromSkeleton`）
- **3 套房产骨架**：Classic Agent / Property Showcase / Bilingual Pro
- **分步创建流程**：选行业 → 选骨架 → 填信息 → 预览微调（4 步 stepper）
- **手动房源管理**：名称、地址、图片上传、介绍、TradeMe 跳转链接
- **表单模板**：Open Home Registration / Buyer Inquiry / Property Valuation（`FormTemplateId` 联合类型）
- **联系方式自动带入海报**：name / phone / email / logo / QR 从 profile 映射
- **模块开关**：toggle 切换可见性 + 配色方案选择 + 行内文字编辑
- **图片上传安全**：MIME allowlist + 魔数校验（`validateImageUpload`），阻止 SVG XSS
- **Server Action 授权**：所有写操作增加 `projects.user_id` 所有权校验

### 技术改进

- 扩展 `MerchantProfileV1`：`logo_url`、`wechat_qr_url`、`whatsapp`、`property_listings[]`、`module_visibility`、`theme_overrides`
- 扩展 `RenderModuleType`：新增 `listings`、`testimonials`、`openHome`、`services`
- `TemplateSkeleton.defaultFormTemplate` 类型收紧为 `FormTemplateId`（非 string）
- 不可变数据模式修复：`reapplySkeletonDraft` 从 in-place mutation 改为 map+spread

---

## [0.2.1] - 2026-04-07

### 新增

- **Render 生产部署**：`render.yaml`、Root Directory `hibiz/`、`hibiz-service.onrender.com`
- **TradeMe 提取管线 v2**：三层 fallback（API → `__NEXT_DATA__` → Jina + OpenAI）
- **TradeMe OAuth API**：`trademe-api.ts`，OAuth 1.0a 两脚认证，自动检测 sandbox/prod
- **提取质量门**：`quality-gate.ts`，0-100 评分，good/partial/failed 分级
- **图片代理**：`image-proxy.ts`，Referer header 拉取 → Supabase Storage 持久化
- **Jina Reader Pro**：`X-Wait-For-Selector` + `X-Timeout` 头部支持
- **Auth Render 适配**：`externalOrigin()` 使用 `X-Forwarded-Host` 解决反向代理重定向

### 数据库迁移

- `20260406140000_listing_images_storage.sql` — Supabase Storage `listing-images` bucket + 公开读策略

### 设计决策

- TradeMe 主动封锁非浏览器请求（Jina/fetch 均返回 500），确认 Official API 为唯一可靠路径
- 三层 fallback 保证降级可用
- Render 替代 Vercel 作为部署目标（Server Actions + Supabase 需要 SSR）

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
