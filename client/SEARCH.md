# Phase 7 — Search

Noble Fits search is intentionally client-side. It uses the same product collections already loaded from Firestore and does not introduce a search service, search index, API endpoint, database schema, or product-detail route.

## Experience

### Global search drawer

The header Search action opens an accessible design-system drawer with:

- a prominent search input
- live product-name and collection matching
- ranked product previews
- matching collection shortcuts
- a full-results action
- recent searches stored only in localStorage on the current browser
- clear-history control
- close-match messaging for minor spelling errors
- collection browsing when no query is entered
- loading, retry, and no-result states

Product previews link to the product's existing collection because the application does not yet have product-detail pages.

### `/search?q=` results

The dedicated search route provides:

- persistent query URL state
- product result count
- close-match notice when results are fuzzy-only
- matching collection cards
- full product cards using real catalog information
- existing Add to Cart behavior
- links back to the product's collection
- recent searches and collection discovery when no query is supplied
- loading/error/no-result states
- responsive 4/3/2-column result layouts

## Matching behavior

Search is performed against real product names and real collection names. Matching is ranked by:

1. exact text
2. prefix
3. substring
4. direct token match
5. small edit-distance tolerance for minor typos

No synonyms, behavioral recommendations, popularity rankings, personalized results, or server-side autocomplete are fabricated.

## Recent searches

Up to five submitted query strings are stored in `localStorage` under `noblefits.recentSearches.v1`. They can be cleared from both the search drawer and the Search page. No account data or remote persistence is involved.

## Explicitly not added

- backend/full-text search service
- Algolia/Elasticsearch/etc.
- product-detail search destinations
- personalized recommendations
- trending/popular search claims
- search analytics
- voice/image search
- fabricated search suggestions not derived from catalog data
