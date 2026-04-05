import type { TradeMeListingData } from "@/lib/extraction/trademe-schema";

export interface ExtractionQuality {
  score: number;
  grade: "good" | "partial" | "failed";
  /** 缺失维度（英文 key，供 URL 与 UI 映射） */
  missing: string[];
}

/**
 * 根据结构化 listing 评估抓取是否足以写入资料；failed 时应拒绝保存并提示用户。
 */
export function assessExtractionQuality(listing: TradeMeListingData): ExtractionQuality {
  let score = 0;
  const missing: string[] = [];

  const title = listing.title.trim();
  const desc = listing.description.trim();
  const imgCount = listing.images.length;

  if (title.length > 10) {
    score += 20;
  } else {
    missing.push("title");
  }

  if (desc.length > 50) {
    score += 25;
  } else {
    missing.push("description");
  }

  if (imgCount >= 2) {
    score += 25;
  } else if (imgCount === 1) {
    score += 10;
    missing.push("images");
  } else {
    missing.push("images");
  }

  if (listing.bedrooms != null) {
    score += 10;
  } else {
    missing.push("bedrooms");
  }

  if (listing.price_hint?.trim()) {
    score += 10;
  } else {
    missing.push("price_hint");
  }

  if (listing.address?.trim()) {
    score += 10;
  } else {
    missing.push("address");
  }

  let grade: ExtractionQuality["grade"];
  if (score >= 60) {
    grade = "good";
  } else if (score >= 30) {
    grade = "partial";
  } else {
    grade = "failed";
  }

  return { score, grade, missing: Array.from(new Set(missing)) };
}
