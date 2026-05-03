# Magic Engine 功能开发工作流

> 当需要开发新功能时，按照本指南操作。包括需求模板、Claude 指令模板、完整流程。

---

## 完整开发流程

```
需求讨论 → 功能规划 → TDD 开发 → 代码审查 → Git 提交 → 部署验证
   ↓         ↓        ↓         ↓        ↓        ↓
 收集       创建      编写       审视    提交    Render
 需求      PRD      代码       质量   分支    部署
```

---

## Step 1: 需求讨论与收集

### 什么时候需要新功能？

新功能开发适用于以下场景：
- 添加新的 API 端点（如新的 Publer 集成）
- 新增页面或 UI 界面
- 支持新的 Airtable 字段映射
- 扩展现有功能（如批量生成、定时 Sync）
- 性能优化或重构

### 需求模板（讨论阶段）

讨论新功能时，提供以下信息：

```markdown
## 功能名称
[功能简称，如 "批量图片生成" 或 "Airtable 定时 Sync"]

## 业务价值
[为什么需要这个功能？用户痛点？]

## 功能描述
[详细描述该功能做什么，如何工作]

## 受影响的系统
- [ ] Frontend (Content Workbench / 其他页面)
- [ ] Backend API (airtable / visual / publer / 其他)
- [ ] Database (新表 / 新字段 / 新关系)
- [ ] External Integration (Airtable / Publer / Atlas / 其他)

## 优先级
- [ ] 高 (blocking，需要立即做)
- [ ] 中 (important，下周内做)
- [ ] 低 (nice-to-have，可延后)

## 验收标准
- [ ] [验收项 1]
- [ ] [验收项 2]
- [ ] [验收项 3]

## 额外信息
[任何其他相关信息：参考链接、UI 设计、API 设计等]
```

**例子：**

```markdown
## 功能名称
定时 Airtable 同步

## 业务价值
目前同步完全依赖手动点击按钮，用户容易忘记同步。定时 Sync 可以确保数据始终最新。

## 功能描述
添加一个 Cron Job，每天 UTC 08:00 自动执行 Airtable Sync（相当于用户手动点击按钮）。
Sync 后在 Discord 推送通知（几条记录 created/updated）。

## 受影响的系统
- [ ] Frontend (不需要 UI 改动，只显示 Cron 配置页)
- [x] Backend API (新增 POST /api/cron/sync-airtable 端点)
- [ ] Database (airtable_last_sync_at 时间戳)
- [x] External Integration (Airtable API + Discord Webhook)

## 优先级
- [x] 高 (用户强烈需求)

## 验收标准
- [ ] Cron Job 每天 08:00 自动触发
- [ ] Sync 成功后发送 Discord 通知
- [ ] 支持手动取消或暂停定时任务
- [ ] 日志记录每次 Cron 的执行结果

## 额外信息
Discord Webhook URL 已在 Render 环境变量中配置为 DISCORD_WEBHOOK_URL
```

---

## Step 2: 功能规划（Claude 的第一步）

需求确认后，给 Claude 的指令：

### 指令模板 A：请求规划阶段

```
我需要开发一个新功能：[功能名称]

## 功能描述
[从需求模板复制过来]

## 要求
1. 先不要写代码
2. 创建以下文档到 /tmp/plan/：
   - PRD.md（产品需求）
   - ARCH.md（架构设计）
   - TASK_LIST.md（任务分解）
3. 列出所需的环境变量、数据库迁移、配置修改

## 预期输出
- [ ] 理解功能全貌
- [ ] 明确受影响的文件
- [ ] 给出分步任务清单
```

**例子：**

```
我需要开发一个新功能：定时 Airtable 同步

## 功能描述
添加一个 Cron Job，每天 UTC 08:00 自动执行 Airtable Sync。
Sync 后在 Discord 推送通知（created/updated 记录数）。
支持在 Dashboard 中查看和暂停定时任务。

## 要求
1. 先不要写代码
2. 创建以下文档：
   - PRD：为什么做这个，做什么，给谁用
   - ARCH：API 设计、数据库改动、Cron 框架选择
   - TASK_LIST：具体要改的文件，分几个 PR
3. 列出需要的环境变量和权限

## 预期输出
- 确认这个方案在 crazycontent 中是可行的
- 指出有没有遗漏的边界情况
- 给出具体的工作量估计
```

### Claude 在规划阶段应该提供什么

规划完成后，Claude 应输出：

**1. 架构设计文档**
```markdown
# 定时 Sync 架构设计

## 数据流
[流程图：Cron Job → pull-content API → Discord Webhook]

## 新增 API
- POST /api/cron/sync-airtable
  - 输入：client_id（可选，不指定则全部客户）
  - 输出：成功的 client_ids 列表 + 失败列表
  - 触发方：Render Cron Job（外部），或手动测试

## 数据库改动
- clients 表新增字段：
  - cron_enabled (boolean, default=true)
  - cron_last_run_at (timestamp, nullable)
  - cron_next_run_at (timestamp, nullable)

## 外部集成
- Discord Webhook（POST 通知）
- Render Cron（HTTP 触发器）
```

