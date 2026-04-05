# HiBiz — 路线图

> 最后更新：2026-04-05

## 版本规划总览

```
v0.1 (已完成)  ─── 底座 + 主链路跑通
v0.2 (已完成)  ─── 模板预设 + 商家信息 + 留资风控
v0.2.1 (当前)  ─── URL 提取管线（Jina Reader + LLM）
v0.3 (下一步)  ─── AI 编译器升级 + 表单生成引擎
v0.4 (规划中)  ─── 编辑体验 + 数据导出
v0.5 (规划中)  ─── 多行业扩展 + 运营工具
v1.0 (里程碑)  ─── 公开发布
```

---

## v0.1 — 底座与主链路 [已完成]

**目标**：最小可用链路跑通

- [x] Supabase 项目初始化、Auth (Magic Link)、RLS
- [x] 项目 CRUD + 列表页
- [x] Rule-based 意图编译器 (`compiler@0.2.0-rule`)
- [x] OpenAI 文案生成 (`gpt-4o-mini`)
- [x] RenderModel 装配 + 草稿预览
- [x] 发布流程：`published_model` + 表单 `active`
- [x] 公开微站 `/site/[slug]`
- [x] 独立表单 `/forms/[public_slug]`
- [x] 匿名表单提交（Server Action）

## v0.2 — 模板预设 + 商家信息 [已完成]

**目标**：垂直行业可用性

- [x] 模板预设系统 (`template-presets.ts`, `?preset=` 快捷入口)
- [x] 商家联系信息 (`merchant_profile`)
- [x] 房产推广字段 + TradeMe 链接粘贴
- [x] 打印海报 (`/app/projects/[id]/poster`)
- [x] Hero 草稿快编
- [x] 提交记录页 (`/app/projects/[id]/leads`)
- [x] 留资风控：蜜罐字段 + `check_lead_rate_limit`
- [x] 明确不做 listing 抓取/API

---

## v0.2.1 — URL 提取管线 [当前阶段]

**目标**：粘贴 TradeMe 链接自动提取房屋信息，替代旧的纯 HTML 图片抓取

### 核心管线

- [ ] `src/lib/extraction/jina-reader.ts` — Jina Reader 客户端（`r.jina.ai/{url}` → Markdown）
- [ ] `src/lib/extraction/trademe-schema.ts` — TradeMe 提取 schema（title, description, images, address, bedrooms, bathrooms, price_hint, agent）
- [ ] `src/lib/extraction/extract-listing.ts` — 统一提取入口（Jina → LLM Structured Output → 结构化数据）
- [ ] `src/lib/extraction/auto-fill.ts` — 自动填充逻辑（提取数据 → merchant_profile + 微站模块 + 海报）

### Server Action + UI

- [ ] 新 Server Action：`importFromUrl(projectId, url)` — 替代 `importTradeMePosterImagesForProject`
- [ ] UI 按钮更新：从"从 TradeMe 抓取图片"改为"从链接导入房源信息"
- [ ] 填充后自动 revalidate 项目详情页和海报页

### 清理旧代码

- [ ] 删除 `src/lib/trademe/extract-images.ts`
- [ ] 删除 `src/lib/trademe/normalize-image-url.ts`
- [ ] 更新 `merchant-profile-actions.ts` 使用新管线
- [ ] 保留 `coercePersistedTradeMeImageUrl` 用于读库兼容（已存储的旧 URL）

### 数据映射

| 提取字段 | → 填充目标 |
|---------|-----------|
| title | `property_promo.headline` |
| description | `property_promo.details` |
| images[] | `property_promo.trademe_image_urls` |
| images[0] | `property_promo.image_url` + 微站 hero |
| 全部 | 海报数据 |

### 设计决策（已确认）

- Jina Reader（非 Firecrawl）：免费 1000 万 token
- 新管线替代旧 HTML 解析，不保留旧代码作 fallback
- 直接填充，用户事后通过现有编辑界面修改
- 先做 TradeMe，学校链接后续用同一管线扩展

