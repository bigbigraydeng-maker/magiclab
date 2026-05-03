# Phase 5 代码审查总结

**审查日期**: 2026-04-07
**审查状态**: ✅ **已批准，但需要修复问题**
**发现**: 2 个 HIGH + 9 个 MEDIUM/LOW 问题

---

## 🚨 必须修复 (HIGH 优先级)

### HIGH-1: `updateMerchantProfileFromForm` 丢失关键数据 🔴

**文件**: `src/app/app/projects/merchant-profile-actions.ts` lines 150–155
**严重程度**: 🔴 严重数据丢失
**影响**: 用户设置骨架模板、主题、房源列表后，点击保存商家信息会**无声地删除这些数据**

**当前代码** (问题):
```typescript
const profile: MerchantProfileV1 = {
  schema_version: 1,
  ...(contact ? { contact } : {}),
  ...(property_promo ? { property_promo } : {}),
  // ❌ 丢失: skeleton_id, theme_overrides, module_visibility, property_listings,
  //         display_name, company_name, logo_url, avatar_url, bio_zh, bio_en
  ...(existing?.hero_image_url ? { hero_image_url: existing.hero_image_url } : {}),
};
```

**修复方案**:
```typescript
// ✅ 保留所有现有字段，仅覆盖表单提交的部分
const profile: MerchantProfileV1 = {
  ...(existing ?? { schema_version: 1 }),  // 保留所有现有字段
  schema_version: 1,
  // 覆盖表单提交的字段
  ...(contact ? { contact } : { contact: undefined }),
  ...(property_promo ? { property_promo } : { property_promo: undefined }),
  // 保留 hero_image_url
  hero_image_url: existing?.hero_image_url,
};
```

**为什么这是 HIGH**:
- 用户设置骨架模板 → 点击保存商家信息 → **骨架模板消失**
- 用户添加房源列表 → 点击保存电话 → **房源列表消失**
- 无错误提示，用户不知道发生了什么

---

### HIGH-2: `safeExternalImageUrl` 接受 HTTP URLs 🔴

**文件**: `src/lib/merchant-profile/render-merge.ts` lines 38–39
**严重程度**: 🔴 网络安全风险
**影响**: Hero 图片可以指向不安全的 HTTP 源（中间人攻击风险）

**当前代码** (问题):
```typescript
if (u.startsWith("https://") || u.startsWith("http://")) return u;  // ❌ 允许 http://
```

**修复方案**:
```typescript
if (u.startsWith("https://")) return u;  // ✅ 仅 HTTPS
return null;
```

**为什么这是 HIGH**:
- HTTPS 网站不应链接 HTTP 图片（混合内容）
- 用户流量可被中间人拦截
- Unsplash 和 Supabase Storage 都是 HTTPS，没有正当理由支持 HTTP

---

## 🟠 应该修复 (MEDIUM 优先级)

### MEDIUM-1: `getMediaAssets` 缺少授权检查
**文件**: `src/app/app/projects/media-actions.ts:238–270`
**问题**: 任何认证用户可以读取其他用户的素材资产
**修复**: 添加 `await assertProjectOwner(projectId, user.id);`

### MEDIUM-2: `updateMerchantProfileFromForm` 缺少所有权检查
**文件**: `src/app/app/projects/merchant-profile-actions.ts:130–135 & 197–204`
**问题**: 用户可以修改其他用户的商家信息
**修复**: 对 `updateMerchantProfileFromForm` 和 `importListingFromUrl` 添加 `await assertProjectOwner(projectId, user.id);`

### MEDIUM-3: `ToolkitPage` 微站查询缺少所有权过滤
**文件**: `src/app/app/projects/[id]/toolkit/page.tsx:36–42`
**问题**: 微站查询仅过滤 `project_id`，未检查 `user_id`
**修复**: 添加 `.eq("user_id", user.id)` 或依赖 RLS

### MEDIUM-4: `searchUnsplash` 没有速率限制
**文件**: `src/app/app/projects/media-actions.ts:30–45`
**问题**: 认证用户可以通过大量搜索请求耗尽 Unsplash API 配额
**修复**: 使用 `@upstash/ratelimit`，每用户每小时限制 30 次请求

### MEDIUM-5: Unsplash API 响应没有运行时验证
**文件**: `src/lib/media/unsplash-client.ts:71`
**问题**: 响应用 `as Promise<UnsplashSearchResult>` 直接类型转换，无验证
**修复**: 使用 Zod schema 进行运行时验证

