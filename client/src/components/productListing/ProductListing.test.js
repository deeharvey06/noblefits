import { describe, expect, it } from "vitest";

import {
  applyCatalogControls,
  collectionsToArray,
  flattenCatalog,
  normalizeCollectionTitle,
} from "./ProductListing";

const collections = {
  hats: {
    title: "Hats",
    routeName: "hats",
    items: [
      { id: 1, name: "Brown Brim", price: 25 },
      { id: 2, name: "Blue Beanie", price: 18 },
    ],
  },
  mens: {
    title: "Mens",
    routeName: "mens",
    items: [
      { id: 3, name: "Camo Vest", price: 325 },
      { id: 4, name: "Floral Tee", price: 20 },
    ],
  },
};

describe("product listing catalog controls", () => {
  it("normalizes legacy collection labels for customer-facing copy", () => {
    expect(normalizeCollectionTitle("Mens")).toBe("Men");
    expect(normalizeCollectionTitle("Womens")).toBe("Women");
    expect(normalizeCollectionTitle("Hats")).toBe("Hats");
  });

  it("flattens collections without changing product commerce fields", () => {
    const products = flattenCatalog(collections);

    expect(products).toHaveLength(4);
    expect(products[0]).toMatchObject({
      id: 3,
      name: "Camo Vest",
      price: 325,
      collectionKey: "mens",
      collectionTitle: "Men",
    });
  });

  it("filters across multiple real collection and price dimensions", () => {
    const products = flattenCatalog(collections);
    const result = applyCatalogControls({
      products,
      selectedCollections: ["hats"],
      priceFilter: "under-50",
      sortBy: "price-asc",
    });

    expect(result.map((product) => product.price)).toEqual([18, 25]);
    expect(result.every((product) => product.collectionKey === "hats")).toBe(true);
  });

  it("sorts by name and price without mutating catalog order", () => {
    const products = flattenCatalog(collections);
    const originalIds = products.map((product) => product.id);

    const alphabetized = applyCatalogControls({
      products,
      sortBy: "name-asc",
    });
    const descending = applyCatalogControls({
      products,
      sortBy: "price-desc",
    });

    expect(alphabetized.map((product) => product.name)).toEqual([
      "Blue Beanie",
      "Brown Brim",
      "Camo Vest",
      "Floral Tee",
    ]);
    expect(descending[0].price).toBe(325);
    expect(products.map((product) => product.id)).toEqual(originalIds);
  });

  it("keeps the preferred customer-facing collection order", () => {
    expect(collectionsToArray(collections).map((collection) => collection.key)).toEqual([
      "mens",
      "hats",
    ]);
  });
});
