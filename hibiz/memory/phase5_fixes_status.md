---
name: Phase 5 修复状态 — 所有问题修复进度
date: 2026-04-07
---

## ✅ HIGH 优先级 (立即修复) — 已完成

**HIGH-1**: `updateMerchantProfileFromForm` 数据丢失 ✅
- 文件: `src/app/app/projects/merchant-profile-actions.ts` lines 150–160
- 问题: 保存时删除 skeleton_id, theme_overrides, module_visibility, property_listings 等字段
- 修复: 保留所有现有字段，仅覆盖表单提交的部分
- 提交: 42e9e05 & 20476dd
- 状态: ✅ 已完成并推送

**HIGH-2**: `safeExternalImageUrl` 接受 HTTP URLs ✅
- 文件: `src/lib/merchant-profile/render-merge.ts` lines 38–39
- 问题: 允许 http:// URLs，产生混合内容和中间人攻击风险
- 修复: 仅接受 https://
- 提交: 60637c0
- 状态: ✅ 已完成并推送

### 🟠 MEDIUM 优先级 (本周) — 待修复

1. **MEDIUM-1**: `getMediaAssets` 缺少授权检查 — 添加 assertProjectOwner
2. **MEDIUM-2**: `updateMerchantProfileFromForm` & `importListingFromUrl` 缺少所有权检查 — 添加 assertProjectOwner
3. **MEDIUM-3**: `ToolkitPage` 微站查询缺少用户过滤 — 添加 user_id 过滤
4. **MEDIUM-4**: `searchUnsplash` 无速率限制 — 使用 upstash/ratelimit
5. **MEDIUM-5**: Unsplash API 响应无运行时验证 — 使用 Zod schema
6. **MEDIUM-6**: UnsplashSearch 双重触发下载统计 — 移到 Server Action

**状态**: 待开始（HIGH 问题完成后优先）

### 🟢 LOW 优先级 (下次迭代) — 可选

6 个 LOW 问题 (工具卡片 Coming Soon / Link 组件 / emoji 等)

**状态**: 非阻塞，MEDIUM 完成后优先

## 修复流程 — Phase 5

### ✅ 已完成 (HIGH 优先级)
1. ✅ Claude 按优先级顺序修复
2. ✅ 每次修复后运行: `npm run build` + `npm run test` (16/16 通过)
3. ✅ 提交 3 个单独的 commit
4. ✅ 代码审查验证 claude.md 规则 (通过)
5. ✅ 推送到 origin/master
6. ✅ Render 自动部署 (2-3 分钟内上线)

### ⏳ 待执行 (MEDIUM 优先级)
- Cursor 开始修复 6 个 MEDIUM 问题
- 每次修复后验证构建和测试
- 代码审查验证安全和质量标准
- 推送到 main

## 文件遵循规则

从 `C:\Users\Zhong\Documents\CLAUDE.md`:
- 使用 Immutability 模式 (创建新对象，不修改现有对象)
- 函数 < 50 行，文件 < 800 行
- 显式错误处理
- 输入验证在系统边界
- 无深嵌套 (> 4 层)
- 无硬编码秘密

从 `src/components/hibiz/CLAUDE.md`:
- TypeScript 严格模式
- Props 必须有 interface
- 文件 < 400 行
- 不可变数据模式
- 错误显式处理
