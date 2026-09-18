# Noble Fits — Phase 12 Responsive Design Audit

Phase 12 treats responsiveness as a layout system rather than a final CSS cleanup. The application keeps the existing four responsive ranges defined by the design system:

| Range         | Width      | Intent                                                                                      |
| ------------- | ---------- | ------------------------------------------------------------------------------------------- |
| Large desktop | 1280px+    | Full merchandising density, desktop navigation, persistent side rails/sticky summaries      |
| Laptop        | 801–1279px | Reduced grid density and spacing while preserving desktop discovery where space allows      |
| Tablet        | 481–800px  | Purpose-built mobile header/drawers, stacked commerce layouts, two-column merchandise grids |
| Mobile        | 320–480px  | Compact typography/spacing, touch-first controls, safe-area-aware overlays/sticky actions   |

The application declares a 320px minimum viewport. No page depends on viewport-level horizontal scrolling.

## Cross-application corrections

- Removed legacy responsive padding from `body`. Page gutters now belong to the application shell and full-width header/footer components, preventing doubled gutters and inset global chrome.
- Product-card actions are fluid (`width: 100%; min-width: 0`) so two-column phone grids cannot be forced wider by the shared button minimum width.
- Dialogs and drawers use dynamic viewport height (`dvh`) and mobile safe-area spacing.
- Mobile cart dropdown and Product Detail sticky purchase controls respect device left/right/bottom safe areas.
- Sticky desktop commerce panels are offset below the sticky header rather than sliding underneath it.
- Horizontal scrolling is limited to intentionally scrollable navigation UI: collection tabs, generic tabs, and pagination page controls.
- Touch target baseline remains `2.75rem` / 44px.

## Route audit

### Global shell / navigation

**Large desktop:** centered brand; Home/Shop at left; Search/Account/Cart at right; category navigation remains visible.

**Laptop:** spacing compresses and action labels collapse before the header becomes crowded.

**Tablet:** desktop primary/category/account navigation is replaced with the dedicated navigation drawer while Search and Cart remain visible.

**Mobile:** header gutters use safe-area-aware spacing, action gaps tighten, and the mobile navigation drawer becomes full-width. Cart remains reachable without opening navigation.

### Homepage

**Large desktop:** asymmetric hero, six-column category composition, four-product editorial grid.

**Laptop:** hero proportions tighten and product merchandising becomes two columns.

**Tablet:** hero content stacks above imagery; editorial story becomes a single-column composition.

**Mobile:** the hero image pair becomes a deliberate vertical sequence instead of two compressed columns. Category discovery becomes one column while product cards remain a familiar two-column commerce grid.

### Shop / collections

**Large desktop:** four-column products plus persistent filter rail.

**Laptop:** three-column products.

**Tablet:** two-column products and filters move into the accessible drawer.

**Mobile:** result summary, filter and sort controls stack cleanly; collection navigation remains an intentionally horizontal, touch-scrollable category strip. Product card actions remain full-width inside each card.

### Search

**Large desktop:** split heading/search composition and four-column product results.

**Laptop:** three-column results and three-column category discovery.

**Tablet:** search moves below the page heading and results become two columns.

**Mobile:** result summaries stack, collection cards simplify, product cards remain two columns, and quick-search previews protect product-name width from image/action columns.

### Product detail

**Large desktop:** large gallery with sticky purchase column and four related products.

**Laptop:** purchase/gallery proportions tighten and related products become three columns.

**Tablet:** gallery and purchase information stack; desktop purchase button gives way to the fixed mobile purchase bar; related products become two columns.

**Mobile:** sticky purchase bar uses safe-area padding, product title is allowed full width, optional specifications become single-column rows, and related products retain a two-column product grid without button overflow.

### Cart / checkout

There is no HTML table in the current cart implementation; cart lines use responsive CSS Grid.

**Large desktop:** bag/payment content sits beside a sticky order summary that is offset below the sticky site header.

**Laptop:** columns tighten without collapsing the order summary.

**Tablet:** review → summary → payment becomes a single-column flow and sticky summary behavior is removed.

**Mobile:** cart images shrink, line totals span the row, progress copy simplifies, Stripe label metadata stacks, and the checkout hierarchy remains touch-first without horizontal scrolling.

### Sign in / registration

**Large desktop/laptop:** sign-in and registration remain side by side with controlled column widths.

**Tablet:** forms stack into a single column.

**Mobile:** intro spacing tightens and form actions remain fluid/full-width.

### Password recovery

The reset surface remains constrained for readability. On mobile its large heading/body typography reduces and vertical minimum-height assumptions are removed.

### Account

**Large desktop:** profile/capability content and session panel share a two-column layout with a sticky session panel.

**Laptop:** spacing and capability cards simplify while retaining the two-column account/session relationship where there is room.

**Tablet:** the session panel stacks and stops being sticky.

**Mobile:** profile definition rows become single-column, session padding tightens, and long identity values may wrap safely.

## Shared UI audit

- **Navigation:** desktop and mobile patterns are distinct; no compressed desktop nav is used on tablet/mobile.
- **Grids:** merchandise density intentionally transitions 4 → 3 → 2 columns; category discovery may become one column when imagery/readability benefits.
- **Typography:** global clamp-based type scale remains responsive, with page-level reductions where large editorial headings would dominate small screens.
- **Forms:** fields are width-fluid and controls retain 44px minimum interaction targets.
- **Dialogs / drawers:** `dvh`, safe-area-aware overlays, contained scrolling and mobile drawer width are supported.
- **Tables:** none exist in the current frontend; cart/order content uses responsive Grid/Flex layouts instead.
- **Product cards:** image hierarchy is preserved; title, price and Add to Cart never disappear on touch devices.
- **Product gallery:** becomes single-column before purchase content on tablet/mobile.
- **Filters:** persistent desktop rail, drawer on tablet/mobile.
- **Cart:** responsive line items and explicit totals/actions.
- **Checkout:** sticky summary only where appropriate; mobile uses natural document flow.
- **Sticky elements:** header persists globally; desktop listing/PDP/account/checkout sticky elements are disabled or replaced at the breakpoint where they would crowd content.
- **Touch targets:** shared minimum is 44px; quantity, icon, navigation, filter and cart controls inherit it.

## Intentional horizontal scrolling

Only these components may scroll horizontally:

1. collection/category navigation on product-listing pages;
2. reusable tab lists;
3. pagination page-number controls on narrow screens.

These are bounded navigation controls, not page-level layout overflow.

## Functional boundaries

Phase 12 changes presentation only. It does not change routes, Firebase data, authentication rules, Redux/cart calculations, Stripe payment behavior, `/payment`, pricing, product data, tax/shipping logic, or backend files.
