import { act, renderHook } from "@testing-library/react";
import { useRecentSearches } from "@/hooks/useRecentSearches";

beforeEach(() => window.localStorage.clear());

it("keeps multiple consumers synchronized when a search is submitted or cleared", () => {
  const first = renderHook(useRecentSearches);
  const second = renderHook(useRecentSearches);
  act(() => first.result.current.saveRecentSearch("Jacket"));
  expect(second.result.current.recentSearches).toEqual(["Jacket"]);
  act(() => second.result.current.clearRecentSearches());
  expect(first.result.current.recentSearches).toEqual([]);
});

it("responds to storage changes from another tab", () => {
  const { result } = renderHook(useRecentSearches);
  act(() => {
    window.localStorage.setItem("noblefits.recentSearches.v1", '["Sneakers"]');
    window.dispatchEvent(
      new StorageEvent("storage", { key: "noblefits.recentSearches.v1" }),
    );
  });
  expect(result.current.recentSearches).toEqual(["Sneakers"]);
});
