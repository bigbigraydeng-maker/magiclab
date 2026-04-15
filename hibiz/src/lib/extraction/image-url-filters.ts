/**
 * TradeMe 页 Markdown 里常混入站点 logo / UI 图，需过滤并优先保留房源照片 URL。
 */

const JUNK_SUBSTRINGS = [
  "/logo",
  "logo-2025",
  "tm-logo",
  "spotlight",
  "spotlight-202",
  "/brand",
  "favicon",
  "apple-touch",
  "/icons/",
  "/icon/",
  "sprite",
  "badge",
  "wordmark",
  "kiwi",
  "/images/common/",
  "nav-",
];

function pathnameLower(url: string): string {
  try {
    return new URL(url).pathname.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

/** 明显为站点品牌/UI，非房源图 */
export function isJunkListingImageUrl(url: string): boolean {
  const u = url.trim();
  if (!u.startsWith("https://")) {
    return true;
  }
  const lower = u.toLowerCase();
  const path = pathnameLower(u);

  if (/\.(svg|ico)(\?|#|$)/i.test(path)) {
    return true;
  }

  for (const s of JUNK_SUBSTRINGS) {
    if (lower.includes(s)) {
      return true;
    }
  }

  // 主站 /images/ 下的品牌、导航、Kiwi 标（非房源图）
  if (/trademe\.co\.nz\/images\//i.test(lower) && /logo|spotlight|brand|nav|kiwi|wordmark|tm-logo|common\//i.test(lower)) {
    return true;
  }

  if (/www\.trademe\.co\.nz\/images\/[^/]*logo/i.test(lower)) {
    return true;
  }

  return false;
}

/** 分数越高越像房源图（启发式） */
export function scoreListingImageUrl(url: string): number {
  let score = 0;
  const lower = url.toLowerCase();

  if (/\.(jpe?g|png|webp|gif)(\?|#|$)/i.test(lower)) {
    score += 8;
  }

  if (
    /listing|gallery|photo|property|resize|image|cdn|tmcdn|cloudfront|trademe-images|listingimage|propertyimage/i.test(
      lower,
    )
  ) {
    score += 12;
  }

  if (/tmcdn|images\.trademe|trademeproperty|photo/i.test(lower)) {
    score += 6;
  }

  if (/logo|spotlight|brand|favicon|wordmark|sprite|badge|kiwi|icon\/|icons\//i.test(lower)) {
    score -= 50;
  }

  // 房源页 HTML URL 误当图链
  if (/trademe\.co\.nz\/a\/property/i.test(lower)) {
    score -= 40;
  }

  if (/tmcdn|cloudfront|trademe-images|listingimage|propertyimage|gallery|resize|photo/i.test(lower)) {
    score += 15;
  }

  // 已通过 image-proxy 写入 Supabase 的房源图：路径不含 tmcdn 等关键词，原先会低于 minScore 被整页过滤掉
  if (/listing-images\//i.test(lower) || /\/object\/public\/listing-images\//i.test(lower)) {
    score += 55;
  }

  return score;
}

/**
 * 去噪、按分数排序、截断数量。
 * `minScore`：低于此分的 URL 丢弃，避免仅剩站点品牌图（分数往往仍 >0）被当成「房源图」。
 */
export function filterAndRankListingImageUrls(urls: string[], max = 12, minScore = 14): string[] {
  const seen = new Set<string>();
  const unique = urls.filter((u) => {
    const t = u.trim();
    if (!t || seen.has(t)) {
      return false;
    }
    if (isJunkListingImageUrl(t)) {
      return false;
    }
    seen.add(t);
    return true;
  });

  const ranked = unique.sort((a, b) => scoreListingImageUrl(b) - scoreListingImageUrl(a));
  const strict = ranked.filter((u) => scoreListingImageUrl(u) >= minScore).slice(0, max);
  if (strict.length > 0) {
    return strict;
  }
  // 仍为空时放宽分数阈值（仍排除 junk），避免外链图启发式分数偏低或自托管图 URL 无 tmcdn 关键词时海报无图
  return ranked.slice(0, max);
}
