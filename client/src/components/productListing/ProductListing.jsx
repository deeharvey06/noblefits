import { useMemo, useState } from "react";
import { NavLink } from "react-router";
import { useDispatch } from "react-redux";

import {
  Button,
  Checkbox,
  Drawer,
  EmptyState,
  ProductCard,
  Radio,
  SelectField,
} from "../../design-system";
import { addItem } from "../../redux/cart/actions";
import { getProductPath } from "../../utils/productRoutes";

import "./productListing.scss";

const COLLECTION_ORDER = ["mens", "womens", "jackets", "sneakers", "hats"];

export const PRICE_FILTERS = [
  { id: "all", label: "All prices", matches: () => true },
  { id: "under-50", label: "Under $50", matches: (price) => price < 50 },
  { id: "50-99", label: "$50–$99", matches: (price) => price >= 50 && price < 100 },
  { id: "100-199", label: "$100–$199", matches: (price) => price >= 100 && price < 200 },
  { id: "200-plus", label: "$200+", matches: (price) => price >= 200 },
];

export const normalizeCollectionTitle = (title = "") => {
  if (title === "Womens") return "Women";
  if (title === "Mens") return "Men";
  return title;
};

export const collectionsToArray = (collections) => {
  if (!collections) return [];

  const entries = Object.entries(collections);
  return entries
    .sort(([keyA], [keyB]) => {
      const indexA = COLLECTION_ORDER.indexOf(keyA);
      const indexB = COLLECTION_ORDER.indexOf(keyB);
      const safeA = indexA === -1 ? COLLECTION_ORDER.length : indexA;
      const safeB = indexB === -1 ? COLLECTION_ORDER.length : indexB;
      return safeA - safeB;
    })
    .map(([key, collection]) => ({
      ...collection,
      key,
      displayTitle: normalizeCollectionTitle(collection.title),
    }));
};

export const flattenCatalog = (collections) =>
  collectionsToArray(collections).flatMap((collection) =>
    (collection.items || []).map((item) => ({
      ...item,
      collectionKey: collection.key,
      collectionTitle: collection.displayTitle,
      collectionRoute: collection.routeName || collection.key,
    }))
  );

export const applyCatalogControls = ({
  products,
  selectedCollections = [],
  priceFilter = "all",
  sortBy = "catalog",
}) => {
  const priceRule = PRICE_FILTERS.find((filter) => filter.id === priceFilter) || PRICE_FILTERS[0];

  const filtered = products.filter((product) => {
    const collectionMatches =
      selectedCollections.length === 0 || selectedCollections.includes(product.collectionKey);
    return collectionMatches && priceRule.matches(product.price);
  });

  if (sortBy === "price-asc") return [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") return [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === "name-asc") {
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }

  return filtered;
};

const FilterControls = ({
  idPrefix,
  collections,
  products,
  showCollectionFilters,
  selectedCollections,
  onToggleCollection,
  priceFilter,
  onPriceFilterChange,
  onClear,
  hasActiveFilters,
}) => {
  const priceCountProducts =
    showCollectionFilters && selectedCollections.length > 0
      ? products.filter((product) => selectedCollections.includes(product.collectionKey))
      : products;
  const currentPriceRule =
    PRICE_FILTERS.find((filter) => filter.id === priceFilter) || PRICE_FILTERS[0];
  const availablePriceFilters = PRICE_FILTERS.filter((filter) => {
    const count = priceCountProducts.filter((product) => filter.matches(product.price)).length;
    return filter.id === "all" || filter.id === priceFilter || count > 0;
  });

  return (
    <div className="catalog-filters">
      <div className="catalog-filters__heading">
        <h2>Filters</h2>
        {hasActiveFilters && (
          <button type="button" className="catalog-filters__clear" onClick={onClear}>
            Clear all
          </button>
        )}
      </div>

      {showCollectionFilters && (
        <fieldset className="catalog-filter-group">
          <legend>Collection</legend>
          <div className="catalog-filter-group__options">
            {collections.map((collection) => {
              const collectionCount = products.filter(
                (product) =>
                  product.collectionKey === collection.key &&
                  currentPriceRule.matches(product.price)
              ).length;
              const isSelected = selectedCollections.includes(collection.key);

              return (
                <Checkbox
                  key={collection.key}
                  id={`${idPrefix}-collection-${collection.key}`}
                  label={`${collection.displayTitle} (${collectionCount})`}
                  checked={isSelected}
                  disabled={collectionCount === 0 && !isSelected}
                  onChange={() => onToggleCollection(collection.key)}
                />
              );
            })}
          </div>
        </fieldset>
      )}

      <fieldset className="catalog-filter-group">
        <legend>Price</legend>
        <div className="catalog-filter-group__options">
          {availablePriceFilters.map((filter) => {
            const count = priceCountProducts.filter((product) =>
              filter.matches(product.price)
            ).length;
            return (
              <Radio
                key={filter.id}
                id={`${idPrefix}-price-${filter.id}`}
                name={`${idPrefix}-price`}
                label={`${filter.label} (${count})`}
                checked={priceFilter === filter.id}
                onChange={() => onPriceFilterChange(filter.id)}
              />
            );
          })}
        </div>
      </fieldset>
    </div>
  );
};

