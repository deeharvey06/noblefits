import {
  clearRecentSearches,
  getRecentSearches,
  saveRecentSearch,
} from "@/services/recentSearches";

const key = "noblefits.recentSearches.v1";
beforeEach(() => window.localStorage.clear());
afterEach(() => jest.restoreAllMocks());

it("deduplicates case-insensitive searches and keeps the five most recent", () => {
  ["Hats", "Jackets", "Nike", "Men", "Women", "Sneakers", "hats"].forEach(
    saveRecentSearch,
  );
  expect(getRecentSearches()).toEqual([
    "hats",
    "Sneakers",
    "Women",
    "Men",
    "Nike",
  ]);
});

it.each(["invalid-json", "{}", '[null, "", 4, "Jackets"]'])(
  "recovers from invalid storage: %s",
  (stored) => {
    window.localStorage.setItem(key, stored);
    expect(getRecentSearches()).toEqual(
      stored.includes("Jackets") ? ["Jackets"] : [],
    );
  },
);

it("continues working when the browser refuses storage access", () => {
  jest.spyOn(window, "localStorage", "get").mockImplementation(() => {
    throw new Error("Storage blocked");
  });
  expect(getRecentSearches()).toEqual([]);
  expect(saveRecentSearch("Jackets")).toEqual([]);
  expect(clearRecentSearches()).toEqual([]);
});

it("retains existing history when browser storage is full", () => {
  saveRecentSearch("Hats");
  jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("Quota exceeded");
  });
  expect(saveRecentSearch("Jackets")).toEqual(["Hats"]);
});
