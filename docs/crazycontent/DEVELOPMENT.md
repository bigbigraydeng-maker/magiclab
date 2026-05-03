# Magic Engine 开发指南

## 开发环境设置

### 安装依赖
```bash
cd "magic lab/crazycontent"
npm install
```

### 启动开发服务器
```bash
npm run dev
```
- 访问 http://localhost:3001
- 支持 HMR（热重载）

### 构建与测试
```bash
npm run build        # 生产构建
npm test             # 测试（如果配置了）
npm run type-check   # TypeScript 类型检查
```

---

## 代码组织规范

### 文件结构约定

```
src/
├── app/                          # Next.js 应用目录
│   ├── dashboard/
│   │   ├── layout.tsx           # 侧边栏导航
│   │   ├── page.tsx             # 概览页面
│   │   ├── clients/
│   │   │   └── [id]/
│   │   │       ├── page.tsx     # 客户详情（Airtable 配置表）
│   │   │       └── embed.tsx    # Embed 视图（规划中）
│   │   ├── visuals/
│   │   │   └── page.tsx         # Content Workbench★（主要操作台）
│   │   ├── keywords/
│   │   │   └── page.tsx         # 关键词库
│   │   ├── content/
│   │   │   └── page.tsx         # 内容看板
│   │   ├── gallery/
│   │   │   └── page.tsx         # Gallery 视图（规划中）
│   │   └── layout.tsx
│   └── api/
│       ├── clients/
│       │   ├── route.ts         # GET 客户列表
│       │   └── [id]/
│       │       ├── route.ts     # GET 客户详情
│       │       └── posts/
│       │           └── route.ts # GET 客户帖子列表
│       ├── posts/
│       │   └── [id]/
│       │       └── route.ts     # PATCH 更新帖子（含 Airtable 写回）★
│       ├── airtable/
│       │   ├── pull-content/
│       │   │   └── route.ts     # Sync 的核心★（字段映射）
│       │   ├── sync-content/
│       │   │   └── route.ts     # POST 同步单个帖子
│       │   ├── pull-keywords/
│       │   │   └── route.ts     # GET 关键词同步
│       │   └── sync-keywords/
│       │       └── route.ts     # POST 关键词同步
│       ├── visual/
│       │   ├── image/
│       │   │   └── route.ts     # POST 触发图片生成
│       │   ├── video/
│       │   │   └── route.ts     # POST 触发视频生成
│       │   ├── status/
│       │   │   └── [assetId]/route.ts # GET 生成状态轮询
│       │   └── assets/
│       │       └── route.ts     # GET 资产列表
│       ├── publer/
│       │   ├── schedule/
│       │   │   └── route.ts     # POST 发布到 Publer
│       │   └── draft/
│       │       └── [assetId]/route.ts # GET 发布预填数据
│       ├── cron/
│       │   └── sync-airtable/
│       │       └── route.ts     # POST 定时同步（未来）
│       └── health/
│           └── route.ts         # GET 健康检查
└── lib/
    ├── supabase.ts              # Supabase 客户端（supabaseAdmin）
    ├── airtable/
    │   └── client.ts            # Airtable REST API 封装
    ├── visual/
    │   ├── wavespeed.ts         # Atlas Cloud 图片生成
    │   └── seedance.ts          # Atlas Cloud 视频生成
    ├── publer/
    │   └── client.ts            # Publer API 封装
    ├── semrush/
    │   └── client.ts            # SEMrush API 封装
    ├── openai/
    │   └── client.ts            # OpenAI GPT-4o-mini
    └── types.ts                 # 通用类型定义
```

### 模块大小约定

| 项目 | 限制 | 说明 |
|------|------|------|
| 单个函数 | < 50 行 | 超过时拆分 |
| 单个文件 | < 800 行 | 超过时提取模块 |
| 页面组件 | < 600 行 | 提取子组件 |
| API 路由 | < 400 行 | 提取 lib 函数 |

---

## TypeScript 规范

### 类型定义

**必须为所有函数签名添加类型：**
```typescript
// ✅ 正确
async function syncAirtable(
  clientId: string,
  tableId: string
): Promise<SyncResult> {
  // ...
}

// ❌ 错误（使用了 any）
async function syncAirtable(clientId: any, tableId: any) {
  // ...
}
```

### 共享类型

在 `src/lib/types.ts` 中定义跨多个模块使用的类型：
```typescript
// types.ts
export interface ContentPost {
  id: string
  client_id: string
  title: string
  status: 'draft' | 'approved' | 'scheduled' | 'published'
  // ...
}

export interface AirtableRecord {
  id: string
  fields: Record<string, unknown>
  // ...
}

export interface SyncResult {
  success: boolean
  total: number
  created: number
  updated: number
  errors?: string[]
}
```

**在路由中导入：**
```typescript
import { ContentPost, SyncResult } from '@/lib/types'
```

### 禁止使用 `any`

除非有非常充分的理由，否则：
```typescript
// ❌ 不要这样做
const data: any = await fetch(url).then(r => r.json())

// ✅ 这样做
const data = await fetch(url).then(r => r.json() as Promise<ContentPost>)
```

