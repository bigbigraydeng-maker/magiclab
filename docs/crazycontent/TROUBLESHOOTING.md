# Magic Engine 故障排查指南

## 快速诊断流程

```
出现问题？
  ↓
├─ Sync 后没看到新数据？ → 见"问题 1"
├─ Sync 成功但状态不对（显示 draft）？ → 见"问题 2"
├─ 图片/视频生成失败？ → 见"问题 3"
├─ 发布到 Publer 失败？ → 见"问题 4"
└─ 其他错误？ → 查看日志
```

---

## 问题 1: Sync 成功但没看到新数据

**症状：** API 响应显示 `created: 3, updated: 6`，但 Content Workbench 中没有新记录

**诊断步骤：**

### Step 1: 刷新页面
```
按 F5 或 Ctrl+R（可能是缓存）
```

### Step 2: 检查 API 响应
打开浏览器 DevTools (F12) → Network 标签：
1. 找到 `pull-content` 请求
2. 查看 Response JSON
3. 检查 `created`、`updated`、`total` 数字是否都是 0

**如果都是 0：** 没有拉到记录
- 前往 Step 4（检查 Airtable）

**如果有数字：** 数据应该在数据库中
- 前往 Step 3（检查数据库）

### Step 3: 查询数据库
运行 SQL 查询验证数据是否保存：
```sql
SELECT id, title, status, airtable_record_id, created_at
FROM content_posts
WHERE client_id = '[你的 client_id]'
ORDER BY created_at DESC
LIMIT 20;
```

**如果有记录：** 数据在库中，是 UI 问题
- 清空浏览器缓存
- 检查 Content Workbench 的 filter 条件（可能过滤掉了新数据）

**如果没有记录：** 数据没有保存，是 API 问题
- 检查 API 日志（见 Step 5）

### Step 4: 验证 Airtable 配置
```sql
SELECT id, name, airtable_base_id, airtable_content_table_id
FROM clients
WHERE id = '[client_id]'
```

检查清单：
- [ ] `airtable_base_id` 非空？
- [ ] `airtable_content_table_id` 非空（使用新表）或为 NULL（使用旧表）？
- [ ] Base ID 和 Table ID 格式正确（app... 和 tbl...）？

### Step 5: 检查 API 日志
登录 Render Dashboard：https://crazycontent-27u3.onrender.com/dashboard
- 找到最新的 `[airtable/pull-content]` 日志
- 查看是否有错误消息

**常见错误：**
| 错误信息 | 原因 | 解决 |
|---------|------|------|
| `No Airtable base configured` | airtable_base_id 为空 | 在 Clients 表中配置 |
| `Airtable list error 401` | API Key 失效 | 重新设置 AIRTABLE_API_KEY |
| `Airtable list error 404` | 表 ID 错误 | 检查 airtable_content_table_id |
| `constraint violation` | 字段冲突 | 查看完整错误信息 |

---

## 问题 2: 状态不对（显示 draft 而不是 approved）

**症状：** Sync 成功拉到数据，但状态是 "draft" 而不是 "approved"

**根本原因：** Airtable Status 转换失败

**诊断步骤：**

### Step 1: 检查 Airtable 中的值
在 Airtable 打开 Status 列：
```
Status 值是否真的是小写 "ready"？
注意：大小写敏感！"Ready" 或 "READY" 不行
```

### Step 2: 查询数据库中的值
```sql
SELECT id, title, status, airtable_record_id
FROM content_posts
WHERE airtable_record_id IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;
```

**检查 status 列：**
- 如果是 "approved" ✓ → 说明转换成功，是其他问题
- 如果是 "ready" → 转换逻辑失败
- 如果是 "draft" → 说明 Airtable 中的值不是 "ready"

### Step 3: 验证转换逻辑
打开 `src/app/api/airtable/pull-content/route.ts`，查看 mapNewTableFields() 函数（第 138-175 行）：

```javascript
// 正确的转换逻辑应该是：
if (statusRaw === "ready") {
  status = "approved"
} else {
  status = "draft"
}
```

如果逻辑不对，修复它。

### Step 4: 重新 Sync
修复后，点击 "Sync Airtable" 再试一次。新的记录应该显示为 "approved"。

---

## 问题 3: 图片/视频生成失败

**症状：** 点击 "Generate Image" 后，状态停留在 "generating" 或显示 "failed"

**诊断步骤：**

### Step 1: 检查生成状态
打开 Content Workbench，找到对应帖子：
```
visual_assets.generation_status 是什么？
- pending: 还没开始
- generating: 正在生成
- ready: 生成完成
- failed: 生成失败
```

### Step 2: 如果是 "failed"，查看错误信息
```sql
SELECT id, asset_type, generation_status, error_message, created_at
FROM visual_assets
WHERE post_id = '[post_id]'
ORDER BY created_at DESC
LIMIT 5;
```

**常见错误：**
| 错误 | 原因 | 解决 |
|------|------|------|
| Invalid prompt | 提示词格式错误 | 检查 visual_brief 字段 |
| Insufficient credits | Atlas Cloud 余额不足 | 充值账户 |
| Rate limit exceeded | 请求过于频繁 | 等待几分钟再试 |
| Model unavailable | 模型离线 | 重试或切换模型 |

