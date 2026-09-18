# Phase 6 — Product Listing / Collections

## Purpose

Phase 6 replaces the legacy collection previews and fixed-width hover cards with one reusable catalog listing system shared by `/shop` and `/shop/:collectionId`.

## Supported catalog controls

The current Noble Fits product data supports these customer-facing controls without backend changes:

- collection filtering on `/shop`
- price filtering using ranges derived from real prices
- sorting by catalog order, product name, price low-to-high, and price high-to-low
- live result counts
- direct collection navigation
- Add to Cart using the existing Redux cart action

The listing deliberately does **not** add pagination or infinite loading because neither behavior existed in the application and the current catalog contains only 35 products.

## Data-dependent commerce presentation

The reusable card can display sale/compare-at pricing, ratings, badges, and availability only when corresponding real product fields exist. The current catalog does not provide these fields, so Phase 6 does not fabricate them.

No bestseller, new-arrival, inventory, review, discount, or promotion claims are generated from product position or price.

## Responsive behavior

Desktop uses a persistent filter rail and four-column product grid. Laptop reduces the grid to three columns. Tablet/mobile use a two-column product grid and move filtering into an accessible modal drawer while keeping sorting visible in the listing toolbar.

Product names and prices are always visible. Add to Cart is always available for products not explicitly marked unavailable; purchase actions do not rely on hover.

## Preserved contracts

Phase 6 does not modify Firebase schemas, Redux cart calculations, product pricing, Stripe, authentication, Express, or backend API contracts.
