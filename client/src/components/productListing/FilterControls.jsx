import { Checkbox, Radio } from "@/design-system";
import { PRICE_FILTERS } from "@/components/productListing/catalogControls";

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
      ? products.filter((product) =>
          selectedCollections.includes(product.collectionKey),
        )
      : products;
  const currentPriceRule =
    PRICE_FILTERS.find((filter) => filter.id === priceFilter) ||
    PRICE_FILTERS[0];
  const availablePriceFilters = PRICE_FILTERS.filter((filter) => {
    const count = priceCountProducts.filter((product) =>
      filter.matches(product.price),
    ).length;
    return filter.id === "all" || filter.id === priceFilter || count > 0;
  });

  return (
    <div className="catalog-filters">
      <div className="catalog-filters__heading">
        <h2>Filters</h2>
        {hasActiveFilters && (
          <button
            type="button"
            className="catalog-filters__clear"
            onClick={onClear}
          >
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
                  currentPriceRule.matches(product.price),
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
              filter.matches(product.price),
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

export default FilterControls;
