import { useProductListing } from "@/components/productListing/useProductListing";
import FilterControls from "@/components/productListing/FilterControls";
import { ROUTES, collectionPath } from "@/config/routes";
import { useState } from "react";
import { AppNavLink as NavLink } from "@/components/navigation/AppLink";
import { useCartActions } from "@/hooks/useCartActions";

import {
  Button,
  Drawer,
  EmptyState,
  ProductCard,
  SelectField,
} from "@/design-system";
import { getProductPath } from "@/utils/productRoutes";

import "./productListing.scss";

const ProductListing = ({
  collections,
  collectionKey,
  eyebrow = "Shop",
  title,
  description,
}) => {
  const { addToCart } = useCartActions();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const {
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
  } = useProductListing(collections, collectionKey);

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
        <NavLink to={ROUTES.shop} end>
          All
        </NavLink>
        {collectionList.map((collection) => (
          <NavLink
            key={collection.key}
            to={collectionPath(collection.collectionRoute || collection.key)}
          >
            {collection.displayTitle}
          </NavLink>
        ))}
      </nav>

      <div className="catalog-toolbar">
        <div
          className="catalog-toolbar__summary"
          role="status"
          aria-live="polite"
        >
          <strong>{resultLabel}</strong>
          {hasActiveFilters && (
            <span>
              {activeFilterCount} active{" "}
              {activeFilterCount === 1 ? "filter" : "filters"}
            </span>
          )}
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
          <FilterControls
            idPrefix={`desktop-${collectionKey || "all"}`}
            {...filterProps}
          />
        </aside>

        <div className="catalog-results">
          {visibleProducts.length > 0 ? (
            <div
              key={resultMotionKey}
              className="catalog-product-grid catalog-product-grid--updated"
            >
              {visibleProducts.map((product) => {
                const isUnavailable =
                  product.available === false || product.inStock === false;
                const availabilityLabel =
                  product.availability ||
                  (typeof product.inStock === "boolean"
                    ? product.inStock
                      ? "In stock"
                      : "Unavailable"
                    : null);

                return (
                  <ProductCard
                    key={`${product.collectionKey}-${product.id}`}
                    className="catalog-product-card"
                    eyebrow={
                      isCollectionView ? undefined : product.collectionTitle
                    }
                    name={product.name}
                    headingLevel={2}
                    imageUrl={product.imageUrl}
                    imageAlt={product.name}
                    price={product.price}
                    compareAtPrice={product.compareAtPrice}
                    badge={product.badge}
                    badgeVariant={product.badgeVariant}
                    rating={
                      typeof product.rating === "number"
                        ? product.rating
                        : undefined
                    }
                    reviewCount={
                      typeof product.reviewCount === "number"
                        ? product.reviewCount
                        : undefined
                    }
                    productHref={getProductPath(
                      product.collectionRoute,
                      product.id,
                    )}
                    disabled={isUnavailable}
                    actionLabel={isUnavailable ? "Unavailable" : "Add to cart"}
                    onAddToCart={
                      isUnavailable ? undefined : () => addToCart(product)
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
        <FilterControls
          idPrefix={`mobile-${collectionKey || "all"}`}
          {...filterProps}
        />
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
