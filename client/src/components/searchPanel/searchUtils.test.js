import SHOP_DATA from "../../redux/shop/shopData";
import {
  buildSearchCatalog,
  displayCollectionTitle,
  normalizeSearchText,
  searchCatalog,
} from "./searchUtils";

describe("search utilities", () => {
  const catalog = buildSearchCatalog(SHOP_DATA);

  it("normalizes collection labels for customers", () => {
    expect(displayCollectionTitle("Mens")).toBe("Men");
    expect(displayCollectionTitle("Womens")).toBe("Women");
  });

  it("normalizes punctuation and casing", () => {
    expect(normalizeSearchText("  Black & White  ")).toBe("black and white");
  });

  it("builds a client-side index from the existing catalog", () => {
    expect(catalog.products).toHaveLength(35);
    expect(catalog.categories).toHaveLength(5);
  });

  it("finds products by exact product terms", () => {
    const result = searchCatalog({ ...catalog, query: "Nike" });
    expect(
      result.products.some((product) => product.name === "Nike Red High Tops"),
    ).toBe(true);
    expect(result.hasExactMatch).toBe(true);
  });

  it("finds products through their collection", () => {
    const result = searchCatalog({ ...catalog, query: "jackets" });
    expect(result.products).toHaveLength(5);
    expect(result.categories[0].title).toBe("Jackets");
  });

  it("tolerates a small typo without claiming an exact match", () => {
    const result = searchCatalog({ ...catalog, query: "sneker" });
    expect(result.products.length).toBeGreaterThan(0);
    expect(
      result.products.every(
        (product) => product.collectionTitle === "Sneakers",
      ),
    ).toBe(true);
    expect(result.fuzzyOnly).toBe(true);
  });

  it("matches common spacing and punctuation variants", () => {
    const result = searchCatalog({ ...catalog, query: "tshirt" });
    expect(
      result.products.some((product) => product.name === "Floral T-shirt"),
    ).toBe(true);
  });

  it("keeps short category terms precise", () => {
    const result = searchCatalog({ ...catalog, query: "men" });
    expect(result.categories.map((category) => category.title)).toEqual([
      "Men",
    ]);
    expect(
      result.products.every((product) => product.collectionTitle === "Men"),
    ).toBe(true);
  });

  it("does not invent matches for unrelated terms", () => {
    const result = searchCatalog({ ...catalog, query: "watches" });
    expect(result.products).toHaveLength(0);
    expect(result.categories).toHaveLength(0);
  });
});