**2. 任务清单**
```markdown
## 任务分解（优先级排序）

### Phase 1: API 实现 (2-3 天)
- [ ] 创建 `api/cron/sync-airtable/route.ts`
- [ ] 复用 `airtable/pull-content` 的逻辑
- [ ] 添加 Discord 通知逻辑
- [ ] 本地测试（curl 或 Postman）

### Phase 2: 数据库与配置 (1 天)
- [ ] 新增 clients 表字段（Cron 开关、上次运行时间）
- [ ] Render 环境变量：DISCORD_WEBHOOK_URL
- [ ] 配置 Render Cron Job HTTP 触发

### Phase 3: UI（可选，可留给后续） (1-2 天)
- [ ] Dashboard 新增"定时任务"页面
- [ ] 显示上次运行时间、下次运行时间
- [ ] 提供"立即运行"和"暂停"按钮

### Phase 4: 测试与监控 (1 天)
- [ ] 测试用例（Sync 成功、部分失败、全部失败）
- [ ] Discord 通知格式验证
- [ ] Render 日志验证
```

**3. 受影响文件清单**
```markdown
## 新增文件
- src/app/api/cron/sync-airtable/route.ts

## 修改文件
- src/lib/types.ts（新增 CronResult 类型）
- supabase/migrations/202604xx_add_cron_fields.sql（新增）
- .env.example（新增 DISCORD_WEBHOOK_URL）

## 参考文件（复用逻辑）
- src/app/api/airtable/pull-content/route.ts
- src/lib/airtable/client.ts
```

---

## Step 3: TDD 开发（实现阶段）

规划确认后，给 Claude 的指令：

### 指令模板 B：实现功能

```
## 功能开发：[功能名称]

我已审核规划文档，同意以下设计：
[简要总结规划中的决策]

现在请：

### Phase 1: 实现核心 API
1. 创建 `src/app/api/cron/sync-airtable/route.ts`
2. 使用 TDD 方法：
   - 先写测试（期望 API 调用成功 Sync 所有客户，然后发 Discord 通知）
   - 再实现函数
   - 确保测试通过
3. 复用 `api/airtable/pull-content` 中的字段映射逻辑
4. 通知格式：Discord 消息显示 total/created/updated 数字

### Phase 2: 数据库迁移
1. 创建 `supabase/migrations/202604xx_add_cron_fields.sql`
2. 新增字段到 clients 表：
   - cron_enabled (bool, default=true)
   - cron_last_run_at (timestamp)
   - cron_next_run_at (timestamp)

### 完成标准
- [ ] 所有测试通过（100%）
- [ ] npm run build 无错误
- [ ] 本地用 curl 测试 API，成功返回 {success: true, ...}
- [ ] 代码审查通过（无 CRITICAL 问题）
- [ ] 日志输出格式统一：[cron/sync-airtable] ...
```

**例子（更详细）：**

```
## 功能开发：定时 Airtable 同步

我已审核规划，同意设计。现在请开发。

### API 实现要求
- 端点：POST /api/cron/sync-airtable
- 输入参数：client_ids (数组，可选；为空则全部)
- 返回格式：
  {
    "success": true,
    "synced_clients": [
      { "client_id": "xxx", "total": 10, "created": 3, "updated": 7 }
    ],
    "failed_clients": [
      { "client_id": "yyy", "error": "reason" }
    ],
    "discord_sent": true
  }

### Discord 通知
- 模板：
  ```
  ✅ Airtable Sync Complete (UTC 08:00)
  
  Synced 3 clients:
  • Client A: 15 total (5 new, 10 updated)
  • Client B: 8 total (0 new, 8 updated)
  • Client C: FAILED - "API Key invalid"
  
  Time: 2026-04-30 08:15 UTC
  ```

### 测试需求
- Sync 成功的客户
- Sync 失败的客户（缺少 Airtable base ID）
- 混合成功和失败
- Discord 通知的发送验证

### 完成标准
- [ ] 测试通过 (100%)
- [ ] 覆盖率 >= 80%
- [ ] 本地测试：curl 'http://localhost:3001/api/cron/sync-airtable' → 返回 {success: true}
- [ ] 构建无错误
- [ ] 代码审查通过
```

---

## Step 4: 代码审查与提交

实现完成后，给 Claude 的指令：

### 指令模板 C：代码审查与提交

