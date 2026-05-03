# API 路由详细说明

## 路由地图

```
/api/
├── clients/
│   ├── route.ts                    # GET 客户列表
│   └── [id]/
│       ├── route.ts                # GET 客户详情
│       └── posts/
│           └── route.ts            # GET 客户帖子列表
├── posts/
│   └── [id]/
│       └── route.ts                # PATCH 更新帖子（含 Airtable 写回）★
├── airtable/
│   ├── pull-content/route.ts       # GET Airtable→Supabase 同步 ⭐
│   ├── sync-content/route.ts       # POST 同步单个帖子
│   ├── pull-keywords/route.ts      # GET 关键词同步
│   └── sync-keywords/route.ts      # POST 关键词同步
├── visual/
│   ├── image/route.ts              # POST 触发图片生成
│   ├── video/route.ts              # POST 触发视频生成
│   ├── status/[assetId]/route.ts   # GET 生成状态轮询
│   └── assets/route.ts             # GET 资产列表
├── publer/
│   ├── schedule/route.ts           # POST 发布到 Publer
│   └── draft/[assetId]/route.ts    # GET 发布预填数据
└── cron/
    └── sync-airtable/route.ts      # POST 定时同步（未来）
```

## 核心 API 详解

### 1. GET /api/airtable/pull-content（⭐ 最重要）

**功能：** Airtable → Supabase 同步

**请求**
```
GET /api/airtable/pull-content?client_id=xxx
```

**参数**
| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| client_id | string | ✓ | Supabase 中的客户 ID |

**响应成功 (200)**
```json
{
  "success": true,
  "total": 9,                    // 拉取的总记录数
  "created": 3,                  // 新增记录数
  "updated": 6,                  // 更新记录数
  "mode": "social_calendar",     // 表模式：social_calendar 或 content_calendar
  "errors": undefined            // 如果都成功，不返回错误数组
}
```

**响应成功但有部分失败**
```json
{
  "success": true,
  "total": 9,
  "created": 2,
  "updated": 6,
  "mode": "social_calendar",
  "errors": [
    "Update rec123: constraint violation",
    "Create from rec456: missing required field"
  ]
}
```

**响应失败 (400/500)**
```json
{
  "success": false,
  "error": "No Airtable base configured for this client"
}
```

**错误类型**
| 错误 | 原因 | 解决 |
|------|------|------|
| No Airtable base configured | `airtable_base_id` 为空 | Clients 设置中配置 |
| Airtable list error 401 | API Key 失效 | 重新设置 AIRTABLE_API_KEY |
| Airtable list error 404 | 表 ID 错误 | 检查 airtable_content_table_id |
| Update/Create constraint | 字段冲突 | 看 errors 数组的详细信息 |

**代码位置**
```
src/app/api/airtable/pull-content/route.ts (135 行)
```

---

### 2. PATCH /api/posts/[id]（帖子更新+写回）

**功能：** 修改帖子，自动写回 Airtable

**请求**
```
PATCH /api/posts/abc-def-123
Content-Type: application/json

{
  "title": "新标题",
  "caption": "新文案",
  "status": "approved",
  "hashtags": ["#tag1", "#tag2"]
}
```

**支持更新的字段**
```javascript
{
  title,
  caption,
  script,
  hashtags,
  visual_brief,
  platforms,
  status,
  scheduled_at,
  format,
  ratio,
  route
}
```

**响应 (200)**
```json
{
  "post": {
    "id": "abc-def-123",
    "title": "新标题",
    "status": "approved",
    "updated_at": "2026-04-29T12:34:56Z"
  }
}
```

**写回 Airtable 的行为**
- 如果帖子有 `airtable_record_id`，自动写回
- 写回失败不影响 Supabase 更新（`.catch()` 静默处理）
- 检查日志查看是否写回成功

**代码位置**
```
src/app/api/posts/[id]/route.ts
```

---

### 3. POST /api/visual/image（图片生成）

**功能：** 触发 AI 图片生成（Atlas Cloud WaveSpeed）

**请求**
```
POST /api/visual/image
Content-Type: application/json

{
  "post_id": "abc-def-123",
  "prompt": "A beautiful mountain landscape in Switzerland",
  "format": "feed",              // reel|video|feed|image|story
  "ratio": "9:16"                // 宽高比
}
```

