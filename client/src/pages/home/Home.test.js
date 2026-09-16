import { describe, expect, it } from "vitest";

import SHOP_DATA from "../../redux/shop/shopData";
import { buildHomepageMedia, getHomepageImageUrls } from "./homeMedia";

describe("buildHomepageMedia", () => {
  it("selects only unique product images across homepage merchandising regions", () => {
    const media = buildHomepageMedia(SHOP_DATA);
    const urls = getHomepageImageUrls(media);

    expect(urls.length).toBeGreaterThan(8);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("does not reuse reserved category imagery", () => {
    const reserved = [SHOP_DATA.womens.items[2].imageUrl];
    const media = buildHomepageMedia(SHOP_DATA, reserved);
    expect(getHomepageImageUrls(media)).not.toContain(reserved[0]);
  });
});
