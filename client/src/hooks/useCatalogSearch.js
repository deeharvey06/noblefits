import { useMemo } from "react";
import { useCatalog } from "@/hooks/useCatalog";
import { buildSearchCatalog, searchCatalog } from "@/utils/searchCatalog";

export const useCatalogSearch = (query) => {
  const state = useCatalog();
  const catalog = useMemo(
    () => buildSearchCatalog(state.collections),
    [state.collections],
  );
  const search = useMemo(
    () => searchCatalog({ ...catalog, query }),
    [catalog, query],
  );
  return {
    ...state,
    catalog,
    search,
    hasQuery: Boolean(search.normalizedQuery),
  };
};
