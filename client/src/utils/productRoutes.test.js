import {
  findCollectionByRoute,
  findProductByRoute,
  getProductImages,
  getProductPath,
  getRelatedProducts,
  normalizeCollectionDisplayTitle,
} from "@/utils/productRoutes";

const collections = {
  sneakers: {
    title: "Sneakers",
    routeName: "sneakers",
    items: [
      { id: 10, name: "Adidas NMD", imageUrl: "/nmd.jpg", price: 220 },
      { id: 11, name: "Adidas Yeezy", imageUrl: "/yeezy.jpg", price: 280 },
    ],
  },
};

describe("product route utilities", () => {
  it("builds stable collection/product paths", () => {
    expect(getProductPath("sneakers", 10)).toBe("/shop/sneakers/10");
  });

  it("finds a product using string route params", () => {
    expect(
      findProductByRoute(collections, "sneakers", "10").product?.name,
    ).toBe("Adidas NMD");
  });

  it("falls back to the primary product image", () => {
    expect(getProductImages(collections.sneakers.items[0])).toEqual([
      { src: "/nmd.jpg", alt: "Adidas NMD" },
    ]);
  });

  it("preserves real multi-image data when supplied", () => {
    expect(
      getProductImages({
        name: "Test",
        images: ["/one.jpg", { url: "/two.jpg", alt: "Back" }],
      }),
    ).toEqual([
      { src: "/one.jpg", alt: "Test" },
      { src: "/two.jpg", alt: "Back" },
    ]);
  });

  it("returns related products from the same collection", () => {
    expect(getRelatedProducts(collections.sneakers, 10)).toHaveLength(1);
    expect(getRelatedProducts(collections.sneakers, 10)[0].id).toBe(11);
  });

  it("normalizes customer-facing collection titles", () => {
    expect(normalizeCollectionDisplayTitle("Mens")).toBe("Men");
    expect(normalizeCollectionDisplayTitle("Womens")).toBe("Women");
  });

  it("can resolve a collection by routeName", () => {
    expect(findCollectionByRoute(collections, "sneakers")?.title).toBe(
      "Sneakers",
    );
  });
});
