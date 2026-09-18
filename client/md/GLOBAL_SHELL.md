# Noble Fits Global Application Shell

Phase 4 establishes the shared ecommerce frame used by every route.

## Header hierarchy

1. Compact announcement/discovery bar with a direct Shop link.
2. Sticky primary header balancing navigation, centered Noble Fits branding, Search, account access, and Cart.
3. Desktop category navigation for Men, Women, Jackets, Sneakers, and Hats.

The desktop shell keeps Search and Cart visible at all times. At tablet/mobile widths the primary navigation is replaced by a dedicated drawer instead of compressing the desktop navigation.

## Search

Global search reuses the existing Redux/Redux-Saga Firestore collection-fetch flow. It does not introduce a new API or search backend. Results are filtered client-side from the existing loaded catalog and lead to the appropriate existing collection route because the application does not currently have product-detail routes.

## Mobile navigation

The mobile drawer provides Home, Shop all, Search, category discovery, authentication access, and Cart/Checkout. It uses the design-system Drawer behavior for focus containment, Escape handling, focus restoration, and background scroll locking.

## Cart

The cart trigger is now a semantic button with an accessible item-count label and expanded state. The existing Redux cart behavior is preserved. The cart preview remains a lightweight popover and routes to the existing `/checkout` page.

## Footer

The footer exposes only routes that actually exist: Shop, existing collections, Sign in/Sign out, and Cart & Checkout. No policy, contact, wishlist, order-history, or other unsupported destinations are fabricated.

## Breadcrumbs

Global breadcrumbs are shown for Shop, collection, Sign in, and Cart/Checkout routes and use the existing React Router history without full-page reloads.

## Explicitly not added

- Wishlist/favorites, because no supporting functionality exists.
- Contact, because the previous header link pointed to a route that does not exist.
- Product-detail destinations, because no PDP route currently exists.
- New backend endpoints, schemas, authentication behavior, payment logic, pricing logic, inventory logic, tax logic, shipping logic, or order logic.
