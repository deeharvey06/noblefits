# NobleFits Design System

## Status

Phase 3 establishes the reusable UI system that subsequent page redesign phases must use. It does not add ecommerce capabilities or change backend contracts, Redux, Firebase, Stripe, pricing, cart calculations, or product data.

The approved visual direction remains **Editorial Modernism**: product-led fashion commerce with strong hierarchy, warm neutral surfaces, disciplined spacing, crisp geometry, restrained elevation, and minimal decorative UI. See `VISUAL_DIRECTION.md` for the complete art direction.

## Principles

1. Product imagery is the strongest visual element.
2. Typography and spacing establish hierarchy before decoration.
3. Components consume semantic tokens; component files do not define arbitrary colors.
4. Controls are obvious, keyboard accessible, and touch friendly.
5. Default, hover, active, focus, disabled, loading, error, and selected states are defined where relevant.
6. Motion is subtle (120–220ms) and respects reduced-motion preferences.
7. New product capabilities are not implied by the design system. Components such as ratings or search render only when real product/application data and behavior are supplied.
8. Existing ecommerce behavior remains the source of truth until a dedicated product phase explicitly changes it.

---

# 1. Semantic tokens

Runtime tokens live in `src/styles/design-system.scss`. Responsive Sass variables and media-query mixins live in `src/styles/_tokens.scss`.

## Color

Required semantic colors:

| Purpose          | Token                      |
| ---------------- | -------------------------- |
| Background       | `--color-background`       |
| Surface          | `--color-surface`          |
| Elevated surface | `--color-surface-elevated` |
| Border           | `--color-border`           |
| Divider          | `--color-divider`          |
| Primary text     | `--color-text-primary`     |
| Secondary text   | `--color-text-secondary`   |
| Muted text       | `--color-text-muted`       |
| Brand            | `--color-brand`            |
| Accent           | `--color-accent`           |
| Success          | `--color-success`          |
| Warning          | `--color-warning`          |
| Error            | `--color-error`            |
| Informational    | `--color-informational`    |
| Focus            | `--color-focus`            |
| Disabled         | `--color-disabled`         |
| Sale             | `--color-sale`             |
| Price            | `--color-price`            |
| Discount         | `--color-discount`         |

Supporting surface, overlay, provider, skeleton, and contrast tokens are also centralized there. Hard-coded color values should not be introduced in component/page styles.

## Typography

The display stack is a zero-dependency editorial serif system stack. Transactional UI, product information, controls, prices, and navigation use a neutral system sans-serif stack.

Semantic roles:

- Display — `--type-display-*`
- H1 — `--type-h1-*`
- H2 — `--type-h2-*`
- H3 — `--type-h3-*`
- H4 — `--type-h4-*`
- Body large — `--type-body-lg-*`
- Body — `--type-body-*`
- Body small — `--type-body-sm-*`
- Label — `--type-label-*`
- Caption — `--type-caption-*`
- Price — `--type-price-*`
- Product title — `--type-product-title-*`
- Button — `--type-button-*`
- Navigation — `--type-navigation-*`

Each role has a defined size and line-height. Heading/display roles also define tracking. Weight tokens are `--font-weight-regular`, `--font-weight-medium`, `--font-weight-semibold`, and `--font-weight-bold`.

## Spacing

Spacing uses a 4px base rhythm:

`--space-0`, `--space-1`, `--space-2`, `--space-3`, `--space-4`, `--space-5`, `--space-6`, `--space-8`, `--space-10`, `--space-12`, `--space-16`, `--space-20`, `--space-24`, `--space-32`.

Do not create component-specific spacing constants unless a real layout constraint cannot be expressed with the system scale.

---

# 2. Layout system

## Content and gutters

- Content max-width: `--layout-content-max` (90rem)
- Reading max-width: `--layout-reading-max`
- Copy max-width: `--layout-copy-max`
- Mobile gutter: `--layout-gutter-mobile`
- Tablet gutter: `--layout-gutter-tablet`
- Desktop gutter: `--layout-gutter-desktop`

Use `.ds-container` for centered max-width content.

## Grid

`.ds-grid` provides an auto-fitting product/content grid using:

- `--layout-grid-card-min`
- `--layout-grid-gap`

Use explicit page-specific grids only when merchandising requires a deliberate composition that cannot be expressed by the shared grid.

## Breakpoints

Sass breakpoints:

- Mobile: 480px
- Tablet: 800px
- Laptop: 1024px
- Desktop: 1280px

Available mixins in `_tokens.scss`:

- `mobile-down`
- `tablet-down`
- `laptop-down`
- `desktop-up`

Breakpoints are layout tools, not device detection. Add a breakpoint only when content/layout actually needs to change.

---

# 3. Reusable component library

Import reusable primitives from:

```js
import {
  Button,
  IconButton,
  Link,
  InputField,
  SelectField,
  TextAreaField,
  Checkbox,
  Radio,
  QuantityControl,
  SearchField,
  Badge,
  PromotionalLabel,
  PriceDisplay,
  RatingDisplay,
  ProductCard,
  Breadcrumbs,
  Pagination,
  Tabs,
  Accordion,
  Dialog,
  Drawer,
  Notification,
  Tooltip,
  Skeleton,
  EmptyState,
  ErrorState,
  LoadingState,
} from "./design-system";
```

