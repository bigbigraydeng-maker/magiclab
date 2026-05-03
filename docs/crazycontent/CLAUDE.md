# Magic Engine — Claude 工作指南

> 📍 完整文档已拆分到 `docs/` 目录。本文件仅保留速查表和快速导航。

---

## 🚀 新 Session 快速上手

**在新对话中，直接输入：**
```
@init magic-engine
```

或手动加载：
```
我在 Magic Engine（crazycontent）上工作。
请读取 CLAUDE.md，然后帮我：[具体问题]
```

---

## 📂 文档导航

| 文档 | 用途 |
|------|------|
| **[docs/WORKFLOW.md](docs/WORKFLOW.md)** | ⭐ 新功能开发工作流（需求 → 规划 → TDD → 提交） |
| **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** | 系统架构、表结构、技术栈 |
| **[docs/AIRTABLE.md](docs/AIRTABLE.md)** | Airtable 字段映射、同步流程 |
| **[docs/API.md](docs/API.md)** | API 路由详解（6 个核心 API） |
| **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** | 故障排查指南 |
| **[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)** | 开发规范、代码组织 |

---

## 🎯 按用途查找

### "Sync 后没看到新数据"
→ [TROUBLESHOOTING.md §问题 1](docs/TROUBLESHOOTING.md#问题-1-sync-成功但没看到新数据)

### "我要修改 Airtable 字段映射"
→ [DEVELOPMENT.md §Airtable 集成规范](docs/DEVELOPMENT.md#airtable-集成规范)

### "API 返回格式是什么"
→ [API.md §标准错误响应](docs/API.md#标准错误响应)

### "我要调试同步问题"
→ [TROUBLESHOOTING.md §一般调试技巧](docs/TROUBLESHOOTING.md#一般调试技巧)

### "我要理解整体架构"
→ [ARCHITECTURE.md §核心架构图](docs/ARCHITECTURE.md#核心架构图)

---

## 🔑 项目身份

- **项目名：** Magic Engine（代码库 `crazycontent`）
- **生产地址：** https://crazycontent-27u3.onrender.com
- **Git：** github.com/bigbigraydeng-maker/magiclab（master 分支，根目录 `crazycontent/`）
- **功能：** 多客户内容日历管理、AI 生成图片/视频、社媒自动发布

---

## 📋 核心原则（必读）

```
Airtable（策划）→ Supabase（执行）← Magic Engine UI
         ↑_______________↑
           (双向写回)

✅ 单一数据源：Supabase = System of Record
✅ 同步方向：Airtable→Supabase（按需） + Supabase→Airtable（异步）
❌ 禁止：双向实时同步（会产生冲突）
```

---

## 🔧 常用命令

```bash
cd "magic lab/crazycontent"

npm run dev        # 开发 :3001
npm run build      # 生产构建
npm test           # 测试

git add .
git commit -m "feat: ..."
git push origin master  # 自动部署到 Render
```

---

## 🗂️ 关键文件速查

| 文件 | 说明 | 优先级 |
|------|------|--------|
| `dashboard/visuals/page.tsx` | Content Workbench（主操作台） | ⭐⭐⭐ |
| `api/airtable/pull-content/route.ts` | Sync 入口（字段映射核心） | ⭐⭐⭐ |
| `api/posts/[id]/route.ts` | 更新帖子（含 Airtable 写回） | ⭐⭐ |
| `lib/airtable/client.ts` | Airtable REST API 封装 | ⭐⭐ |

---

## 🔍 常见问题一览

| 问题 | 检查项 | 更多 |
|------|--------|------|
| Sync 成功但没数据 | 1) 刷新页面 2) DevTools Network 检查 3) DB 查询 4) Airtable Status="ready" | [详细](docs/TROUBLESHOOTING.md#问题-1-sync-成功但没看到新数据) |
| Status 显示 "draft" | Airtable Status 是否为小写 "ready"？ | [详细](docs/TROUBLESHOOTING.md#问题-2-状态不对) |
| 字段没同步 | mapNewTableFields() 中是否有该字段？ | [详细](docs/TROUBLESHOOTING.md#问题-5-字段没有同步过来) |
| 生成失败 | 检查 visual_assets 表的 error_message | [详细](docs/TROUBLESHOOTING.md#问题-3-图片视频生成失败) |

---

## 💡 Airtable 字段映射（新表）

| Supabase 字段 | Airtable 字段 | 转换 |
|---------------|---------------|------|
| title | Headline_EN | 直接复制 |
| status | Status | "ready" → "approved" |
| hashtags | Hashtags_IG | 按空格分割 |
| scheduled_at | Date + Time_NZST | NZ→UTC 转换 |
| platforms | Platform | 小写转数组 |
| ... | ... | 见 [AIRTABLE.md](docs/AIRTABLE.md#映射关系表) |

---

## 📍 环境变量

需要在 Render Dashboard 设置：
```env
AIRTABLE_API_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ATLAS_API_KEY=
OPENAI_API_KEY=
PUBLER_API_KEY=
SEMRUSH_API_KEY=
```

详见 [DEVELOPMENT.md §环境变量管理](docs/DEVELOPMENT.md#环境变量管理)

---

## ✅ 提交前检查

```bash
npm run type-check   # TypeScript 检查
npm run build        # 构建验证（必须通过）
git status           # 确认文件变更
```

---

## 🆘 需要帮助？

1. **查阅文档：** `docs/` 目录下的 5 个 Markdown 文件
2. **快速诊断：** [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
3. **提问格式：**
   ```
   我的问题：[描述症状]
   已查阅：[哪个文档]
   已尝试：[哪些步骤]
   ```

---

**最后更新：** 2026-04-29  
**维护者：** Claude  
**语言：** 中文