---

## API 路由规范

### 导出命名约定

```typescript
// src/app/api/airtable/pull-content/route.ts

// 支持的 HTTP 方法导出为大写函数名
export async function GET(request: Request) {
  // 处理 GET 请求
}

export async function POST(request: Request) {
  // 处理 POST 请求
}

// 禁止：
// export default async function handler(req, res) {} ← 不用这个模式
```

### 错误响应格式

所有 API 路由都应返回统一的错误响应：

```typescript
// 成功 (200)
{
  "success": true,
  "data": { /* payload */ }
}

// 失败 (400/500)
{
  "success": false,
  "error": "Human-readable error message"
}

// 分页
{
  "success": true,
  "data": { /* payload */ },
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

### 参数验证

在处理请求前验证所有输入：

```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const clientId = searchParams.get('client_id')
  
  // 验证必填参数
  if (!clientId) {
    return Response.json(
      { success: false, error: 'client_id required' },
      { status: 400 }
    )
  }
  
  // 继续处理...
}
```

---

## Supabase 操作规范

### 客户端初始化

**在 handler 内部初始化，不在模块顶层：**

```typescript
// ✅ 正确
export async function POST(request: Request) {
  const { createClient } = await import('@/lib/supabase')
  const supabase = createClient()
  
  // 使用 supabase
}

// ❌ 错误（在文件顶层初始化）
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  // 使用 supabase
}
```

### 查询模式

**使用 service role 进行受信任操作：**

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
```

**在 API 路由中使用：**

```typescript
// src/app/api/airtable/pull-content/route.ts
import { createAdminClient } from '@/lib/supabase'

const supabase = createAdminClient()

const { data, error } = await supabase
  .from('content_posts')
  .select('*')
  .eq('client_id', clientId)
```

### 批量操作

对于大量记录，使用事务或批处理：

```typescript
// 插入多条记录
const { error } = await supabase
  .from('content_posts')
  .insert(
    records.map(r => ({
      client_id: clientId,
      title: r.fields['Headline_EN'],
      // ... 更多字段
      airtable_record_id: r.id
    }))
  )

if (error) {
  console.error('[airtable/pull-content] Insert error:', error)
  // 收集错误信息
}
```

---

## Airtable 集成规范

### API 客户端使用

```typescript
// src/lib/airtable/client.ts
import { listRecords, updateRecord } from '@/lib/airtable/client'

// 列出记录（支持 filterByFormula）
const records = await listRecords({
  baseId: 'appXXX',
  tableId: 'tblYYY',
  filterByFormula: "LOWER({Status}) = 'ready'"
})

// 更新单条记录
await updateRecord({
  baseId: 'appXXX',
  tableId: 'tblYYY',
  recordId: 'recZZZ',
  fields: { 'Image_URL': 'https://...' }
})
```

### 字段映射模式

```typescript
// 标准映射函数
function mapNewTableFields(f: Record<string, unknown>) {
  return {
    title: (f['Headline_EN'] as string) || '',
    caption: (f['Caption_EN'] as string) || '',
    script: (f['Video_Text_Overlay'] as string) || '',
    hashtags: (f['Hashtags_IG'] as string)
      ?.split(/\s+/)
      .map(s => s.trim())
      .filter(Boolean) || [],
    visual_brief: (f['LoveArt_Prompt_EN'] as string) || '',
    status: (f['Status'] as string) === 'ready' ? 'approved' : 'draft',
    // ... 更多字段
  }
}
```

### 写回 Airtable（异步，静默失败）

在 API 路由中修改帖子后，异步写回 Airtable，但不影响主流程：

```typescript
// src/app/api/posts/[id]/route.ts
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { title, caption } = await request.json()
  
  // 1. 更新 Supabase（主操作）
  const { data: post, error } = await supabase
    .from('content_posts')
    .update({ title, caption })
    .eq('id', params.id)
    .select()
    .single()
  
  if (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 })
  }
  
  // 2. 异步写回 Airtable（不影响响应）
  if (post.airtable_record_id) {
    updateRecord({
      baseId: post.airtable_base_id,
      tableId: post.airtable_content_table_id,
      recordId: post.airtable_record_id,
      fields: { 'Headline_EN': title, 'Caption_EN': caption }
    })
      .catch(err => {
        console.error('[posts/update] Airtable write-back failed:', err)
        // 不 throw，允许主流程继续
      })
  }
  
  // 3. 立即返回 Supabase 结果
  return Response.json({ success: true, post })
}
```

---

## 日志规范

### 日志格式

使用结构化日志，便于搜索和调试：

```typescript
// ✅ 正确
console.log('[airtable/pull-content] Syncing client:', clientId)
console.log('[airtable/pull-content] Records fetched:', records.length)
console.error('[airtable/pull-content] Sync failed:', error)

// ❌ 不清楚
console.log('Syncing...')
console.log('Error')
```

### 日志级别

```typescript
console.log('[module/action] Info message')     // 常规信息
console.warn('[module/action] Warning message') // 警告
console.error('[module/action] Error message')  // 错误
```

### 日志可见性