All component styling is loaded once from `src/design-system/components.scss` by `src/index.jsx`.

## Buttons

`Button` variants:

- `primary`
- `secondary`
- `tertiary`
- `danger`

Sizes: `sm`, `md`, `lg`.

Supported states include hover, active, focus-visible, disabled, loading, error, and selected/pressed. Use `fullWidth` for mobile/transactional layouts where appropriate.

`IconButton` requires an accessible `label` and supports equivalent interactive states.

The legacy `CustomButton` now acts as a compatibility adapter over the reusable `Button`, preserving existing page APIs while new work can import `Button` directly.

## Links

`Link` can render as a normal anchor or another link component via the `as` prop. Variants include default, navigation, and subtle. Disabled and selected states are supported.

## Inputs, selects, checkboxes, radios

`InputField`, `SelectField`, and `TextAreaField` provide:

- programmatic labels
- required state
- hints
- error messages
- `aria-invalid`
- `aria-describedby`
- hover/focus/disabled/error styling

`Checkbox` and `Radio` provide selected/checked, focus, disabled, and error states without relying on color alone.

## Quantity control

`QuantityControl` exposes decrease/increase actions, live quantity output, min/max bounds, disabled state, and 44px-friendly icon controls.

## Search

`SearchField` is presentation/interaction infrastructure only. It does **not** add a search backend. It accepts controlled value/change/submit callbacks and exposes loading, disabled, focus, and error states.

## Badges and promotional labels

`Badge` variants:

- neutral
- brand
- sale/error
- success
- warning
- info

`PromotionalLabel` is a semantic commerce wrapper around `Badge`. It does not manufacture promotional claims; the caller must provide legitimate content.

## Product card

`ProductCard` establishes the product-information hierarchy:

1. imagery
2. product title
3. price
4. optional real commerce state (badge/rating)
5. optional action

It supports loading, disabled, selected, badge, rating, compare-at price, and optional Add to Cart callback. It does not create navigation, ratings, discounts, or product capabilities that are not supplied by real application data.

## Price and rating

`PriceDisplay` provides tabular commerce pricing and optional compare-at price presentation.

`RatingDisplay` only renders when a real rating is provided. It includes an accessible spoken value and optional review count.

## Breadcrumbs and pagination

`Breadcrumbs` marks the current location with `aria-current="page"`.

`Pagination` includes previous/next controls, current-page state, disabled boundaries, focus states, and touch-friendly controls.

## Tabs

`Tabs` uses tab/tablist/tabpanel semantics and supports keyboard Left/Right/Home/End navigation, selected state, focus, and disabled tabs.

## Accordions

`Accordion` supports single or multiple expanded sections, `aria-expanded`, labelled regions, focus, hover, and disabled items.

## Dialogs and drawers

`Dialog` and `Drawer` provide:

- `role="dialog"`
- `aria-modal="true"`
- labelled titles
- Escape-to-close
- focus containment
- focus restoration
- background scroll locking
- overlay click dismissal when `onClose` is supplied

A later page integration may define the exact placement and content of these overlays, but should not reimplement their interaction model.

## Notifications

`Notification` supports info, success, warning, and error states. Error notifications use alert semantics; other statuses use non-interruptive status semantics.

## Tooltips

`Tooltip` supports top/bottom/left/right placement and reveals on hover or focus-within. Tooltips must never contain essential information that is unavailable elsewhere.

## Skeletons

`Skeleton` supports text and circle patterns plus custom dimensions. ProductCard exposes a loading skeleton. Skeleton motion respects reduced-motion preferences.

## Empty, error, loading states

`EmptyState`, `ErrorState`, and `LoadingState` provide consistent feedback structures. ErrorState uses alert semantics. Empty/error states may expose a single clear recovery action.

---

# 4. Interaction-state contract

Every component should implement only states that are semantically relevant, but the library collectively standardizes:

- default
- hover
- active
- focus-visible
- disabled
- loading
- error
- selected

State must not be communicated by color alone. Focus-visible treatment uses `--color-focus` / `--focus-ring`. Disabled controls remain legible. Loading controls expose `aria-busy` where appropriate.

---

# 5. Accessibility contract

- Intended interactive target size: at least 44px where practical.
- Native controls are preferred over clickable generic elements.
- Inputs require labels or accessible names.
- Error messaging is linked to fields.
- Dialogs/drawers preserve keyboard focus.
- Tabs expose keyboard navigation.
- Reduced-motion preferences are respected globally.
- Product images require meaningful alt text from real product data.
- Color is never the only state indicator.

Legacy page components that currently violate these rules are intentionally migrated during their dedicated redesign phases to avoid uncontrolled page rewrites during Phase 3.

---

# 6. Phase boundary / preserve functionality

Phase 3 does not change:

- routes
- Redux state shape/actions/reducers/sagas
- Firebase authentication or Firestore contracts
- Stripe/payment processing
- cart calculations
- product data schema
- pricing/tax/shipping/inventory calculations
- backend APIs

The design system may expose UI for capabilities such as search or ratings, but those components remain dormant until a real existing or explicitly approved capability supplies their data/behavior.
