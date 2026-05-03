# Security Review — 修复方案

**审查日期**: 2026-04-07
**审查结果**: 3 个 HIGH 级问题 + 6 个 MEDIUM/LOW 问题

---

## 🚨 HIGH 优先级 — 必须在下次发布前修复

### HIGH-3: `getMediaAssets` Server Action 缺少授权检查 🔴

**文件**: `src/app/app/projects/media-actions.ts` lines 238–270
**风险**: 任何认证用户可以读取其他用户的素材资产

**当前代码**:
```typescript
export async function getMediaAssets(projectId: string, category?: MediaCategory) {
  const supabase = createClient();
  // ❌ 没有 auth 检查！
  let query = supabase.from("media_assets").select("*").eq("project_id", projectId)...
}
```

**修复**:
```typescript
export async function getMediaAssets(projectId: string, category?: MediaCategory) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // ✅ 检查项目所有权
  await assertProjectOwner(projectId, user.id);

  let query = supabase.from("media_assets").select("*").eq("project_id", projectId)...
}
```

**影响**: 🔴 严重 — 跨用户信息泄露

---

### MEDIUM-4: `updateMerchantProfileFromForm` 缺少项目所有权检查 🟠

**文件**: `src/app/app/projects/merchant-profile-actions.ts` lines 130–135 和 197–204
**风险**: 用户可以修改其他用户的商家信息（联系方式、宣传内容、hero 图片）

**当前代码**:
```typescript
export async function updateMerchantProfileFromForm(projectId: string, ...fields) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // ❌ 没有检查 project_id 是否属于 user！
  const { data: microsite } = await supabase
    .from("microsites")
    .select(...).eq("project_id", projectId).maybeSingle();

  // 可以修改任何项目的信息...
}

// ❌ importListingFromUrl 也有相同问题 (lines 197–204)
```

**修复**:
```typescript
export async function updateMerchantProfileFromForm(projectId: string, ...fields) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // ✅ 添加所有权检查
  await assertProjectOwner(projectId, user.id);

  const { data: microsite } = await supabase
    .from("microsites")
    .select(...).eq("project_id", projectId).maybeSingle();
  // ...
}

// ❌ importListingFromUrl 也需要相同修复
export async function importListingFromUrl(...) {
  // ...
  await assertProjectOwner(projectId, user.id);  // ✅ 添加这行
  // ...
}
```

**建议**: 将 `assertProjectOwner` 提取到共享工具模块，以便在所有 action 中重用

**影响**: 🟠 高 — 跨用户信息篡改

---

### HIGH-1: `safeExternalImageUrl` 接受 `http://` URLs 🔴

**文件**: `src/lib/merchant-profile/render-merge.ts` lines 38–39
**风险**: 存储纯 HTTP URLs，渲染在公网网站上导致混合内容、中间人攻击

**当前代码**:
```typescript
export function safeExternalImageUrl(raw: string | undefined): string | null {
  if (!raw?.trim()) return null;
  const u = raw.trim();
  if (u.startsWith("http://") || u.startsWith("https://")) return u;  // ❌ 允许 http://
  return null;
}
```

**修复**:
```typescript
export function safeExternalImageUrl(raw: string | undefined): string | null {
  if (!raw?.trim()) return null;
  const u = raw.trim();
  if (u.startsWith("https://")) return u;  // ✅ 仅 HTTPS
  return null;
}
```

**影响**: 🔴 严重 — 网络攻击向量（中间人、混合内容）

---

## 🟡 MEDIUM 优先级 — 应该在下次发布前修复

### HIGH-2: 没有 hero_image_url 的域名白名单 🟠

**文件**: `src/app/app/projects/media-actions.ts` lines 273–323
**风险**: 如果将来添加服务端图片处理（如调整大小、海报生成），可能导致 SSRF 攻击内部服务