### MEDIUM-6: `UnsplashSearch` 双重触发 Unsplash 下载统计
**文件**: `src/components/media/UnsplashSearch.tsx:69–83`
**问题**: "应用到 Hero" 后如果再 "保存到素材库"，会触发两次下载统计
**修复**: 将 `triggerUnsplashDownload` 仅在 Server Action 中调用

---

## 🟢 可选改进 (LOW 优先级)

### LOW-1: 工具卡片链接到未实现的路由
**文件**: `src/app/app/projects/[id]/toolkit/page.tsx`
**问题**: "社交媒体"、"表单与线索"、"数据报表" 等工具卡片指向可能不存在的页面
**改进**: 添加 "Coming Soon" 标签或禁用未实现的工具

### LOW-2: 工作流边栏使用 `<a>` 而非 `<Link>`
**文件**: `src/components/project-workflow-sidebar.tsx:49–56`
**问题**: 工具箱快速链接使用纯 HTML `<a>`，不会预加载或客户端导航
**改进**: 改用 Next.js `<Link>` 组件

### LOW-3: `parseMerchantProfile` 不验证 `hero_image_url`
**文件**: `src/types/merchant-profile.ts:205`
**问题**: 从 DB 读取时未验证 URL 格式
**改进**: 在 `parseMerchantProfile` 中调用 `safeExternalImageUrl`

### LOW-4: 源代码中的 emoji 字符
**文件**: `src/components/project-workflow-sidebar.tsx:10,21,46` 等
**问题**: Emoji 硬编码在代码中（如果项目后续禁用 emoji 需要重构）
**改进**: 提取为命名常量或 icon 组件

### LOW-5: `safeExternalImageUrl` 无域名白名单
**文件**: `src/app/app/projects/media-actions.ts`
**问题**: 接受任何 HTTPS 域名的图片（未来如果添加服务端处理可能导致 SSRF）
**改进**: 添加域名白名单（Unsplash、Supabase Storage 等）

### LOW-6: 骨架模板变体类型不强制
**文件**: `src/data/skeletons/agent-pro.ts:11–34`
**问题**: `variant` 字符串值未通过闭合枚举强制（如果变体值写错，只会在渲染时失败）
**改进**: 为每个模块类型添加强制的变体枚举

---

## 📊 问题总结

| 优先级 | 数量 | 问题 |
|--------|------|------|
| 🔴 HIGH | 2 | 数据丢失 + HTTP URLs |
| 🟠 MEDIUM | 6 | 授权/验证/限流 |
| 🟢 LOW | 6 | UX/类型安全/样式 |

---

## 🛠️ 修复时间表

### 立即修复 (阻塞部署) — **必须**
- [ ] HIGH-1: 修复 `updateMerchantProfileFromForm` 数据丢失 (5 分钟)
- [ ] HIGH-2: 限制 `safeExternalImageUrl` 仅 HTTPS (1 分钟)

**优先级**: 🔴 严重 — 阻止部署

### 本周修复 — **应该**
- [ ] MEDIUM-1/2/3: 添加授权检查 (30 分钟)
- [ ] MEDIUM-4: 速率限制 (30 分钟)
- [ ] MEDIUM-5/6: URL 验证和下载统计 (30 分钟)

**优先级**: 🟠 高 — 下周前完成

### 下次迭代 — **可以**
- [ ] LOW-1~6: UX 改进和类型安全 (1-2 小时)

**优先级**: 🟢 低 — 非阻塞

---

## ✅ 验收标准

代码合并前需要满足:
- [ ] HIGH-1 和 HIGH-2 已修复
- [ ] TypeScript 构建无错误
- [ ] 相关测试通过
- [ ] 修复的问题通过代码审查

代码发布前需要满足:
- [ ] 所有 MEDIUM 问题已修复或有清晰的时间表
- [ ] 生产环境已配置 UNSPLASH_ACCESS_KEY
- [ ] 用户验收测试通过

---

## 📋 关联文件

- **完整安全审查**: `SECURITY_REVIEW_FIXES.md`
- **完整代码审查**: 本文件 (`CODE_REVIEW_SUMMARY.md`)
- **部署报告**: `PHASE_5_FINAL_REPORT.md`
- **部署步骤**: `DEPLOYMENT_STEPS.md`

---

**建议**: 立即修复 HIGH-1 和 HIGH-2，然后重新部署。可以与 MEDIUM 问题修复并行进行。
