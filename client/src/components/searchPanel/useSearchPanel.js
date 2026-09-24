import { useState } from "react";
import { useNavigate } from "react-router";
import { useCatalogSearch } from "@/hooks/useCatalogSearch";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { collectionPath, searchPath } from "@/config/routes";
import { getProductPath } from "@/utils/productRoutes";

export const useSearchPanel = (onClose) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { recentSearches, saveRecentSearch, clearRecentSearches } =
    useRecentSearches();

  const { isFetching, errorMessage, retry, catalog, search, hasQuery } =
    useCatalogSearch(query);
  const previewProducts = search.products.slice(0, 5);
  const previewCategories = search.categories.slice(0, 3);

  const navigateTo = (path) => {
    navigate(path);
    onClose();
  };

  const submitSearch = (searchQuery = query) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    saveRecentSearch(trimmed);
    navigateTo(searchPath(trimmed));
  };

  const openCollection = (routeName, searchQuery = query) => {
    if (searchQuery.trim()) saveRecentSearch(searchQuery);
    navigateTo(collectionPath(routeName));
  };

  const openProduct = (product) => {
    if (query.trim()) saveRecentSearch(query);
    navigateTo(getProductPath(product.routeName, product.id));
  };

  const handleClearRecent = () => clearRecentSearches();

  return {
    query,
    setQuery,
    recentSearches,
    isFetching,
    errorMessage,
    retry,
    catalog,
    hasQuery,
    previewProducts,
    previewCategories,
    search,
    navigateTo,
    submitSearch,
    openCollection,
    openProduct,
    handleClearRecent,
  };
};
