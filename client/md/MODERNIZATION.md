# Frontend Modernization + Stabilization

This pass modernizes the Noble Fits frontend before Phase 5 without redesigning individual pages or changing backend commerce contracts.

## Toolchain

- Create React App / `react-scripts` -> Vite 8
- React 17 -> React 19
- ReactDOM legacy render -> `createRoot`
- React Router 5 -> React Router 8 declarative routing
- manual Redux store -> Redux Toolkit `configureStore`
- Firebase 8 namespaced API -> Firebase modular API
- `node-sass` -> Dart Sass
- CRA/Jest test harness -> Vitest + Testing Library
- legacy ESLint configuration -> ESLint flat config
- `react-stripe-checkout` -> maintained React Stripe.js + Stripe.js

Redux Saga, Redux Persist, reducers/actions, Firebase data shape, routes, cart calculations, and the `/payment` payload contract are preserved.

## Stabilization fixes

- Fixed Sign Up controlled-field state updates and password mismatch feedback.
- Fixed cart decrement so it decrements quantity instead of always deleting the line item.
- Restored the missing Mens directory title.
- Converted checkout quantity/remove interactions to semantic buttons.
- Converted homepage/category tiles and collection-preview headings to keyboard-accessible button interactions.
- Added accessible product `img` elements with alt text and lazy loading.
- Made Add to Cart available on touch devices instead of relying on hover.
- Added graceful handling for invalid collection URLs.
- Added a wildcard route fallback.
- Added a visible loading state during persisted-store rehydration.
- Replaced legacy styled-components-only Spinner/ErrorBoundary implementations with the existing Sass/token system.
- Corrected Vite Stripe environment-variable handling and removed JavaScript payment alerts.
- Replaced the nine-year-old Stripe React wrapper with the maintained official Stripe React/Stripe.js packages while retaining the existing token-based backend request contract.
- Cleared stale shop-fetch errors when retrying/succeeding.
- Removed stale CRA starter files/documentation.

## Intentionally not changed

- Express server implementation
- `/payment` endpoint shape
- Stripe server-side Charges API
- pricing logic
- Firebase collections/user schema
- authentication semantics
- product data model
- Phase 5+ page redesigns

The server-side Stripe Charges integration is legacy. Modern Stripe guidance favors PaymentIntents or Checkout Sessions, but that requires a backend/payment-contract migration and is deliberately outside this frontend-only stabilization pass.
