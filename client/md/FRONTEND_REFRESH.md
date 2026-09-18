# Frontend Refresh — React Cleanup + Merchandising Polish

This pass sits on top of the production-hardened Phase 14 frontend.

## React cleanup

- Replaced every remaining React-Redux `connect()` HOC with `useSelector` / `useDispatch`.
- Removed `mapStateToProps` / `mapDispatchToProps` boilerplate.
- Removed unnecessary default `React` imports under the automatic JSX runtime.
- Kept the class Error Boundary because render-error boundaries still require an error-boundary component pattern.
- Removed the Header effect that mirrored route changes into local state; mobile navigation now closes from the user interaction that changes route.
- Kept effects where they synchronize with external systems/data loading.

## Homepage

The homepage now uses a single media picker that tracks used `imageUrl` values. Product imagery selected for the hero, Noble Edit, visual journal, and outerwear story cannot repeat. Directory/category images are reserved as well so they are not reused elsewhere on the page.

The page adds an image-led visual journal and a third hero image while preserving real product links and catalog data.

## Footer

The tall three-column footer is replaced by a compact navigation bar plus a small legal row.

## Account access

`/signin` is now a focused editorial split layout. Sign in and registration share one accessible tabbed workspace instead of presenting two long forms side-by-side.

## Catalog resilience

The original 35-product local catalog is now a storefront fallback. Remote Firestore collections still win when they contain products, but a missing/empty collection falls back to its bundled products. If the Firestore catalog read fails, the complete local catalog keeps all five shop pages usable.

Local fallback counts:

- Men: 6
- Women: 7
- Jackets: 5
- Sneakers: 8
- Hats: 9
