import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useCatalogSearch } from "@/hooks/useCatalogSearch";
import { useRecentSearches } from "@/hooks/useRecentSearches";

export const useSearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(urlQuery);
  const { recentSearches, saveRecentSearch, clearRecentSearches } =
    useRecentSearches();

  const [previousUrlQuery, setPreviousUrlQuery] = useState(urlQuery);
  if (previousUrlQuery !== urlQuery) {
    setPreviousUrlQuery(urlQuery);
    setInputValue(urlQuery);
  }

  const {
    collections,
    isFetching,
    errorMessage,
    retry,
    catalog,
    search,
    hasQuery,
  } = useCatalogSearch(urlQuery);

  const submitSearch = (value = inputValue) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setSearchParams({});
      return;
    }

    saveRecentSearch(trimmed);
    setSearchParams({ q: trimmed });
  };

  const clearRecents = () => clearRecentSearches();

  return {
    inputValue,
    setInputValue,
    recentSearches,
    collections,
    isFetching,
    errorMessage,
    retry,
    catalog,
    search,
    hasQuery,
    submitSearch,
    clearRecents,
    urlQuery,
    navigate,
  };
};
