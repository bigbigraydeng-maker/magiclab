# PRD：Magic Engine Build Mine 自动化 MVP

## 1. 背景

Magic Lab 每天都会和 Claude Code / Codex 一起产生大量真实建设记录：代码、产品判断、SEO 页面、PRD、自动化流程、bug 修复、技术债清理、内容素材。

这些记录原本只是私有日报，用来给社交内容储备素材。但它们也可以成为 Magic Lab 对外展示的长期建设轨迹。

Build Mine 的核心想法是：

> 把每天真实发生的 AI-assisted building，自动沉淀成可公开的 Proof of Work。

## 2. 目标

第一版目标不是做复杂后台，而是打通最小自动化链路：

1. 从 Claude/Codex 日报目录读取 markdown。
2. 只处理 `content_ready: true` 的日报。
3. 自动提取日期、项目、commit 数、建设强度、标签、可公开素材。
4. 生成站点可直接使用的数据文件。
5. 在 `/magic-engine/build-mine` 页面展示：
   - Build days
   - Current streak
   - Artifacts
   - Commits logged
   - Average intensity
   - 年度建设热力图
   - 最新公开 artifacts

## 3. 数据来源

默认读取目录：

`C:\Users\Zhong\Documents\Claude Big Ray\magic-engine\Second-Brain\Claude-Code-Logs`

也可以通过环境变量覆盖：

`BUILD_MINE_LOG_DIR`

## 4. 自动化命令

```bash
npm run generate:build-mine
```

该命令会读取日报并生成：

`src/data/buildMineEntries.ts`

## 5. 隐私规则

Build Mine 不能直接公开原始日报。第一版遵守以下规则：

- 只读取 `content_ready: true` 的日报。
- 不读取“不能公开的内容”作为页面展示主体。
- 页面只展示公开摘要、标签、建设强度、commit 数和可公开素材钩子。
- 客户名、内部路径、token、环境变量、未验证生产状态等敏感内容不应进入公开页面。

## 6. 页面定位

公开页面：

`/magic-engine/build-mine`

页面不是普通 changelog，而是 Magic Lab 的建设仪表盘：

- 对客户：证明 Magic Lab 每天真的在构建 AI automation 系统。
- 对 SEO：增加真实经验、技术实体、长尾主题和持续更新信号。
- 对投资人/合作方：展示产品进化速度和执行密度。
- 对自己：形成一年的建设记忆。

## 7. 下一步

1. 让 Claude/Codex 每天稳定生成日报。
2. 每天自动运行 `npm run generate:build-mine`。
3. 给每条日报增加更明确的 `public_ready: true/false` 字段。
4. 后续接入 Magic Content Engine，把 Build Mine 条目自动生成英文 public note。
5. 再做游戏化增强：
   - level system
   - artifact rarity
   - project skill tree
   - monthly boss fight / milestone
   - yearly build atlas