---

## v0.3 — AI 编译器升级 + 表单生成引擎 [下一步]

**目标**：自然语言能力从"关键词匹配"升级为"语义理解"（含学校链接提取管线扩展）

### 0.3.1 — 混合编译器 (Rule + LLM)

- [ ] 定义 `CompiledIntentV2` 类型（新增 `module_selection`, `form_field_hints`, `business_context`）
- [ ] 实现 LLM Compiler（OpenAI Structured Output）
- [ ] Rule Guard 前置：不支持行业拦截、城市检测、中文检测、合规词过滤
- [ ] 规则高置信度时跳过 LLM（成本优化）
- [ ] 编译器版本升级为 `compiler@0.3.0-hybrid`
- [ ] 保持 V1 向后兼容（已有项目不受影响）

### 0.3.2 — 表单生成引擎

- [ ] 定义字段池 `FieldRegistry`（基础字段 + 房产字段 + 移民字段 + 通用字段）
- [ ] 实现 LLM Form Builder（从字段池选取 + 定制 label）
- [ ] 强制字段规则（full_name + email 不可删除）
- [ ] 字段数上限 12、select options 上限 15
- [ ] 自定义字段支持（最多 2 个 `custom_1`/`custom_2`）
- [ ] `FormFieldsFileV2` 类型 + 迁移兼容

### 0.3.3 — 模块选择

- [ ] `assembleRenderModelV2` 支持按 `module_selection` 动态装配
- [ ] 最小模块集约束：`hero` + `form` + `footer`
- [ ] Copy Generator 只为 selected modules 生成文案

### 0.3.4 — 质量保障

- [ ] 编译器单元测试（Rule Guard 覆盖率 > 90%）
- [ ] LLM 输出 Schema 校验测试
- [ ] 端到端测试：自然语言 → 生成 → 渲染
- [ ] Fallback 路径测试（LLM 超时/错误时回退到规则编译）

---

## v0.4 — 编辑体验 + 数据管理 [规划中]

**目标**：生成后的可编辑性和数据价值

### 编辑

- [ ] 模块级可视化编辑（点击模块 → 编辑槽位内容）
- [ ] 表单字段拖拽排序 + 增删
- [ ] 主题色切换（封闭色板：trust_teal, warm_neutral, premium_minimal）
- [ ] "AI 重写"单模块文案（保持 scope 封闭）

### 数据

- [ ] 线索 CSV 导出 + 筛选
- [ ] 推广图直传 Supabase Storage（替代粘贴 URL）
- [ ] 提交数据仪表盘（总量、来源、趋势）

### 通知

- [ ] 新线索邮件通知（可选）
- [ ] Webhook 通知（预留）

---

## v0.5 — 多行业扩展 + 运营 [规划中]

**目标**：从两个行业扩展到更多，加入运营能力

### 行业扩展

- [ ] 行业插件架构（新行业 = 新 preset + 新字段池 + 新合规规则）
- [ ] 候选行业评估：健康/美容、法律咨询、教育培训
- [ ] 行业 onboarding 引导流程

### 运营

- [ ] 观测与埋点（对齐 Obsidian `06-观测` 文档）
- [ ] A/B 测试框架（模板 variant 级别）
- [ ] 用户行为分析（生成→发布转化率等）

---

## v1.0 — 公开发布 [里程碑]

**准入条件**：

- [ ] 至少 3 个行业 preset 稳定运行
- [ ] 自定义域名支持
- [ ] 生产环境 Runbook 完成（对齐 `07-多环境` 文档）
- [ ] 付费增值功能上线（自定义域名、高级数据导出）
- [ ] 安全审计通过
- [ ] 性能基线：生成 < 15 秒，页面加载 < 2 秒

---

## 未来探索（仅预留，不排期）

- 二维码生成
- Facebook/Google 广告创意生成
- MCP 集成
- 多语言扩展（不限于中英）
- 学习层（用户编辑反馈 → 优化生成质量）
- 组织/团队协作
- Magic Lab 官网导流 API