```
## 代码审查与提交：[功能名称]

功能开发完成。请：

1. 运行代码审查：
   - TypeScript 检查：npm run type-check
   - 构建验证：npm run build
   - 生成 Detection Report（见 ~/.claude/rules/detection-report-workflow.md）

2. 修复任何 CRITICAL 或 HIGH 问题

3. 创建提交（遵循 Conventional Commits）：
   - feat: add cron job for daily Airtable sync
   - Include: API endpoint, DB migration, Discord notification

4. 等待我的审批后再推送

输出格式：
- [ ] 代码审查报告（Detection Report）
- [ ] 提交信息
- [ ] 修改文件列表
```

### 我的审批流程

当 Claude 提交代码审查报告后，我会：

```
✅ APPROVED - 可以推送
⚠️  NEEDS FIXES - 需要修复 [X, Y, Z] 后重新提交
❌ BLOCKED - 有 CRITICAL 问题，联系我讨论
```

只有得到 ✅ 后，Claude 才执行：
```bash
git add .
git commit -m "feat: ..."
git push origin master
```

---

## 完整指令示例

### 初次讨论（功能提案阶段）

用户消息：
```
我想给 Magic Engine 加一个功能：
定时每天自动同步 Airtable，不用手动点按钮。
完成后发个通知到 Discord 告诉我同步了多少记录。
这可行吗？需要改哪些地方？
```

Claude 的回应：
```
这个功能很有价值！完全可行。
需要改的地方：
1. 新增 API 端点：POST /api/cron/sync-airtable
2. 数据库添加 cron_enabled 和 last_run_at 字段
3. Render 配置 HTTP Cron Job（外部定时器）
4. 集成 Discord Webhook 发通知

要先做规划吗？规划会输出 PRD 和任务清单。
```

用户批准：
```
好，先做规划。
```

### 规划阶段

Claude：
```
我来做规划。先从需求整理开始...

[输出 PRD.md, ARCH.md, TASK_LIST.md]

规划完成。涉及 3 个文件修改，2 个新文件创建。
工作量估计：3-4 天。
有问题吗？
```

用户批准：
```
规划看起来不错。现在开始实现，按 Phase 1 先做 API。
```

### 实现阶段

Claude：
```
开始 Phase 1 API 实现...

[编写代码，通过 TDD]

Phase 1 完成。所有测试通过。
现在进行代码审查...

[输出 Detection Report]

✅ APPROVED
建议推送。
```

用户批准：
```
Approved，推送吧。
```

Claude 执行提交和推送。

---

## 文档关联

新功能开发流程关联的文档：

| 阶段 | 相关文档 |
|------|---------|
| 需求讨论 | 本文件（WORKFLOW.md）§ Step 1 |
| 规划设计 | 本文件（WORKFLOW.md）§ Step 2 |
| TDD 开发 | [DEVELOPMENT.md](DEVELOPMENT.md)、[TROUBLESHOOTING.md](TROUBLESHOOTING.md) |
| 代码审查 | `~/.claude/rules/detection-report-workflow.md`（全局规则） |
| Git 提交 | `~/.claude/rules/git-workflow.md`（全局规则） |
| 部署验证 | [TROUBLESHOOTING.md](TROUBLESHOOTING.md)§ 调试技巧 |

---

## 快速参考

### "我想讨论一个新功能"
→ 填写[需求模板](#需求模板讨论阶段)，给 Claude

### "功能已讨论好，现在要规划"
→ 使用[指令模板 A](#指令模板-a请求规划阶段)

### "规划已确认，现在要实现"
→ 使用[指令模板 B](#指令模板-b实现功能)

### "代码实现完成"
→ 使用[指令模板 C](#指令模板-c代码审查与提交)

---

## 常见问题

**Q: 这个流程适合所有功能吗？**  
A: 适合需要 API / 数据库 / 外部集成改动的功能。小的 UI 调整或 bug fix 可以简化流程。

**Q: 规划阶段需要多长时间？**  
A: 通常 30 分钟 - 1 小时。复杂功能（涉及多个系统）可能需要 2-3 小时。

**Q: 如果在开发中遇到规划没想到的问题？**  
A: 停止开发，回到规划阶段讨论。让 Claude 更新设计文档后继续。

**Q: 可以跳过规划直接开发吗？**  
A: 不建议。规划可以提前发现设计问题，避免返工。

**Q: Phase 2/3 的任务什么时候做？**  
A: Phase 1 通过代码审查后再做 Phase 2。不要一股脑都做，这样容易出错。

---

## 最佳实践

1. **分阶段推进** - 不要一次性做完所有 Phase
2. **每个 Phase 都要代码审查** - 确保质量
3. **提前沟通** - 遇到阻力立即讨论，不要埋头苦干
4. **保持日志** - 每个 Phase 输出都记录到文件
5. **定期回顾** - 功能上线后 1 周复盘，记录经验教训

---

**最后更新：** 2026-04-29
