import { filterAndRankListingImageUrls } from "@/lib/extraction/image-url-filters";
import { safeExternalImageUrl } from "@/lib/merchant-profile/render-merge";
import type { PropertyPromoV1 } from "@/types/merchant-profile";

/** 主图 URL 优先，其次 TradeMe 列表；去重、过滤 logo 噪声、排序，最多 12 张。 */
export function collectPosterImageUrls(promo: PropertyPromoV1 | undefined): string[] {
  const raw: string[] = [];
  const push = (url: string | undefined) => {
    const u = safeExternalImageUrl(url);
    if (u && !raw.includes(u)) {
      raw.push(u);
    }
  };
  push(promo?.image_url);
  for (const u of promo?.trademe_image_urls ?? []) {
    push(u);
  }
  return filterAndRankListingImageUrls(raw, 12);
}
