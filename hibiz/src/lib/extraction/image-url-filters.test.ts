import { describe, expect, it } from "vitest";
import { filterAndRankListingImageUrls, scoreListingImageUrl } from "./image-url-filters";

describe("scoreListingImageUrl", () => {
  it("scores Supabase listing-images proxy URLs above strict threshold", () => {
    const u =
      "https://abcdefgh.supabase.co/storage/v1/object/public/listing-images/proj-1/a1b2c3d4-e5f6.jpg";
    expect(scoreListingImageUrl(u)).toBeGreaterThanOrEqual(14);
  });
});

describe("filterAndRankListingImageUrls", () => {
  it("keeps proxied Supabase images for poster pipeline", () => {
    const u =
      "https://abcdefgh.supabase.co/storage/v1/object/public/listing-images/proj-1/a1b2c3d4-e5f6.jpg";
    expect(filterAndRankListingImageUrls([u], 6)).toEqual([u]);
  });

  it("falls back to best-effort order when no URL meets minScore", () => {
    const low = "https://example.org/a.jpg";
    expect(scoreListingImageUrl(low)).toBeLessThan(14);
    const out = filterAndRankListingImageUrls([low], 3);
    expect(out).toEqual([low]);
  });
});
