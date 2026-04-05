# HiBiz — Agent 工作指南

## 产品

- **HiBiz**（Magic Lab 旗下）：新西兰本地商家的 AI 微站 + 表单引擎。
- Phase 1 行业：**房地产**、**留学移民**；无餐厅。
- 详细规格见 Obsidian：`01-Magiclab/Projects/HiBiz/`。
- 项目全景见 [PROJECT.md](./PROJECT.md)，路线图见 [ROADMAP.md](./ROADMAP.md)。

## 技术栈

| 层 | 技术 |
|----|------|
| Framework | Next.js 14 App Router, TypeScript strict |
| UI | React 18 + Tailwind 3.4 |
| Backend | Supabase Auth + Postgres + RLS |
| AI | OpenAI API (gpt-4o-mini), Structured Output |
| URL 提取 | Jina Reader (`r.jina.ai`) → Markdown → LLM 结构化提取 |
| Deploy | Vercel（计划） |

## 核心架构

```
用户 raw_prompt
  → Rule Guard（正则预过滤、城市/语言检测）
  → LLM Compiler（意图编译 → CompiledIntentV2）
  → 用户确认
  → LLM Copy Generator + LLM Form Builder（并行）
  → assembleRenderModel（确定性装配）
  → Schema 校验 + 合规过滤
  → RenderModelV2 → 草稿预览 → 发布
```

### 关键文件映射

| 功能 | 文件 |
|------|------|
| 意图编译（规则） | `src/lib/compiler/rule-based.ts` |
| 文案生成 | `src/lib/generation/openai-copy.ts` |
| 表单预设 | `src/lib/generation/form-presets.ts` |
| 模型装配 | `src/lib/generation/assemble.ts` |
| 类型定义 | `src/types/compiled-intent.ts`, `render-model.ts` |
| 模板预设 | `src/data/template-presets.ts` |
| Server Actions | `src/app/app/projects/intent-actions.ts`, `generation-actions.ts` |
| URL 提取（Jina + LLM） | `src/lib/extraction/`（`jina-reader.ts`, `extract-listing.ts`, `auto-fill.ts`） |
| 读库 URL 兼容 | `src/lib/extraction/legacy-url.ts`（`coercePersistedTradeMeImageUrl`） |
| 商家信息 | `src/types/merchant-profile.ts`, `merchant-profile-actions.ts` |

## 约定

- 不在浏览器暴露 `service_role`。
- 匿名表单提交由 Server Action 写入 `submissions`（已实现，含蜜罐 + 限流）。
- **开放输入，封闭执行**：LLM 只做意图解析和文案填充，模块选择和渲染由代码控制。
- LLM 输出必须经过 Schema 校验，禁止直接渲染未校验的 LLM 输出。
- 所有枚举值（industry, scene, module type, field type）封闭定义在 TypeScript 类型中。

## 编码规范

- TypeScript 严格模式，禁止 `any`
- 组件 props 必须有 interface
- 文件 < 400 行，函数 < 50 行
- 不可变数据模式：创建新对象，不修改已有对象
- 错误显式处理，不静默吞掉

## AI 工程约定

- **编译器分层**：Rule Guard（零成本、确定性） → LLM Compiler（需 API、有成本）
- **成本控制**：编译失败不触发生成；用户确认后才调 Copy Generator
- **可审计**：CompiledIntent 是中间层，用户确认的是"意图"而非"页面代码"
- **Structured Output**：LLM 调用必须使用 `response_format: { type: "json_object" }` 或 JSON Schema
- **Fallback**：LLM 输出字段缺失时使用 `coerceString()` 等函数提供默认值

## URL 提取管线（v0.2.1）

用户粘贴外部 URL 时，统一走 Jina Reader + LLM 提取管线，替代旧的纯 HTML 正则解析。

### 管线流程

```
用户粘贴 URL（如 TradeMe 房源链接）
  → Jina Reader (r.jina.ai/{url}) → 干净 Markdown
  → OpenAI Structured Output → 结构化数据 {title, description, images[], ...}
  → 自动填充 merchant_profile + 微站模块 + 海报数据
  → 用户在现有界面事后编辑
```

### 设计决策

- **Jina Reader 而非 Firecrawl**：免费 1000 万 token，足够 MVP；API 极简（一行 GET）
- **旧 HTML 抓取管线已移除**：统一使用 `src/lib/extraction/`（Jina Reader + OpenAI）
- **直接填充，不需用户确认**：提取结果直接写入，用户通过现有编辑界面事后修改
- **先 TradeMe，后学校链接**：同一管线，不同的 LLM 提取 schema
- **统一管线位置**：`src/lib/extraction/`

### TradeMe 提取 Schema

```typescript
interface TradeMeListingData {
  title: string;              // 房屋标题
  description: string;        // 房屋描述
  address: string | null;     // 地址
  bedrooms: number | null;
  bathrooms: number | null;
  price_hint: string | null;  // "Auction", "By negotiation", "$850,000" 等
  images: string[];           // 图片 URL 列表
  agent_name: string | null;  // 中介姓名
  agent_company: string | null;
}
```

### 自动填充映射

| 提取字段 | 填充目标 |
|---------|---------|
| title | `merchant_profile.property_promo.headline` |
| description | `merchant_profile.property_promo.details` |
| images | `merchant_profile.property_promo.trademe_image_urls` |
| images[0] | `merchant_profile.property_promo.image_url` |
| title + images[0] | 微站 hero 模块 |
| 全部数据 | 海报 |

## 禁止

- 勿将 HiBiz 与根目录 Magic Lab **静态 export** 站混为同一部署目标
- 禁止让 LLM 直接生成 RenderModel 或 HTML
- 禁止在表单中使用不在封闭字段类型枚举内的 type
- 禁止硬编码联系信息、API key
- 禁止「包过」「保证批签」等合规违规文案

## Agent 使用指南

| 场景 | 推荐 Agent |
|------|-----------|
| 新功能开发 | `planner` → `tdd-guide` → `code-reviewer` |
| 编译器 / AI 管线改动 | `architect` → `security-reviewer` |
| 组件重构 | `refactor-cleaner` → `code-reviewer` |
| 构建失败 | `build-error-resolver` |

## 输出语言

所有对话用中文。
