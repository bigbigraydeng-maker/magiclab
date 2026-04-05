import type { ExtractTradeMeListingResult } from "@/lib/extraction/extract-listing";
import { extractTradeMeListing } from "@/lib/extraction/extract-listing";
import { extractFromNextData } from "@/lib/extraction/extract-next-data";
import { filterAndRankListingImageUrls } from "@/lib/extraction/image-url-filters";

/**
 * Layer 1: HTML `__NEXT_DATA__`（零 LLM）→ Layer 2: Jina + OpenAI。
 */
export async function extractTradeMeListingMultiLayer(url: string): Promise<ExtractTradeMeListingResult> {
  const fromNext = await extractFromNextData(url);
  if (fromNext) {
    const images = filterAndRankListingImageUrls(fromNext.images, 12);
    return { listing: { ...fromNext, images }, markdown: "" };
  }
  return extractTradeMeListing(url);
}
