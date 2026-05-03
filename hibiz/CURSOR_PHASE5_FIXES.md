# Cursor 任务：Phase 5 问题修复 (HIGH 优先级)

## 概述
修复 Phase 5 代码审查发现的问题。需要遵循 claude.md 文件的规则。

---

## HIGH-1: 修复 `updateMerchantProfileFromForm` 数据丢失

**文件**: `src/app/app/projects/merchant-profile-actions.ts`

**问题**:
当用户在商家信息表单中修改联系方式后保存，会**无声地删除**这些字段:
- `skeleton_id` (骨架模板选择)
- `theme_overrides` (主题覆盖)
- `module_visibility` (模块可见性)
- `property_listings` (房源列表)
- `display_name`, `company_name`, `logo_url` 等

**当前代码** (第 150–155 行):
```typescript
const profile: MerchantProfileV1 = {
  schema_version: 1,
  ...(contact ? { contact } : {}),
  ...(property_promo ? { property_promo } : {}),
  // ❌ 丢失其他所有字段！
  ...(existing?.hero_image_url ? { hero_image_url: existing.hero_image_url } : {}),
};
```

**修复步骤**:

1. 打开 `src/app/app/projects/merchant-profile-actions.ts`
2. 找到 `updateMerchantProfileFromForm` 函数 (约在第 130 行)
3. 定位到第 150–155 行的 profile 对象构造
4. **改为保留所有现有字段**:

```typescript
// ✅ 修复: 保留所有现有字段，仅覆盖表单提交的部分
const profile: MerchantProfileV1 = {
  ...(existing ?? { schema_version: 1 }),  // 先保留所有现有字段
  schema_version: 1,
  // 然后覆盖表单修改的字段
  ...(contact ? { contact } : { contact: existing?.contact }),
  ...(property_promo ? { property_promo } : { property_promo: existing?.property_promo }),
  // 保留 hero_image_url
  hero_image_url: existing?.hero_image_url,
};
```

**验证**:
```bash
npm run build  # 应该无错误
npm run test   # 应该 16/16 通过
```

---

## HIGH-2: 修复 `safeExternalImageUrl` 接受 HTTP URLs

**文件**: `src/lib/merchant-profile/render-merge.ts`

**问题**:
函数接受 `http://` 和 `https://` URLs，但 HTTPS 网站不应链接 HTTP 资源（混合内容风险）。

**当前代码** (第 38–39 行):
```typescript
export function safeExternalImageUrl(raw: string | undefined): string | null {
  if (!raw?.trim()) return null;
  const u = raw.trim();
  if (u.startsWith("https://") || u.startsWith("http://")) return u;  // ❌ 允许 http://
  return null;
}
```

**修复步骤**:

1. 打开 `src/lib/merchant-profile/render-merge.ts`
2. 找到 `safeExternalImageUrl` 函数 (约在第 36 行)
3. 修改第 38–39 行:

```typescript
// ✅ 修复: 仅接受 HTTPS
export function safeExternalImageUrl(raw: string | undefined): string | null {
  if (!raw?.trim()) return null;
  const u = raw.trim();
  if (u.startsWith("https://")) return u;  // ✅ 仅 HTTPS
  return null;
}
```

**为什么这样安全**:
- Unsplash URLs 总是 HTTPS
- Supabase Storage URLs 总是 HTTPS
- 用户上传的图片存储在 Supabase（HTTPS）
- 没有正当理由支持 HTTP

**验证**:
```bash
npm run build  # 应该无错误
npm run test   # 应该 16/16 通过
```

---

## 检查清单

修复完成后，验证:

- [ ] `npm run build` 无错误
- [ ] `npm run test` 16/16 通过
- [ ] 两个函数遵循 claude.md 规则:
  - [ ] 函数 < 50 行 ✅ (都很小)
  - [ ] 没有深嵌套 ✅
  - [ ] 不可变数据模式 ✅
  - [ ] 显式错误处理 ✅
- [ ] 使用 TypeScript 严格模式 ✅
- [ ] 没有硬编码秘密 ✅
- [ ] 代码可读性好 ✅

---

## 提交 Commit

完成后创建两个独立的 commit:

### Commit 1 (HIGH-1):
```
fix: preserve all merchant profile fields when updating form

Fixes data loss bug where saving business info form would erase:
- skeleton_id (template selection)
- theme_overrides
- module_visibility
- property_listings
- display_name, company_name, logo_url, etc.

Now preserves all existing fields and only overwrites form-submitted fields.

Fixes: CODE_REVIEW_SUMMARY.md HIGH-1
```

### Commit 2 (HIGH-2):
```
fix: restrict external image URLs to HTTPS only

Remove support for http:// URLs to prevent mixed content warnings
and potential MITM attacks on hero images.

- hero_image_url: must be https://
- Unsplash and Supabase Storage are already HTTPS

Fixes: CODE_REVIEW_SUMMARY.md HIGH-2
```

---

## MEDIUM 优先级修复 (完成 HIGH 后)

见 `CODE_REVIEW_SUMMARY.md` MEDIUM 部分:
1. MEDIUM-1: `getMediaAssets` 添加授权
2. MEDIUM-2: `updateMerchantProfileFromForm` 添加所有权检查
3. MEDIUM-3: `ToolkitPage` 添加用户过滤
4. MEDIUM-4: `searchUnsplash` 速率限制
5. MEDIUM-5: Unsplash 运行时验证
6. MEDIUM-6: 下载统计去重

---

## 需要帮助?

查看相关文件:
- `CODE_REVIEW_SUMMARY.md` — 完整问题描述和修复方案
- `SECURITY_REVIEW_FIXES.md` — 安全问题详解
- `src/app/app/projects/merchant-profile-actions.ts` — 完整文件上下文
- `src/lib/merchant-profile/render-merge.ts` — 完整文件上下文