const ProductListing = ({
  collections,
  collectionKey,
  eyebrow = "Shop",
  title,
  description,
}) => {
  const dispatch = useDispatch();
  const collectionList = useMemo(() => collectionsToArray(collections), [collections]);
  const allProducts = useMemo(() => flattenCatalog(collections), [collections]);
  const isCollectionView = Boolean(collectionKey);
  const collectionProducts = isCollectionView
    ? allProducts.filter((product) => product.collectionKey === collectionKey)
    : allProducts;

  const [selectedCollections, setSelectedCollections] = useState([]);
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("catalog");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const visibleProducts = applyCatalogControls({
    products: collectionProducts,
    selectedCollections: isCollectionView ? [] : selectedCollections,
    priceFilter,
    sortBy,
  });

  const toggleCollection = (key) => {
    setSelectedCollections((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    );
  };

  const clearFilters = () => {
    setSelectedCollections([]);
    setPriceFilter("all");
  };

  const activeFilterCount =
    (isCollectionView ? 0 : selectedCollections.length) + (priceFilter === "all" ? 0 : 1);
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

  return (
    <div className="catalog-listing">
      <header className="catalog-header">
        <span className="catalog-header__eyebrow">{eyebrow}</span>
        <div className="catalog-header__content">
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </header>

      <nav className="catalog-collection-nav" aria-label="Browse collections">
        <NavLink to="/shop" end>
          All
        </NavLink>
        {collectionList.map((collection) => (
          <NavLink key={collection.key} to={`/shop/${collection.collectionRoute || collection.key}`}>
            {collection.displayTitle}
          </NavLink>
        ))}
      </nav>

      <div className="catalog-toolbar">
        <div className="catalog-toolbar__summary" role="status" aria-live="polite">
          <strong>{resultLabel}</strong>
          {hasActiveFilters && <span>{activeFilterCount} active {activeFilterCount === 1 ? "filter" : "filters"}</span>}
        </div>

        <div className="catalog-toolbar__controls">
          <Button
            variant="secondary"
            size="sm"
            className="catalog-toolbar__filter-button"
            onClick={() => setMobileFiltersOpen(true)}
          >
            Filters{activeFilterCount ? ` (${activeFilterCount})` : ""}
          </Button>

          <SelectField
            id={`catalog-sort-${collectionKey || "all"}`}
            name="catalog-sort"
            label="Sort by"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="catalog-toolbar__sort"
          >
            <option value="catalog">Catalog order</option>
            <option value="name-asc">Name: A–Z</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </SelectField>
        </div>
      </div>

      <div className="catalog-layout">
        <aside className="catalog-sidebar" aria-label="Product filters">
          <FilterControls idPrefix={`desktop-${collectionKey || "all"}`} {...filterProps} />
        </aside>

        <div className="catalog-results">
          {visibleProducts.length > 0 ? (
            <div key={resultMotionKey} className="catalog-product-grid catalog-product-grid--updated">
              {visibleProducts.map((product) => {
                const isUnavailable =
                  product.available === false || product.inStock === false;
                const availabilityLabel = product.availability ||
                  (typeof product.inStock === "boolean"
                    ? product.inStock
                      ? "In stock"
                      : "Unavailable"
                    : null);

                return (
                  <ProductCard
                    key={`${product.collectionKey}-${product.id}`}
                    className="catalog-product-card"
                    eyebrow={isCollectionView ? undefined : product.collectionTitle}
                    name={product.name}
                    headingLevel={2}
                    imageUrl={product.imageUrl}
                    imageAlt={product.name}
                    price={product.price}
                    compareAtPrice={product.compareAtPrice}
                    badge={product.badge}
                    badgeVariant={product.badgeVariant}
                    rating={typeof product.rating === "number" ? product.rating : undefined}
                    reviewCount={typeof product.reviewCount === "number" ? product.reviewCount : undefined}
                    productHref={getProductPath(product.collectionRoute, product.id)}
                    disabled={isUnavailable}
                    actionLabel={isUnavailable ? "Unavailable" : "Add to cart"}
                    onAddToCart={
                      isUnavailable
                        ? undefined
                        : () =>
                            dispatch(
                              addItem({
                                id: product.id,
                                name: product.name,
                                imageUrl: product.imageUrl,
                                price: product.price,
                              })
                            )
                    }
                  >
                    {availabilityLabel && (
                      <span className="catalog-product-card__availability">
                        {availabilityLabel}
                      </span>
                    )}
                  </ProductCard>
                );
              })}
            </div>
          ) : (
            <EmptyState
              eyebrow="No matches"
              title="Nothing fits those filters."
              description="Clear the current filters to return to the full set of products."
              actionLabel="Clear filters"
              onAction={clearFilters}
            />
          )}
        </div>
      </div>

      <Drawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        title="Filter products"
        side="left"
        id={`catalog-filters-${collectionKey || "all"}`}
        className="catalog-filter-drawer"
      >
        <FilterControls idPrefix={`mobile-${collectionKey || "all"}`} {...filterProps} />
        <div className="catalog-filter-drawer__action">
          <Button fullWidth onClick={() => setMobileFiltersOpen(false)}>
            View {resultLabel}
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default ProductListing;
