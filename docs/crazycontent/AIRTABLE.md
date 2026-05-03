# Airtable 字段映射 & 同步指南

## 新表字段映射（CTS T061 April Social）

### 映射关系表

| # | Airtable 字段 | 字段类型 | Supabase 字段 | 转换规则 | 说明 |
|----|---|---|---|---|---|
| 1 | Status | SingleSelect | status | "ready"→"approved" | 只拉 Status="ready" |
| 2 | Headline_EN | LongText | title | 直接复制 | 必填 |
| 3 | Caption_EN | LongText | caption | 直接复制 | 社媒文案 |
| 4 | Video_Text_Overlay | Text | script | 直接复制 | 视频叠字 |
| 5 | Hashtags_IG | Text | hashtags | 按空格分割为数组 | #tag1 #tag2 → ['tag1','tag2'] |
| 6 | LoveArt_Prompt_EN | LongText | visual_brief | 直接复制 | AI 图片生成提示词 |
| 7 | Date | Date | scheduled_at | Date+Time→UTC | NZ 时区处理 |
| 8 | Time_NZST | SingleSelect | scheduled_at | 时间部分 | 合并为 ISO 字符串 |
| 9 | Format | SingleSelect | format | 小写 | reel\|video\|feed\|image\|story\|carousel |
| 10 | Ratio | SingleSelect | ratio | 直接复制 | 9:16\|1:1\|16:9 |
| 11 | Platform | SingleSelect | platforms | 小写转数组 | ["facebook","instagram"] |
| 12 | Image_URL | URL | — | 读写回 | 图片生成后由 Supabase 写回 |
| 13 | Publer_Post_ID | Text | — | 读写回 | 发布后由 Supabase 写回 |

### 转换规则详解

#### Status → status
```javascript
// Airtable (单选)
Status: "ready" / "draft" / "approved" ...

// 转换逻辑
if (statusRaw === "ready") {
  status = "approved"  // 触发 Magic Engine 处理
} else {
  status = "draft"
}

// 解释：Airtable 用 "ready" 表示"可以处理"，
//       Supabase 用 "approved" 表示"已批准可生成"
```

#### Hashtags_IG → hashtags (数组)
```javascript
// Airtable (文本)
Hashtags_IG: "#travel #china #asia"

// 转换逻辑
const hashtags = Hashtags_IG
  .split(/\s+/)           // 按空格分割
  .map(s => s.trim())     // 去掉多余空格
  .filter(Boolean)        // 过滤空字符串
// 结果: ["#travel", "#china", "#asia"]
// 或去掉 #: ["travel", "china", "asia"]
```

#### Date + Time_NZST → scheduled_at (ISO 字符串)
```javascript
// Airtable
Date: "2026-04-29"
Time_NZST: "09:00" / "9:00am" / "21:00"

// 转换逻辑（NZ = UTC+12）
const local = new Date(`${date}T${time}:00+12:00`)
const scheduled_at = local.toISOString()
// 示例: "2026-04-28T21:00:00Z"

// 注意：NZ 时区是 UTC+12（可能 UTC+13 夏令时）
//      代码中写死 +12:00，需要注意夏令时切换
```

#### Platform → platforms (数组)
```javascript
// Airtable (单选或多选)
Platform: "Facebook" / "Instagram" / "TikTok"

// 转换逻辑
const platforms = platform
  .toLowerCase()           // facebook / instagram / tiktok
  .trim()
  .split(/[,\s]+/)         // 如果有逗号分隔
  .filter(Boolean)
// 结果: ["facebook"] 或 ["facebook", "instagram"]
```

---

## 同步流程

### 完整流程图

```
用户在 Airtable 设置 Status="ready"
  ↓
点击 Magic Engine → "Sync Airtable" 按钮
  ↓
GET /api/airtable/pull-content?client_id=xxx
  ↓
① 检查 clients.airtable_content_table_id 配置
  ├─ 有 → 使用新表，应用新模式
  └─ 无 → 使用旧 Content Calendar，应用兼容模式
  ↓
② listRecords() 拉取记录
  filterByFormula: "LOWER({Status}) = 'ready'"
  (只拉 Status="ready" 的记录，最多 200 条)
  ↓
③ 逐条处理
  ├─ mapNewTableFields() 转换字段
  │  └─ Status "ready" → "approved"
  ├─ 查询 Supabase: airtable_record_id = record.id ?
  │  ├─ 存在 → UPDATE
  │  └─ 不存在 → INSERT (新记录)
  ↓
④ 返回结果
  {
    success: true,
    total: 9,           // 拉取的记录数
    created: 3,         // 新增记录数
    updated: 6,         // 更新记录数
    errors: [...]       // 失败详情
  }
  ↓
⑤ Content Workbench 刷新列表
```

