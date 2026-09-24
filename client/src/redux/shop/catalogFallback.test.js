import { mergeCatalogWithFallback } from "@/redux/shop/catalogFallback";

describe("mergeCatalogWithFallback", () => {
  it("keeps every core collection populated when remote data is missing", () => {
    const catalog = mergeCatalogWithFallback({});

    ["mens", "womens", "jackets", "sneakers", "hats"].forEach((key) => {
      expect(catalog[key].items.length).toBeGreaterThan(0);
    });
  });

  it("uses populated remote collection data when available", () => {
    const catalog = mergeCatalogWithFallback({
      hats: {
        title: "Hats",
        routeName: "hats",
        items: [
          { id: 999, name: "Remote hat", imageUrl: "/hat.jpg", price: 42 },
        ],
      },
    });

    expect(catalog.hats.items).toHaveLength(1);
    expect(catalog.hats.items[0].name).toBe("Remote hat");
    expect(catalog.mens.items.length).toBeGreaterThan(0);
  });

  it("falls back when a remote collection exists but contains no products", () => {
    const catalog = mergeCatalogWithFallback({
      hats: { title: "Hats", items: [] },
    });
    expect(catalog.hats.items.length).toBeGreaterThan(0);
  });
});
