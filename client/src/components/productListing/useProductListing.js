import { useMemo, useState } from "react";
import {
  collectionsToArray,
  flattenCatalog,
  applyCatalogControls,
} from "@/components/productListing/catalogControls";

export const useProductListing = (collections, collectionKey) => {
  const collectionList = useMemo(
    () => collectionsToArray(collections),
    [collections],
  );
  const allProducts = useMemo(() => flattenCatalog(collections), [collections]);
  const isCollectionView = Boolean(collectionKey);
  const collectionProducts = isCollectionView
    ? allProducts.filter((product) => product.collectionKey === collectionKey)
    : allProducts;

  const [selectedCollections, setSelectedCollections] = useState([]);
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("catalog");

  const visibleProducts = applyCatalogControls({
    products: collectionProducts,
    selectedCollections: isCollectionView ? [] : selectedCollections,
    priceFilter,
    sortBy,
  });

  const toggleCollection = (key) => {
    setSelectedCollections((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );
  };

  const clearFilters = () => {
    setSelectedCollections([]);
    setPriceFilter("all");
  };

  const activeFilterCount =
    (isCollectionView ? 0 : selectedCollections.length) +
    (priceFilter === "all" ? 0 : 1);
  const hasActiveFilters = activeFilterCount > 0;

  const resultLabel = `${visibleProducts.length} ${visibleProducts.length === 1 ? "product" : "products"}`;
  const resultMotionKey = [
    collectionKey || "all",
    [...selectedCollections].sort().join(","),
    priceFilter,
    sortBy,
  ].join("|");

  const filterProps = {
    collections: collectionList,
    products: collectionProducts,
    showCollectionFilters: !isCollectionView,
    selectedCollections,
    onToggleCollection: toggleCollection,
    priceFilter,
    onPriceFilterChange: setPriceFilter,
    onClear: clearFilters,
    hasActiveFilters,
  };

  return {
    isCollectionView,
    collectionList,
    sortBy,
    setSortBy,
    visibleProducts,
    activeFilterCount,
    hasActiveFilters,
    resultLabel,
    resultMotionKey,
    filterProps,
    clearFilters,
  };
};
