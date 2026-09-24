import { useSearchPage } from "@/pages/search/useSearchPage";
import { ROUTES, collectionPath } from "@/config/routes";
import { useCartActions } from "@/hooks/useCartActions";
import { AppLink as Link } from "@/components/navigation/AppLink";

import {
  EmptyState,
  ErrorState,
  LoadingState,
  ProductCard,
  SearchField,
} from "@/design-system";
import { getProductPath } from "@/utils/productRoutes";

import "./searchPage.scss";

const SearchPage = () => {
  const {
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
  } = useSearchPage();
  const { addToCart } = useCartActions();

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
        <LoadingState
          label="Searching the catalog"
          className="search-page__state"
        />
      )}

      {errorMessage && !collections && (
        <ErrorState
          title="Search is unavailable"
          description="We could not load the product catalog. Try again."
          actionLabel="Try again"
          onAction={retry}
          className="search-page__state"
        />
      )}

      {!isFetching && !errorMessage && !hasQuery && (
        <div className="search-page__start">
          {recentSearches.length > 0 && (
            <section
              className="search-page__recent"
              aria-labelledby="search-recent-title"
            >
              <div className="search-page__section-heading">
                <div>
                  <span className="search-page__eyebrow">
                    Pick up where you left off
                  </span>
                  <h2 id="search-recent-title">Recent searches</h2>
                </div>
                <button type="button" onClick={clearRecents}>
                  Clear history
                </button>
              </div>
              <div className="search-page__recent-list">
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

          <section
            className="search-page__browse"
            aria-labelledby="search-browse-title"
          >
            <div className="search-page__section-heading">
              <div>
                <span className="search-page__eyebrow">Browse instead</span>
                <h2 id="search-browse-title">Shop by collection</h2>
              </div>
            </div>
            <div className="search-page__collection-grid">
              {catalog.categories.map((category) => (
                <Link
                  key={category.routeName}
                  to={collectionPath(category.routeName)}
                >
                  <span>{category.title}</span>
                  <small>
                    {category.itemCount}{" "}
                    {category.itemCount === 1 ? "product" : "products"}
                  </small>
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}

      {!isFetching && !errorMessage && hasQuery && (
        <div
          key={search.normalizedQuery}
          className="search-page__results search-page__results--updated"
        >
          <div
            className="search-page__summary"
            role="status"
            aria-live="polite"
          >
            <div>
              <span className="search-page__eyebrow">Results for</span>
              <h2>“{urlQuery.trim()}”</h2>
            </div>
            <p>
              {search.totalProducts}{" "}
              {search.totalProducts === 1 ? "product" : "products"}
            </p>
          </div>

          {search.fuzzyOnly && (
            <div className="search-page__fuzzy-note">
              <strong>No exact match.</strong>
              <span>
                {" "}
                Showing close catalog matches for “{urlQuery.trim()}”.
              </span>
            </div>
          )}

          {search.categories.length > 0 && (
            <section
              className="search-page__matched-collections"
              aria-labelledby="matched-collections-title"
            >
              <span className="search-page__eyebrow">Collections</span>
              <h2 id="matched-collections-title">Matching collections</h2>
              <div className="search-page__collection-grid search-page__collection-grid--compact">
                {search.categories.map((category) => (
                  <Link
                    key={category.routeName}
                    to={collectionPath(category.routeName)}
                  >
                    <span>{category.title}</span>
                    <small>
                      {category.itemCount}{" "}
                      {category.itemCount === 1 ? "product" : "products"}
                    </small>
                    <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {search.products.length > 0 ? (
            <section
              className="search-page__products"
              aria-labelledby="search-products-heading"
            >
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
                    productHref={getProductPath(product.routeName, product.id)}
                    onAddToCart={() => addToCart(product)}
                  >
                    <Link
                      className="search-page__collection-link"
                      to={collectionPath(product.routeName)}
                    >
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
              onAction={() => navigate(ROUTES.shop)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
