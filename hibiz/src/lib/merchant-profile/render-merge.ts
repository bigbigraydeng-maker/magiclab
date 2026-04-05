import type { MerchantContactV1 } from "@/types/merchant-profile";

/** Prefer merchant-configured contact lines on the Contact module. */
export function contactLinesFromMerchant(modelLines: string[], contact: MerchantContactV1 | undefined): string[] {
  const lines: string[] = [];
  const p = contact?.phone?.trim();
  const e = contact?.email?.trim();
  const a = contact?.address?.trim();
  if (p) {
    lines.push(`Phone: ${p}`);
  }
  if (e) {
    lines.push(`Email: ${e}`);
  }
  if (a) {
    lines.push(`Address: ${a}`);
  }
  return lines.length > 0 ? lines : modelLines;
}

export function safeExternalImageUrl(raw: string | undefined): string | null {
  if (!raw?.trim()) {
    return null;
  }
  const u = raw.trim();
  if (u.startsWith("https://") || u.startsWith("http://")) {
    return u;
  }
  return null;
}