**响应**
```json
{
  "success": true,
  "asset_id": "xyz-789",
  "job_id": "atlas-job-123",
  "status": "queued",
  "message": "Image generation queued"
}
```

**轮询状态**
```
GET /api/visual/status/xyz-789
```

响应：
```json
{
  "status": "generating",        // queued|generating|ready|failed
  "progress": 45,                // 0-100
  "storage_url": null,           // 生成完成后有 URL
  "error": null
}
```

**代码位置**
```
src/app/api/visual/image/route.ts
src/app/api/visual/status/[assetId]/route.ts
```

---

### 4. POST /api/publer/schedule（发布到社媒）

**功能：** 将生成的资产发布到 Facebook / Instagram / TikTok

**请求**
```
POST /api/publer/schedule
Content-Type: application/json

{
  "post_id": "abc-def-123",
  "asset_id": "xyz-789",         // 生成的图片/视频
  "platforms": ["facebook", "instagram"],
  "caption": "Check out this!",
  "scheduled_at": "2026-04-30T10:00:00Z",
  "account_id": "publer-account-123"
}
```

**响应**
```json
{
  "success": true,
  "post_id": "publer-post-456",  // Publer 端的 Post ID
  "platforms": ["facebook", "instagram"],
  "scheduled": true
}
```

**之后的行为**
- Publer_Post_ID 自动写回 Airtable（带时间戳）
- 日程表显示"已发布"状态

**代码位置**
```
src/app/api/publer/schedule/route.ts
```

---

### 5. GET /api/clients（客户列表）

**功能：** 获取所有客户

**请求**
```
GET /api/clients
```

**响应**
```json
{
  "clients": [
    {
      "id": "client-1",
      "name": "CTS Tours NZ",
      "airtable_base_id": "appXXX",
      "airtable_content_table_id": "tblYYY"
    },
    ...
  ]
}
```

**代码位置**
```
src/app/api/clients/route.ts
```

---

### 6. GET /api/clients/[id]/posts（客户帖子列表）

**功能：** 获取特定客户的所有帖子

**请求**
```
GET /api/clients/client-1/posts?status=approved&limit=50
```

**查询参数**
| 参数 | 类型 | 说明 |
|------|------|------|
| status | string | 过滤：draft/approved/scheduled/published |
| limit | integer | 分页：最多返回条数 |
| offset | integer | 分页：跳过条数 |

**响应**
```json
{
  "posts": [
    {
      "id": "post-1",
      "title": "Beijing Tour",
      "status": "approved",
      "platforms": ["facebook", "instagram"],
      ...
    },
    ...
  ],
  "total": 24,
  "limit": 50,
  "offset": 0
}
```

**代码位置**
```
src/app/api/clients/[id]/posts/route.ts
```

---

## 错误处理规范

### 标准错误响应

**400 Bad Request**
```json
{
  "success": false,
  "error": "client_id required"
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "error": "Airtable API Key invalid"
}
```

**404 Not Found**
```json
{
  "success": false,
  "error": "Post not found"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "error": "Database connection failed"
}
```

### 日志输出

所有 API 都输出结构化日志：
```javascript
console.error('[airtable/pull-content]', err)
console.log('[publer/schedule] Posted to Facebook:', post_id)
```

查看日志：
- 本地：`npm run dev` 的 terminal 输出
- 生产：Render Dashboard → Logs

---

## 认证 & 授权

**当前状态：** 无认证（内部 API，仅在可信环境使用）

**未来计划：** 添加 API Key 或 JWT 认证

---

## 性能考量

| 操作 | 耗时 | 备注 |
|------|------|------|
| 拉取 50 条记录 | 2-3s | Airtable API 响应 |
| 图片生成 | 30-60s | 取决于模型 |
| 视频生成 | 3-5分 | 较费时 |
| 发布到 Publer | 1-2s | 较快 |

**建议：**
- 图片/视频生成用异步轮询，不要同步等待
- 批量拉取记录时分页处理
- 写回 Airtable 使用 `.catch()` 静默失败，不阻塞主流程