- **本地开发：** 在 terminal 输出（`npm run dev`）
- **生产环境：** Render Dashboard → Logs 标签

---

## 环境变量管理

### 定义约定

```env
# .env.local（本地开发，git 忽略）
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

AIRTABLE_API_KEY=patXXX
ATLAS_API_KEY=xxxxx
OPENAI_API_KEY=sk-xxxxx
PUBLER_API_KEY=xxxxx
PUBLER_WORKSPACE_ID=xxxxx
SEMRUSH_API_KEY=xxxxx
```

### 在代码中使用

```typescript
// ✅ 正确（在 handler 中）
const apiKey = process.env.AIRTABLE_API_KEY
if (!apiKey) {
  throw new Error('AIRTABLE_API_KEY not set')
}

// ❌ 错误（在模块顶层赋值）
const apiKey = process.env.AIRTABLE_API_KEY
export async function handler() {
  // 使用 apiKey（可能是 undefined）
}
```

### 生产部署

1. 登录 Render Dashboard
2. Settings → Environment
3. 添加或更新环境变量
4. 自动重启应用

---

## 性能优化

### 数据库查询

```typescript
// ❌ N+1 问题
const clients = await supabase.from('clients').select()
for (const client of clients) {
  const posts = await supabase
    .from('content_posts')
    .select()
    .eq('client_id', client.id)
}

// ✅ 一次查询
const posts = await supabase
  .from('content_posts')
  .select('*, clients!inner(name)')
```

### API 响应时间

避免在 handler 中进行耗时操作。如果必须，使用后台任务：

```typescript
// ✅ 立即响应，后台处理
export async function POST(request: Request) {
  // 1. 快速验证和存储
  const { data: post } = await supabase
    .from('content_posts')
    .insert(payload)
    .select()
    .single()
  
  // 2. 异步触发生成（不等待）
  triggerImageGeneration(post.id).catch(err => {
    console.error('[visual/image] Async error:', err)
  })
  
  // 3. 立即返回
  return Response.json({ success: true, post })
}
```

---

## 提交与部署规范

### 提交前检查清单

```bash
# 1. 类型检查
npm run type-check

# 2. 构建验证（必须通过）
npm run build

# 3. 日志检查
grep -r "console\." src/ | grep -v node_modules  # 不应有 debug 日志

# 4. 环境变量检查
grep -r "process.env\." src/ | grep -v "NEXT_PUBLIC"  # 检查敏感变量

# 5. Git 状态
git status
```

### 提交消息格式

```
feat: add new feature description
fix: fix bug description
refactor: refactor module description
docs: update documentation
test: add test for feature
```

例：
```
feat: add hashtag sync from Airtable

- Map Hashtags_IG field to content_posts.hashtags
- Split by whitespace and filter empty strings
- Tested with 50+ records
```

### 推送

```bash
git add .
git commit -m "feat: ..."
git push origin master  # 自动触发 Render 部署
```

部署完成后在 Render Dashboard 检查日志。

---

## 测试规范（未来）

当项目添加测试框架后：

```typescript
// __tests__/airtable.test.ts
describe('Airtable Pull Content', () => {
  it('should map Status "ready" to "approved"', () => {
    const input = { Status: 'ready', Headline_EN: 'Test' }
    const output = mapNewTableFields(input)
    expect(output.status).toBe('approved')
  })
})
```

目标：80%+ 覆盖率。

---

## 调试技巧

### 1. 启用详细日志

在需要调试的函数中添加 `console.log()`：

```typescript
console.log('[airtable/pull-content] Raw records:', JSON.stringify(records, null, 2))
console.log('[airtable/pull-content] Mapped data:', JSON.stringify(mapped, null, 2))
```

### 2. 浏览器 DevTools

打开 Content Workbench，按 F12：
- **Network** 标签：查看 API 请求/响应
- **Console** 标签：查看前端错误

### 3. Supabase 控制台

登录 Supabase → SQL 编辑器：

```sql
SELECT * FROM content_posts WHERE client_id = 'xxx' ORDER BY created_at DESC;
```

### 4. 本地测试 API

使用 curl 或 Postman：

```bash
curl 'http://localhost:3001/api/airtable/pull-content?client_id=xxx' \
  -H 'Content-Type: application/json'
```

---

## 常见陷阱

| 陷阱 | 原因 | 解决 |
|------|------|------|
| async 写回 Airtable 失败，客户看不到 | `.catch()` 静默处理 | 检查日志 |
| 修改了字段映射后没有效果 | 需要新 Sync | 清除缓存，重新 Sync |
| "Status 转换失败" | Airtable 中不是小写 "ready" | 确保 Status="ready" |
| 图片生成卡在 "generating" | Atlas Cloud 任务失败 | 检查日志中的错误信息 |
| 推送后 Render 没有部署 | 构建失败 | 查看 Render Dashboard 日志 |

---

## 需要帮助？

- **文档：** 见 `docs/` 目录
- **快速诊断：** 见 `CLAUDE.md` 的"常见问题快速诊断"
- **问题排查：** 见 `docs/TROUBLESHOOTING.md`
