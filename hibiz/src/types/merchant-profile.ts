/** Stored in microsites.merchant_profile (JSONB). */

import { normalizePosterTemplateId, type PosterTemplateId } from "@/data/poster-templates";
import { coercePersistedTradeMeImageUrl } from "@/lib/extraction/legacy-url";

export interface MerchantContactV1 {
  phone?: string;
  email?: string;
  address?: string;
}

/** Real estate: manual promo — no listing feed; image via HTTPS URL (upload to Storage later). */
export interface PropertyPromoV1 {
  headline?: string;
  details?: string;
  image_url?: string;
  trademe_url?: string;
  /** 海报选用的设计模板 */
  poster_template_id?: PosterTemplateId;
  /** 从 TradeMe 页缓存的图片（服务端抓取） */
  trademe_image_urls?: string[];
  /** 从 listing 导入的中介展示（海报/预览；可与 contact 手工电话并存） */
  listing_agent_name?: string;
  listing_agent_company?: string;
  /** 海报上优先展示；可与上方 Contact 电话不同（如 listing 上分机号） */
  listing_agent_phone?: string;
  listing_agent_photo_url?: string;
  /** 导入生成的海报正文（提炼要点）；海报优先显示对应语言 */
  poster_blurb_zh?: string;
  poster_blurb_en?: string;
  /** 海报摘要语言（打印用） */
  poster_locale?: "en" | "zh";
}

export interface MerchantProfileV1 {
  schema_version: 1;
  contact?: MerchantContactV1;
  property_promo?: PropertyPromoV1;
}

export function parseMerchantProfile(raw: unknown): MerchantProfileV1 | null {
  if (raw == null || typeof raw !== "object") {
    return null;
  }
  const o = raw as Record<string, unknown>;

  const contact: MerchantContactV1 = {};
  if (o.contact && typeof o.contact === "object") {
    const c = o.contact as Record<string, unknown>;
    if (typeof c.phone === "string" && c.phone.trim()) {
      contact.phone = c.phone.trim();
    }
    if (typeof c.email === "string" && c.email.trim()) {
      contact.email = c.email.trim();
    }
    if (typeof c.address === "string" && c.address.trim()) {
      contact.address = c.address.trim();
    }
  }

  const property_promo: PropertyPromoV1 = {};
  if (o.property_promo && typeof o.property_promo === "object") {
    const p = o.property_promo as Record<string, unknown>;
    if (typeof p.headline === "string" && p.headline.trim()) {
      property_promo.headline = p.headline.trim();
    }
    if (typeof p.details === "string" && p.details.trim()) {
      property_promo.details = p.details.trim();
    }
    if (typeof p.image_url === "string" && p.image_url.trim()) {
      property_promo.image_url = p.image_url.trim();
    }
    if (typeof p.trademe_url === "string" && p.trademe_url.trim()) {
      property_promo.trademe_url = p.trademe_url.trim();
    }
    if (typeof p.poster_template_id === "string") {
      property_promo.poster_template_id = normalizePosterTemplateId(p.poster_template_id);
    }
    if (Array.isArray(p.trademe_image_urls)) {
      const urls = p.trademe_image_urls
        .map((x) => (typeof x === "string" ? coercePersistedTradeMeImageUrl(x) : null))
        .filter((x): x is string => x !== null);
      if (urls.length > 0) {
        property_promo.trademe_image_urls = urls.slice(0, 12);
      }
    }
    if (typeof p.listing_agent_name === "string" && p.listing_agent_name.trim()) {
      property_promo.listing_agent_name = p.listing_agent_name.trim();
    }
    if (typeof p.listing_agent_company === "string" && p.listing_agent_company.trim()) {
      property_promo.listing_agent_company = p.listing_agent_company.trim();
    }
    if (typeof p.listing_agent_photo_url === "string" && p.listing_agent_photo_url.trim()) {
      property_promo.listing_agent_photo_url = p.listing_agent_photo_url.trim();
    }
    if (typeof p.listing_agent_phone === "string" && p.listing_agent_phone.trim()) {
      property_promo.listing_agent_phone = p.listing_agent_phone.trim();
    }
    if (typeof p.poster_blurb_zh === "string" && p.poster_blurb_zh.trim()) {
      property_promo.poster_blurb_zh = p.poster_blurb_zh.trim();
    }
    if (typeof p.poster_blurb_en === "string" && p.poster_blurb_en.trim()) {
      property_promo.poster_blurb_en = p.poster_blurb_en.trim();
    }
    if (p.poster_locale === "en" || p.poster_locale === "zh") {
      property_promo.poster_locale = p.poster_locale;
    }
  }

  const hasContact = Object.keys(contact).length > 0;
  const hasPromo = Object.keys(property_promo).length > 0;
  if (!hasContact && !hasPromo) {
    return null;
  }

  return {
    schema_version: 1,
    ...(hasContact ? { contact } : {}),
    ...(hasPromo ? { property_promo } : {}),
  };
}