**修复方案**:
```typescript
// 新增: 白名单域名检查
const ALLOWED_IMAGE_HOSTS = [
  "images.unsplash.com",
  "*.supabase.co",
  // 你的存储域名
];

function isAllowedImageHost(url: string): boolean {
  try {
    const u = new URL(url);
    return ALLOWED_IMAGE_HOSTS.some(host =>
      host === u.hostname ||
      (host.startsWith("*.") && u.hostname.endsWith(host.substring(1)))
    );
  } catch {
    return false;
  }
}

export async function applyImageToHero(...) {
  const validUrl = safeExternalImageUrl(imageUrl);
  if (!validUrl || !isAllowedImageHost(validUrl)) {
    throw new Error("Image host not allowed");
  }
  // ...
}
```

---

### MEDIUM-1: `searchUnsplash` 没有速率限制 🟠

**文件**: `src/app/app/projects/media-actions.ts` lines 30–45
**风险**: 认证用户可以通过大量请求耗尽 Unsplash API 配额

**修复方案**:
```typescript
// 使用 upstash/ratelimit 或类似库
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(30, "1 h"),  // 每小时 30 次请求
});

export async function searchUnsplash(query: string, page?: number) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // ✅ 按用户限速
  const { success } = await ratelimit.limit(user.id);
  if (!success) throw new Error("Too many requests");

  return searchUnsplashPhotos(query, { page });
}
```

---

### MEDIUM-2: `parseMerchantProfile` 不验证 hero_image_url 🟠

**文件**: `src/types/merchant-profile.ts` line 205
**修复**:
```typescript
export function parseMerchantProfile(...): MerchantProfileV1 {
  // ...
  hero_image_url: safeExternalImageUrl(o.hero_image_url) ?? undefined,  // ✅ 验证
  // ...
}
```

---

### MEDIUM-3: Unsplash API 响应没有运行时验证 🟠

**文件**: `src/lib/media/unsplash-client.ts` line 71
**修复**:
```typescript
import { z } from "zod";

// 定义 schema
const UnsplashPhotoSchema = z.object({
  id: z.string(),
  urls: z.object({
    regular: z.string().url(),
    small: z.string().url(),
    // ...
  }),
  // ...
});

export async function searchUnsplashPhotos(...) {
  // ...
  const json = await res.json();
  // ✅ 运行时验证
  const validated = z.array(UnsplashPhotoSchema).parse(json.results);
  return { ...json, results: validated };
}
```

---

## 🟢 LOW 优先级 — 后续改进

### LOW-1: `triggerUnsplashDownload` 在客户端调用但会失败 🟢
- 将调用移到 `applyImageToHero` Server Action 中
- 移除 `UnsplashSearch.tsx` 的客户端导入

### LOW-2: 未知的 `missing=` 查询参数键渲染为文本 🟢
- 在 `[id]/page.tsx` 中过滤仅已知的 `missingRaw` 键

---

## 修复优先级时间表

### 立即 (Hotfix) 🚨
- [ ] HIGH-3: 添加 `getMediaAssets` 授权检查
- [ ] MEDIUM-4: 添加 `updateMerchantProfileFromForm` 所有权检查
- [ ] HIGH-1: 限制仅 HTTPS URLs

**预计时间**: 30 分钟
**影响**: 阻止跨用户信息泄露 + 篡改

### 本周内 🟠
- [ ] HIGH-2: 添加域名白名单
- [ ] MEDIUM-1: 添加速率限制
- [ ] MEDIUM-2/3: 添加运行时验证

**预计时间**: 1-2 小时
**影响**: 防御 SSRF、API 滥用、注入攻击

### 下次迭代 🟢
- [ ] LOW-1: 移动 Unsplash 下载触发
- [ ] LOW-2: 过滤查询参数

---

## 验收标准

每个修复合并前需要满足:
- [ ] 修改的代码在 TypeScript 严格模式下编译
- [ ] 相关单元测试通过
- [ ] 修复的安全问题通过代码审查
- [ ] 无新的安全问题引入

---

## 相关文档

- 完整安全审查报告: `SECURITY_REVIEW_FIXES.md` (本文件)
- 部署前清单: `DEPLOYMENT_STEPS.md`
- 最终报告: `PHASE_5_FINAL_REPORT.md`
