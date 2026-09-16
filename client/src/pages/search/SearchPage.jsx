import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router";

import {
  EmptyState,
  ErrorState,
  LoadingState,
  ProductCard,
  SearchField,
} from "../../design-system";
import { addItem } from "../../redux/cart/actions";
import { fetchCollectionsStart } from "../../redux/shop/actions";
import {
  selectCollections,
  selectIsCollectionFetching,
  selectShopError,
} from "../../redux/shop/shopSelector";
import { getProductPath } from "../../utils/productRoutes";
import {
  buildSearchCatalog,
  clearRecentSearches,
  getRecentSearches,
  saveRecentSearch,
  searchCatalog,
} from "../../components/searchPanel/searchUtils";

import "./searchPage.scss";

const SearchPage = () => {
  const dispatch = useDispatch();
  const collections = useSelector(selectCollections);
  const isFetching = useSelector(selectIsCollectionFetching);
  const errorMessage = useSelector(selectShopError);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(urlQuery);
  const [recentSearches, setRecentSearches] = useState(() => getRecentSearches());

  useEffect(() => {
    if (!collections && !isFetching && !errorMessage) dispatch(fetchCollectionsStart());
  }, [collections, dispatch, errorMessage, isFetching]);

  useEffect(() => {
    setInputValue(urlQuery);
    if (urlQuery.trim()) setRecentSearches(saveRecentSearch(urlQuery));
  }, [urlQuery]);

  const catalog = useMemo(() => buildSearchCatalog(collections), [collections]);
  const search = useMemo(
    () => searchCatalog({ ...catalog, query: urlQuery }),
    [catalog, urlQuery]
  );

  const submitSearch = (value = inputValue) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setSearchParams({});
      return;
    }

    setRecentSearches(saveRecentSearch(trimmed));
    setSearchParams({ q: trimmed });
  };

  const clearRecents = () => setRecentSearches(clearRecentSearches());
  const hasQuery = Boolean(search.normalizedQuery);

  return (
    <div className="search-page">
      <header className="search-page__header">
        <span className="search-page__eyebrow">Product discovery</span>
        <div className="search-page__header-copy">
          <h1>Search Noble Fits</h1>
          <p>Find products and collections across the current catalog.</p>
        </div>

        <SearchField
          id="search-page-input"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onSubmit={() => submitSearch()}
          placeholder="Try “jacket”, “Nike”, or “hats”"
          loading={isFetching}
          disabled={Boolean(errorMessage)}
          autoComplete="off"
        />
      </header>

      {isFetching && !collections && (
        <LoadingState label="Searching the catalog" className="search-page__state" />
      )}

      {errorMessage && !collections && (
        <ErrorState
          title="Search is unavailable"
          description="We could not load the product catalog. Try again."
          actionLabel="Try again"
          onAction={fetchCollectionsStart}
          className="search-page__state"
        />
      )}

      {!isFetching && !errorMessage && !hasQuery && (
        <div className="search-page__start">
          {recentSearches.length > 0 && (
            <section className="search-page__recent" aria-labelledby="search-recent-title">
              <div className="search-page__section-heading">
                <div>
                  <span className="search-page__eyebrow">Pick up where you left off</span>
                  <h2 id="search-recent-title">Recent searches</h2>
                </div>
                <button type="button" onClick={clearRecents}>Clear history</button>
              </div>
              <div className="search-page__recent-list">
                {recentSearches.map((recent) => (
                  <button key={recent} type="button" onClick={() => submitSearch(recent)}>
                    <span aria-hidden="true">↺</span>
                    {recent}
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="search-page__browse" aria-labelledby="search-browse-title">
            <div className="search-page__section-heading">
              <div>
                <span className="search-page__eyebrow">Browse instead</span>
                <h2 id="search-browse-title">Shop by collection</h2>
              </div>
            </div>
            <div className="search-page__collection-grid">
              {catalog.categories.map((category) => (
                <Link key={category.routeName} to={`/shop/${category.routeName}`}>
                  <span>{category.title}</span>
                  <small>{category.itemCount} {category.itemCount === 1 ? "product" : "products"}</small>
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}

      {!isFetching && !errorMessage && hasQuery && (
        <div key={search.normalizedQuery} className="search-page__results search-page__results--updated">
          <div className="search-page__summary" role="status" aria-live="polite">
            <div>
              <span className="search-page__eyebrow">Results for</span>
              <h2>“{urlQuery.trim()}”</h2>
            </div>
            <p>
              {search.totalProducts} {search.totalProducts === 1 ? "product" : "products"}
            </p>
          </div>

          {search.fuzzyOnly && (
            <div className="search-page__fuzzy-note">
              <strong>No exact match.</strong>
              <span> Showing close catalog matches for “{urlQuery.trim()}”.</span>
            </div>
          )}

          {search.categories.length > 0 && (
            <section className="search-page__matched-collections" aria-labelledby="matched-collections-title">
              <span className="search-page__eyebrow">Collections</span>
              <h2 id="matched-collections-title">Matching collections</h2>
              <div className="search-page__collection-grid search-page__collection-grid--compact">
                {search.categories.map((category) => (
                  <Link key={category.routeName} to={`/shop/${category.routeName}`}>
                    <span>{category.title}</span>
                    <small>{category.itemCount} {category.itemCount === 1 ? "product" : "products"}</small>
                    <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {search.products.length > 0 ? (
            <section className="search-page__products" aria-labelledby="search-products-heading">
              <div className="search-page__section-heading">
                <div>
                  <span className="search-page__eyebrow">Products</span>
                  <h2 id="search-products-heading">Catalog matches</h2>
                </div>
              </div>

              <div className="search-page__product-grid">
                {search.products.map((product) => (
                  <ProductCard
                    key={`${product.collectionKey}-${product.id}`}
                    eyebrow={product.collectionTitle}
                    name={product.name}
                    imageUrl={product.imageUrl}
                    imageAlt={product.name}
                    price={product.price}
                    compareAtPrice={product.compareAtPrice}
                    badge={product.badge}
                    rating={typeof product.rating === "number" ? product.rating : undefined}
                    reviewCount={typeof product.reviewCount === "number" ? product.reviewCount : undefined}
                    productHref={getProductPath(product.routeName, product.id)}
                    onAddToCart={() =>
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
                    <Link className="search-page__collection-link" to={`/shop/${product.routeName}`}>
                      View {product.collectionTitle}
                    </Link>
                  </ProductCard>
                ))}
              </div>
            </section>
          ) : (
            <EmptyState
              eyebrow="No matches"
              title={`Nothing matched “${urlQuery.trim()}”.`}
              description="Check the spelling, try a shorter product term, or browse the existing collections."
              actionLabel="Browse all products"
              onAction={() => navigate("/shop")}
            />
          )}
        </div>
      )}
    </div>
  );
};


export default SearchPage;