---

## 常见问题排查

### 问题 1：Sync 成功但没看到新数据

**检查顺序：**

1. **刷新页面**（缓存问题）
   ```
   F5 或 Ctrl+R
   ```

2. **检查 API 响应**（DevTools）
   ```
   Network → pull-content API
   → 看 response JSON 的 created / updated / total 数字
   → 如果都是 0，说明没拉到记录
   ```

3. **验证 Airtable 配置**
   ```sql
   SELECT id, name, airtable_base_id, airtable_content_table_id
   FROM clients
   WHERE id = '[你的 client_id]'
   ```
   - `airtable_base_id` 非空 ✓
   - `airtable_content_table_id` 非空 ✓（新表才用）

4. **确认 Status="ready"**（Airtable）
   ```
   社媒总表 → Status 列 → 确实有 "ready"？
   注意：大小写敏感！('Ready' 或 'READY' 不行)
   ```

5. **查看 API 日志**（Render）
   ```
   https://crazycontent-27u3.onrender.com/dashboard
   → 查看最新 Log 中 [airtable/pull-content] 的错误
   ```

### 问题 2：拉到了记录但状态不对

**现象：** created/updated 有数字，但 Magic Engine 中显示 "draft" 而不是 "approved"

**根本原因：** mapNewTableFields() 中 Status 转换失败

**排查：**
1. Airtable 中的 Status 值是否真的是小写 "ready"？
2. 代码中是否正确转换？（见上面的转换规则）
3. Supabase 中的 status 列是否保存成了 "ready"？
   ```sql
   SELECT id, title, status FROM content_posts
   WHERE airtable_record_id IS NOT NULL
   ORDER BY created_at DESC
   LIMIT 10;
   ```

### 问题 3：某些字段没有同步过来

**检查清单：**
1. Airtable 中该字段是否有值？（空字符串会被忽略）
2. 字段名称是否完全匹配？（区分大小写）
3. 字段类型是否对应？（LongText vs Text vs SingleSelect）
4. mapNewTableFields() 中是否忘记添加这个字段？

**例：添加新字段**
```javascript
// api/airtable/pull-content/route.ts 第 138-175 行
function mapNewTableFields(f: Record<string, unknown>) {
  // ... 现有字段 ...
  
  return {
    // ... 现有字段 ...
    new_field: (f['New_Field_Name'] as string) || null,  // ← 添加这一行
  }
}
```

---

## 旧表兼容模式（Content Calendar）

如果 `airtable_content_table_id` 为空，使用旧 Content Calendar 表：

### 字段映射（旧表）
| Airtable | Supabase | 说明 |
|----------|----------|------|
| Status | status | draft/approved/scheduled/published/rejected |
| Title | title | — |
| Caption | caption | — |
| Script | script | — |
| Hashtags | hashtags | 按空格分割 |
| Visual Brief | visual_brief | — |
| Platforms | platforms | 逗号或空格分割 |
| Route | route | Route A/B/C → route_a/b/c |
| Source URL | source_video_url | — |
| Supabase ID | — | 用于关联（Airtable 的反向引用） |

### 主要区别
- **新表：** Status 管理（ready → approved）
- **旧表：** Status 直接使用，Supabase ID 字段手动关联

---

## 调试技巧

### 1. 查看拉取的原始数据
```javascript
// 在 api/airtable/pull-content/route.ts 中添加
console.log('Raw records:', JSON.stringify(records, null, 2))
```

### 2. 逐个检查转换结果
```javascript
for (const record of records) {
  const mapped = mapNewTableFields(record.fields)
  console.log(`Record ${record.id}:`, mapped)
}
```

### 3. 直接查询 Supabase
```sql
-- 查看最新同步的记录
SELECT id, title, status, airtable_record_id, created_at
FROM content_posts
WHERE client_id = '[client_id]'
ORDER BY created_at DESC
LIMIT 10;

-- 查看特定 Airtable 记录的同步状态
SELECT * FROM content_posts
WHERE airtable_record_id = 'rec...'
```

### 4. 测试字段映射
```javascript
// 在浏览器控制台运行
const testData = {
  'Status': 'ready',
  'Headline_EN': '测试标题',
  'Hashtags_IG': '#tag1 #tag2 #tag3'
}
// 然后粘贴 mapNewTableFields 函数，测试输出
```