### Step 3: 检查 Atlas Cloud API
如果错误不明显，查看 API 日志：
```
Render Dashboard → Logs → 搜索 [visual/image]
```

### Step 4: 检查 prompt 有效性
在代码中（`src/app/api/visual/image/route.ts`）测试 prompt：
```javascript
console.log('Prompt:', prompt);  // 打印 prompt 检查内容
```

---

## 问题 4: 发布到 Publer 失败

**症状：** 点击 "Schedule to Publer" 后显示错误

**诊断步骤：**

### Step 1: 检查 Publer 账户配置
```sql
SELECT account_id, publer_account_id
FROM content_posts
WHERE id = '[post_id]'
```

- [ ] `publer_account_id` 已设置？
- [ ] Account ID 格式正确？

### Step 2: 验证必填字段
检查帖子是否有所有必填字段：
```sql
SELECT 
  id, title, caption, platforms, 
  scheduled_at, (SELECT storage_url FROM visual_assets 
    WHERE post_id = content_posts.id LIMIT 1) as visual
FROM content_posts
WHERE id = '[post_id]'
```

必填字段：
- [ ] title（至少 1 个字符）
- [ ] caption（可选）
- [ ] platforms（至少 1 个平台）
- [ ] scheduled_at（未来时间）
- [ ] 图片/视频 URL（如果平台需要）

### Step 3: 检查时间
Publer 需要 `scheduled_at` 是**未来时间**：
```javascript
const now = new Date();
const scheduledTime = new Date(scheduled_at);
if (scheduledTime <= now) {
  // ❌ 时间已过去，会失败
}
```

修复：确保 scheduled_at 是未来时间。

### Step 4: 查看错误日志
```
Render Dashboard → Logs → 搜索 [publer/schedule]
```

**常见错误：**
| 错误 | 原因 | 解决 |
|------|------|------|
| Invalid account ID | 账户不存在或已删除 | 重新配置 Publer 账户 |
| Missing required field | 缺少必填字段 | 填写所有必填字段 |
| Invalid scheduled_at | 时间格式错误或已过期 | 使用 ISO 格式的未来时间 |
| Rate limit | 请求过于频繁 | 等待后重试 |

---

## 问题 5: 字段没有同步过来

**症状：** Sync 成功，但某个字段（如 hashtags、visual_brief）为空

**检查清单：**

### 1. Airtable 中有值吗？
```
打开 Airtable，找到该字段
- 字段值为空？ → 在 Airtable 中添加值
- 字段值存在？ → 继续下一步
```

### 2. 字段名称匹配吗？
比对 `AIRTABLE.md` 中的映射表：
| Airtable 字段名 | Supabase 字段 |
|---|---|
| Hashtags_IG | hashtags |
| LoveArt_Prompt_EN | visual_brief |
| etc. |

- 字段名是否**完全匹配**（包括大小写、下划线）？

### 3. 字段类型正确吗？
```
例：
Hashtags_IG 应该是 Text 类型
如果是 LongText，可能需要调整转换逻辑
```

### 4. mapNewTableFields() 中有转换规则吗？
打开 `src/app/api/airtable/pull-content/route.ts` 第 138-175 行：
```javascript
function mapNewTableFields(f: Record<string, unknown>) {
  return {
    // ... 检查该字段是否在这里 ...
    hashtags: (f['Hashtags_IG'] as string)?.split(/\s+/) || [],
    // ...
  }
}
```

**如果字段缺失：**
1. 打开 route.ts
2. 在 mapNewTableFields() 中添加该字段
3. 重新部署（Render 会自动部署）
4. 再次 Sync

**添加新字段示例：**
```javascript
return {
  // ... 现有字段 ...
  my_new_field: (f['My_New_Field_Name'] as string) || null,  // ← 添加这一行
}
```

---

## 一般调试技巧

### 1. 启用详细日志
在 route.ts 中添加：
```javascript
console.log('[airtable/pull-content] Raw records:', JSON.stringify(records, null, 2))
console.log('[airtable/pull-content] Mapped data:', JSON.stringify(mapped, null, 2))
```

### 2. 手动测试 API
使用 curl 或 Postman：
```bash
curl 'https://crazycontent-27u3.onrender.com/api/airtable/pull-content?client_id=xxx' \
  -H 'Content-Type: application/json'
```

### 3. 检查环境变量
```
Render Dashboard → Environment
- AIRTABLE_API_KEY 已设置？
- SUPABASE_URL 已设置？
- SUPABASE_SERVICE_KEY 已设置？
```

### 4. 查看浏览器控制台
DevTools (F12) → Console 标签：
```
有红色错误吗？什么错误？
```

### 5. 查看网络请求
DevTools → Network 标签：
- 请求状态码是什么？(200, 400, 500?)
- 响应 JSON 是什么？

---

## 需要帮助？

如果以上步骤都试过了还是不行：

1. **收集信息：**
   - [ ] 错误信息的完整文本
   - [ ] API 响应 JSON
   - [ ] Supabase 数据库查询结果
   - [ ] Render 日志截图

2. **打开问题：**
   - GitHub issue (如果是 bug)
   - 或直接问 Claude

3. **临时绕过：**
   - 在 Content Workbench 中手动创建记录（不依赖 Airtable）
   - 手动设置 status 为 "approved"
   - 触发生成流程
