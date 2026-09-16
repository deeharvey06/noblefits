import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import {
  Drawer,
  ErrorState,
  LoadingState,
  PriceDisplay,
  SearchField,
  ResilientImage,
} from "../../design-system";
import { fetchCollectionsStart } from "../../redux/shop/actions";
import { getProductPath } from "../../utils/productRoutes";
import {
  selectCollections,
  selectIsCollectionFetching,
  selectShopError,
} from "../../redux/shop/shopSelector";
import {
  buildSearchCatalog,
  clearRecentSearches,
  getRecentSearches,
  saveRecentSearch,
  searchCatalog,
} from "./searchUtils";

import "./searchPanel.scss";

const SearchPanel = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const collections = useSelector(selectCollections);
  const isFetching = useSelector(selectIsCollectionFetching);
  const errorMessage = useSelector(selectShopError);
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    if (open && !collections && !isFetching && !errorMessage) {
      dispatch(fetchCollectionsStart());
    }
  }, [collections, dispatch, errorMessage, isFetching, open]);

  useEffect(() => {
    if (open) setRecentSearches(getRecentSearches());
  }, [open]);

  const catalog = useMemo(() => buildSearchCatalog(collections), [collections]);
  const search = useMemo(
    () => searchCatalog({ ...catalog, query }),
    [catalog, query]
  );
  const hasQuery = Boolean(search.normalizedQuery);
  const previewProducts = search.products.slice(0, 5);
  const previewCategories = search.categories.slice(0, 3);

  const navigateTo = (path) => {
    navigate(path);
    onClose();
  };

  const submitSearch = (searchQuery = query) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    setRecentSearches(saveRecentSearch(trimmed));
    navigateTo(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const openCollection = (routeName, searchQuery = query) => {
    if (searchQuery.trim()) setRecentSearches(saveRecentSearch(searchQuery));
    navigateTo(`/shop/${routeName}`);
  };

  const openProduct = (product) => {
    if (query.trim()) setRecentSearches(saveRecentSearch(query));
    navigateTo(getProductPath(product.routeName, product.id));
  };

  const handleClearRecent = () => setRecentSearches(clearRecentSearches());

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Search Noble Fits"
      side="right"
      id="site-search-drawer"
      className="site-search-drawer"
    >
      <div className="site-search">
        <div className="site-search__input-wrap">
          <SearchField
            id="global-product-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onSubmit={() => submitSearch()}
            placeholder="Search products or collections"
            loading={isFetching}
            disabled={Boolean(errorMessage)}
            autoComplete="off"
            aria-controls={hasQuery ? "global-search-suggestions" : undefined}
            autoFocus
          />
          {query && (
            <button
              type="button"
              className="site-search__clear-query"
              onClick={() => setQuery("")}
            >
              Clear search
            </button>
          )}
        </div>

        {!hasQuery && !isFetching && !errorMessage && (
          <div className="site-search__idle">
            {recentSearches.length > 0 && (
              <section className="site-search__recent" aria-labelledby="recent-searches-title">
                <div className="site-search__section-heading">
                  <p id="recent-searches-title" className="site-search__eyebrow">Recent searches</p>
                  <button type="button" onClick={handleClearRecent}>Clear</button>
                </div>
                <div className="site-search__recent-list">
                  {recentSearches.map((recent) => (
                    <button
                      key={recent}
                      type="button"
                      onClick={() => submitSearch(recent)}
                    >
                      <span aria-hidden="true">↺</span>
                      {recent}
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section className="site-search__discover" aria-labelledby="browse-collections-title">
              <p id="browse-collections-title" className="site-search__eyebrow">Browse collections</p>
              <div className="site-search__category-links">
                {catalog.categories.map((category) => (
                  <button
                    key={category.routeName}
                    type="button"
                    className="site-search__category-link"
                    onClick={() => openCollection(category.routeName, "")}
                  >
                    <span>{category.title}</span>
                    <span className="site-search__category-count">
                      {category.itemCount} {category.itemCount === 1 ? "product" : "products"}
                    </span>
                    <span aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {isFetching && (
          <LoadingState label="Loading products" className="site-search__state" />
        )}

        {errorMessage && (
          <ErrorState
            title="Search is unavailable"
            description="We could not load the product catalog. Try loading it again."
            actionLabel="Try again"
            onAction={() => dispatch(fetchCollectionsStart())}
            className="site-search__state"
          />
        )}

        {hasQuery && !isFetching && !errorMessage && (
          <section
            id="global-search-suggestions"
            className="site-search__results"
            aria-label="Search suggestions"
          >
            <div className="site-search__results-header" aria-live="polite">
              <div>
                <p>
                  {search.totalProducts
                    ? `${search.totalProducts} product ${search.totalProducts === 1 ? "match" : "matches"}`
                    : "No product matches"}
                </p>
                {search.fuzzyOnly && (
                  <span>Showing close matches for “{query.trim()}”.</span>
                )}
              </div>
              {(search.products.length > 0 || search.categories.length > 0) && (
                <button type="button" onClick={() => submitSearch()}>
                  View all results
                </button>
              )}
            </div>

            {search.suggestions.length > 0 && (
              <section className="site-search__suggestions" aria-labelledby="search-suggestions-title">
                <p id="search-suggestions-title" className="site-search__eyebrow">Suggestions</p>
                <div className="site-search__suggestion-list">
                  {search.suggestions.slice(0, 5).map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => submitSearch(suggestion)}
                    >
                      <span aria-hidden="true">⌕</span>
                      {suggestion}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {previewCategories.length > 0 && (
              <section className="site-search__category-results" aria-labelledby="search-categories-title">
                <p id="search-categories-title" className="site-search__eyebrow">Collections</p>
                <div className="site-search__category-chips">
                  {previewCategories.map((category) => (
                    <button
                      key={category.routeName}
                      type="button"
                      onClick={() => openCollection(category.routeName)}
                    >
                      {category.title}
                      <span>{category.itemCount}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {previewProducts.length > 0 ? (
              <section aria-labelledby="search-products-title">
                <p id="search-products-title" className="site-search__eyebrow">Products</p>
                <ul className="site-search__result-list">
                  {previewProducts.map((result) => (
                    <li key={`${result.routeName}-${result.id}`}>
                      <button
                        type="button"
                        className="site-search__result"
                        onClick={() => openProduct(result)}
                      >
                        <ResilientImage className="site-search__result-image" src={result.imageUrl} alt="" loading="lazy" decoding="async" />
                        <span className="site-search__result-copy">
                          <span className="site-search__result-name">{result.name}</span>
                          <span className="site-search__result-meta">{result.collectionTitle}</span>
                          <PriceDisplay price={result.price} />
                        </span>
                        <span className="site-search__result-arrow" aria-hidden="true">→</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ) : (
              <div className="site-search__empty">
                <p>No products match “{query.trim()}”. Check the spelling or browse a collection.</p>
                <div className="site-search__empty-actions">
                  <button type="button" onClick={() => submitSearch()}>
                    Search anyway
                  </button>
                  <button type="button" onClick={() => navigateTo("/shop")}>
                    Browse all collections
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </Drawer>
  );
};


export default SearchPanel;
